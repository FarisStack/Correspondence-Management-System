'use strict';
import { Model, DataTypes } from 'sequelize';

export interface IChannel {
    id: number;
    name: string;
    isGroup: boolean;
    // adminId: number | undefined; // only if it is a group channel
    latestMessageId: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Channel extends Model<IChannel> implements IChannel {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IChannel["id"];
        // employeeId!: IChannel["employeeId"]; 
        name!: IChannel["name"];
        isGroup!: IChannel["isGroup"];
        // lastLoginPosId: ChannelAttributes["lastLoginPosId"];
        // adminId!: IChannel["adminId"];
        latestMessageId!: IChannel["latestMessageId"]

        static associate(models: any) {
            // define association here:
            // -------{#1: Workflow HAS MANY Actions} -------
            Channel.hasMany(models.Message, {
                foreignKey: {
                    name: 'channelId',
                    allowNull: false,
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });

            Channel.hasMany(models.Channel_Member, {
                foreignKey: {
                    name: 'channelId',
                    allowNull: false,
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }

    Channel.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(25), //VARCHAR(25)
            allowNull: false,
            // unique: true, 
        },
        isGroup: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        // adminId: {
        //     type: DataTypes.INTEGER(11).UNSIGNED,
        //     allowNull: true,
        //     defaultValue: null,
        // },
        latestMessageId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true,
            defaultValue: null,
        }
    }, {
        sequelize,
        modelName: 'Channel',
        // initialAutoIncrement: "1000", //must be string | undefined
    });
    return Channel;
};