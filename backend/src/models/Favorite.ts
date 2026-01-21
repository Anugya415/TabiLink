import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IFavoriteAttributes {
  id: number;
  userId: number;
  type: 'hotel' | 'travel';
  hotelId?: number;
  travelPackageId?: number;
  createdAt?: Date;
}

interface IFavoriteCreationAttributes extends Optional<IFavoriteAttributes, 'id' | 'createdAt'> { }

class Favorite extends Model<IFavoriteAttributes, IFavoriteCreationAttributes> implements IFavoriteAttributes {
  public id!: number;
  public userId!: number;
  public type!: 'hotel' | 'travel';
  public hotelId?: number;
  public travelPackageId?: number;
  public readonly createdAt!: Date;
}

Favorite.init(
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
  },
  {
    sequelize,
    tableName: 'favorites',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { unique: true, fields: ['user_id', 'hotel_id'], where: { type: 'hotel' } },
      { unique: true, fields: ['user_id', 'travel_package_id'], where: { type: 'travel' } },
      { fields: ['user_id', 'type'] },
    ],
  }
);

export default Favorite;
