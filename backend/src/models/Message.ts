import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IMessageAttributes {
    id: number;
    chatId: number;
    sender: 'user' | 'bot' | 'support';
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IMessageCreationAttributes extends Optional<IMessageAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Message extends Model<IMessageAttributes, IMessageCreationAttributes> implements IMessageAttributes {
    public id!: number;
    public chatId!: number;
    public sender!: 'user' | 'bot' | 'support';
    public content!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        chatId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'chat_id',
        },
        sender: {
            type: DataTypes.ENUM('user', 'bot', 'support'),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'messages',
        timestamps: true,
    }
);

export default Message;
