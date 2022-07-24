'use strict';
import { Model } from 'sequelize';


interface IChannelMember {
    id: number;
    // channelId: number; //references `Channel(`id`)`
    // memberId: number; //references `EmployeePosition(`id`)`
    isAdmin: boolean;
    lastSeenMessageId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Channel_Member extends Model<IChannelMember>
        implements IChannelMember {

        id!: IChannelMember["id"];
        // channelId: number; //references `Channel(`id`)`
        // memberId: number; //references `Employee_Position(`id`)`
        isAdmin!: IChannelMember["isAdmin"];
        lastSeenMessageId!: IChannelMember["lastSeenMessageId"];


        static associate(models: any) {
            // define association here:
            // define association here:
            Channel_Member.belongsTo(models.Channel, {
                as: "channel", onDelete: "CASCADE", onUpdate: "CASCADE"
            });
            Channel_Member.belongsTo(models.Employee, {
                as: "member", onDelete: "CASCADE", onUpdate: "CASCADE"
            });
            Channel_Member.belongsTo(models.Message, {
                as: "lastSeenMessage", onDelete: "SET NULL", onUpdate: "CASCADE"
            });
        }
    }// end class

    Channel_Member.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
        },
        lastSeenMessageId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true,
            // references: {

            // }
        }
    }, {
        sequelize, //this is our Sequelize instance (our db connection instance)
        modelName: "Channel_Member",
        freezeTableName: true,
        tableName: "Channels_Members",
        timestamps: true, //Adds createdAt and updatedAt timestamps to the model. Default true.
        // initialAutoIncrement: "1000", //must be string | undefined
    });

    return Channel_Member; // Workflow Participants Class
};

