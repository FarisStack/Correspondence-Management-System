import { NextFunction, Request, Response } from 'express';
// ----------------- Regarding Database -----------------------
import Sequelize from "sequelize";
import db from '../models'; // our database connection object
import { QueryTypes } from "sequelize"
// ---------------------------------------------------------
import { ClassificationType } from "../interfaces/Classification";
import { UploadedFile } from "express-fileupload";
import path from 'path';
// ----------- Types & Interfaces --------------------
import { ActionTypes, } from "../interfaces/Workflow_Participants";
import {
    WorkflowType,
    WorkflowPriority,
    FilterByOptions,
    EmployeeAs,
    FolderTypes
}
    from "../interfaces/Workflow";
// ------------------- Done Importing -------------------------------
const { models } = db.sequelize; // returns object with all our models.
import { Op } from "sequelize"


type resultSetType = {
    rows: Array<any>;
    count: number;
}

export const populateTable = async (req: Request, res: Response, next: NextFunction) => {

    const { filterBy, folder, isArchived } = req.query;

    console.log("*** isArchived: ", isArchived);

    if (filterBy && filterBy !== "") {
        console.log("----------- WILL CALL searchBy() -----------");
        return searchBy(req, res, next);
    }

    // const { employeePositionId } = req.user; //from the middleware function 
    const employeePositionId = req.header("employeeCurrentPositionId");

    let page: number = Number(req.query.page);
    let rowsPerPage: number = Number(req.query.rowsPerPage);
    let wantedActionType: string = "";


    // ------------------------- Search By Folder -------------------------
    let wantedFolders: string[] = [];
    if (!folder) {
        wantedFolders = [ActionTypes.RECIPIENT, ActionTypes.CC, ActionTypes.SENDER]
    }
    else {
        switch (folder?.toString().toLowerCase()) {
            case FolderTypes.All:
                wantedFolders = [ActionTypes.RECIPIENT, ActionTypes.CC, ActionTypes.SENDER]
                break;
            case FolderTypes.Inbox:
                wantedFolders = [ActionTypes.RECIPIENT];
                break;
            case FolderTypes.FollowUp:
                wantedFolders = [ActionTypes.SENDER];
                break;
            case FolderTypes.Cc:
                wantedFolders = [ActionTypes.CC];
                break;
            default:
                wantedFolders = [ActionTypes.RECIPIENT, ActionTypes.CC, ActionTypes.SENDER]
        }
    }

    let workflowsList: Array<any>;
    let allMatchedWorkflowsCount: number;


    // console.log("PAGE: ", page);
    // console.log("ROWS_PER_PAGE: ", rowsPerPage);
    if (!page) { page = 0 }
    if (!rowsPerPage) { rowsPerPage = 20; }
    console.log("-------------------------------");
    console.log("PAGE: ", page);
    console.log("ROWS_PER_PAGE: ", rowsPerPage);
    console.log("FOLDER: ", folder);
    console.log("Wanted Folders: ", wantedFolders);
    // console.log("wantedActionType: ", wantedActionType);
    console.log("-------------------------------");

    try {

        // const getInbox1 = `SELECT * FROM workflows as W JOIN workflow_participants as P on W.id = P.workflowId 
        //                    WHERE P.actionType = "RECIPIENT" AND P.empPositionId = ${employeePositionId}
        //                    ORDER BY P.createdAt DESC`;

        // const inbox1 = await db.sequelize.query(getInbox1, {
        //     type: QueryTypes.SELECT,
        //     logging: console.log,
        // });

        let whereConditions: any = {
            empPositionId: employeePositionId,
            actionType: { [Op.in]: wantedFolders },
        }
        if (isArchived) {
            // then the requested page is the ARCHIVE
            whereConditions = { ...whereConditions, isArchived: true }
        }


        let objResultAndCount: resultSetType = await models.Workflow.findAndCountAll({
            include: [{
                model: models.Workflow_Participant,
                // as: 'Workflow_Participants',
                required: true, //will make it INNER JOIN instead of LEFT OUTER
                where: whereConditions,
                attributes: ["empPositionId", "isSeen", "isPinned", "createdAt", "actionId"]
            }],
            order: [
                [Sequelize.col('Workflow_Participants.isPinned'), "DESC"],
                [Sequelize.col('Workflow_Participants.createdAt'), "DESC"],
            ],
            attributes: ["id", "subject", "workflowType", "priority"],
            raw: true, //this will make the result not nested 😁
            limit: rowsPerPage,
            offset: page * rowsPerPage,
            subQuery: false, //visit: https://localcoder.org/sequelize-limit-and-offset-incorrect-placement-in-query
        });

        // I used method `findAndCountAll` because it's usually preferred when dealing with queries related to pagination where you want to retrieve data with a limit and offset but also need to know the total number of records that match the query.
        // It returns an object with two properties:
        /*
            count: an integer - the total number records matching the query
            rows: an array of objects - the obtained records
        */
        workflowsList = objResultAndCount.rows;
        allMatchedWorkflowsCount = objResultAndCount.count;
        // read more about `findAndCountAll`: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findandcountall


        // I really need to change the name of the `workflow_participants` columns,
        // ex: instead of the long name: `WorkflowParticipants.isSeen`, transform it to `isSeen`:
        // I tried to do that using sequelize { model: , as: } but didn't allow me 🤯
        // --- The following loop will change the keys names in the objects of `workflowsList`:
        workflowsList.forEach((o: any) => {
            delete Object.assign(o, { ["empPositionId"]: o["Workflow_Participants.empPositionId"] })["Workflow_Participants.empPositionId"];

            delete Object.assign(o, { ["isSeen"]: o["Workflow_Participants.isSeen"] })["Workflow_Participants.isSeen"];

            delete Object.assign(o, { ["isPinned"]: o["Workflow_Participants.isPinned"] })["Workflow_Participants.isPinned"];


            delete Object.assign(o, { ["createdAt"]: o["Workflow_Participants.createdAt"] })["Workflow_Participants.createdAt"];

            delete Object.assign(o, { ["actionId"]: o["Workflow_Participants.actionId"] })["Workflow_Participants.actionId"];
        });

        // ------------ Adding some information to the workflowsList: ------------
        // such as: sender's name, and count of attachment on each action:
        for (let a = 0; a < workflowsList.length; a++) {

            const workflow = workflowsList[a];
            let senderEmpPositionId;

            if (folder === FolderTypes.FollowUp) {
                // no need to make queries to get info about the action sender,
                // because simply you are the sender of all actions in the follow-up table
                senderEmpPositionId = workflow.empPositionId;
            }
            else {
                // ---- I need the empPositionId of the sender of each action: ----
                const senderWParticipantRecord = await models.Workflow_Participant.findOne({
                    where: { actionId: workflow.actionId, actionType: ActionTypes.SENDER },
                });
                // -----
                senderEmpPositionId = senderWParticipantRecord.empPositionId
            }
            workflow.senderEmpPositionId = senderEmpPositionId;
            // -----
            const senderEmployeePositionRecord = await models.Employee_Position.findByPk(senderEmpPositionId);
            const senderEmployeeId = senderEmployeePositionRecord.employeeId;
            const { positionId, jobTitleId } = senderEmployeePositionRecord;
            workflow.senderEmployeeId = senderEmployeeId;
            // -----
            const senderPositionRecord = await models.Position.findByPk(positionId);
            workflow.senderPosition = senderPositionRecord.description;
            // -----
            const senderJobTitleRecord = await models.JobTitle.findByPk(jobTitleId);
            workflow.senderJobTitle = senderJobTitleRecord.title;
            // -----
            const senderEmployeeRecord = await models.Employee.findByPk(senderEmployeeId);
            const { firstName, middleName, lastName, avatar } = senderEmployeeRecord;
            workflow.senderFullName = `${firstName} ${middleName.charAt(0)}. ${lastName}`;
            if (avatar) {
                workflow.senderAvatar = avatar;
            }
            // else {
            //     workflow.senderAvatar = "https://images.pexels.com/photos/6386956/pexels-photo-6386956.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
            // }
            const attachments = await models.Action_Attachment.findOne({
                where: { actionId: workflow.actionId },
                attributes: [[Sequelize.fn('count', Sequelize.col('actionId')), 'count']],
                raw: true,
            });
            console.log(attachments);
            workflow.attachmentsCount = attachments.count;
            // -----
        }// end for loop

        res.json({ workflowsList, myEmpPositionId: employeePositionId, allMatchedWorkflowsCount });
    }
    catch (error) {
        next(error);
    }
}

export const toggleRecordPin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { actionId, empPositionId } = req.body;

        const clickedRecord = await models.Workflow_Participant.findOne({
            where: { actionId, empPositionId }
        });
        if (clickedRecord) {
            // then the record is found, update its pin status:
            const isCurrentlyPinned = clickedRecord.isPinned;
            await clickedRecord.update({ isPinned: !isCurrentlyPinned });

            return res.json({
                message: `${isCurrentlyPinned ? `unpinned` : `pinned`} successfully`,
                type: "success",
                actionId,
                empPositionId,
                clickedRecordUpdated: clickedRecord,
            });
        }
        return res.json({
            message: `record not found`,
            type: "error",
            actionId,
            empPositionId,
        });
    }
    catch (error) {
        next(error);
    }
}
export const moveToOrFromArchive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { actionsIds, empPositionId } = req.body;
        let { isMoveTo } = req.query;

        await models.Workflow_Participant.update({
            isArchived: isMoveTo == "true" ? true : false
        }, {
            where: { 
                actionId: {[Op.in]: actionsIds}, 
                empPositionId: req.user.employeePositionId
            }
        });

        res.json({
            message: `${isMoveTo == "true" ? `moved to archive` : `removed from archive`}`,
            type: "success",
            actionsIds: actionsIds,
            empPositionId,
        });
    }
    catch (error) {
        next(error);
    }
}



export const searchBy = async (req: Request, res: Response, next: NextFunction) => {

    /*
        0. Folder [Inbox, CC, Follow-Up, or All] ✅ (wantedFolders)
        1. Keyword
        2. Workflow's Serial
        3. Workflow's Type
        4. Workflow's Priority
        5. Employee (Sender, Consignee, or Either) ✅ (wantedActionsIds)
        6. Date From and/or To
    */
    try {
        // const { employeePositionId } = req.user; //from the middleware function 
        const employeePositionId = req.header("employeeCurrentPositionId");
        let page: number = Number(req.query.page);
        let rowsPerPage: number = Number(req.query.rowsPerPage);
        if (!page) { page = 0 }
        if (!rowsPerPage) { rowsPerPage = 20; }

        let workflowsList: Array<any> = [];
        let allMatchedWorkflowsCount: number = 0;

        type resultSetType = {
            rows: Array<any>;
            count: number;
        }

        const { filterBy, folder } = req.query;
        console.log("--------- FILTER BY ----------:  ", filterBy);

        console.log("😈😈😈😈 Folder: ", folder);
        // ------------------------- Search By Folder -------------------------
        let wantedFolders: string[] = [];
        if (!folder) {
            wantedFolders = [ActionTypes.RECIPIENT, ActionTypes.CC, ActionTypes.SENDER]
        }
        else {
            switch (folder?.toString().toLowerCase()) {
                case FolderTypes.All:
                    wantedFolders = [ActionTypes.RECIPIENT, ActionTypes.CC, ActionTypes.SENDER]
                    break;
                case FolderTypes.Inbox:
                    wantedFolders = [ActionTypes.RECIPIENT];
                    break;
                case FolderTypes.FollowUp:
                    wantedFolders = [ActionTypes.SENDER];
                    break;
                case FolderTypes.Cc:
                    wantedFolders = [ActionTypes.CC];
                    break;
                default:
                    wantedFolders = [ActionTypes.RECIPIENT, ActionTypes.CC, ActionTypes.SENDER]

            }
        }
        console.log("_______ wantedFolders: ______ ", wantedFolders);
        // ---------------------------------------------------------------------
        let objResultAndCount = { rows: [], count: -1 };

        switch (filterBy) {
            // ------------------------- Search By Keyword -------------------------
            case FilterByOptions.Keyword:
                let { keyword } = req.query;
                console.log("ENTERED KEYWORD: ", keyword);
                objResultAndCount = await models.Workflow.findAndCountAll({
                    include: [{
                        model: models.Workflow_Participant,
                        // as: 'Workflow_Participants',
                        required: true, //will make it INNER JOIN instead of LEFT OUTER
                        where: {
                            actionType: { [Op.in]: wantedFolders },
                            empPositionId: employeePositionId,
                        },
                        attributes: ["empPositionId", "isSeen", "isPinned", "createdAt", "actionId"],
                    }],
                    where: {
                        subject: { [Op.like]: `%${keyword}%` }
                    },
                    order: [
                        [Sequelize.col('Workflow_Participants.isPinned'), "DESC"],
                        [Sequelize.col('Workflow_Participants.createdAt'), "DESC"],
                    ],
                    attributes: ["id", "subject", "workflowType", "priority"],
                    raw: true, //this will make the result not nested 😁
                    limit: rowsPerPage,
                    offset: page * rowsPerPage,
                    subQuery: false, //visit: https://localcoder.org/sequelize-limit-and-offset-incorrect-placement-in-query
                });
                break;
            // ------------------------- Search By Employee -------------------------
            case FilterByOptions.Employee:
                let allowedActionTypes: string[] = [];
                let { employeeAs, wantedEmpPosId } = req.query;
                console.log("employeeAs: ", employeeAs);
                console.log("wantedEmpPosId: ", wantedEmpPosId);

                if (!employeeAs) {
                    employeeAs = EmployeeAs.Either
                }

                switch (employeeAs) {
                    case EmployeeAs.Sender:
                        allowedActionTypes = [ActionTypes.SENDER];
                        break;
                    case EmployeeAs.Consignee:
                        allowedActionTypes = [ActionTypes.RECIPIENT, ActionTypes.CC];
                        break;
                    case EmployeeAs.Either:
                        allowedActionTypes = [ActionTypes.SENDER, ActionTypes.RECIPIENT, ActionTypes.CC];
                        break;
                    default:
                        allowedActionTypes = [ActionTypes.SENDER, ActionTypes.RECIPIENT, ActionTypes.CC];
                }

                const allActionsRegardingTheWantedEmployee = await models.Workflow_Participant.findAll({
                    where: {
                        empPositionId: wantedEmpPosId,
                        actionType: { [Op.in]: allowedActionTypes }
                    }
                });
                const wantedActionsIds = allActionsRegardingTheWantedEmployee.map((elem: any) => elem.actionId);
                console.log("wantedActionsIds: ", wantedActionsIds);

                objResultAndCount = await models.Workflow.findAndCountAll({
                    include: [{
                        model: models.Workflow_Participant,
                        // as: 'Workflow_Participants',
                        required: true, //will make it INNER JOIN instead of LEFT OUTER
                        where: {
                            actionType: { [Op.in]: wantedFolders },
                            // actionType: ActionTypes.RECIPIENT,
                            empPositionId: employeePositionId,
                            actionId: { [Op.in]: wantedActionsIds },
                        },
                        attributes: ["empPositionId", "isSeen", "isPinned", "createdAt", "actionId"]
                    }],
                    order: [
                        [Sequelize.col('Workflow_Participants.isPinned'), "DESC"],
                        [Sequelize.col('Workflow_Participants.createdAt'), "DESC"],
                    ],
                    attributes: ["id", "subject", "workflowType", "priority"],
                    raw: true, //this will make the result not nested 😁
                    limit: rowsPerPage,
                    offset: page * rowsPerPage,
                    subQuery: false, //visit: https://localcoder.org/sequelize-limit-and-offset-incorrect-placement-in-query
                });
                break;
            // ------------------------- Search By Date -------------------------
            case FilterByOptions.Date:
                let { fromDate, toDate } = req.query;

                if (!fromDate || fromDate === "") {
                    fromDate = "1970-01-01";
                }
                else {
                    fromDate = new Date(fromDate.toString()).toISOString().split("T")[0];
                }
                if (!toDate || toDate === "") {
                    toDate = new Date().toISOString().split("T")[0];
                    // ISOString is always in this format: YYYY-MM-DD
                    // ex: 2022-04-21
                }
                else {
                    toDate = new Date(toDate.toString()).toISOString().split("T")[0];
                }

                console.log("------ FromDate: ", fromDate);
                console.log("------ toDate: ", toDate);

                objResultAndCount = await models.Workflow.findAndCountAll({
                    include: [{
                        model: models.Workflow_Participant,
                        // as: 'Workflow_Participants',
                        required: true, //will make it INNER JOIN instead of LEFT OUTER
                        where: {
                            actionType: { [Op.in]: wantedFolders },
                            empPositionId: employeePositionId,
                            [Op.and]: [
                                Sequelize.where(Sequelize.fn('date', Sequelize.col('Workflow_Participants.createdAt')), '>=', fromDate),
                                Sequelize.where(Sequelize.fn('date', Sequelize.col('Workflow_Participants.createdAt')), '<=', toDate),
                            ]
                        },
                        attributes: ["empPositionId", "isSeen", "isPinned", "createdAt", "actionId"]
                    }],
                    order: [
                        [Sequelize.col('Workflow_Participants.isPinned'), "DESC"],
                        [Sequelize.col('Workflow_Participants.createdAt'), "DESC"],
                    ],
                    attributes: ["id", "subject", "workflowType", "priority"],
                    raw: true, //this will make the result not nested 😁
                    limit: rowsPerPage,
                    offset: page * rowsPerPage,
                    subQuery: false, //visit: https://localcoder.org/sequelize-limit-and-offset-incorrect-placement-in-query
                });
                break;
            // ------------------------- Search By Workflow's Type -------------------------
            case FilterByOptions.WorkflowType:
                let { workflowType } = req.query;

                if (!workflowType || workflowType === "") {
                    workflowType = WorkflowType.INTERNAL_CORRESPONDENCE;
                }

                objResultAndCount = await models.Workflow.findAndCountAll({
                    include: [{
                        model: models.Workflow_Participant,
                        // as: 'Workflow_Participants',
                        required: true, //will make it INNER JOIN instead of LEFT OUTER
                        where: {
                            actionType: { [Op.in]: wantedFolders },
                            empPositionId: employeePositionId,
                        },
                        attributes: ["empPositionId", "isSeen", "isPinned", "createdAt", "actionId"]
                    }],
                    where: {
                        workflowType,
                    },
                    order: [
                        [Sequelize.col('Workflow_Participants.isPinned'), "DESC"],
                        [Sequelize.col('Workflow_Participants.createdAt'), "DESC"],
                    ],
                    attributes: ["id", "subject", "workflowType", "priority"],
                    raw: true, //this will make the result not nested 😁
                    limit: rowsPerPage,
                    offset: page * rowsPerPage,
                    subQuery: false, //visit: https://localcoder.org/sequelize-limit-and-offset-incorrect-placement-in-query
                });
                break;
            // ------------------------- Search By Workflow's Priority -------------------------
            case FilterByOptions.WorkflowPriority:
                let { priority } = req.query;
                console.log("-----------------priority: ", priority);
                if (!priority || priority === "") {
                    priority = WorkflowPriority.MEDIUM;
                }

                objResultAndCount = await models.Workflow.findAndCountAll({
                    include: [{
                        model: models.Workflow_Participant,
                        // as: 'Workflow_Participants',
                        required: true, //will make it INNER JOIN instead of LEFT OUTER
                        where: {
                            actionType: { [Op.in]: wantedFolders },
                            empPositionId: employeePositionId,
                        },
                        attributes: ["empPositionId", "isSeen", "isPinned", "createdAt", "actionId"]
                    }],
                    where: { priority },
                    order: [
                        [Sequelize.col('Workflow_Participants.isPinned'), "DESC"],
                        [Sequelize.col('Workflow_Participants.createdAt'), "DESC"],
                    ],
                    attributes: ["id", "subject", "workflowType", "priority"],
                    raw: true, //this will make the result not nested 😁
                    limit: rowsPerPage,
                    offset: page * rowsPerPage,
                    subQuery: false, //visit: https://localcoder.org/sequelize-limit-and-offset-incorrect-placement-in-query
                });
                break;
            // ------------------------- Search By Workflow's Serial -------------------------
            case FilterByOptions.WorkflowSerial:
                let { workflowSerial } = req.query;


                objResultAndCount = await models.Workflow.findAndCountAll({
                    include: [{
                        model: models.Workflow_Participant,
                        // as: 'Workflow_Participants',
                        required: true, //will make it INNER JOIN instead of LEFT OUTER
                        where: {
                            actionType: { [Op.in]: wantedFolders },
                            empPositionId: employeePositionId,
                        },
                        attributes: ["empPositionId", "isSeen", "isPinned", "createdAt", "actionId"]
                    }],
                    where: { id: workflowSerial },
                    order: [
                        [Sequelize.col('Workflow_Participants.isPinned'), "DESC"],
                        [Sequelize.col('Workflow_Participants.createdAt'), "DESC"],
                    ],
                    attributes: ["id", "subject", "workflowType", "priority"],
                    raw: true, //this will make the result not nested 😁
                    limit: rowsPerPage,
                    offset: page * rowsPerPage,
                    subQuery: false, //visit: https://localcoder.org/sequelize-limit-and-offset-incorrect-placement-in-query
                });
                break;
        } //end switch
        workflowsList = objResultAndCount.rows;
        allMatchedWorkflowsCount = objResultAndCount.count;

        // I really need to change the name of the `workflow_participants` columns,
        // ex: instead of the long name: `WorkflowParticipants.isSeen`, transform it to `isSeen`:
        // I tried to do that using sequelize { model: , as: } but didn't allow me 🤯
        // --- The following loop will change the keys names in the objects of `workflowsList`:
        workflowsList.forEach((o: any) => {
            delete Object.assign(o, { ["empPositionId"]: o["Workflow_Participants.empPositionId"] })["Workflow_Participants.empPositionId"];

            delete Object.assign(o, { ["isSeen"]: o["Workflow_Participants.isSeen"] })["Workflow_Participants.isSeen"];

            delete Object.assign(o, { ["isPinned"]: o["Workflow_Participants.isPinned"] })["Workflow_Participants.isPinned"];


            delete Object.assign(o, { ["createdAt"]: o["Workflow_Participants.createdAt"] })["Workflow_Participants.createdAt"];

            delete Object.assign(o, { ["actionId"]: o["Workflow_Participants.actionId"] })["Workflow_Participants.actionId"];
        });

        // ------------ Adding some information to the workflowsList: ------------
        // such as: sender's name, and count of attachment on each action:
        for (let a = 0; a < workflowsList.length; a++) {

            const workflow = workflowsList[a];

            // ---- I need the empPositionId of the sender of each action: ----
            const senderWParticipantRecord = await models.Workflow_Participant.findOne({
                where: { actionId: workflow.actionId, actionType: ActionTypes.SENDER },
            });
            // -----
            const senderEmpPositionId = senderWParticipantRecord.empPositionId
            workflow.senderEmpPositionId = senderEmpPositionId;
            // -----
            const senderEmployeePositionRecord = await models.Employee_Position.findByPk(senderEmpPositionId);
            const senderEmployeeId = senderEmployeePositionRecord.employeeId;
            const { positionId, jobTitleId } = senderEmployeePositionRecord;
            workflow.senderEmployeeId = senderEmployeeId;
            // -----
            const senderPositionRecord = await models.Position.findByPk(positionId);
            workflow.senderPosition = senderPositionRecord.description;
            // -----
            const senderJobTitleRecord = await models.JobTitle.findByPk(jobTitleId);
            workflow.senderJobTitle = senderJobTitleRecord.title;
            // -----
            const senderEmployeeRecord = await models.Employee.findByPk(senderEmployeeId);
            const { firstName, middleName, lastName, avatar } = senderEmployeeRecord;
            workflow.senderFullName = `${firstName} ${middleName}. ${lastName}`;
            if (avatar) {
                workflow.senderAvatar = avatar;
            }
            // else {
            //     workflow.senderAvatar = "https://images.pexels.com/photos/6386956/pexels-photo-6386956.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
            // }
            const attachments = await models.Action_Attachment.findOne({
                where: { actionId: workflow.actionId },
                attributes: [[Sequelize.fn('count', Sequelize.col('actionId')), 'count']],
                raw: true,
            });
            console.log(attachments);
            workflow.attachmentsCount = attachments.count;
            // -----
        }// end for loop


        res.json({
            workflowsList, myEmpPositionId: employeePositionId, allMatchedWorkflowsCount
        });

    }
    catch (error) {
        next(error);
    }
}




// export const multiJoin = async (req: Request, res: Response, next: NextFunction) => {

//     try {
//         const { employeePositionId } = req.user; //from the middleware function
//         let page: number = Number(req.query.page);
//         let rowsPerPage: number = Number(req.query.rowsPerPage);
//         if (!page) { page = 0 }
//         if (!rowsPerPage) { rowsPerPage = 20; }

//         let workflowsList: Array<any> = [];
//         let allMatchedWorkflowsCount: number = 0;

//         type resultSetType = {
//             rows: Array<any>;
//             count: number;
//         }

//         const objResultAndCount = await models.Workflow.findAndCountAll({
//             include: [{
//                 model: models.Workflow_Participant,
//                 // as: 'Workflow_Participants',
//                 required: true, //will make it INNER JOIN instead of LEFT OUTER
//                 where: {
//                     actionType: "RECIPIENT",
//                     empPositionId: employeePositionId,
//                 },
//                 attributes: ["empPositionId", "isSeen", "isPinned", "createdAt", "actionId"],
//                 include: [{
//                     model: models.Employee_Position,
//                     required: true,
//                     attributes: ["empPositionId"]
//                     // association: new Sequelize.HasOne(models.Workflow_Participant, models.Employee_Position, {})
//                 }]
//             }],
//             order: [
//                 [Sequelize.col('Workflow_Participants.isPinned'), "DESC"],
//                 [Sequelize.col('Workflow_Participants.createdAt'), "DESC"],
//             ],
//             attributes: ["id", "subject", "workflowType", "priority"],
//             raw: true, //this will make the result not nested 😁
//             limit: rowsPerPage,
//             offset: page * rowsPerPage,
//             subQuery: false, //visit: https://localcoder.org/sequelize-limit-and-offset-incorrect-placement-in-query
//         });

//         const rows = objResultAndCount.rows;
//         const count = objResultAndCount.count;

//         return res.json({
//             rows, count
//         });
//     }
//     catch (error) {
//         next(error);
//     }
// }