'use strict';
import { Model, DataTypes } from 'sequelize';

export interface IMessage {
    id: number;
    // channelId: number;
    // senderId: number;
    // createdAt: boolean;
    content: number | undefined;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Message extends Model<IMessage> implements IMessage {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IMessage["id"];
        // employeeId!: IMessage["employeeId"]; 
        content!: IMessage["content"];


        static associate(models: any) {
            // define association here:
            // -------------- {#1: Message belongs to Channel} --------------
            Message.belongsTo(models.Channel, { as: "channel", });
            // NOTE: { as: "channel" } will consider the target model name "channel" instead 
            // of "Channel", so it will add field: `channelId` to the `Message` model.
            // So, `channelId` is a FK that references `Channel(`id`)`,

            // Message.belongsTo(models.Employee_Position, { as: "sender" });
            Message.belongsTo(models.Employee, { as: "sender" });

            // Message.hasMany(models.Message_Member, {
            //     foreignKey: {
            //         name: 'messageId',
            //         allowNull: false,
            //     },
            //     onDelete: 'CASCADE',
            //     onUpdate: 'CASCADE',
            // });

            Message.hasOne(models.Channel_Member, {
                foreignKey: {
                    name: 'lastSeenMessageId',
                    allowNull: true,
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            });
        }
    }

    Message.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT, // == TEXT in MySQL = 64 Kilobytes (65,535 characters)
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Message',
        // initialAutoIncrement: "1000", //must be string | undefined
    });
    return Message;
};