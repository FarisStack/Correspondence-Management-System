'use strict';
import { Model, Sequelize } from 'sequelize';

export interface IJobTitle {
    id: number;
    title: string; // title of the job (ex: Assistant Prof.)
}

module.exports = (sequelize: any, DataTypes: any) => {
    class JobTitle extends Model<IJobTitle>
        implements IJobTitle {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IJobTitle["id"];
        title!: IJobTitle["title"];

        static associate(models: any) {
            // define association here:      
            // -------{ASSOC #1: JobTitle HAS ONE Employee_Position }----------------
            // Each Employee_Position record will has a `jobTitleId` field referencing the JobTitle model
            JobTitle.hasOne(models.Employee_Position, {
                foreignKey: {
                    name: 'jobTitleId',
                    // allowNull: false, 
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            })
        }
    }

    JobTitle.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING, //default length is VARCHAR(255)
            allowNull: false,
            unique: "jobTitle_index"
        },
    },
        {
            sequelize,
            modelName: 'JobTitle',
            // initialAutoIncrement: "1000", //must be string | undefined
        });
    return JobTitle;
};