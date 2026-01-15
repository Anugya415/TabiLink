// Export all models from a single file for easier imports
import User from './User';
import Hotel from './Hotel';
import TravelPackage from './TravelPackage';
import Booking from './Booking';
import Review from './Review';
import Favorite from './Favorite';
import Payment from './Payment';
import Contact from './Contact';
import Discount from './Discount';
import Reward from './Reward';
import Redemption from './Redemption';

// Define associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Hotel.hasMany(Booking, { foreignKey: 'hotelId', as: 'bookings' });
Booking.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

Hotel.hasMany(Review, { foreignKey: 'hotelId', as: 'reviews' });
Review.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

Hotel.hasMany(Favorite, { foreignKey: 'hotelId', as: 'favorites' });
Favorite.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

TravelPackage.hasMany(Booking, { foreignKey: 'travelPackageId', as: 'bookings' });
Booking.belongsTo(TravelPackage, { foreignKey: 'travelPackageId', as: 'travelPackage' });

TravelPackage.hasMany(Review, { foreignKey: 'travelPackageId', as: 'reviews' });
Review.belongsTo(TravelPackage, { foreignKey: 'travelPackageId', as: 'travelPackage' });

TravelPackage.hasMany(Favorite, { foreignKey: 'travelPackageId', as: 'favorites' });
Favorite.belongsTo(TravelPackage, { foreignKey: 'travelPackageId', as: 'travelPackage' });

Booking.hasMany(Review, { foreignKey: 'bookingId', as: 'reviews' });
Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

User.hasMany(Redemption, { foreignKey: 'userId', as: 'redemptions' });
Redemption.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Reward.hasMany(Redemption, { foreignKey: 'rewardId', as: 'redemptions' });
Redemption.belongsTo(Reward, { foreignKey: 'rewardId', as: 'reward' });

Booking.hasOne(Redemption, { foreignKey: 'appliedToBookingId', as: 'redemption' });
Redemption.belongsTo(Booking, { foreignKey: 'appliedToBookingId', as: 'appliedToBooking' });

export { User, Hotel, TravelPackage, Booking, Review, Favorite, Payment, Contact, Discount, Reward, Redemption };

// Export types
export type { IUserAttributes as IUser } from './User';
export type { IHotelAttributes as IHotel } from './Hotel';
export type { ITravelPackageAttributes as ITravelPackage } from './TravelPackage';
export type { IBookingAttributes as IBooking } from './Booking';
export type { IReviewAttributes as IReview } from './Review';
export type { IFavoriteAttributes as IFavorite } from './Favorite';
export type { IPaymentAttributes as IPayment } from './Payment';
export type { IContactAttributes as IContact } from './Contact';
export type { IDiscountAttributes as IDiscount } from './Discount';
export type { IRewardAttributes as IReward } from './Reward';
export type { IRedemptionAttributes as IRedemption } from './Redemption';
