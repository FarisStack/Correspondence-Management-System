'use strict';
import { Model } from 'sequelize';

export interface IPosition {
    id: number;
    description: string;
    parentId: number | undefined; // since it references the `Position`(`id`), it must be nullable, otherwise you can't insert the first record
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Position extends Model<IPosition>
        implements IPosition {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IPosition["id"];
        description!: IPosition["description"];
        parentId: IPosition["parentId"];

        static associate(models: any) {
            // define association here:

        }
    }

    Position.init({
        id: {
            type: DataTypes.INTEGER(4).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            // autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING, //default length is VARCHAR(255)
            allowNull: false,
        },
        parentId: {
            type: DataTypes.INTEGER(4).UNSIGNED,
            allowNull: true,
            references: {
                model: Position, //or "Positions" as a string with (s)
                key: 'id',
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE",
            // `parentPosId` references `id` ?????!! R U sure it is possible?
            // Yes, it is possible to reference a column in the same table,
            // but notice that the `parentPositionId` must be nullable
            // otherwise you can't insert the first record.
        }
    }, {
        sequelize,
        modelName: 'Position',
        // initialAutoIncrement: "1000", //must be string | undefined
    });
    return Position;
};