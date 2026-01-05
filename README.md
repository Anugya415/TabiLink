# TabiLink - Tourism Booking Platform

A full-stack tourism booking platform with hotel reservations, travel package bookings, and secure payment processing.

## Project Structure

```
TabiLink/
├── tabilink/         # Next.js frontend application
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities and helpers
│   └── ...
├── backend/          # Express.js backend API
│   ├── src/
│   │   ├── models/   # Mongoose database schemas
│   │   ├── routes/   # API routes
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/ # Express middleware
│   │   ├── utils/    # Utility functions
│   │   ├── database/ # Database connection
│   │   └── server.ts # Express app entry point
│   └── ...
└── README.md
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (magicui/shadcn inspired)
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Context API
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL with Sequelize
- **Authentication**: JWT
- **Payment**: Stripe
- **Email**: Nodemailer
- **File Upload**: Multer + Cloudinary

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+ (local or cloud)
- npm or yarn

### Frontend Setup

1. Navigate to tabilink directory:
```bash
cd tabilink
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secrets
   - Stripe API keys
   - Email credentials
   - Cloudinary credentials

5. Initialize database (create database and tables):
```bash
npm run db:setup
```

6. Seed database (optional):
```bash
npm run seed
```

7. Run development server:
```bash
npm run dev
```

Backend API will be available at `http://localhost:5000`

## Database Schemas

### Core Models

1. **User** - User accounts, authentication, profiles
2. **Hotel** - Hotel listings with details, amenities, pricing
3. **TravelPackage** - Travel packages with itineraries
4. **Booking** - Hotel and travel package bookings
5. **Payment** - Payment transactions and records
6. **Review** - User reviews and ratings
7. **Favorite** - User favorites/wishlist
8. **Contact** - Contact form submissions

See `backend/src/models/` for detailed schemas.

## Features

### User Features
- User registration and authentication
- Hotel search and filtering
- Travel package browsing
- Booking management
- Payment processing
- Reviews and ratings
- Favorites/wishlist
- User dashboard
- Profile management

### Admin Features
- Hotel management
- Travel package management
- Booking management
- User management
- Review moderation
- Analytics dashboard
- System settings

### Security
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- Input validation
- Secure payment processing

## Development

### Running Both Frontend and Backend

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
cd tabilink
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

## Production Deployment

### Frontend
```bash
cd tabilink
npm run build
npm start
```

### Backend
```bash
cd backend
npm run build
npm start
```

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe API key
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` - Email configuration
- `CLOUDINARY_*` - Cloudinary credentials

## API Documentation

API endpoints are available at `/api/v1/`

See `backend/README.md` for detailed API documentation.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC
