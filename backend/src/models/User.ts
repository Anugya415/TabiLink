import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

export interface IUserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  memberSince: Date;
  membershipTier: 'Silver' | 'Gold' | 'Platinum';
  totalTrips: number;
  totalSpent: number;
  loyaltyPoints: number;
  preferences: {
    currency: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone?: string;
  public avatar?: string;
  public role!: 'user' | 'admin' | 'super_admin';
  public isEmailVerified!: boolean;
  public emailVerificationToken?: string;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;
  public memberSince!: Date;
  public membershipTier!: 'Silver' | 'Gold' | 'Platinum';
  public totalTrips!: number;
  public totalSpent!: number;
  public loyaltyPoints!: number;
  public preferences!: {
    currency: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  public isActive!: boolean;
  public lastLogin?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public async updateMembershipTier(): Promise<void> {
    if (this.totalSpent >= 10000) {
      this.membershipTier = 'Platinum';
    } else if (this.totalSpent >= 5000) {
      this.membershipTier = 'Gold';
    } else {
      this.membershipTier = 'Silver';
    }
    await this.save();
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255],
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'super_admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    memberSince: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    membershipTier: {
      type: DataTypes.ENUM('Silver', 'Gold', 'Platinum'),
      allowNull: false,
      defaultValue: 'Silver',
    },
    totalTrips: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    totalSpent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        currency: 'USD',
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  }
);

export default User;
