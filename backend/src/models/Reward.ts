import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IRewardAttributes {
  id: number;
  name: string;
  description: string;
  category: 'discount' | 'cashback' | 'voucher' | 'upgrade' | 'freebie';
  pointsRequired: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  cashbackAmount?: number;
  voucherCode?: string;
  maxRedemptions?: number;
  redemptionCount: number;
  validFrom: Date;
  validUntil: Date;
  applicableTo?: 'all' | 'hotel' | 'travel';
  minPurchaseAmount?: number;
  image?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IRewardCreationAttributes extends Optional<IRewardAttributes, 'id' | 'redemptionCount' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Reward extends Model<IRewardAttributes, IRewardCreationAttributes> implements IRewardAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public category!: 'discount' | 'cashback' | 'voucher' | 'upgrade' | 'freebie';
  public pointsRequired!: number;
  public discountType?: 'percentage' | 'fixed';
  public discountValue?: number;
  public cashbackAmount?: number;
  public voucherCode?: string;
  public maxRedemptions?: number;
  public redemptionCount!: number;
  public validFrom!: Date;
  public validUntil!: Date;
  public applicableTo?: 'all' | 'hotel' | 'travel';
  public minPurchaseAmount?: number;
  public image?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Check if reward is valid
  public isValid(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      now >= this.validFrom &&
      now <= this.validUntil &&
      (!this.maxRedemptions || this.redemptionCount < this.maxRedemptions)
    );
  }

  // Calculate equivalent cash value (for display purposes)
  public getCashValue(): number {
    if (this.category === 'cashback' && this.cashbackAmount) {
      return this.cashbackAmount;
    }
    if (this.category === 'discount' && this.discountValue) {
      if (this.discountType === 'fixed') {
        return this.discountValue;
      }
      // For percentage, estimate based on average booking value
      // This is just for display - actual discount applies at checkout
      return this.discountValue * 10; // Rough estimate: 10% of $100 = $10
    }
    return 0;
  }
}

Reward.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('discount', 'cashback', 'voucher', 'upgrade', 'freebie'),
      allowNull: false,
    },
    pointsRequired: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
      },
      field: 'points_required',
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: true,
      field: 'discount_type',
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
      field: 'discount_value',
    },
    cashbackAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
      field: 'cashback_amount',
    },
    voucherCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'voucher_code',
    },
    maxRedemptions: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'max_redemptions',
    },
    redemptionCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'redemption_count',
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'valid_from',
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'valid_until',
    },
    applicableTo: {
      type: DataTypes.ENUM('all', 'hotel', 'travel'),
      allowNull: true,
      field: 'applicable_to',
    },
    minPurchaseAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
      field: 'min_purchase_amount',
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'rewards',
    indexes: [
      { fields: ['category'] },
      { fields: ['is_active', 'valid_from', 'valid_until'] },
      { fields: ['points_required'] },
    ],
  }
);

export default Reward;

