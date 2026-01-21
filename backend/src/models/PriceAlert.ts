import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IPriceAlertAttributes {
    id: number;
    userId: number;
    hotelId?: number;
    travelPackageId?: number;
    targetPrice: number;
    currentPrice: number; // Snapshot of price when alert was created
    triggerType: 'price_drop' | 'availability';
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IPriceAlertCreationAttributes extends Optional<IPriceAlertAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> { }

class PriceAlert extends Model<IPriceAlertAttributes, IPriceAlertCreationAttributes> implements IPriceAlertAttributes {
    public id!: number;
    public userId!: number;
    public hotelId?: number;
    public travelPackageId?: number;
    public targetPrice!: number;
    public currentPrice!: number;
    public triggerType!: 'price_drop' | 'availability';
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

PriceAlert.init(
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
            references: {
                model: 'users',
                key: 'id',
            },
        },
        hotelId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'hotel_id',
            references: {
                model: 'hotels',
                key: 'id',
            },
        },
        travelPackageId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'travel_package_id',
            references: {
                model: 'travel_packages',
                key: 'id',
            },
        },
        targetPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currentPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        triggerType: {
            type: DataTypes.ENUM('price_drop', 'availability'),
            allowNull: false,
            defaultValue: 'price_drop',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'price_alerts',
        timestamps: true,
        indexes: [
            { fields: ['user_id', 'hotel_id'] }, // Quick lookup for user's alerts on a hotel
            { fields: ['hotel_id', 'targetPrice'] }, // Quick lookup for triggering alerts
        ],
    }
);

export default PriceAlert;
