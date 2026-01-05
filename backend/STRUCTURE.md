# Backend Structure

## Directory Structure

```
backend/
├── src/
│   ├── config/              # Configuration files (optional)
│   ├── controllers/         # Route controllers (business logic)
│   │   ├── authController.ts
│   │   ├── hotelController.ts
│   │   ├── travelPackageController.ts
│   │   ├── bookingController.ts
│   │   └── contactController.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # Authentication & authorization
│   │   ├── errorHandler.ts  # Error handling
│   │   └── validator.ts     # Request validation
│   ├── models/              # Sequelize models (MySQL)
│   │   ├── User.ts
│   │   ├── Hotel.ts
│   │   ├── TravelPackage.ts
│   │   ├── Booking.ts
│   │   ├── Review.ts
│   │   ├── Favorite.ts
│   │   ├── Payment.ts
│   │   ├── Contact.ts
│   │   └── index.ts
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   ├── hotelRoutes.ts
│   │   ├── packageRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── contactRoutes.ts
│   │   └── index.ts
│   ├── services/            # Service layer (optional, for complex business logic)
│   ├── utils/               # Utility functions
│   │   ├── generateToken.ts
│   │   └── asyncHandler.ts
│   ├── database/            # Database connection & utilities
│   │   ├── connection.ts
│   │   ├── migrate.ts       # Migrations (optional)
│   │   └── seed.ts          # Database seeding
│   └── server.ts            # Express app entry point
├── dist/                    # Compiled JavaScript (generated)
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

## Database Models (Sequelize)

All models use Sequelize ORM with MySQL. Models are located in `src/models/`:

### 1. User Model
- Authentication fields (email, password)
- Profile information
- Role-based access (user, admin, super_admin)
- Membership tiers
- Preferences and settings

### 2. Hotel Model
- Hotel details (name, location, description)
- Images and amenities
- Pricing (price, originalPrice, discount)
- Rating and reviews
- Room types and availability
- Policies and contact information

### 3. TravelPackage Model
- Package details (title, destination, description)
- Duration (days/nights)
- Itinerary
- Pricing and availability
- Includes/exclusions
- Terms and conditions

### 4. Booking Model
- User reference
- Hotel or TravelPackage reference
- Booking dates (for hotels)
- Traveler information
- Pricing breakdown
- Status tracking
- Payment status

### 5. Review Model
- User reference
- Hotel or TravelPackage reference
- Rating and comment
- Verification status
- Moderation support

### 6. Favorite Model
- User reference
- Hotel or TravelPackage reference
- Quick access to user favorites

### 7. Payment Model
- Booking reference
- Payment details
- Stripe integration
- Transaction tracking
- Refund management

### 8. Contact Model
- Contact form submissions
- Status tracking
- Reply management

## API Routes Structure

All routes are prefixed with `/api/v1/`

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update user profile

### Hotel Routes (`/api/v1/hotels`)
- `GET /` - Get all hotels (with filters)
- `GET /:id` - Get single hotel
- `POST /` - Create hotel (admin)
- `PUT /:id` - Update hotel (admin)
- `DELETE /:id` - Delete hotel (admin)

### Travel Package Routes (`/api/v1/packages`)
- `GET /` - Get all packages (with filters)
- `GET /:id` - Get single package
- `POST /` - Create package (admin)
- `PUT /:id` - Update package (admin)
- `DELETE /:id` - Delete package (admin)

### Booking Routes (`/api/v1/bookings`)
- `GET /` - Get user bookings
- `GET /:id` - Get single booking
- `POST /` - Create booking
- `PUT /:id/cancel` - Cancel booking

### Contact Routes (`/api/v1/contact`)
- `POST /` - Submit contact form
- `GET /` - Get all contacts (admin)

## Middleware

### Authentication (`middleware/auth.ts`)
- `authenticate` - Verify JWT token and attach user to request
- `authorize(...roles)` - Check user roles for authorization

### Error Handling (`middleware/errorHandler.ts`)
- Centralized error handling
- Custom AppError class
- Development vs production error responses

### Validation (`middleware/validator.ts`)
- Zod schema validation
- Request validation middleware

## Utilities

### Token Generation (`utils/generateToken.ts`)
- JWT token generation
- Refresh token generation
- Token verification

### Async Handler (`utils/asyncHandler.ts`)
- Wrapper for async route handlers
- Automatic error catching

## Development Workflow

1. Create/update models in `src/models/`
2. Create controllers in `src/controllers/`
3. Create routes in `src/routes/`
4. Add middleware as needed
5. Test endpoints
6. Build and deploy

## Notes

- **No Prisma**: This project uses Mongoose ODM directly
- **TypeScript**: All code is written in TypeScript
- **MongoDB**: Database is MongoDB
- **Express**: Web framework is Express.js
- **JWT**: Authentication uses JSON Web Tokens

