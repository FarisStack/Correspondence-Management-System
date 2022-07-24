'use strict';
import { Model, Sequelize } from 'sequelize';

export interface PositionJobTitleAttributes {
    id: number;
    positionId: number;
    jobTitleId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Position_JobTitle extends Model<PositionJobTitleAttributes>
        implements PositionJobTitleAttributes {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: PositionJobTitleAttributes["id"];
        positionId!: PositionJobTitleAttributes["positionId"];
        jobTitleId!: PositionJobTitleAttributes["jobTitleId"];

        static associate(models: any) {
            // define association here:
            // -------{ASSOC #1: }-----------    
            // const { Position, JobTitle } = models; //destructure the `models` object
            // Position.belongsToMany(JobTitle, { through: Position_JobTitle, });
            // JobTitle.belongsToMany(Position, { through: Position_JobTitle });
            /*
            for {through: } option, instead of a string, we are passing the models directly.
            So, the Position_JobTitle model will be created as the junction table that shows
            the Many-to-Many relationship between the `Position` and the `JobTitle` models.
            */
            // PRIMARY KEY will be ("positionId", "jobTitleId")
        }
    }

    Position_JobTitle.init({
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        positionId: {
            type: DataTypes.INTEGER(4).UNSIGNED, //default length is VARCHAR(255)
            allowNull: false,
            references: {
                model: "Positions",
                key: "id"
            },
            // onDelete: "SET NULL",
            // onUpdate: "CASCADE",
            // primaryKey: true,
            unique: "composite_Position_JobTitle_index"
            // Creating two objects with the same value will throw an error. The unique property can be either a
            // boolean, or a string. If you provide the same string for multiple columns, they will form a
            // composite unique key.
            // visit: https://sequelize.org/master/manual/model-basics.html#column-options
        },
        jobTitleId: {
            type: DataTypes.INTEGER(11).UNSIGNED, //default length is VARCHAR(255)
            allowNull: false,
            references: {
                model: "JobTitles",
                key: "id"
            },
            // onDelete: "SET NULL",
            // onUpdate: "CASCADE",
            // primaryKey: true,
            unique: "composite_Position_JobTitle_index"
            // Creating two objects with the same value will throw an error. The unique property can be either a
            // boolean, or a string. If you provide the same string for multiple columns, they will form a
            // composite unique key.
        },
    },
        {
            sequelize,
            modelName: 'Position_JobTitle',
            freezeTableName: true,
            tableName: "Positions_JobTitles"
            // initialAutoIncrement: "1000", //must be string | undefined
        });
    return Position_JobTitle;
};