import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IChatAttributes {
    id: number;
    userId?: number; // Optional if guest chat is supported, but better to link to user if possible or session id
    status: 'active' | 'closed';
    createdAt?: Date;
    updatedAt?: Date;
}

interface IChatCreationAttributes extends Optional<IChatAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Chat extends Model<IChatAttributes, IChatCreationAttributes> implements IChatAttributes {
    public id!: number;
    public userId!: number;
    public status!: 'active' | 'closed';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'user_id',
        },
        status: {
            type: DataTypes.ENUM('active', 'closed'),
            allowNull: false,
            defaultValue: 'active',
        },
    },
    {
        sequelize,
        tableName: 'chats',
        timestamps: true,
    }
);

export default Chat;
