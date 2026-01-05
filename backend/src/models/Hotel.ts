import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface IHotelAttributes {
  id: number;
  name: string;
  locationCity: string;
  locationCountry: string;
  locationAddress: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  locationDistanceFromCenter?: string;
  description: string;
  images: string[];
  category: 'luxury' | 'beach' | 'business' | 'boutique' | 'mountain' | 'resort';
  amenities: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  rooms: {
    type: string;
    capacity: number;
    price: number;
    available: number;
    amenities: string[];
  }[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    petsAllowed: boolean;
    smokingAllowed: boolean;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  isActive: boolean;
  isPopular: boolean;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IHotelCreationAttributes extends Optional<IHotelAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Hotel extends Model<IHotelAttributes, IHotelCreationAttributes> implements IHotelAttributes {
  public id!: number;
  public name!: string;
  public locationCity!: string;
  public locationCountry!: string;
  public locationAddress!: string;
  public locationCoordinates?: { lat: number; lng: number };
  public locationDistanceFromCenter?: string;
  public description!: string;
  public images!: string[];
  public category!: 'luxury' | 'beach' | 'business' | 'boutique' | 'mountain' | 'resort';
  public amenities!: string[];
  public price!: number;
  public originalPrice?: number;
  public discount?: number;
  public rating!: number;
  public reviewCount!: number;
  public rooms!: {
    type: string;
    capacity: number;
    price: number;
    available: number;
    amenities: string[];
  }[];
  public policies!: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    petsAllowed: boolean;
    smokingAllowed: boolean;
  };
  public contact!: {
    phone: string;
    email: string;
    website?: string;
  };
  public isActive!: boolean;
  public isPopular!: boolean;
  public featured!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Hotel.init(
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
    locationCity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'location_city',
    },
    locationCountry: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'location_country',
    },
    locationAddress: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'location_address',
    },
    locationCoordinates: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'location_coordinates',
    },
    locationDistanceFromCenter: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'location_distance_from_center',
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
    category: {
      type: DataTypes.ENUM('luxury', 'beach', 'business', 'boutique', 'mountain', 'resort'),
      allowNull: false,
    },
    amenities: {
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
    rooms: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    policies: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        checkIn: '14:00',
        checkOut: '11:00',
        cancellation: 'Free cancellation up to 24 hours before check-in',
        petsAllowed: false,
        smokingAllowed: false,
      },
    },
    contact: {
      type: DataTypes.JSON,
      allowNull: false,
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
    tableName: 'hotels',
    indexes: [
      { fields: ['location_city', 'location_country'] },
      { fields: ['category', 'is_active'] },
      { fields: ['price', 'rating'] },
      { fields: ['is_popular', 'featured'] },
      { fields: ['name'] },
    ],
  }
);

export default Hotel;
