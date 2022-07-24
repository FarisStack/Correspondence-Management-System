'use strict';
import { Model, DataTypes } from 'sequelize';

export interface IAccount {
    id: number;
    // employeeId: EmployeeAttributes["id"]; //references the id field in `Employee`(`id`) model

    username: string;
    password: string;

    // lastLoginPosId: EmployeePositionAttributes["id"] | undefined;
    // references the id field in `EmployeePosition` model
    isActivated: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Account extends Model<IAccount> implements IAccount {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IAccount["id"];
        // employeeId!: IAccount["employeeId"]; 
        username!: IAccount["username"];
        password!: IAccount["password"];
        // lastLoginPosId: AccountAttributes["lastLoginPosId"];
        isActivated!: IAccount["isActivated"];

        static associate(models: any) {
            // define association here:
            // -------{ASSOC #1: Account belongs to Employee}-----------
            Account.belongsTo(models.Employee, { as: "employee", });
            // this will add 'employeeId' column to Account table.
            // -------{ASSOC #2: Account belongs to Employee_Position}----------------
            Account.belongsTo(models.Employee_Position, { as: "lastLoginPosition" });
            // this will add 'lastLoginPositionId' column to Account table.
            // -------{ASSOC #3: Account(`username`) references User(`email`)}----------------
            // Account.belongsTo(models.Employee, {
            //     foreignKey: {
            //         name: "username",
            //         allowNull: false,
            //     },
            //     targetKey: "email",
            // });
            // //remember: Account(`username`) references User(`email`) 😃
        }
    }

    Account.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(25), //VARCHAR(25)
            allowNull: false,
            unique: true, //will be used to login to the system
            // references: {
            //     model: "Employees",
            //     key: 'email'
            // }
        },
        password: {
            type: DataTypes.STRING, //default length is VARCHAR(255)
            allowNull: false
        },
        isActivated: {
            type: DataTypes.BOOLEAN, // TINYINT(1)
            defaultValue: false,
            // In order to activate the account, the employee must click the activation 
            // link which will be sent to his email address.
        }
    }, {
        sequelize,
        modelName: 'Account',
        // initialAutoIncrement: "1000", //must be string | undefined
    });
    return Account;
};