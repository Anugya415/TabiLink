import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IBookingAttributes {
  id: number;
  bookingId: string;
  userId: number;
  type: 'hotel' | 'travel';
  hotelId?: number;
  travelPackageId?: number;
  checkIn?: Date;
  checkOut?: Date;
  travelers: number;
  guests?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'card' | 'paypal' | 'bank_transfer';
  paymentIntentId?: string;
  transactionId?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  specialRequests?: string;
  bookingDate: Date;
  confirmationEmailSent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IBookingCreationAttributes extends Optional<IBookingAttributes, 'id' | 'bookingId' | 'createdAt' | 'updatedAt' | 'confirmationEmailSent'> {}

class Booking extends Model<IBookingAttributes, IBookingCreationAttributes> implements IBookingAttributes {
  public id!: number;
  public bookingId!: string;
  public userId!: number;
  public type!: 'hotel' | 'travel';
  public hotelId?: number;
  public travelPackageId?: number;
  public checkIn?: Date;
  public checkOut?: Date;
  public travelers!: number;
  public guests?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }[];
  public subtotal!: number;
  public tax!: number;
  public discount?: number;
  public total!: number;
  public currency!: string;
  public status!: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  public paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded';
  public paymentMethod?: 'card' | 'paypal' | 'bank_transfer';
  public paymentIntentId?: string;
  public transactionId?: string;
  public cancellationReason?: string;
  public cancelledAt?: Date;
  public specialRequests?: string;
  public bookingDate!: Date;
  public confirmationEmailSent!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'booking_id',
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
    checkIn: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'check_in',
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'check_out',
    },
    travelers: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    guests: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'payment_status',
    },
    paymentMethod: {
      type: DataTypes.ENUM('card', 'paypal', 'bank_transfer'),
      allowNull: true,
      field: 'payment_method',
    },
    paymentIntentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'payment_intent_id',
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'transaction_id',
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_reason',
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'cancelled_at',
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'special_requests',
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'booking_date',
    },
    confirmationEmailSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'confirmation_email_sent',
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    hooks: {
      beforeCreate: async (booking: Booking) => {
        if (!booking.bookingId) {
          const prefix = booking.type === 'hotel' ? 'HOTEL' : 'TRAVEL';
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          booking.bookingId = `${prefix}-${timestamp}-${random}`;
        }
      },
    },
    indexes: [
      { fields: ['booking_id'] },
      { fields: ['user_id', 'booking_date'] },
      { fields: ['status', 'payment_status'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Booking;
