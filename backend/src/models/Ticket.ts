import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ITicketAttributes {
    id: number;
    userId: number;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt?: Date;
    updatedAt?: Date;
}

interface ITicketCreationAttributes extends Optional<ITicketAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Ticket extends Model<ITicketAttributes, ITicketCreationAttributes> implements ITicketAttributes {
    public id!: number;
    public userId!: number;
    public subject!: string;
    public description!: string;
    public status!: 'open' | 'in_progress' | 'resolved' | 'closed';
    public priority!: 'low' | 'medium' | 'high';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Ticket.init(
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
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
            allowNull: false,
            defaultValue: 'open',
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            allowNull: false,
            defaultValue: 'medium',
        },
    },
    {
        sequelize,
        tableName: 'tickets',
        timestamps: true,
    }
);

export default Ticket;
