import { NextFunction, Request, Response } from 'express';
// ----------------- Regarding Database -----------------------
import Sequelize from "sequelize";
import db from '../models/'; // our database connection object
import { QueryTypes } from "sequelize"
// ---------------------------------------------------------
import { ClassificationType } from "../interfaces/Classification";
import { UploadedFile } from "express-fileupload";
import path from 'path';
// ----------- Types & Interfaces --------------------
import { ActionTypes, ConsigneeTypes } from "../interfaces/Workflow_Participants";

// ------------------- Done Importing -------------------------------
const { models } = db.sequelize; // returns object with all our models.
import { Op } from "sequelize"

import filesConfig from "../config/attachment";


const filesBlackList = ["exe"];

// ---------- Internal Function contains Common Code ----------
const appendAdditionalInfoToEmpPosList = async (availableConsignees: Array<any>): Promise<any[]> => {
    //Queries to Find the `position`, the `jobTitle`, and the `fullName` of each recipient:
    for (let i = 0; i < availableConsignees.length; i++) {
        const posRecord = await models.Position.findOne({
            where: { id: availableConsignees[i].positionId },
            attributes: ["description"]
        });
        const jobTitleRecord = await models.JobTitle.findByPk(availableConsignees[i].jobTitleId);
        const empRecord = await models.Employee.findByPk(availableConsignees[i].employeeId);

        availableConsignees[i].position = posRecord.description;
        availableConsignees[i].jobTitle = jobTitleRecord.title;
        availableConsignees[i].name = `${empRecord.firstName} ${empRecord.middleName.charAt(0).toUpperCase()}. ${empRecord.lastName}`;
    }
    return availableConsignees;
}
const getWhoCanIMessageAccordingToTheHierarchy = async (req: Request, next: NextFunction) => {


    const employeePositionId = req.header("employeeCurrentPositionId");


    try {
        // ------ Know the Sender's Classification (responsible, subordinate, or secretary)
        const senderEmployee_PositionRecord = await models.Employee_Position.findOne({
            where: { id: employeePositionId },
            // attributes: ["classification"]
        });
        const myClassification = senderEmployee_PositionRecord.classification;
        const myPositionId = senderEmployee_PositionRecord.positionId;
        const myEmployee_PositionRecordId = senderEmployee_PositionRecord.id;
        // ------------------------------------------------------------------------

        let myDirectResponsible;
        let myColleagues; // siblings
        let myStaff; // Only for the responsible employee
        let myChildrenPositions; // Only for the responsible employee
        let listOfChildrenPositionsIDs; // Only for the responsible employee

        if (myClassification === ClassificationType.RESPONSIBLE) {
            // -------- Case 1: Direct Responsible for a responsible employee --------
            let myParentPositionRecord = await models.Position.findOne({
                where: { id: myPositionId },
                attributes: ["parentId"]
            });
            const myParentPositionId = myParentPositionRecord.parentId;

            myDirectResponsible = await models.Employee_Position.findOne({
                where: { positionId: myParentPositionId, classification: ClassificationType.RESPONSIBLE },
                attributes: ["id", "positionId", "jobTitleId", "employeeId"],
                raw: true,
            });
            // -------- Case 2: Siblings (Colleagues) for a responsible employee --------
            // -- A. I Know myParentPositionId (Ready from above step)
            // -- B. Fetch my siblings (colleagues)
            let listOfMySiblingsPositionsIDs = await models.Position.findAll({
                where: { parentId: myParentPositionId, id: { [Op.ne]: myPositionId } },
                attributes: ["id"],
            });
            listOfMySiblingsPositionsIDs = listOfMySiblingsPositionsIDs.map((obj: any) => obj.id);

            myColleagues = await models.Employee_Position.findAll({
                where: {
                    classification: ClassificationType.RESPONSIBLE,
                    positionId: { [Op.in]: listOfMySiblingsPositionsIDs }
                },
                attributes: ["id", "positionId", "jobTitleId", "employeeId"],
                raw: true,
            });
            // -------- Case 3: Subordinates (Staff) for a responsible employee --------

            myChildrenPositions = await models.Position.findAll({
                where: { parentId: myPositionId },
            });

            listOfChildrenPositionsIDs = myChildrenPositions.map((positionObj: any) => positionObj.id);

            myStaff = await models.Employee_Position.findAll({
                where: {
                    [Op.or]: [
                        {
                            // 1. My staff from same position as mine
                            [Op.and]: [
                                { positionId: myPositionId },
                                { classification: { [Op.ne]: ClassificationType.RESPONSIBLE }, }
                            ],
                        },
                        {
                            // 2. My staff from my children positions (if exist)
                            positionId: { [Op.in]: listOfChildrenPositionsIDs },
                            // classification: ClassificationType.RESPONSIBLE,
                        }
                    ],
                },
                attributes: ["id", "positionId", "jobTitleId", "employeeId"],
                raw: true,
            });
        }
        else {
            // Case 1: Direct Responsible for a non-responsible employee
            myDirectResponsible = await models.Employee_Position.findOne({
                where: {
                    positionId: myPositionId,
                    classification: ClassificationType.RESPONSIBLE
                },
                attributes: ["id", "positionId", "jobTitleId", "employeeId"],
                raw: true,
            });
            // -------- Case 2: Siblings (Colleagues) for a non-responsible employee --------
            myColleagues = await models.Employee_Position.findAll({
                where: {
                    positionId: myPositionId,
                    id: { [Op.ne]: myEmployee_PositionRecordId },
                    classification: { [Op.ne]: ClassificationType.RESPONSIBLE }
                },
                attributes: ["id", "positionId", "jobTitleId", "employeeId"],
                raw: true,
            });
        }
        // ---- Combining all of them in one array: `availableConsignees` -----------------
        let availableConsignees: Array<any> = [{ ...myDirectResponsible, consigneeType: ConsigneeTypes.DIRECT_RESPONSIBLE }];

        myColleagues.forEach((colleagueObj: any) => {
            // console.log("colleagueObj: ", colleagueObj.dataValues);
            // const onlyTheRecordObj = colleagueObj.dataValues; //since raw: true, no need to say: colleagueObj.dataValues;
            availableConsignees.push({ ...colleagueObj, consigneeType: ConsigneeTypes.COLLEAGUE })
        });

        myStaff?.forEach((staffObj: any) => {
            // const onlyTheRecordObj = staffObj.dataValues; // since raw: true, no need to say: staffObj.dataValues
            availableConsignees.push({ ...staffObj, consigneeType: ConsigneeTypes.STAFF })
        });
        // ----------------------------------------------------------------------------------
        availableConsignees = await appendAdditionalInfoToEmpPosList(availableConsignees);

        return availableConsignees;
    }
    catch (error) {
        next(error);
    }
}
const appendMyCustomConsigneesGroups = async (req: Request, availableConsignees: any) => {

    const { employeePositionId } = req.user; //from the middleware function 

    const getMyCustomGroups = `SELECT CG.id, CG.name FROM consignees_groups as CG WHERE CG.ownerId = ${employeePositionId}`;
    const myCustomGroups = await db.sequelize.query(getMyCustomGroups, {
        logging: console.log,
        type: QueryTypes.SELECT
    });

    // --- Iterate over each group and append a list of the group members: ---
    for (let i = 0; i < myCustomGroups.length; i++) {

        let customGroup = myCustomGroups[i];

        customGroup.consigneeType = ConsigneeTypes.CUSTOM_GROUP;
        const getMembers = `SELECT memberId FROM consignees_groups_members as CGM WHERE CGM.groupId = ${customGroup.id}`;
        let groupMembers = await db.sequelize.query(getMembers, {
            logging: console.log,
            type: QueryTypes.SELECT
        });
        // -------- Convert the array of objects to array of numbers (IDs) only: ----
        groupMembers = groupMembers.map((member: any) => member.memberId);
        customGroup.groupMembers = groupMembers;

        // --- Prepend the object to the list: `availableConsignees`:
        availableConsignees?.unshift(customGroup);
    }
    return availableConsignees;
}
// ---------- End Internal Function contains Common Code ----------

//  ------------- `Create New Workflow` page -------------
export const createNewWorkflow = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    // console.log(req.body);
    const { workflowType, priority, subject, recipients, cc, richTextContent } = req.body;

    // Remember that the middleware function "validateAccessToken"
    // has added a `req.user` entry to our request.
    // const { id, role, employeePositionId } = req.user; //id means accountId

    try {
        // -------- Create New `Workflow` Record --------
        const newWorkflow = await models.Workflow.create({
            subject, workflowType, priority
        });

        // -------- Create New `Action` Record --------
        const newAction = await models.Action.create({
            content: richTextContent,
            workflowId: newWorkflow.id
        });

        // -------- Create New `Workflow_Participant` Record for the SENDER --------
        const newSender = await models.Workflow_Participant.create({
            workflowId: newWorkflow.id,
            actionId: newAction.id,
            // empPositionId: req.user.employeePositionId,
            empPositionId: req.header("employeeCurrentPositionId"),
            actionType: ActionTypes.SENDER,
            isSeen: true,
        });

        // --- Now for each recipient in the list, create new `Workflow_Participant` Record --
        for (let i = 0; i < recipients.length; i++) {
            const newRecipient = await models.Workflow_Participant.create({
                workflowId: newWorkflow.id,
                actionId: newAction.id,
                empPositionId: recipients[i].id,
                actionType: ActionTypes.RECIPIENT
            });
        }

        // --- Now for each CC in the list, create new `Workflow_Participant` Record --
        for (let i = 0; i < cc.length; i++) {
            const newCC = await models.Workflow_Participant.create({
                workflowId: newWorkflow.id,
                actionId: newAction.id,
                empPositionId: cc[i].id,
                actionType: ActionTypes.CC
            });
        }

        return res.json({
            message: "New Workflow created successfully",
            success: true,
            newWorkflowId: newWorkflow.id,
            newActionId: newAction.id,
        });
    }
    catch (error) {
        next(error);
    }
}
export const uploadNewWorkflowFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.files === null) {
            return res.json({
                message: "No files uploaded",
                statusCode: 400,
            });
        }
        let files: any = req.files?.workflowFiles; //now files is array of objects, each object stores a single file info.
        //'workflowFiles' is a name received from the request in client-side
        // in React, we said: const formData = new FormData();
        // formData.append('workflowFiles', files);
        let { workflowId, actionId } = req.body;
        // I need actionId to store it in the DB record to link these files with an action.
        // And I need the workflowId now just for the sake of naming the files:

        // The problem is that the function is expecting multiple files, so in case the client uploaded only one file, the req.files will be an object, not array of objects:
        if (Array.isArray(files) === false) {
            // console.log('NOT ARRAY');
            //then the client uploaded one single file, so store it in array:
            files = [files]; //wrap the single file object in an array
        }


        console.log("All files before validation 📂: ", files);
        // ---------- 🖌️🖌️🖌️ File Validation 🖌️🖌️🖌️ ------------------------
        let totalSizeAfterTruncationKB = 0; //total file size in Bytes
        const maxNumberOfAllowedFiles = filesConfig.MAX_NUMBER_OF_FILES;
        let feedbackList: string[] = [];
        // let acceptedList: string[] = [];
        // let rejectedList: string[] = [];

        // ----- The number of allowable files are 10 ------
        if (files.length > maxNumberOfAllowedFiles) {
            console.log(`The max number of allowable files is ${maxNumberOfAllowedFiles}`);
            feedbackList.push(
                `The max number of allowable files is ${maxNumberOfAllowedFiles}, only first ${maxNumberOfAllowedFiles} files have been accepted`
            );
            files = files.slice(0, maxNumberOfAllowedFiles); // Accept only first 10 files.
        }

        // --- Filter the files (reject any blacklisted file mimetype)
        files = files.filter((file: any) => {
            if (filesBlackList.includes(file.mimetype)) {
                // reject the file
                console.log(`REJECTED a file whose mimetype = ${file.mimetype}`);
                feedbackList.push(
                    `REJECTED file: ${file.name} because of its mimetype: ${file.mimetype}`
                );
                return;
            }
            const extension = path.extname(file.name); //extension name with the dot (.) ex: .png
            if (extension == ".exe") {
                // reject the file
                console.log(`REJECTED a file whose extension = ${file.mimetype}`);
                feedbackList.push(
                    `REJECTED file: ${file.name} because of its extension/mimetype: ${file.mimetype}`
                );
                return;
            }
            if (file.truncated) {
                // don't reject the file, just tell the user that it has been truncated.
                feedbackList.push(
                    `Truncated file: ${file.name} due to its large size`
                );
            }
            // else, the file mimetype is safe:
            totalSizeAfterTruncationKB += Number(file.size / 1024);
            return file;
        });

        // totalSizeAfterTruncation = files.reduce((prevFile: any, currFile: any) => {
        //     console.log("***Size", Number(prevFile.size / 1024));
        //     return Number(prevFile.size / 1024) + Number(currFile.size / 1024);
        // }, 0);

        console.log("***Size", totalSizeAfterTruncationKB.toFixed(2));
        feedbackList.push(`Total size of uploaded files: ${totalSizeAfterTruncationKB.toFixed(2)} KB`);
        // ---------- 🖌️🖌️🖌️ End File Validation 🖌️🖌️🖌️ ------------------------

        // Now I am sure that `files` is an array.
        console.log("Filtered files 📂: ", files);

        // const myPath = path.join(__dirname, "../../../", "frontend", "public", "actions_attachments");
        const myPath = path.join(__dirname, "../../", "public", "actions_attachments");
        console.log("myPath: ", myPath);
        // Iterate over the files list and prepare to move each file to its destination
        let promises = files.map((file: any) => {
            const extension = path.extname(file.name); //extension name with the dot (.) ex: .png
            const uniqueName =
                `${workflowId}_${actionId}_${new Date().getTime()}${extension}`;
            file.uniqueName = uniqueName;
            // console.log("MIME TYPE: ", file.mimetype);
            // console.log("FILE NAME: ", file.name);
            return file.mv(`${myPath}/${uniqueName}`);
        });
        console.log('#of ACCEPTED FILES = ' + promises.length);
        console.log("actionId: ", actionId);
        // remember that .mv(path) returns a promise.
        await Promise.all(promises); //Now execute the array of promises 
        // -------------- Done Uploading Files 😇✅ -------------------------

        // ---- Storing Files info in the database table `Actions_Attachments` -----
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            const newAttachment = await models.Action_Attachment.create({
                fileName: file.uniqueName,
                fileType: file.mimetype,
                description: file.name, // this is the real file name on the user's PC
                size: file.size, // size stored in Bytes
                actionId
            });
        }

        res.json({
            message: "Files Uploaded Successfully",
            status: 200,
            feedbackList
            // fileName: files[0].name, // only for first file I will do that
            // filePath: `/uploads/${files[0].name}`
        });
    } //end try
    catch (error) {
        next(error);
        // if (error) {
        //     console.error(error);
        //     return res.json({
        //         error,
        //         status: 500
        //     });
        // }
    }
}


export const getToWhomCanISendNewWorkflow = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // Remember that the middleware function "validateAccessToken"
        // has added a `req.user` entry to our request.
        const { employeePositionId } = req.user; //from the middleware function 

        let availableConsignees = await getWhoCanIMessageAccordingToTheHierarchy(req, next);

        await appendMyCustomConsigneesGroups(req, availableConsignees);

        res.json({ availableConsignees });
    }
    catch (error) {
        next(error);
    }
}
//  ------------- `Actions of a Workflow` page -------------
export const getActionsByWorkflowId = async (req: Request, res: Response, next: NextFunction) => {
    // Remember that the middleware function "validateAccessToken"
    // has added a `req.user` entry to our request.
    // const employeePositionId = req.user.employeePositionId 
    const employeePositionId = req.header("employeeCurrentPositionId");
    const workflowId: number = Number(req.query.workflowId);
    const cameFromActionId: number = Number(req.query.cameFromActionId);
    console.log("cameFromActionId: ", cameFromActionId);

    try {
        if (isNaN(workflowId)) {
            return res.json({
                message: "Invalid workflowId",
                status: 403, //forbidden
            });
        }
        // ---- Before fetching actions, let's fetch data related to the workflow itself ----
        const workflowRecord = await models.Workflow.findByPk(workflowId);
        // 1. Does the provided workflowId really exist?
        // --- Before proceeding, if the provided workflowId does not exist, stop and immediately return a response:
        if (!workflowRecord) {
            return res.json({
                message: "Invalid workflowId",
                status: 403, //forbidden
            });
        }
        // Now after I am sure the workflowId really exists in the DB:
        // 2. Am I involved in this workflow? (Did I participate as a sender or/and recipient/cc in this workflow whose workflowId is provided in the req.query?)
        const recordsIAMInvolvedIn = await models.Workflow_Participant.findOne({
            where: { workflowId, empPositionId: employeePositionId }
        });
        if (!recordsIAMInvolvedIn) {
            return res.json({
                message: "You are not involved in this workflow (You are neither a sender nor a recipient/cc)",
                status: 403, //forbidden
            });
        }
        // ✅ If the program reaches here, then the workflow exists and I am involved in this workflow ✅:
        // ---- Let's set the `isSeen` status to true for all records belonging to me on this workflow:
        await models.Workflow_Participant.update({ isSeen: true }, {
            where: {
                workflowId,
                actionId: cameFromActionId,
                empPositionId: employeePositionId
            }
        });

        // const getAllWorkflowParticipants = `SELECT workflow_participants.*, actions.* FROM actions INNER JOIN workflow_participants ON actions.workflowId = workflow_participants.workflowId AND actions.id = workflow_participants.actionId WHERE actions.workflowId = ${workflowId}`

        // 😃😃In case we want to show only actions in which the user is mentioned 😃😃
        const actionsIDsWhereIWasMentioned = await models.Workflow_Participant.findAll({
            where: { workflowId: workflowId, empPositionId: employeePositionId },
            attributes: ["actionId"]
        });
        let str: string = "(";
        actionsIDsWhereIWasMentioned.forEach((obj: any) => {
            str += obj.actionId + ", "
        });
        str = str.substring(0, str.length - 2);
        str += ")";

        const getAllWorkflowParticipantsWhereIWasMentioned = `SELECT P.id, P.empPositionId, P.actionType, P.isSeen, P.isPinned, P.actionId, P.workflowId, A.content, A.createdAt
    FROM actions as A INNER JOIN workflow_participants as P ON A.workflowId = P.workflowId AND A.id = P.actionId 
    WHERE A.workflowId = ${workflowId} AND P.actionId in ${str}`;
        // 😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃😃

        const getAllWorkflowParticipants = `SELECT P.id, P.empPositionId, P.actionType, P.isSeen, P.isPinned, P.actionId, P.workflowId, A.content, A.createdAt
    FROM actions as A INNER JOIN workflow_participants as P ON A.workflowId = P.workflowId AND A.id = P.actionId 
    WHERE A.workflowId = ${workflowId}`;

        const allParticipants = await db.sequelize.query(getAllWorkflowParticipants, {
            type: QueryTypes.SELECT,
            logging: console.log,
        });
        // Now `allParticipants` is an array of objects, each object is a record resulting from JOINING `actions` with `workflow_participants`.
        // But each object still lacks some details, such as the participant's full name, and his job title.
        // ---------- Let's get the needed details: ------------------
        for (let i = 0; i < allParticipants.length; i++) {
            const participant = allParticipants[i];
            // ----- Find the participant's name for the current `action` record by his empPositionId:
            const employeePositionRecord = await models.Employee_Position.findByPk(participant.empPositionId, {
                attributes: ["employeeId", "jobTitleId", "positionId"]
            });
            const employeeId = employeePositionRecord.employeeId;
            participant.employeeId = employeeId; //add the employeeId to the `action` object

            // --- Having the action participant's employeeId, now I can now fetch his name:
            const employeeRecord = await models.Employee.findOne({
                where: { id: participant.employeeId },
                attributes: ["firstName", "middleName", "lastName", "avatar"]
            });
            const { firstName, middleName, lastName, avatar } = employeeRecord;
            participant.fullName = `${firstName} ${middleName.charAt(0).toUpperCase()}. ${lastName}`; //add the participant's name to the `action` object.
            if (avatar) {
                participant.avatar = avatar;
            }
            // else {
            //     participant.avatar = "https://images.pexels.com/photos/6386956/pexels-photo-6386956.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
            // }
            console.log("AVATAR: ", avatar);
            // --- Fetch the participant's job title:
            const jobTitleRecord = await models.JobTitle.findByPk(employeePositionRecord.jobTitleId);
            participant.jobTitle = jobTitleRecord.title;
            // --- Fetch the participant's position:
            const positionRecord = await models.Position.findByPk(employeePositionRecord.positionId);
            participant.position = positionRecord?.description;
        }
        // If you want to know the number of actions associated with this workflow, then count the participant objects where actionType == "SENDER", because these objects represent the users who created the action.
        // ** Now for each action object, let's append a list of all the action's recipients, and another list for all the action's CCs ** 
        const actions = allParticipants.filter((action: any) => action.actionType === "SENDER");

        actions.forEach((action: any) => {
            action.iAmMentioned = false; //assume that the logged in user is not mentioned in this action (not mentioned neither as a recipient nor as a CC)

            let recipientsList: Array<any>, ccList: Array<any>;
            recipientsList = [];
            ccList = [];

            for (let i = 0; i < allParticipants.length; i++) {
                const participant = allParticipants[i];

                if (participant.actionType === "RECIPIENT" && participant.actionId === action.actionId) {
                    recipientsList.push(participant);

                    if (participant.empPositionId == employeePositionId) {
                        action.iAmMentioned = true;
                    }
                }
                if (participant.actionType === "CC" && participant.actionId === action.actionId) {
                    ccList.push(participant);

                    if (participant.empPositionId == employeePositionId) {
                        action.iAmMentioned = true;
                    }
                }
            }
            action.recipientsList = recipientsList;
            action.ccList = ccList;
        });
        // *************************************************************

        // **** Adding Attachments List for each action ****
        let allActionsAttachments: Array<any> = []; //here store all attachments regarding this workflow
        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            let attachments: Array<any> = [];

            attachments = await models.Action_Attachment.findAll({
                where: { actionId: action.actionId }
            });
            // `attachments` is an array of `actions_attachments` records

            attachments.map((attObj: any) => allActionsAttachments.push(attObj))

            action.attachments = attachments; //each attachment object now has a list called attachments 
        }
        // *************************************************************
        res.json({
            // allParticipants,
            workflowInfo: workflowRecord,
            actions,
            allActionsAttachments,
            myEmpPositionId: employeePositionId,
            status: 200, //success
            // actionsIDsWhereIWasMentioned,
            // str
        });
    }
    catch (error) {
        next(error);
    }
}
export const getToWhomCanIRespondWithNewAction = async (req: Request, res: Response, next: NextFunction) => {

    // Remember that the middleware function "validateAccessToken"
    // has added a `req.user` entry to our request.
    try {
        // const employeePositionId = req.header("employeeCurrentPositionId");
        const { employeePositionId } = req.user;

        const workflowId = req.query.workflowId;

        let availableConsignees = await getWhoCanIMessageAccordingToTheHierarchy(req, next);

        const availableConsigneesEmpPosIDs = availableConsignees?.map((consignee: any) => consignee.id);

        // CASE A: Allow only to respond to action senders who mentioned you in their recipients or CC in any action during this workflow (So that you cannot respond to other action senders in this workflow):
        // ---- 😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻----
        // ---- Sometimes, a high-level person (higher than my direct responsible) mention me in an action within this workflow. In that case, I will have the ability to respond to them directly in this workflow only, just because they messaged me in an action within this workflow. ----
        // For example: secretary (Heba) in CSE department cannot message the Dean of Engineering (Dr. Mutamed); because he is in a higher position than Heba's  direct responsible.
        // But if the dean Dr. Mutamed messaged Heba in an action, then Heba can respond to Dr. Mutamed
        const actionsInWhichIWasMentioned = await models.Workflow_Participant.findAll({
            where: {
                workflowId,
                empPositionId: employeePositionId, //comment this condition if you want to allow me to message all senders participants in this workflow, even if they didn't mention me as a recipient or cc in their action. 
                actionType: { [Op.ne]: ActionTypes.SENDER }
            },
            attributes: ["actionId"]
        });
        const listOfActionsIDsInWhichIWasMentioned = actionsInWhichIWasMentioned.map((action: any) => action.actionId);


        const participantsMentionedMeInThisWorkflow = await models.Workflow_Participant.findAll({
            where: {
                actionType: ActionTypes.SENDER,
                actionId: {
                    [Op.in]: listOfActionsIDsInWhichIWasMentioned,
                }
            }
        });

        const listOfParticipantsEmpPositionIDsWhoMentionedMe = participantsMentionedMeInThisWorkflow.map((pa: any) => pa.empPositionId);

        /* --- Now fetch people whose empPositionIds are in the `listOfParticipantsEmpPositionIDsWhoMentionedMe`, but make additional condition which is:
        their empPositionIds must not be in the `availableConsigneesEmpPosIDs`
        because these people are already available to you from the hierarchy, so don't show them again in the dropdown list as a groupTag: "Workflow Participant"
        */
        let myNewContactsBecauseTheyMentionedMe = await models.Employee_Position.findAll({
            where: {
                id: {
                    [Op.in]: listOfParticipantsEmpPositionIDsWhoMentionedMe,
                    [Op.notIn]: availableConsigneesEmpPosIDs,
                }
            },
            attributes: ["id", "positionId", "jobTitleId", "employeeId"],
            raw: true,
        });

        myNewContactsBecauseTheyMentionedMe = await appendAdditionalInfoToEmpPosList(myNewContactsBecauseTheyMentionedMe);

        myNewContactsBecauseTheyMentionedMe?.forEach((empPosObj: any) => {
            availableConsignees?.unshift({ ...empPosObj, consigneeType: ConsigneeTypes.WORKFLOW_PARTICIPANT })
        });
        // ---- 😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻😻----


        // ---- CASE B: In case you want to allow me to respond to all senders in this workflow, even if they didn't directly put me in their recipients or cc: (This case is easier) 
        // ---- Dr.Yousef💰Dr.Yousef💰Dr.Yousef💰Dr.Yousef💰Dr.Yousef💰Dr.Yousef💰 ----
        // const allActionSendersInThisWorkflow = await models.Workflow_Participant.findAll({
        //     where: {
        //         workflowId,
        //         actionType: ActionTypes.SENDER
        //     }
        // });
        // const actionSendersEmpPosIDs = allActionSendersInThisWorkflow.map((aSender: any) => aSender.empPositionId);

        // let myNewContacts = await models.Employee_Position.findAll({
        //     where: { id: { [Op.in]: actionSendersEmpPosIDs } },
        //     attributes: ["id", "positionId", "jobTitleId", "employeeId"],
        //     raw: true,
        // });

        // myNewContacts = await appendAdditionalInfoToEmpPosList(myNewContacts);

        // myNewContacts?.forEach((empPosObj: any) => {
        //     availableConsignees?.unshift({ ...empPosObj, consigneeType: ConsigneeTypes.WORKFLOW_PARTICIPANT })
        // });
        // ---- Dr.Yousef💰Dr.Yousef💰Dr.Yousef💰Dr.Yousef💰Dr.Yousef💰Dr.Yousef💰 ----

        // ---- Finally, if the employee has his own custom consignees groups, append them: 
        await appendMyCustomConsigneesGroups(req, availableConsignees);

        res.json({
            // listOfParticipantsEmpPositionIDsWhoMentionedMe,
            // participantsMentionedMeInThisWorkflow,
            availableConsigneesEmpPosIDs,
            listOfParticipantsEmpPositionIDsWhoMentionedMe,
            availableConsignees,
            // actionSendersEmpPosIDs
        });
    }
    catch (error) {
        next(error);
    }
}
export const createNewAction = async (req: Request, res: Response, next: NextFunction) => {

    const { recipients, cc, richTextContent, workflowId } = req.body;
    // const { workflowId } = req.query;
    // Remember that the middleware function "validateAccessToken"
    // has added a `req.user` entry to our request.
    // const { id, role, employeePositionId } = req.user; //id means accountId

    try {
        // remember: Here no need to create a new `Workflow` record, we are just adding new action to an existing workflow.

        // -------- Create New `Action` Record --------
        const newAction = await models.Action.create({
            content: richTextContent,
            workflowId,
        });

        // -------- Create New `Workflow_Participant` Record for the SENDER --------
        const newSender = await models.Workflow_Participant.create({
            workflowId,
            actionId: newAction.id,
            empPositionId: req.header("employeeCurrentPositionId"),
            actionType: ActionTypes.SENDER,
            isSeen: true,
        });

        // --- Now for each recipient in the list, create new `Workflow_Participant` Record --
        for (let i = 0; i < recipients.length; i++) {
            const newRecipient = await models.Workflow_Participant.create({
                workflowId,
                actionId: newAction.id,
                empPositionId: recipients[i].id, //remember that each object in the recipients array is a record of `Employee_Position` model. So, id means the employeePositionId
                actionType: ActionTypes.RECIPIENT
            });
        }

        // --- Now for each CC in the list, create new `Workflow_Participant` Record --
        for (let i = 0; i < cc.length; i++) {
            const newCC = await models.Workflow_Participant.create({
                workflowId,
                actionId: newAction.id,
                empPositionId: cc[i].id,
                actionType: ActionTypes.CC
            });
        }
        // ---- Now, since a new action has been added to the workflow whose id = `workflowId`,
        //  we should update the `updatedAt` column for this workflow in the `workflows` table:
        const workflowRecord = await models.Workflow.findByPk(workflowId);
        await models.Workflow.update({ "subject": workflowRecord.subject }, {
            where: { id: workflowId }
        });
        // Note: I updated the `subject` record with the same value just to make sequelize update the `updatedAt` column for this record. (I don't know how to update the date)
        // --------------------------------------------------------------------

        return res.json({
            message: `New action added to this workflow`,
            success: true,
            newActionId: newAction.id,
        });
    }
    catch (error) {
        next(error);
    }
}
export const uploadNewActionFiles = async (req: Request, res: Response, next: NextFunction) => {

    // remember: Here we are uploading files for a new action, but not new workflow, the workflow exists. So, we expect to be receiving a workflowId in the req.query
    // const { workflowId } = req.query;

    try {
        if (req.files === null) {
            return res.json({
                message: "No files to upload",
                statusCode: 400,
            });
        }
        let files: any = req.files?.actionFiles; //now files is array of objects, each object stores a single file info.
        //'actionFiles' is a name received from the request in client-side
        // in React, we said: const formData = new FormData();
        // formData.append('actionFiles', files);
        let { actionId, workflowId } = req.body;
        // I need actionId to store it in the DB record to link these files with an action.

        // The problem is that the function is expecting multiple files, so in case the client uploaded only one file, the req.files will be an object, not array of objects:
        if (Array.isArray(files) === false) {
            // console.log('NOT ARRAY');
            //then the client uploaded one single file, so store it in array:
            files = [files]; //wrap the single file object in an array
        }


        const myPath = path.join(__dirname, "../../", "public", "actions_attachments");
        console.log("myPath: ", myPath);
        // Iterate over the files list and prepare to move each file to its destination

        console.log("All files before validation 📂: ", files);
        // ---------- 🖌️🖌️🖌️ File Validation 🖌️🖌️🖌️ ------------------------
        let totalSizeAfterTruncationKB = 0; //total file size in Bytes
        const maxNumberOfAllowedFiles = filesConfig.MAX_NUMBER_OF_FILES;
        let feedbackList: string[] = [];
        // let acceptedList: string[] = [];
        // let rejectedList: string[] = [];

        // ----- The number of allowable files are 10 ------
        if (files.length > maxNumberOfAllowedFiles) {
            console.log(`The max number of allowable files is ${maxNumberOfAllowedFiles}`);
            feedbackList.push(
                `The max number of allowable files is ${maxNumberOfAllowedFiles}, only first ${maxNumberOfAllowedFiles} files have been accepted`
            );
            files = files.slice(0, maxNumberOfAllowedFiles); // Accept only first 10 files.
        }

        // --- Filter the files (reject any blacklisted file mimetype)
        files = files.filter((file: any) => {
            if (filesBlackList.includes(file.mimetype)) {
                // reject the file
                console.log(`REJECTED a file whose mimetype = ${file.mimetype}`);
                feedbackList.push(
                    `REJECTED file: ${file.name} because of its mimetype: ${file.mimetype}`
                );
                return;
            }
            const extension = path.extname(file.name); //extension name with the dot (.) ex: .png
            if (extension == ".exe") {
                // reject the file
                console.log(`REJECTED a file whose extension = ${file.mimetype}`);
                feedbackList.push(
                    `REJECTED file: ${file.name} because of its extension/mimetype: ${file.mimetype}`
                );
                return;
            }
            if (file.truncated) {
                // don't reject the file, just tell the user that it has been truncated.
                feedbackList.push(
                    `Truncated file: ${file.name} due to its large size`
                );
            }
            // else, the file mimetype is safe:
            totalSizeAfterTruncationKB += Number(file.size / 1024);
            return file;
        });

        console.log("***Size", totalSizeAfterTruncationKB.toFixed(2));
        feedbackList.push(`Total size of uploaded files: ${totalSizeAfterTruncationKB.toFixed(2)} KB`);
        // ---------- 🖌️🖌️🖌️ End File Validation 🖌️🖌️🖌️ ------------------------


        // Now I am sure that `files` is an array.
        console.log("Filtered files 📂: ", files);

        let promises = files.map((file: any) => {
            const extension = path.extname(file.name); //extension name with the dot (.) ex: .png
            const uniqueName =
                `${workflowId}_${actionId}_${new Date().getTime()}${extension}`;
            file.uniqueName = uniqueName;
            // console.log("MIME TYPE: ", file.mimetype);
            // console.log("FILE NAME: ", file.name);
            return file.mv(`${myPath}/${uniqueName}`);
        });
        console.log('#of ACCEPTED FILES = ' + promises.length);
        console.log("actionId: ", actionId);
        // remember that .mv(path) returns a promise.
        await Promise.all(promises); //Now execute the array of promises 
        // -------------- Done Uploading Files 😇✅ -------------------------

        // ---- Storing Files info in the database table `Actions_Attachments` -----
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            const newAttachment = await models.Action_Attachment.create({
                fileName: file.uniqueName,
                fileType: file.mimetype,
                description: file.name, // this is the real file name on the user's PC
                size: file.size, // size stored in Bytes
                actionId
            });
        }

        res.json({
            message: `Files Uploaded Successfully for the new action[id: ${actionId}]`,
            status: 200,
            feedbackList,
        });
    } //end try
    catch (error) {
        next(error);
    }
}

//  ------------- `Search Box` page -------------
export const getEmployeesListToSearchBy = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // const { employeePositionId } = req.user; //from the middleware function 
        const employeePositionId = req.header("employeeCurrentPositionId");
        console.log("employeePositionId from header: ", employeePositionId);

        //  #get all empPositionIds for actions in which I am involved:
        // const getRecords = `SELECT DISTINCT (P.empPositionId) FROM workflow_participants as P 
        //                     WHERE P.actionId IN (
        //                         SELECT DISTINCT (P.actionId) FROM workflow_participants as P 
        //                         WHERE P.empPositionId = ${employeePositionId}
        //                    ) AND P.empPositionId != ${employeePositionId}`;


        // # get all empPositionIds for actions in which I am involved:
        const theMiracle = `SELECT DISTINCT (PT.empPositionId), 
                    CONCAT(E.firstName, " ", SUBSTRING(E.   middleName, 1, 1), ". ", E.lastName) as fullName, PO.description as position, JO.title as jobTitle
                    FROM workflow_participants as PT
                    JOIN employees_positions as EP ON PT.empPositionId = EP.id
                    JOIN employees as E ON EP.employeeId = E.id
                    JOIN positions as PO ON EP.positionId = PO.id  
                    JOIN jobtitles as JO ON EP.jobTitleId = JO.id
                    WHERE PT.actionId IN (
                        SELECT DISTINCT (workflow_participants.actionId) FROM workflow_participants
                        WHERE workflow_participants.empPositionId = 8
                    ) 
                    AND PT.empPositionId != ${employeePositionId}`;


        const peopleList = await db.sequelize.query(theMiracle, {
            type: QueryTypes.SELECT,
            logging: console.log,
        });

        return res.json({
            peopleList
        });
    }
    catch (error) {
        next(error);
    }
}
