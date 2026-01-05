# TabiLink Backend API

Backend API for TabiLink Tourism Booking Platform built with Node.js, Express, TypeScript, and MySQL.

## Features

- 🔐 User authentication and authorization (JWT)
- 🏨 Hotel management and booking
- ✈️ Travel package management and booking
- 💳 Secure payment processing (Stripe integration)
- ⭐ Review and rating system
- ❤️ Favorites/Wishlist functionality
- 📧 Email notifications
- 🔒 Security features (Helmet, CORS, Rate limiting)
- 📊 Admin dashboard APIs
- 🗄️ MySQL with Sequelize ORM

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL with Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe
- **Email**: Nodemailer
- **File Upload**: Multer + Cloudinary

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Sequelize models (MySQL)
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validators
│   ├── database/        # Database connection & migrations
│   └── server.ts        # Express app entry point
├── dist/                # Compiled JavaScript
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schemas

### User
- Authentication and profile management
- Role-based access (user, admin, super_admin)
- Membership tiers (Silver, Gold, Platinum)
- Loyalty points system

### Hotel
- Hotel listings with details
- Categories (luxury, beach, business, etc.)
- Amenities and room types
- Pricing and availability

### TravelPackage
- Travel package listings
- Itinerary management
- Pricing and availability
- Categories (adventure, beach, cultural, etc.)

### Booking
- Hotel and travel package bookings
- Payment tracking
- Status management
- Guest information

### Review
- User reviews for hotels and packages
- Rating system
- Moderation support

### Favorite
- User favorites/wishlist
- Hotel and package favorites

### Payment
- Payment transaction records
- Stripe integration
- Refund management

### Contact
- Contact form submissions
- Support ticket management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MySQL database credentials (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
   - JWT secrets
   - Stripe keys
   - Email credentials
   - Cloudinary credentials

4. Initialize database (create database and tables):
```bash
npm run db:setup
```

5. Seed database (optional):
```bash
npm run seed
```

### Development

Run in development mode with hot reload:
```bash
npm run dev
```

### Production

Build the project:
```bash
npm run build
```

Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Hotels
- `GET /api/v1/hotels` - Get all hotels (with filters)
- `GET /api/v1/hotels/:id` - Get hotel by ID
- `POST /api/v1/hotels` - Create hotel (admin)
- `PUT /api/v1/hotels/:id` - Update hotel (admin)
- `DELETE /api/v1/hotels/:id` - Delete hotel (admin)

### Travel Packages
- `GET /api/v1/packages` - Get all packages (with filters)
- `GET /api/v1/packages/:id` - Get package by ID
- `POST /api/v1/packages` - Create package (admin)
- `PUT /api/v1/packages/:id` - Update package (admin)
- `DELETE /api/v1/packages/:id` - Delete package (admin)

### Bookings
- `GET /api/v1/bookings` - Get user bookings
- `GET /api/v1/bookings/:id` - Get booking by ID
- `POST /api/v1/bookings` - Create booking
- `PUT /api/v1/bookings/:id/cancel` - Cancel booking
- `GET /api/v1/bookings/admin` - Get all bookings (admin)

### Payments
- `POST /api/v1/payments/create-intent` - Create payment intent
- `POST /api/v1/payments/confirm` - Confirm payment
- `POST /api/v1/payments/refund` - Process refund

### Reviews
- `GET /api/v1/reviews` - Get reviews
- `POST /api/v1/reviews` - Create review
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review

### Favorites
- `GET /api/v1/favorites` - Get user favorites
- `POST /api/v1/favorites` - Add to favorites
- `DELETE /api/v1/favorites/:id` - Remove from favorites

## Environment Variables

See `.env.example` for all required environment variables.

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- Password hashing (bcrypt)
- JWT token authentication
- SQL injection prevention (Sequelize parameterized queries)
- XSS protection

## License

ISC

