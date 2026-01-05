# Database Schemas Documentation

This document describes all database schemas/models used in the TabiLink backend. All models use **Sequelize ORM with MySQL** (not Prisma).

## Models Overview

1. [User](#user)
2. [Hotel](#hotel)
3. [TravelPackage](#travelpackage)
4. [Booking](#booking)
5. [Review](#review)
6. [Favorite](#favorite)
7. [Payment](#payment)
8. [Contact](#contact)

---

## User

**File**: `src/models/User.ts`

User accounts with authentication and profile management.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | User's full name (2-100 chars) |
| `email` | String | Yes | Unique email address (indexed) |
| `password` | String | Yes | Hashed password (not returned by default) |
| `phone` | String | No | Phone number |
| `avatar` | String | No | Avatar image URL |
| `role` | Enum | Yes | `user`, `admin`, `super_admin` (default: `user`) |
| `isEmailVerified` | Boolean | Yes | Email verification status (default: false) |
| `emailVerificationToken` | String | No | Token for email verification |
| `passwordResetToken` | String | No | Token for password reset |
| `passwordResetExpires` | Date | No | Password reset token expiration |
| `memberSince` | Date | Yes | Account creation date |
| `membershipTier` | Enum | Yes | `Silver`, `Gold`, `Platinum` (default: `Silver`) |
| `totalTrips` | Number | Yes | Total trips booked (default: 0) |
| `totalSpent` | Number | Yes | Total amount spent (default: 0) |
| `loyaltyPoints` | Number | Yes | Loyalty points (default: 0) |
| `preferences` | Object | Yes | User preferences |
| `preferences.currency` | String | Yes | Preferred currency (default: 'USD') |
| `preferences.language` | String | Yes | Preferred language (default: 'en') |
| `preferences.notifications` | Object | Yes | Notification preferences |
| `isActive` | Boolean | Yes | Account active status (default: true) |
| `lastLogin` | Date | No | Last login timestamp |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

### Methods

- `comparePassword(candidatePassword: string)` - Compare password with hash
- `updateMembershipTier()` - Update membership tier based on total spent

### Indexes

- `email` (unique)
- `role`
- `isActive`

---

## Hotel

**File**: `src/models/Hotel.ts`

Hotel listings with details, amenities, and pricing.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Hotel name (indexed, text search) |
| `location` | Object | Yes | Location details |
| `location.city` | String | Yes | City name (indexed) |
| `location.country` | String | Yes | Country name (indexed) |
| `location.address` | String | Yes | Street address |
| `location.coordinates` | Object | No | GPS coordinates (lat, lng) |
| `location.distanceFromCenter` | String | No | Distance from city center |
| `description` | String | Yes | Hotel description (min 50 chars) |
| `images` | Array[String] | Yes | Array of image URLs |
| `category` | Enum | Yes | `luxury`, `beach`, `business`, `boutique`, `mountain`, `resort` |
| `amenities` | Array[String] | Yes | List of amenities |
| `price` | Number | Yes | Price per night (indexed, min: 0) |
| `originalPrice` | Number | No | Original price before discount |
| `discount` | Number | No | Discount percentage (0-100) |
| `rating` | Number | Yes | Average rating (0-5, default: 0, indexed) |
| `reviewCount` | Number | Yes | Number of reviews (default: 0) |
| `rooms` | Array[Object] | Yes | Room types and availability |
| `rooms[].type` | String | Yes | Room type name |
| `rooms[].capacity` | Number | Yes | Maximum guests (min: 1) |
| `rooms[].price` | Number | Yes | Price per night (min: 0) |
| `rooms[].available` | Number | Yes | Available rooms (default: 0) |
| `rooms[].amenities` | Array[String] | Yes | Room-specific amenities |
| `policies` | Object | Yes | Hotel policies |
| `policies.checkIn` | String | Yes | Check-in time (default: '14:00') |
| `policies.checkOut` | String | Yes | Check-out time (default: '11:00') |
| `policies.cancellation` | String | Yes | Cancellation policy |
| `policies.petsAllowed` | Boolean | Yes | Pets allowed (default: false) |
| `policies.smokingAllowed` | Boolean | Yes | Smoking allowed (default: false) |
| `contact` | Object | Yes | Contact information |
| `contact.phone` | String | Yes | Phone number |
| `contact.email` | String | Yes | Email address |
| `contact.website` | String | No | Website URL |
| `isActive` | Boolean | Yes | Active status (default: true, indexed) |
| `isPopular` | Boolean | Yes | Popular flag (default: false, indexed) |
| `featured` | Boolean | Yes | Featured flag (default: false, indexed) |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

### Indexes

- `location.city`, `location.country`
- `category`, `isActive`
- `price`, `rating`
- `isPopular`, `featured`
- Text search: `name`, `description`, `location.city`

---

## TravelPackage

**File**: `src/models/TravelPackage.ts`

Travel packages with itineraries and pricing.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Package title (indexed, text search) |
| `destination` | Array[String] | Yes | Array of destinations (indexed) |
| `description` | String | Yes | Package description (min 100 chars) |
| `images` | Array[String] | Yes | Array of image URLs |
| `duration` | Object | Yes | Trip duration |
| `duration.days` | Number | Yes | Number of days (min: 1) |
| `duration.nights` | Number | Yes | Number of nights (min: 0) |
| `includes` | Array[String] | Yes | What's included |
| `price` | Number | Yes | Price per person (indexed, min: 0) |
| `originalPrice` | Number | No | Original price before discount |
| `discount` | Number | No | Discount percentage (0-100) |
| `rating` | Number | Yes | Average rating (0-5, default: 0, indexed) |
| `reviewCount` | Number | Yes | Number of reviews (default: 0) |
| `itinerary` | Array[Object] | Yes | Day-by-day itinerary |
| `itinerary[].day` | Number | Yes | Day number |
| `itinerary[].title` | String | Yes | Day title |
| `itinerary[].description` | String | Yes | Day description |
| `itinerary[].activities` | Array[String] | Yes | Activities for the day |
| `itinerary[].meals` | Array[String] | Yes | Meals included |
| `itinerary[].accommodation` | String | No | Accommodation details |
| `highlights` | Array[String] | Yes | Package highlights |
| `exclusions` | Array[String] | Yes | What's not included |
| `termsAndConditions` | Array[String] | Yes | Terms and conditions |
| `category` | Enum | Yes | `adventure`, `beach`, `cultural`, `family`, `luxury`, `romantic` |
| `maxTravelers` | Number | Yes | Maximum travelers (default: 10, min: 1) |
| `minTravelers` | Number | Yes | Minimum travelers (default: 1, min: 1) |
| `availability` | Array[Object] | Yes | Availability dates |
| `availability[].startDate` | Date | Yes | Start date |
| `availability[].endDate` | Date | Yes | End date |
| `availability[].available` | Boolean | Yes | Available status (default: true) |
| `isActive` | Boolean | Yes | Active status (default: true, indexed) |
| `isPopular` | Boolean | Yes | Popular flag (default: false, indexed) |
| `featured` | Boolean | Yes | Featured flag (default: false, indexed) |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

### Indexes

- `destination`
- `category`, `isActive`
- `price`, `rating`
- `isPopular`, `featured`
- Text search: `title`, `description`, `destination`

---

## Booking

**File**: `src/models/Booking.ts`

Hotel and travel package bookings.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bookingId` | String | Auto | Unique booking ID (HOTEL-xxx or TRAVEL-xxx, indexed) |
| `user` | ObjectId | Yes | Reference to User (indexed) |
| `type` | Enum | Yes | `hotel` or `travel` (indexed) |
| `hotel` | ObjectId | Conditional | Reference to Hotel (required if type='hotel') |
| `travelPackage` | ObjectId | Conditional | Reference to TravelPackage (required if type='travel') |
| `checkIn` | Date | Conditional | Check-in date (required if type='hotel') |
| `checkOut` | Date | Conditional | Check-out date (required if type='hotel') |
| `travelers` | Number | Yes | Number of travelers (min: 1) |
| `guests` | Array[Object] | No | Guest information |
| `guests[].firstName` | String | Yes | Guest first name |
| `guests[].lastName` | String | Yes | Guest last name |
| `guests[].email` | String | Yes | Guest email |
| `guests[].phone` | String | Yes | Guest phone |
| `subtotal` | Number | Yes | Subtotal amount (min: 0) |
| `tax` | Number | Yes | Tax amount (min: 0) |
| `discount` | Number | No | Discount amount (min: 0) |
| `total` | Number | Yes | Total amount (indexed, min: 0) |
| `currency` | String | Yes | Currency code (default: 'USD') |
| `status` | Enum | Yes | `pending`, `confirmed`, `cancelled`, `completed`, `refunded` (default: 'pending', indexed) |
| `paymentStatus` | Enum | Yes | `pending`, `paid`, `failed`, `refunded` (default: 'pending', indexed) |
| `paymentMethod` | Enum | No | `card`, `paypal`, `bank_transfer` |
| `paymentIntentId` | String | No | Stripe payment intent ID |
| `transactionId` | String | No | Transaction ID (indexed) |
| `cancellationReason` | String | No | Cancellation reason |
| `cancelledAt` | Date | No | Cancellation timestamp |
| `specialRequests` | String | No | Special requests |
| `bookingDate` | Date | Yes | Booking date (default: now, indexed) |
| `confirmationEmailSent` | Boolean | Yes | Email sent status (default: false) |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

### Indexes

- `bookingId` (unique)
- `user`, `bookingDate`
- `status`, `paymentStatus`
- `transactionId`
- `createdAt`

### Pre-save Hook

- Generates unique booking ID before saving

---

## Review

**File**: `src/models/Review.ts`

User reviews and ratings for hotels and travel packages.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user` | ObjectId | Yes | Reference to User (indexed) |
| `booking` | ObjectId | Yes | Reference to Booking |
| `type` | Enum | Yes | `hotel` or `travel` (indexed) |
| `hotel` | ObjectId | Conditional | Reference to Hotel (required if type='hotel', indexed) |
| `travelPackage` | ObjectId | Conditional | Reference to TravelPackage (required if type='travel', indexed) |
| `rating` | Number | Yes | Rating (1-5, indexed) |
| `title` | String | No | Review title (max 200 chars) |
| `comment` | String | Yes | Review comment (10-2000 chars) |
| `images` | Array[String] | No | Review images |
| `verified` | Boolean | Yes | Verified purchase (default: false) |
| `helpful` | Number | Yes | Helpful count (default: 0, min: 0) |
| `reported` | Boolean | Yes | Reported status (default: false) |
| `status` | Enum | Yes | `pending`, `approved`, `rejected` (default: 'pending', indexed) |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

### Indexes

- `hotel`, `status`, `createdAt`
- `travelPackage`, `status`, `createdAt`
- `user`, `type`
- `rating`, `status`

---

## Favorite

**File**: `src/models/Favorite.ts`

User favorites/wishlist for hotels and travel packages.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user` | ObjectId | Yes | Reference to User (indexed) |
| `type` | Enum | Yes | `hotel` or `travel` (indexed) |
| `hotel` | ObjectId | Conditional | Reference to Hotel (required if type='hotel') |
| `travelPackage` | ObjectId | Conditional | Reference to TravelPackage (required if type='travel') |
| `createdAt` | Date | Auto | Creation timestamp |

### Indexes

- `user`, `hotel` (unique, sparse)
- `user`, `travelPackage` (unique, sparse)
- `user`, `type`

---

## Payment

**File**: `src/models/Payment.ts`

Payment transactions and records.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `booking` | ObjectId | Yes | Reference to Booking (indexed) |
| `user` | ObjectId | Yes | Reference to User (indexed) |
| `amount` | Number | Yes | Payment amount (min: 0) |
| `currency` | String | Yes | Currency code (default: 'USD', uppercase) |
| `status` | Enum | Yes | `pending`, `processing`, `completed`, `failed`, `refunded`, `cancelled` (default: 'pending', indexed) |
| `paymentMethod` | Enum | Yes | `card`, `paypal`, `bank_transfer` |
| `paymentIntentId` | String | No | Stripe payment intent ID (indexed) |
| `transactionId` | String | Auto | Unique transaction ID (TXN-xxx, unique, indexed) |
| `stripeChargeId` | String | No | Stripe charge ID |
| `cardDetails` | Object | No | Card information (last 4 digits, brand, expiry) |
| `refundAmount` | Number | No | Refund amount (min: 0) |
| `refundReason` | String | No | Refund reason |
| `refundedAt` | Date | No | Refund timestamp |
| `metadata` | Object | No | Additional metadata |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

### Indexes

- `transactionId` (unique)
- `user`, `createdAt`
- `status`, `createdAt`
- `paymentIntentId`

### Pre-save Hook

- Generates unique transaction ID before saving

---

## Contact

**File**: `src/models/Contact.ts`

Contact form submissions.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Contact name |
| `email` | String | Yes | Contact email (indexed) |
| `subject` | String | Yes | Message subject |
| `message` | String | Yes | Message content (min 10 chars) |
| `status` | Enum | Yes | `new`, `read`, `replied`, `archived` (default: 'new', indexed) |
| `repliedAt` | Date | No | Reply timestamp |
| `replyMessage` | String | No | Reply message |
| `createdAt` | Date | Auto | Creation timestamp |
| `updatedAt` | Date | Auto | Update timestamp |

### Indexes

- `status`, `createdAt`
- `email`

---

## Relationships

```
User
  ├── Booking (one-to-many)
  ├── Review (one-to-many)
  ├── Favorite (one-to-many)
  ├── Payment (one-to-many)

Hotel
  ├── Booking (one-to-many)
  ├── Review (one-to-many)
  ├── Favorite (one-to-many)

TravelPackage
  ├── Booking (one-to-many)
  ├── Review (one-to-many)
  ├── Favorite (one-to-many)

Booking
  ├── Payment (one-to-one)
  ├── Review (one-to-one, optional)
```

## Notes

- All models use Sequelize timestamps (`createdAt`, `updatedAt`)
- Foreign key references use Sequelize associations (`belongsTo`, `hasMany`)
- Indexes are optimized for common query patterns
- JSON columns are used for complex nested data (MySQL 5.7+)
- All monetary values use DECIMAL type for precision
- Primary keys are auto-incrementing integers (not ObjectId)
- Associations are defined in `src/models/index.ts`

