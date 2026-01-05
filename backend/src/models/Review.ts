import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IReviewAttributes {
  id: number;
  userId: number;
  bookingId: number;
  type: 'hotel' | 'travel';
  hotelId?: number;
  travelPackageId?: number;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  reported: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

interface IReviewCreationAttributes extends Optional<IReviewAttributes, 'id' | 'createdAt' | 'updatedAt' | 'verified' | 'helpful' | 'reported' | 'status'> {}

class Review extends Model<IReviewAttributes, IReviewCreationAttributes> implements IReviewAttributes {
  public id!: number;
  public userId!: number;
  public bookingId!: number;
  public type!: 'hotel' | 'travel';
  public hotelId?: number;
  public travelPackageId?: number;
  public rating!: number;
  public title?: string;
  public comment!: string;
  public images?: string[];
  public verified!: boolean;
  public helpful!: number;
  public reported!: boolean;
  public status!: 'pending' | 'approved' | 'rejected';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
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
    bookingId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'booking_id',
      references: {
        model: 'bookings',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('hotel', 'travel'),
      allowNull: false,
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
    rating: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 2000],
      },
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    helpful: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    reported: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'reviews',
    indexes: [
      { fields: ['hotel_id', 'status', 'createdAt'] },
      { fields: ['travel_package_id', 'status', 'createdAt'] },
      { fields: ['user_id', 'type'] },
      { fields: ['rating', 'status'] },
    ],
  }
);

export default Review;
