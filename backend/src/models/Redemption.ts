import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IRedemptionAttributes {
  id: number;
  userId: number;
  rewardId: number;
  pointsUsed: number;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
  discountCode?: string;
  voucherCode?: string;
  cashbackAmount?: number;
  appliedToBookingId?: number;
  expiresAt?: Date;
  redeemedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IRedemptionCreationAttributes extends Optional<IRedemptionAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Redemption extends Model<IRedemptionAttributes, IRedemptionCreationAttributes> implements IRedemptionAttributes {
  public id!: number;
  public userId!: number;
  public rewardId!: number;
  public pointsUsed!: number;
  public status!: 'pending' | 'completed' | 'cancelled' | 'expired';
  public discountCode?: string;
  public voucherCode?: string;
  public cashbackAmount?: number;
  public appliedToBookingId?: number;
  public expiresAt?: Date;
  public redeemedAt?: Date;
  public cancelledAt?: Date;
  public cancellationReason?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Check if redemption is valid
  public isValid(): boolean {
    if (this.status !== 'completed') {
      return false;
    }
    if (this.expiresAt && new Date() > this.expiresAt) {
      return false;
    }
    return true;
  }
}

Redemption.init(
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
    rewardId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'reward_id',
      references: {
        model: 'rewards',
        key: 'id',
      },
    },
    pointsUsed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'points_used',
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'expired'),
      allowNull: false,
      defaultValue: 'pending',
    },
    discountCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'discount_code',
    },
    voucherCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'voucher_code',
    },
    cashbackAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'cashback_amount',
    },
    appliedToBookingId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'applied_to_booking_id',
      references: {
        model: 'bookings',
        key: 'id',
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at',
    },
    redeemedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'redeemed_at',
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'cancelled_at',
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_reason',
    },
  },
  {
    sequelize,
    tableName: 'redemptions',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['reward_id'] },
      { fields: ['status'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default Redemption;

