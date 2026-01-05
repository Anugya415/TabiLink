import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IPaymentAttributes {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  paymentIntentId?: string;
  transactionId: string;
  stripeChargeId?: string;
  cardDetails?: {
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  };
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IPaymentCreationAttributes extends Optional<IPaymentAttributes, 'id' | 'transactionId' | 'createdAt' | 'updatedAt'> {}

class Payment extends Model<IPaymentAttributes, IPaymentCreationAttributes> implements IPaymentAttributes {
  public id!: number;
  public bookingId!: number;
  public userId!: number;
  public amount!: number;
  public currency!: string;
  public status!: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  public paymentMethod!: 'card' | 'paypal' | 'bank_transfer';
  public paymentIntentId?: string;
  public transactionId!: string;
  public stripeChargeId?: string;
  public cardDetails?: {
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  };
  public refundAmount?: number;
  public refundReason?: string;
  public refundedAt?: Date;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    amount: {
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
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.ENUM('card', 'paypal', 'bank_transfer'),
      allowNull: false,
      field: 'payment_method',
    },
    paymentIntentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'payment_intent_id',
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'transaction_id',
    },
    stripeChargeId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'stripe_charge_id',
    },
    cardDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'card_details',
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'refund_amount',
      validate: {
        min: 0,
      },
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'refund_reason',
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'refunded_at',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: 'payments',
    hooks: {
      beforeCreate: async (payment: Payment) => {
        if (!payment.transactionId) {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
          payment.transactionId = `TXN-${timestamp}-${random}`;
        }
      },
    },
    indexes: [
      { unique: true, fields: ['transaction_id'] },
      { fields: ['user_id', 'createdAt'] },
      { fields: ['status', 'createdAt'] },
      { fields: ['payment_intent_id'] },
    ],
  }
);

export default Payment;
