'use strict';
import { Model, Sequelize } from 'sequelize';

export interface IEmployeePermission {
    id: number;
    permissionId: number;
    employeeId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Employee_Permission extends Model<IEmployeePermission>
        implements IEmployeePermission {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IEmployeePermission["id"];
        permissionId!: IEmployeePermission["permissionId"];
        employeeId!: IEmployeePermission["employeeId"];

        static associate(models: any) {
            // define association here:

        }
    }

    Employee_Permission.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        permissionId: {
            type: DataTypes.INTEGER(4).UNSIGNED,
            allowNull: false,
            references: {
                model: "Permissions",
                key: "id"
            },
            // onDelete: "SET NULL",
            // onUpdate: "CASCADE",
            // primaryKey: true,
            unique: "composite_Employee_Permission_index"
            // Creating two objects with the same value will throw an error. The unique property can be either a
            // boolean, or a string. If you provide the same string for multiple columns, they will form a
            // composite unique key.
            // visit: https://sequelize.org/master/manual/model-basics.html#column-options
        },
        employeeId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            references: {
                model: "Employees",
                key: "id"
            },
            // onDelete: "SET NULL",
            // onUpdate: "CASCADE",
            // primaryKey: true,
            unique: "composite_Employee_Permission_index"
            // Creating two objects with the same value will throw an error. The unique property can be either a
            // boolean, or a string. If you provide the same string for multiple columns, they will form a
            // composite unique key.
        },
    },
        {
            sequelize,
            modelName: 'Employee_Permission',
            freezeTableName: true,
            tableName: "Employees_Permissions"
            // initialAutoIncrement: "1000", //must be string | undefined
        });
    return Employee_Permission;
};