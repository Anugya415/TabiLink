import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IContactAttributes {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  repliedAt?: Date;
  replyMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IContactCreationAttributes extends Optional<IContactAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'> {}

class Contact extends Model<IContactAttributes, IContactCreationAttributes> implements IContactAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public subject!: string;
  public message!: string;
  public status!: 'new' | 'read' | 'replied' | 'archived';
  public repliedAt?: Date;
  public replyMessage?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 5000],
      },
    },
    status: {
      type: DataTypes.ENUM('new', 'read', 'replied', 'archived'),
      allowNull: false,
      defaultValue: 'new',
    },
    repliedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'replied_at',
    },
    replyMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reply_message',
    },
  },
  {
    sequelize,
    tableName: 'contacts',
    indexes: [
      { fields: ['status', 'createdAt'] },
      { fields: ['email'] },
    ],
  }
);

export default Contact;
