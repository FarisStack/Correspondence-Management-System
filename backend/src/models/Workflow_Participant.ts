'use strict';
import { Model } from 'sequelize';
import { ActionTypes } from "../interfaces/Workflow_Participants";
// import { ActionAttributes } from '../interfaces/Action';


interface WParticipantsType {
    // Workflow Participants Interface
    id: number;
    // workflowId: number; //references `Worfklow(`id`)`
    // actionId: number; //references `Action(`id`)`
    // empId: number; //references `Employee(`id`)`
    empPositionId: number; //references `EmployeePosition(`id`)`
    actionType: ActionTypes;
    // creationDate: Date;
    isSeen: Boolean;
    isPinned: Boolean;
    isArchived: Boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Workflow_Participant extends Model<WParticipantsType>
        implements WParticipantsType {

        id!: WParticipantsType["id"];
        // workflowId: number; //references `Worfklow(`id`)`
        // actionId: number; //references `Action(`id`)`
        // empId!: WParticipantsType["empId"]; //references `Employee(`id`)`
        empPositionId!: WParticipantsType["empPositionId"]; //references `Employee_Position(`id`)`
        actionType!: WParticipantsType["actionType"];
        // creationDate!: WParticipantsType["creationDate"];
        isSeen!: WParticipantsType["isSeen"];
        isPinned!: WParticipantsType["isPinned"];
        isArchived!: WParticipantsType["isArchived"];

        static associate(models: any) {
            // define association here:
            // -------------- {#1: Action belongs to Workflow} --------------
            Workflow_Participant.belongsTo(models.Workflow, { as: "workflow", });
            // NOTE: { as: "workflow" } will consider the target model name "workflow" instead 
            // of "Workflow", so it will add field: `workflowId` to the `WorkflowParticipant` model.
            // So, `workflowId` is a FK that references `Workflow(`id`)`,

            // -------------- {#2: WorkflowParticipant belongs to Action} --------------
            Workflow_Participant.belongsTo(models.Action, { as: "action", });
            // NOTE: { as: "action" } will consider the target model name "action" instead 
            // of "Action", so it will add field: `actionId` to the `Action` model.
            // So, `actionId` is a FK that references `Action(`id`)`,
        }
    }// end class

    Workflow_Participant.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        // empId: {
        //     type: DataTypes.INTEGER(11).UNSIGNED,
        //     allowNull: false,
        //     references: {
        //       model: "Employees",
        //       key: 'id',
        //     },
        // },
        empPositionId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            references: {
                model: "Employees_Positions",
                key: 'id',
            },
        },
        actionType: {
            type: DataTypes.ENUM,
            values: [
                ActionTypes.SENDER,
                ActionTypes.RECIPIENT,
                ActionTypes.CC,
            ],
            allowNull: false,
            defaultValue: ActionTypes.RECIPIENT
        },
        // creationDate: {
        //     type: DataTypes.DATE, // = DATETIME for mysql
        //     // defaultValue: Date.now(),
        //     allowNull: false,
        // },
        isSeen: {
            type: DataTypes.BOOLEAN, // TINYINT(1)
            defaultValue: false,
            allowNull: false,
        },
        isPinned: {
            type: DataTypes.BOOLEAN, // TINYINT(1)
            defaultValue: false,
            allowNull: false,
        },
        isArchived: {
            type: DataTypes.BOOLEAN, // TINYINT(1)
            defaultValue: false,
            allowNull: false,
        },
    }, {
        sequelize, //this is our Sequelize instance (our db connection instance)
        modelName: 'Workflow_Participant',
        timestamps: true, //Adds createdAt and updatedAt timestamps to the model. Default true.
        // initialAutoIncrement: "1000", //must be string | undefined
    });

    return Workflow_Participant; // Workflow Participants Class
};

