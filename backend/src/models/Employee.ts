'use strict';
import { Model, Sequelize } from 'sequelize';

import {
  EmployeeAttributes,
  EmployeeStatus,
  MaritalStatus,
  Role
} from '../interfaces/Employee';

// remember that these 2 arguments: (sequelize, DataTypes) came from the 
// ./models/index.js file  from the forEach in line:23
module.exports = (sequelize: any, DataTypes: any) => {
  //(In some situations, not all type information is available)
  //Since Sequelize is a 3rd party library and we should trust it, so here we
  //can specify the 'any' type for the function arguments. 
  class Employee extends Model<EmployeeAttributes> implements EmployeeAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: EmployeeAttributes["id"]; // this ! means not nullable attribute
    firstName!: EmployeeAttributes["firstName"];
    middleName!: EmployeeAttributes["middleName"];
    lastName!: EmployeeAttributes["lastName"];
    email!: EmployeeAttributes["email"];
    avatar: EmployeeAttributes["avatar"] | undefined;  //store the profile_photo name (path) as string
    phoneNumber!: EmployeeAttributes["phoneNumber"];
    hireDate!: EmployeeAttributes["hireDate"];
    birthDate!: EmployeeAttributes["birthDate"];
    gender!: EmployeeAttributes["gender"];
    userStatus!: EmployeeAttributes["userStatus"];
    maritalStatus!: EmployeeAttributes["maritalStatus"];
    city!: EmployeeAttributes["city"];
    // privilegeGroup!: EmployeeAttributes["privilegeGroup"];
    role!: EmployeeAttributes["role"];

    static associate(models: any) {
      // define association here:
      // -------{#1: Employee HAS MANY EmpPositions} -------
      Employee.hasMany(models.Employee_Position, {
        foreignKey: {
          name: 'employeeId',
          allowNull: false,
        },
        // onDelete: 'SET NULL',
        // onUpdate: 'CASCADE',
      });
      // -------{#2: Employee HAS ONE Account} -------
      Employee.hasOne(models.Account, {
        foreignKey: {
          name: 'employeeId',
          allowNull: false,
        },
        // onDelete: 'SET NULL',
        // onUpdate: 'CASCADE',
      });
      // -------{#3: Employee HAS ONE Account} -------
      // // Account(`username`) references Employee(`email`) 😃
      // Employee.hasOne(models.Account, {
      //   foreignKey: {
      //     name: 'username',
      //     allowNull: false,
      //   },
      //   onDelete: 'NO ACTION',
      //   onUpdate: 'CASCADE',
      // })

      Employee.hasMany(models.Channel_Member, {
        foreignKey: {
          name: 'memberId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // Employee.hasMany(models.Message_Member, {
      //   foreignKey: {
      //     name: 'memberId',
      //     allowNull: false,
      //   },
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE',
      // });

      Employee.hasMany(models.Message, {
        foreignKey: {
          name: 'senderId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  };

  // ===== User-defined validator functions: ===============
  function isGT3(value: string) {
    value = value.trim();
    if (value.length <= 2) {
      throw new Error('First Name must be greater than 2 letters');
    }
    return value;
  }

  // Now grab the created 'Employee' class, and initialize the schema:
  Employee.init({
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      // validate: {
      //   isGT3
      // }
    },
    middleName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING, //default length is VARCHAR(255)
      allowNull: false,
      unique: true, //will be used to login to the system
    },
    avatar: {
      type: DataTypes.STRING(300), //store the path of the image
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
      // Thanks to the international phone numbering plan (ITU-T E. 164), phone numbers cannot contain more than 15 digits. 
      allowNull: false,
    },
    hireDate: {
      type: DataTypes.DATEONLY, // DATE without time.
      // Since DataTypes.DATE will be converted to DATETIME for mysql. 
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    birthDate: {
      type: DataTypes.DATEONLY, // DATE without time.
      // Since DataTypes.DATE will be converted to DATETIME for mysql. 
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(),
      values: ["male","female"],
      defaultValue: "male",
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.ENUM(),
      // values must be array of strings
      values: [
        MaritalStatus.SINGLE,
        MaritalStatus.MARRIED,
        MaritalStatus.DIVORCED,
        MaritalStatus.WIDOWED,
        MaritalStatus.OTHER,
      ],
      defaultValue: MaritalStatus.SINGLE,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      defaultValue: "Tulkarm"
    },
    userStatus: {
      type: DataTypes.ENUM(),
      // values must be array of strings
      values: [
        EmployeeStatus.REGULAR,
        EmployeeStatus.IN_VACATION,
        EmployeeStatus.FIRED,
        EmployeeStatus.RETIRED,
        EmployeeStatus.RESIGNED,
      ],
      defaultValue: EmployeeStatus.REGULAR,
      allowNull: false, // although there is a default value, this default valueensures
      // that the field will not be null when record is inserted for first time,
      // but since we can update the field after insertion and make it null,
      // so that's why we put allowNull: false
    },
    // privilegeGroup: {
    //   type: DataTypes.ENUM(),
    //   values: [
    //     PrivilegeGroup.ADMIN,
    //     PrivilegeGroup.MODERATOR,
    //     PrivilegeGroup.EMPLOYEE,
    //     // PrivilegeGroup.FULL_TIME_EMPLOYEE,
    //     // PrivilegeGroup.PART_TIME_EMPLOYEE,
    //   ],
    //   defaultValue: PrivilegeGroup.EMPLOYEE,
    //   allowNull: false,
    // },
    role: {
      type: DataTypes.ENUM(),
      values: [
        Role.ADMIN,
        Role.MODERATOR,
        Role.EMPLOYEE,
        // PrivilegeGroup.FULL_TIME_EMPLOYEE,
        // PrivilegeGroup.PART_TIME_EMPLOYEE,
      ],
      defaultValue: Role.EMPLOYEE,
      allowNull: false,
    }
  },
    {
      sequelize,  //this is our Sequelize instance (our db connection instance)
      modelName: 'Employee',
      initialAutoIncrement: "1000", //must be string | undefined
    });

  return Employee;
};
