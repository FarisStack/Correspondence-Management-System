import { NextFunction, Request, Response } from 'express';
import db from '../models/'; // our database connection object
import { QueryTypes } from "sequelize"

const { models } = db.sequelize; // returns object with all our models.
import 'dotenv/config'
import bcrypt from 'bcrypt'; //for hashing the password when registering new user
import { Secret, sign, verify } from 'jsonwebtoken'; //Secret is a type from @types/jsonwebtoken


import path from 'path';
import fileUpload from 'express-fileupload';
import fs from "fs"; //file system

export const informationOfEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeePositionId, employeeId, accountId } = req.user;

        let accountRecord = await models.Account.findByPk(accountId);
        accountRecord = accountRecord.dataValues;

        let employeeRecord = await models.Employee.findByPk(employeeId);
        employeeRecord = employeeRecord.dataValues;


        const initialValues = { ...employeeRecord, username: accountRecord.username };

        res.json({
            initialValues
        });
    }
    catch (error: any) {
        next(error);
    }
}



export const updateEmployeeInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeePositionId, employeeId, accountId } = req.user;
        const { theNewData } = req.body;

        const {
            firstName, middleName, lastName, username,
            hireDate, birthDate, email, phoneNumber, city, gender, maritalStatus
        } = theNewData;

        const updatedEmployeeRecord = await models.Employee.update({
            firstName, middleName, lastName,
            hireDate, birthDate, email, phoneNumber, city, gender, maritalStatus
        }, {
            where: { id: employeeId }
        });

        return res.json({
            updatedEmployeeRecord
        });
    }
    catch (error) {
        next(error);
    }
}

export const updateImageOfEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const { employeePositionId, employeeId, accountId } = req.user;

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // ---- Before uploading new avatar, remove the previous one if any: ----
        const employeeRecord = await models.Employee.findByPk(employeeId);
        const accountRecord = await models.Account.findByPk(accountId);

        console.log("Previous avatar: ", employeeRecord.avatar);
        const previousAvatarPath = `public/avatars/${employeeRecord.avatar}`;
        fs.unlinkSync(previousAvatarPath);
        console.log(previousAvatarPath);
        // -----------------------------------------------------------

        let targetFile = req.files.image as fileUpload.UploadedFile;
        console.log(" ----- ** targetFile ** -----");
        const extension = path.extname(targetFile.name); //extension name with the dot (.) ex: .png
        targetFile.name = accountRecord.username + extension; //rename the file to be the username
        console.log(targetFile);


        targetFile.mv(
            path.join(__dirname, '../../public/avatars', targetFile.name),
            (err: any) => {
                if (err)
                    return res.status(500).send(err);
                res.send('File uploaded!');
            });


        await models.Employee.update(
            { avatar: targetFile.name },
            { where: { id: employeeId } }
        );

        return res.json("successfully uploaded avatar");
    }
    catch (error: any) {
        next(error);
    }

}

export const getEmployeePositions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { employeePositionId, employeeId, accountId } = req.user;
        const employeeId = Number(req.params.employeeId);


        const q = `SELECT EP.id as recordId, EP.positionId, EP.classification, EP.jobTitleId, EP.startDate, EP.endDate, 
        P.description, JT.title
        FROM employees_positions as EP
        JOIN positions as P on P.id = EP.positionId
        JOIN jobtitles as JT on JT.id = EP.jobTitleId
        WHERE employeeId = ${employeeId}`;

        const myEmployeePositions = await db.sequelize.query(q, {
            type: QueryTypes.SELECT,
            logging: console.log,
        });

        myEmployeePositions.forEach((emp: any) => {
            emp.isNew = false;
            emp.isDeleted = false;
            emp.isUpdated = false;
        });


        const allPositions = await models.Position.findAll({});
        const allJobTitles = await models.JobTitle.findAll({});

        return res.json({
            myEmployeePositions,
            allPositions,
            allJobTitles,
        });
    }
    catch (error) {
        next(error);
    }
}

export const updateEmployeePositionsTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { employeePositionId, employeeId, accountId } = req.user;
        const { myEmpPositions, employeeId } = req.body;
        // this is the employeeId for the employee whose positions are about to be updated:

        let employeeRecord = await models.Employee.findByPk(employeeId);
        employeeRecord = employeeRecord.dataValues;


        let promises = [];
        for (let i = 0; i < myEmpPositions?.length; i++) {
            let currentEmpPos = myEmpPositions[i];

            if (currentEmpPos.isNew == false) {
                // then either delete or update. 
                if (currentEmpPos.isDeleted) {
                    // then delete the record from the database
                    let deletedRecordResponse = models.Employee_Position.destroy({
                        where: { id: currentEmpPos.recordId }
                    });
                    promises.push(deletedRecordResponse)
                }
                if (currentEmpPos.isUpdated) {
                    // then update the record
                    const { positionId, jobTitleId, classification, startDate, endDate } = currentEmpPos;
                    let updatedRecordResponse = models.Employee_Position.update(
                        { positionId, jobTitleId, classification, startDate, endDate },
                        { where: { id: currentEmpPos.recordId } }
                    );
                    promises.push(updatedRecordResponse)
                }
            }
            else {
                // then the record is new (doesn't exist in the database yet):
                // if (currentEmpPos.isDeleted) continue; //the record is new but it was deleted in the frontend, so 

                const { positionId, jobTitleId, classification, startDate, endDate } = currentEmpPos;
                const createdRecordResponse = models.Employee_Position.create({
                    positionId, jobTitleId, classification, startDate, endDate,
                    employeeId
                });
                promises.push(createdRecordResponse)
            }

            // Now reset the flags all to false:
            currentEmpPos.isNew = false; //the new records will become old after inserting them to the database.
            currentEmpPos.isUpdated = false;
        }

        // Now execute the list of promises all in parallel:
        await Promise.all(promises);


        // Now we can safely remove the deleted objects permanently.
        // Because we have deleted them from the database.
        const updatedList = myEmpPositions.filter((item: any) => item.isDeleted == false);

        return res.json({
            message: `Positions has been updated for: ${employeeRecord.firstName} ${employeeRecord.lastName}`,
            myEmpPositions: updatedList
        });
    }
    catch (error) {
        next(error);
    }
}

// ======= This is for the Cards Page that shows all employees =====
export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    const positionsList = await models.Position.findAll();
    const employees = await models.Employee.findAll();

    for (let i = 0; i < employees.length; ++i) {
        // list of all empPositions for the current employee:
        const employeePositions = await models.Employee_Position.findAll({
            where: { employeeId: employees[i].id }
        });

        const departments: string[] = [];
        for (let j = 0; j < employeePositions.length; ++j) {
            const positions = await models.Position.findOne({
                where: { id: employeePositions[j].positionId },
            });

            departments.push(positions.description);
        }
        employees[i] = Object.assign(employees[i].dataValues, { 'departments': departments });
    }
    return res.json({
        employees,
        positionsList
    });
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {

    const { employeePositionId, employeeId, accountId } = req.user;
    const { currentPassword, newPassword } = req.body;

    try {
        const accountRecord = await models.Account.findByPk(accountId);

        // Compare the currentPassword received from `req.body` with the password stored in the database: 
        const match = await bcrypt.compare(currentPassword, accountRecord.password);

        if (match) {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await models.Account.update({ password: hashedNewPassword }, {
                where: { id: accountId }
            });

            return res.status(200).json({
                message: 'Password has been successfully changed',
                statusCode: 200
            });
        }
        else {
            return res.json({
                message: 'This is not your current password',
                statusCode: 403 //Forbidden
            });
        }
    }
    catch (error: any) {
        next(error);
    }
}

