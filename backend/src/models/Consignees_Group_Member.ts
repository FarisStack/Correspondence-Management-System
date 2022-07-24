'use strict';
import { Model, Sequelize } from 'sequelize';

export interface IConsigneesGroupMember {
    id: number;
    memberId: number; // The member's employeePositionId
    groupId: number;
}


module.exports = (sequelize: any, DataTypes: any) => {
    class Consignees_Group_Member extends Model<IConsigneesGroupMember>
        implements IConsigneesGroupMember {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IConsigneesGroupMember["id"];
        memberId!: IConsigneesGroupMember["memberId"];
        groupId!: IConsigneesGroupMember["groupId"];

        static associate(models: any) {
            // define association here:
            Consignees_Group_Member.belongsTo(models.Consignees_Group, {
                as: "group", onDelete: "CASCADE", onUpdate: "CASCADE"
            });
            Consignees_Group_Member.belongsTo(models.Employee_Position, {
                as: "member", onDelete: "CASCADE", onUpdate: "CASCADE"
            });

        }
    }


    Consignees_Group_Member.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        memberId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            references: {
                model: "Employees_Positions",
                key: 'id', //references Employee_Position(id)
            },
            unique: "unique_memberId_groupId"
        },
        groupId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            references: {
                model: "Consignees_Groups",
                key: 'id', //references Consignees_Group(id)
            },
            unique: "unique_memberId_groupId"
        }
    },
        {
            sequelize,
            modelName: "Consignees_Group_Member",
            freezeTableName: true,
            tableName: "Consignees_Groups_Members"
            // initialAutoIncrement: "1000", //must be string | undefined
        });
    return Consignees_Group_Member;
};