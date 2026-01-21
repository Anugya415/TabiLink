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
import Trip from './Trip';
import TripCollaborator from './TripCollaborator';
import SavedSearch from './SavedSearch';
import Ticket from './Ticket';
import Chat from './Chat';
import Message from './Message';

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

// Trips
User.hasMany(Trip, { foreignKey: 'ownerId', as: 'ownedTrips' });
Trip.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Trip.belongsToMany(User, { through: TripCollaborator, as: 'collaborators', foreignKey: 'tripId' });
User.belongsToMany(Trip, { through: TripCollaborator, as: 'sharedTrips', foreignKey: 'userId' });

Trip.hasMany(Booking, { foreignKey: 'tripId', as: 'bookings' });
Booking.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// Price Alerts
import PriceAlert from './PriceAlert';
import Notification from './Notification';

User.hasMany(PriceAlert, { foreignKey: 'userId', as: 'priceAlerts' });
PriceAlert.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Hotel.hasMany(PriceAlert, { foreignKey: 'hotelId', as: 'subscribers' });
PriceAlert.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

TravelPackage.hasMany(PriceAlert, { foreignKey: 'travelPackageId', as: 'subscribers' });
PriceAlert.belongsTo(TravelPackage, { foreignKey: 'travelPackageId', as: 'travelPackage' });

// Saved Searches
User.hasMany(SavedSearch, { foreignKey: 'userId', as: 'savedSearches' });
SavedSearch.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Tickets
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Chat & Messages
User.hasMany(Chat, { foreignKey: 'userId', as: 'chats' });
Chat.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });

// Notifications
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Hotel, TravelPackage, Booking, Review, Favorite, Payment, Contact, Discount, Reward, Redemption, Trip, TripCollaborator, PriceAlert, Notification, SavedSearch, Ticket, Chat, Message };

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
export type { ITripAttributes as ITrip } from './Trip';
export type { IPriceAlertAttributes as IPriceAlert } from './PriceAlert';
export type { INotificationAttributes as INotification } from './Notification';
export type { ISavedSearchAttributes as ISavedSearch } from './SavedSearch';
export type { ITicketAttributes as ITicket } from './Ticket';
export type { IChatAttributes as IChat } from './Chat';
export type { IMessageAttributes as IMessage } from './Message';


