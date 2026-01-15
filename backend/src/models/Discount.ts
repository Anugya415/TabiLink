import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IDiscountAttributes {
  id: number;
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  applicableTo: 'all' | 'hotel' | 'travel';
  applicableHotelIds?: number[];
  applicableTravelPackageIds?: number[];
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usageCount: number;
  userUsageLimit?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IDiscountCreationAttributes extends Optional<IDiscountAttributes, 'id' | 'usageCount' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Discount extends Model<IDiscountAttributes, IDiscountCreationAttributes> implements IDiscountAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public description?: string;
  public discountType!: 'percentage' | 'fixed';
  public discountValue!: number;
  public minPurchaseAmount?: number;
  public maxDiscountAmount?: number;
  public applicableTo!: 'all' | 'hotel' | 'travel';
  public applicableHotelIds?: number[];
  public applicableTravelPackageIds?: number[];
  public startDate!: Date;
  public endDate!: Date;
  public usageLimit?: number;
  public usageCount!: number;
  public userUsageLimit?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to check if discount is valid
  public isValid(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      now >= this.startDate &&
      now <= this.endDate &&
      (!this.usageLimit || this.usageCount < this.usageLimit)
    );
  }

  // Method to calculate discount amount
  public calculateDiscount(subtotal: number): number {
    if (!this.isValid() || (this.minPurchaseAmount && subtotal < this.minPurchaseAmount)) {
      return 0;
    }

    let discount = 0;
    if (this.discountType === 'percentage') {
      discount = (subtotal * this.discountValue) / 100;
      if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
        discount = this.maxDiscountAmount;
      }
    } else {
      discount = this.discountValue;
      if (discount > subtotal) {
        discount = subtotal;
      }
    }

    return Math.round(discount * 100) / 100; // Round to 2 decimal places
  }
}

Discount.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
      field: 'discount_type',
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      field: 'discount_value',
    },
    minPurchaseAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
      field: 'min_purchase_amount',
    },
    maxDiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
      field: 'max_discount_amount',
    },
    applicableTo: {
      type: DataTypes.ENUM('all', 'hotel', 'travel'),
      allowNull: false,
      defaultValue: 'all',
      field: 'applicable_to',
    },
    applicableHotelIds: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'applicable_hotel_ids',
    },
    applicableTravelPackageIds: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'applicable_travel_package_ids',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date',
    },
    usageLimit: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'usage_limit',
    },
    usageCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'usage_count',
    },
    userUsageLimit: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'user_usage_limit',
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
    tableName: 'discounts',
    hooks: {
      beforeCreate: async (discount: Discount) => {
        // Convert code to uppercase
        if (discount.code) {
          discount.code = discount.code.toUpperCase().trim();
        }
      },
      beforeUpdate: async (discount: Discount) => {
        // Convert code to uppercase
        if (discount.changed('code') && discount.code) {
          discount.code = discount.code.toUpperCase().trim();
        }
      },
    },
    indexes: [
      { fields: ['code'] },
      { fields: ['is_active', 'start_date', 'end_date'] },
      { fields: ['applicable_to'] },
    ],
  }
);

export default Discount;


