# TabiLink Setup Guide

Complete setup guide for the TabiLink tourism booking platform.

## Project Structure

```
TabiLink/
├── tabilink/        # Frontend (Next.js)
└── backend/         # Backend (Express.js + MySQL)
```

## Prerequisites

- **Node.js** 18+ installed
- **MySQL** 8.0+ installed and running (local or cloud)
- **npm** or **yarn** package manager
- Code editor (VS Code recommended)

## Quick Start

### 1. Frontend Setup (tabilink)

```bash
# Navigate to frontend directory
cd tabilink

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1" > .env.local

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 2. Backend Setup (backend)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration:
# - MySQL database credentials
# - JWT secrets
# - Stripe keys (optional for now)
# - Email credentials (optional for now)
# - Cloudinary credentials (optional for now)

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Database Setup

#### Option A: Local MySQL

1. Install MySQL 8.0+ locally
2. Start MySQL service
3. Create database:
   ```sql
   CREATE DATABASE tabilink;
   ```
4. Update `.env` in backend:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=tabilink
   DB_USER=root
   DB_PASSWORD=your_password
   ```

#### Option B: MySQL Cloud (e.g., AWS RDS, PlanetScale)

1. Create MySQL database instance
2. Get connection details
3. Update `.env` in backend with your cloud MySQL credentials

### 4. Initialize Database (Create tables)

```bash
cd backend
npm run db:setup
```

This will:
- Create the database if it doesn't exist
- Create all tables if they don't exist

### 5. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates an admin user:
- Email: `admin@tabilink.com`
- Password: (from ADMIN_PASSWORD in .env, default: `admin123`)

## Environment Variables

### Frontend (tabilink/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Backend (backend/.env)

Required:
```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tabilink
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000
```

Optional (for full functionality):
```env
# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin
ADMIN_EMAIL=admin@tabilink.com
ADMIN_PASSWORD=admin123
```

## Development Workflow

### Running Both Servers

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

### Building for Production

**Frontend:**
```bash
cd tabilink
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

## API Testing

### Using cURL

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using Postman/Thunder Client

1. Import the API endpoints from `backend/README.md`
2. Set base URL: `http://localhost:5000/api/v1`
3. Use the token from login response in Authorization header:
   ```
   Authorization: Bearer <token>
   ```

## Database Models

All models are defined in `backend/src/models/`:

- **User** - User accounts and authentication
- **Hotel** - Hotel listings
- **TravelPackage** - Travel packages
- **Booking** - Bookings (hotel & travel)
- **Payment** - Payment transactions
- **Review** - Reviews and ratings
- **Favorite** - User favorites
- **Contact** - Contact form submissions

See `backend/DATABASE_SCHEMAS.md` for detailed schema documentation.

## Troubleshooting

### Frontend Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Backend Issues

**MySQL connection error:**
- Check if MySQL is running
- Verify database credentials in .env (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
- Check MySQL logs
- Ensure database exists: `CREATE DATABASE tabilink;`

**Port 5000 already in use:**
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5001
```

**Module not found errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Connection timeout:**
- Check MySQL service status
- Verify network connectivity (for cloud MySQL)
- Check firewall settings

**Authentication failed:**
- Verify MySQL credentials (DB_USER, DB_PASSWORD)
- Check user permissions
- Ensure database exists

## Next Steps

1. ✅ Set up MySQL
2. ✅ Configure environment variables
3. ✅ Run both servers
4. 🔲 Test API endpoints
5. 🔲 Create admin account
6. 🔲 Add hotels/travel packages
7. 🔲 Test booking flow
8. 🔲 Configure payment (Stripe)
9. 🔲 Set up email (Nodemailer)
10. 🔲 Configure image upload (Cloudinary)

## Support

For issues or questions:
- Check `backend/README.md` for API documentation
- Check `backend/DATABASE_SCHEMAS.md` for schema details
- Check `backend/STRUCTURE.md` for code structure

## Technology Stack

**Frontend:**
- Next.js 16
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod

**Backend:**
- Node.js + Express
- TypeScript
- MySQL + Sequelize
- JWT Authentication
- Stripe (payment)
- Nodemailer (email)
- Cloudinary (images)

