import { NextFunction, Request, Response } from 'express';
import db from '../../models/'; // our database connection object
const { models } = db.sequelize; // returns object with all our models.
import { Op } from "sequelize"

import { QueryTypes } from "sequelize"
import 'dotenv/config'
// ---------- For Validation and Error Throwing ------------
import createError from 'http-errors'
import { promises } from 'nodemailer/lib/xoauth2';

import colors from "colors";


export const sendMessage = async (req: Request, res: Response, next: NextFunction,) => {

    const senderId = req.user.employeeId; // I am the sender of the message

    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        const newMessage = await models.Message.create({
            content: content,
            channelId: chatId,
            senderId: senderId,
        });

        // --- get the IDs of all members in this channel: ---
        let allMembers = await models.Channel_Member.findAll({
            where: {
                channelId: chatId
            }
        });
        const membersIDs = allMembers.map((m: any) => m.memberId);


        // // ------- This table `Message_Member` will be deleted --------------
        // let promises = [];
        // for (let i = 0; i < membersIDs.length; i++) {
        //     const mId = membersIDs[i];
        //     const response = models.Message_Member.create({
        //         messageId: newMessage.dataValues.id,
        //         memberId: mId,
        //         isSeen: mId == senderId ? true : false
        //     });
        //     promises.push(response);
        // }
        // await Promise.all(promises);
        // // ---------------------------------------------------------------

        // --- Update the `latestMessageId` of this channel: ---
        await models.Channel.update({
            latestMessageId: newMessage.dataValues.id
        }, { where: { id: chatId } });

        // --- Update the `lastSeenMessageId` for the sender in this channel: ---
        await models.Channel_Member.update({
            lastSeenMessageId: newMessage.dataValues.id
        }, {
            where: { channelId: chatId, memberId: senderId }
        });
        // ---------------------------------------------------------------

        // --- ❌💁 Now return the formatted response needed in frontend: ---
        // let selectedChat = await accessChatUtil(req, res, next, chatId);
        // const sender = selectedChat?.members?.find((m: any) => m.memberId == senderId);
        // selectedChat.sender = sender;
        // selectedChat.content = content;
        // // ---------------------------------------------------------------
        // return res.json({
        //     selectedChat
        // });


        // --- ✅💁 Now return the formatted response needed in frontend: ---
        // 1. Fetch the newly sent message with the same format written in `getAllMessages` function:
        const q = `SELECT C.id as channelId, C.name, C.isGroup, E.id as senderId, CONCAT_WS(' ', E.firstName, E.lastName) fullName, E.id, M.id as messageId, M.content, M.createdAt
        FROM channels as C
        JOIN messages as M on M.channelId = C.id
        JOIN employees as E on E.id = M.senderId
        WHERE C.id = ${chatId} AND M.id=${newMessage.dataValues.id}`;

        const message = await db.sequelize.query(q, {
            logging: console.log,
            type: QueryTypes.SELECT
        });
        // Be careful here, the raw query will return a list, not a single object.
        // So, return only the message[0] 


        // 2. Fetch data for the channel on which this message was sent:
        // (This data is needed for the purpose of Socket.io notifications)
        let targetChat = await accessChatUtil(req, res, next, chatId);
        const sender = targetChat?.members?.find((m: any) => m.memberId == senderId);
        targetChat.sender = sender;
        targetChat.content = content;


        return res.json({
            message: message[0],
            targetChat
        });
    }
    catch (error) {
        next(error);
    }
}

const accessChatUtil = async (req: Request, res: Response, next: NextFunction, channelId: any) => {
    const myId = req.user.employeeId;

    try {
        let myChannel = await models.Channel_Member.findOne({
            include: [
                {
                    model: models.Channel,
                    as: "channel"
                },
            ],
            where: {
                memberId: myId,
                channelId: channelId
            },
            raw: true,
        });

        // ----------- Regarding channel MEMBERS -------------------
        const members = await models.Channel_Member.findAll({
            where: {
                channelId: myChannel.channelId,
            },
            raw: true,
        });

        for (let j = 0; j < members.length; j++) {
            let member = members[j];
            let employeeRecord = await models.Employee.findOne({
                where: { id: member.memberId }
            });

            let { firstName, middleName, lastName, email, avatar } = employeeRecord;

            member.fullName = firstName + " " + lastName;
            member.email = email;
            member.avatar = avatar;
        }

        myChannel.members = members;
        // ----------- End Regarding channel MEMBERS -------------------

        // -------- Check if the chat (channel) is a group: ----------------
        if (myChannel["channel.isGroup"] == true) {
            // then find its admin:
            let channelAdmin = myChannel.members.find((member: any) => member.isAdmin == true);
            myChannel.admin = channelAdmin;
        }

        // console.log(myChannels);
        return myChannel;
    }
    catch (error) {
        next(error);
    }
}

export const getAllMessages = async (req: Request, res: Response, next: NextFunction,) => {
    try {
        const myId = req.user.employeeId;
        const { chatId } = req.params;

        // Fetch all messages of a particular chat:
        const q = `SELECT C.id as channelId, C.name, C.isGroup, C.latestMessageId, E.id as senderId, CONCAT_WS(' ', E.firstName, E.lastName) fullName, E.id, E.avatar, M.id as messageId, M.content, M.createdAt
        FROM channels as C
        JOIN messages as M on M.channelId = C.id
        JOIN employees as E on E.id = M.senderId
        WHERE C.id = ${chatId}`;

        const messages = await db.sequelize.query(q, {
            logging: console.log,
            type: QueryTypes.SELECT
        });
        return res.json({
            messages
        });
    }
    catch (err: any) {
        // console.log(err.message);
        next(err);
    }
}

export const setIsSeen = async (req: Request, res: Response, next: NextFunction,) => {
    const senderId = req.user.employeeId; // I am the sender of the message

    const { channelId, memberId } = req.body;


    if (!channelId || !memberId) {
        console.log("Please provide a channelId and memberId");
        return res.sendStatus(400);
    }

    try {
        // // --- get the IDs of all messages in this channel: ---
        // let allMessages = await models.Message.findAll({
        //     where: { channelId: channelId }
        // });

        // const allMessagesIDs = allMessages.map((msg: any) => msg.id);
        // console.log("allMessages: ", allMessages);

        // ---- Get the `latestMessageId` on this channel: ---
        const channelRecord = await models.Channel.findByPk(channelId, {
            raw: true,
            attributes: ["latestMessageId"]
        });
        // ---- update the `lastSeenMessageId` for this member on this channel: ---
        const updatedRecord = await models.Channel_Member.update({
            lastSeenMessageId: channelRecord.latestMessageId
        }, {
            where: {
                channelId, memberId
            }
        });

        console.log(
            colors.bgCyan(`SET IS SEEN FOR: ${memberId}`)
        );

        return res.json({
            updatedRecord
        });
    }
    catch (error) {
        next(error);
    }
}

