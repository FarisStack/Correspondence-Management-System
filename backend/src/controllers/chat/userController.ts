import { NextFunction, Request, Response } from 'express';
import db from '../../models/'; // our database connection object
const { models } = db.sequelize; // returns object with all our models.
import { Op } from "sequelize"

import { QueryTypes } from "sequelize"
import 'dotenv/config'
// ---------- For Validation and Error Throwing ------------
import createError from 'http-errors'


export const getAllUsers = async (req: Request, res: Response, next: NextFunction,) => {
    // remove the cookie whose name is "access-token" from the server:
    try {
        const keyword = req.query.search;
        console.log(keyword);
        console.log(req.user);

        // Find all users matching the search query (the keyword) and exclude yourself.
        const users = await models.Employee.findAll({
            // include: [models.Account, models.Employee_Position], 
            include: [models.Account],
            where: {
                id: { [Op.ne]: req.user.employeeId }, //exclude the user himself.
                [Op.or]: {
                    firstName: { [Op.like]: `%${keyword}%` },
                    middleName: { [Op.like]: `%${keyword}%` },
                    lastName: { [Op.like]: `%${keyword}%` },
                    email: { [Op.like]: `%${keyword}%` },
                    '$Account.username$': { [Op.like]: `%${keyword}%` },
                }
            }
        });

        for (let i = 0; i < users.length; i++) {
            let user = users[i].dataValues;
            user.fullName = `${user.firstName} ${user.lastName}`;
        }

        // for(let i = 0; i <users.length; i++) {
        //     let user = users[i].dataValues;
        //     console.log("USER**: ", user);
        //     for(let j=0; j < user.Employee_Positions.length; j++) {
        //         let empPos = user.Employee_Positions[j].dataValues;
        //         console.log("empPos**: ", empPos);

        //         console.log("empPos.positionId**: ", empPos.positionId);
        //         let positionRecord = await models.Position.findByPk(empPos.positionId);
        //         empPos.position = positionRecord.description;
        //         let jobTitleRecord = await models.JobTitle.findByPk(empPos.jobTitleId);
        //         empPos.jobTitle = jobTitleRecord.title;
        //     }
        // }

        return res.json({
            result: users
        });
    }
    catch (err: any) {
        // console.log(err.message);
        next(err);
    }
}

export const whoSawThisMessage = async (req: Request, res: Response, next: NextFunction,) => {
    const { channelId, messageId } = req.query;

    if (!channelId || !messageId) {
        console.log("Please provide a channelId and messageId");
        return res.sendStatus(400);
    }

    // console.log("**channelId: ", channelId);
    // console.log("**messageId: ", messageId);

    try {
        const seeners = await models.Channel_Member.findAll({
            include: [{
                model: models.Employee,
                as: "member",
                attributes: ["firstName", "middleName", "lastName", "avatar"]
            }],
            where: {
                channelId, 
                lastSeenMessageId:  {
                    [Op.gte]: messageId
                }
            },
        });

        console.log(seeners);

        return res.json({
            seeners
        });
    }
    catch (error) {
        next(error);
    }
}

// export default { registerUser, loginUser }