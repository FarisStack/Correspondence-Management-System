'use strict';
import { Model, Sequelize } from 'sequelize';

export interface ClassificationType {
    id: number;
    name: string; // name of the jobtitle (ex: responsible, suboridinate, secretary)
}

import { positionClassifications as Classifcations } from '../interfaces/Employee_Position'

module.exports = (sequelize: any, DataTypes: any) => {
    class Classification extends Model<ClassificationType>
        implements ClassificationType {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: ClassificationType["id"];
        name!: ClassificationType["name"];

        static associate(models: any) {
            // define association here:
        }
    }

    Classification.init({
        id: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100), //default length is VARCHAR(255)
            unique: true,
            // type: DataTypes.ENUM(),
            // values: [
            //     Classifcations.RESPONSIBLE,
            //     Classifcations.SUBORDINATE,
            //     Classifcations.SECRETARY
            // ],
            allowNull: false,
        },
    },
        {
            sequelize,
            modelName: 'Classification',
            // initialAutoIncrement: "1000", //must be string | undefined
        });
    return Classification;
};