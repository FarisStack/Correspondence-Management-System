'use strict';
import { Model } from 'sequelize';

// import { ActionAttributes } from '../interfaces/Action';
interface ActionAttributes {
    id: number;
    content: string;
    createdAt: Date;
    // workflowId: number; // references `Workflow(`id`)`
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Action extends Model<ActionAttributes>
        implements ActionAttributes {

        id!: ActionAttributes["id"];
        content!: ActionAttributes["content"];
        createdAt!: ActionAttributes["createdAt"];

        static associate(models: any) {
            // define association here:
            // -------------- {#1: Action belongs to Workflow} --------------
            Action.belongsTo(models.Workflow, { as: "workflow", });
            // NOTE: { as: "workflow" } will consider the target model name "workflow" instead 
            // of "Workflow", so it will add field: `workflowId` to the `Action` model.
            // So, `workflowId` is a FK that references `Workflow(`id`)`,

            // -------------- {#2: Action HAS MANY Workflow_Participants} --------------
            Action.hasMany(models.Workflow_Participant, {
                foreignKey: {
                    name: 'actionId',
                    allowNull: false,
                },
                // onDelete: 'SET NULL',
                // onUpdate: 'CASCADE',
            });
            // -------------- {#3: Action HAS MANY Attachments} --------------
            Action.hasMany(models.Action_Attachment, {
                foreignKey: {
                    name: 'actionId',
                    allowNull: false,
                },
                //   onDelete: 'SET NULL',
                //   onUpdate: 'CASCADE',
            });
        }
    }// end class

    Action.init({
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
        createdAt: {
            type: DataTypes.DATE, // = DATETIME for mysql
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    }, {
        sequelize, //this is our Sequelize instance (our db connection instance)
        modelName: 'Action',
        timestamps: false, //Adds createdAt and updatedAt timestamps to the model. Default true.
        // initialAutoIncrement: "1000", //must be string | undefined
    });

    return Action;
};


/*
Action has only `createdAt`, no need for `updatedAt` column, because once the action is created, it is not meant to be updated.
*/