import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ITravelPackageAttributes {
  id: number;
  title: string;
  destination: string[];
  description: string;
  images: string[];
  duration: {
    days: number;
    nights: number;
  };
  includes: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }[];
  highlights: string[];
  exclusions: string[];
  termsAndConditions: string[];
  category: 'adventure' | 'beach' | 'cultural' | 'family' | 'luxury' | 'romantic';
  maxTravelers: number;
  minTravelers: number;
  availability: {
    startDate: Date;
    endDate: Date;
    available: boolean;
  }[];
  isActive: boolean;
  isPopular: boolean;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ITravelPackageCreationAttributes extends Optional<ITravelPackageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class TravelPackage extends Model<ITravelPackageAttributes, ITravelPackageCreationAttributes> implements ITravelPackageAttributes {
  public id!: number;
  public title!: string;
  public destination!: string[];
  public description!: string;
  public images!: string[];
  public duration!: { days: number; nights: number };
  public includes!: string[];
  public price!: number;
  public originalPrice?: number;
  public discount?: number;
  public rating!: number;
  public reviewCount!: number;
  public itinerary!: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }[];
  public highlights!: string[];
  public exclusions!: string[];
  public termsAndConditions!: string[];
  public category!: 'adventure' | 'beach' | 'cultural' | 'family' | 'luxury' | 'romantic';
  public maxTravelers!: number;
  public minTravelers!: number;
  public availability!: {
    startDate: Date;
    endDate: Date;
    available: boolean;
  }[];
  public isActive!: boolean;
  public isPopular!: boolean;
  public featured!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TravelPackage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    destination: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    duration: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: { days: 1, nights: 0 },
    },
    includes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'original_price',
      validate: {
        min: 0,
      },
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    reviewCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      field: 'review_count',
    },
    itinerary: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    highlights: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    exclusions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    termsAndConditions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      field: 'terms_and_conditions',
    },
    category: {
      type: DataTypes.ENUM('adventure', 'beach', 'cultural', 'family', 'luxury', 'romantic'),
      allowNull: false,
    },
    maxTravelers: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 10,
      field: 'max_travelers',
      validate: {
        min: 1,
      },
    },
    minTravelers: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      field: 'min_travelers',
      validate: {
        min: 1,
      },
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_popular',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'travel_packages',
    indexes: [
      { fields: ['category', 'is_active'] },
      { fields: ['price', 'rating'] },
      { fields: ['is_popular', 'featured'] },
      { fields: ['title'] },
    ],
  }
);

export default TravelPackage;
