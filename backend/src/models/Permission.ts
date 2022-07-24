'use strict';
import { Model, Sequelize } from 'sequelize';

export interface IPermission {
    id: number;
    name: string; // name of the permission (ex: Diwan director)
}

module.exports = (sequelize: any, DataTypes: any) => {
    class Permission extends Model<IPermission>
        implements IPermission {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: IPermission["id"];
        name!: IPermission["name"];

        static associate(models: any) {
            // define association here:      
        }
    }

    Permission.init({
        id: {
            type: DataTypes.INTEGER(4).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING, //default length is VARCHAR(255)
            allowNull: false,
            unique: "Permission_index"
        },
    },
        {
            sequelize,
            modelName: 'Permission',
            // initialAutoIncrement: "1000", //must be string | undefined
        });
    return Permission;
};