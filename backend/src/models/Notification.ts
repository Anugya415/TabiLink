import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface INotificationAttributes {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: 'price_alert' | 'system' | 'booking' | 'social';
    isRead: boolean;
    link?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface INotificationCreationAttributes extends Optional<INotificationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isRead'> { }

class Notification extends Model<INotificationAttributes, INotificationCreationAttributes> implements INotificationAttributes {
    public id!: number;
    public userId!: number;
    public title!: string;
    public message!: string;
    public type!: 'price_alert' | 'system' | 'booking' | 'social';
    public isRead!: boolean;
    public link?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Notification.init(
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
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('price_alert', 'system', 'booking', 'social'),
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_read',
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'notifications',
        timestamps: true,
        indexes: [
            { fields: ['user_id', 'is_read'] },
        ],
    }
);

export default Notification;
