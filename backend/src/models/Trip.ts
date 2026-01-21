import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ITripAttributes {
    id: number;
    ownerId: number;
    name: string;
    startDate?: Date;
    endDate?: Date;
    status: 'planning' | 'confirmed' | 'completed';
    shareToken: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ITripCreationAttributes extends Optional<ITripAttributes, 'id' | 'startDate' | 'endDate' | 'status' | 'shareToken' | 'createdAt' | 'updatedAt'> { }

class Trip extends Model<ITripAttributes, ITripCreationAttributes> implements ITripAttributes {
    public id!: number;
    public ownerId!: number;
    public name!: string;
    public startDate?: Date;
    public endDate?: Date;
    public status!: 'planning' | 'confirmed' | 'completed';
    public shareToken!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Trip.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        ownerId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'owner_id',
            references: {
                model: 'users',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: 'start_date',
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: 'end_date',
        },
        status: {
            type: DataTypes.ENUM('planning', 'confirmed', 'completed'),
            defaultValue: 'planning',
        },
        shareToken: {
            type: DataTypes.STRING(100), // UUID or similar
            allowNull: true,
            unique: true,
            field: 'share_token',
        },
    },
    {
        sequelize,
        tableName: 'trips',
        hooks: {
            beforeCreate: async (trip: Trip) => {
                if (!trip.shareToken) {
                    // Simple random token for sharing
                    trip.shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                }
            }
        }
    }
);

export default Trip;
