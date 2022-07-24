import { NextFunction, Request, Response } from 'express';
import db from '../models/'; // our database connection object
const { models } = db.sequelize; // returns object with all our models.
import 'dotenv/config'
import bcrypt from 'bcrypt'; //for hashing the password when registering new user
import { Secret, sign, verify } from 'jsonwebtoken'; //Secret is a type from @types/jsonwebtoken


// ========= Nodemailer: ===========================================
import fs from "fs"; // FileSystem for reading emailContent.html file
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com', //I'm sending from my outlook email, which is a hotmail service.
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MY_OUTLOOK_FROM_EMAIL_ADDRESS,
        pass: process.env.MY_OUTLOOK_EMAIL_PASSWORD
    },
});
// ========= End Nodemailer: ===============

// ========= Random Password Generator: ============
import pwdGenerator from "generate-password"




export const checkUsernameExists = async (req: Request, res: Response, next: NextFunction) => {

    const { username } = req.body;

    models.Account.findOne({
        where: { username },
        attributes: ['username']
    }).then((result: any) => {
        // if the username doesn't exist in the database, the result will be null.
        if (result) {
            return res.json({
                message: `Username: ${username} is taken❕`,
                taken: true,
                status: 200
            });
        }
        return res.json({
            message: `Username: ${username} is available ☑️`,
            taken: false,
            status: 200
        });
    }).catch((error: any) => {
        next(error); // passing error to error handler middleware
        // console.log(error.message);
    });
}
// =================================================================

export const fetchPositions = async (req: Request, res: Response, next: NextFunction) => {

    const allPositions = await models.Position.findAll({ attributes: ["id", "description"] });
    const allClassifications = await models.Classification.findAll({ attributes: ["id", "name"] });
    const allJobTitles = await models.JobTitle.findAll({ attributes: ["id", "title"] });

    return res.json({
        allPositions,
        allClassifications,
        allJobTitles
    })
}
// =================================================================
export const addEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, middleName, lastName, email, phoneNumber,
            hireDate, birthDate, username, position, classification, jobTitle,
            startDate, endDate
        } = req.body;

        // First, check if email is taken:
        const employeeWithThisEmail = await models.Employee.findOne({
            where: { email },
            attributes: ['email']
        });
        if (employeeWithThisEmail) {
            return res.json({
                message: `Sorry, this email: ${employeeWithThisEmail.email} is taken`,
                type: "error", // to know what color to show for the alert snackbar in frontend
                status: 200
            });
        }
        // else, the email is not taken, so proceed:
        // Generate random password:
        let generatedPassword = pwdGenerator.generate({
            length: 10,
            strict: true, //Password should include at least one character from each pool
        });

        // If reaches here, then email is not taken, so let's register the user
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const newEmployee = await models.Employee.create({
            firstName,
            middleName,
            lastName,
            email,
            phoneNumber,
            hireDate,
            birthDate,
            // userStatus: "regular",
            // privilegeGroup: "employee",
            role: "employee",
        });

        // Now the record is added to the `Employee` model, let's get the inserted id:
        const employeeId = newEmployee.id; // needed in order to store it in the `Accounts` table

        // Now we have to insert a new record to the `Account` model:
        const newAccount = await models.Account.create({
            username,
            password: hashedPassword,
            employeeId,// references the `Employee`(`id`) model
        });
        // Now we have to insert a new record to the `Employees_Positions` model:
        const newEmpPosition = await models.Employee_Position.create({
            positionId: position,
            classification,
            jobTitleId: jobTitle,
            startDate, // the start date for this position
            endDate, // the end date (could be null if no endDate is determined)
            employeeId,// references the `Employee`(`id`) model
        });

        // ============= GENERATE TOKEN TO SEND WITHIN THE EMAIL ==============
        const mySecretKey: Secret = process.env.JWT_ACC_ACTIVATE as Secret;
        const token: string = sign(
            { //1st arg: the payload object
                accountId: newAccount.id,
                // I need the accountId in order to execute the query that will 
                // update the column `Account(`isActivated`)` and set it to true.
            },
            mySecretKey, //2nd arg: the secretKey
            { expiresIn: "30 m" } //20 minutes
        );
        // ==================================================================

        // ============= NOW: SENDING EMAIL with the token to THE NEW USER: ==============
        //  ======================= Start Nodemailer Email Sending =======================
        const nodemailerOptions = {
            from: `CORRESPONDENCE HRMS <fareshatem.fh@outlook.com>`, // sender address
            to: email, // list of receivers (here is only one receiver)
            subject: "Account Activation Link", // Subject line
            html: "<h1>Hello, " + newEmployee.firstName + ". Welcome to our company 🙋</h1><h3>Kindly click the below link to activate your account:</h3><p>" + process.env.CLIENT_URL + "/auth/activate/" + token + "</p>" + "<p>Note: The above activation link will expire after 30 minutes from the time this email was sent</p><h4>After activation, you can login to your account using the following credentials:</h4><p>Username: " + newAccount.username + "</P><p>Password: " + generatedPassword + "</p>",
        };
        transporter.sendMail(nodemailerOptions, function (err, info) {
            if (err) {
                console.log(err);
                console.log("Error sending email from Nodemailer! 😕");
            }
            console.log(info);
        });
        //  ======================= End Nodemailer Email Sending =======================
        return res.json({
            message: `Success! An email with account activation link has been sent to: [${newEmployee.email}]`,
            type: "success", // to know what color to show for the alert snackbar in frontend
            insertedRecords: [
                newEmployee,
                newAccount,
                newEmpPosition
            ],
            statusCode: 200
        });
    }
    catch (error) {
        next(error); // passing error to error handler middleware
    }
}
export const updateLastLoginPositionId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeCurrentPositionId = req.body.employeeCurrentPositionId;


        // First, ensure that the passed id is owned by the user who is making the request:
        const empPosRecord = await models.Employee_Position.findOne({
            where: {
                id: employeeCurrentPositionId,
                employeeId: req.user.employeeId
            }
        })

        if (empPosRecord) {

            // -- Update the `lastLoginPositionId` for the user:
            const updatedRecord = await models.Account.update({
                lastLoginPositionId: employeeCurrentPositionId
            }, {
                where: { employeeId: req.user.employeeId }
            });

            // -- Find the job title that the user switched into: 
            const theJobTitleSwitchedInto = await models.JobTitle.findByPk(empPosRecord.jobTitleId);

            return res.json({
                message: `You will be acting as: "${theJobTitleSwitchedInto.title}"`,
            });
        }
        else {
            return res.json({
                message: `The passed employeeCurrentPositionId is not owned by the current user`,
            });
        }
    }
    catch (error) {
        next(error)
    }
}
export const getUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeRecord = await models.Employee.findByPk(req.user.employeeId, {
            attributes: ["avatar"],
            raw: true,
        });
        return res.json({
            "avatar": employeeRecord.avatar
        });
    }
    catch (error) {
        next(error);
    }
}
export const getEmployeeRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let employeeId = req.query.employeeId;
        if (!employeeId) {
            employeeId = req.user.employeeId;
        }

        const employeeRecord = await models.Employee.findByPk(employeeId, {
            raw: true,
        });
        return res.json({
            "employeeRecord": employeeRecord
        });
    }
    catch (error) {
        next(error);
    }
}


