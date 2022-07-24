'use strict';
import { Model, Sequelize } from 'sequelize';

export interface IConsigneesGroup {
    id: number;
    name: string; // The group's name
    ownerId: number; //ownerEmployeePositionId
}


module.exports = (sequelize: any, DataTypes: any) => {
    class Consignees_Group extends Model<IConsigneesGroup>
        implements IConsigneesGroup {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IConsigneesGroup["id"];
        name!: IConsigneesGroup["name"];
        ownerId!: IConsigneesGroup["ownerId"];

        static associate(models: any) {
            // define association here:
            // --- {ASSOC #1: Consignees_Group belongsTo only one owner Employee_Position} ---
            Consignees_Group.belongsTo(models.Employee_Position, { as: "owner", onDelete: "CASCADE", onUpdate: "CASCADE" });
            // NOTE: { as: "owner" } will consider the target model name "owner" instead 
            // of "Consignees_Group", so it will add field: `ownerId` to the `Consignees_Group` model.
            // So, `ownerId` is a FK that references `Employee_Position`(`id`)


            Consignees_Group.hasMany(models.Consignees_Group_Member, {
                foreignKey: {
                    name: 'groupId',
                    allowNull: false,
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });

            // {ASSOC #2: Consignees_Group belongsToMany Employee_Position (as members in the group)}:
            // Consignees_Group.belongsToMany(models.Employee_Position, {
            //     through: models.Consignees_Group_Member,
            //     uniqueKey: "unique_memberId_groupId",
            //     as: "group",
            // });
        }
    }

    Consignees_Group.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50), //default length is VARCHAR(255)
            allowNull: false,
        },
        ownerId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
        }
    },
        {
            sequelize,
            modelName: "Consignees_Group",
            freezeTableName: true,
            tableName: "Consignees_Groups"
            // initialAutoIncrement: "1000", //must be string | undefined
        });
    return Consignees_Group;
};