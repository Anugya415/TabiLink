import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ISavedSearchAttributes {
    id: number;
    userId: number;
    name: string;
    criteria: string; // JSON string of filters
    createdAt?: Date;
    updatedAt?: Date;
}

interface ISavedSearchCreationAttributes extends Optional<ISavedSearchAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class SavedSearch extends Model<ISavedSearchAttributes, ISavedSearchCreationAttributes> implements ISavedSearchAttributes {
    public id!: number;
    public userId!: number;
    public name!: string;
    public criteria!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

SavedSearch.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'user_id',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        criteria: {
            type: DataTypes.TEXT, // Storing JSON as text/string for flexibility
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'saved_searches',
        timestamps: true,
    }
);

export default SavedSearch;
