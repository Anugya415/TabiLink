# TabiLink - Tourism Booking Website

A modern, secure tourism website built with Next.js 16, featuring hotel bookings, travel package bookings, and a user-friendly interface using magicui components.

## Features

### 🏨 Hotel Booking
- Search and filter hotels by location, price, and rating
- Detailed hotel listings with amenities
- Real-time availability and pricing
- Secure booking checkout flow

### ✈️ Travel Packages
- Curated travel packages to popular destinations
- All-inclusive packages with flights, hotels, and activities
- Easy comparison and booking
- Special offers and discounts

### 🔒 Secure Transactions
- 256-bit SSL encryption for all transactions
- Secure payment processing
- PCI DSS compliant payment handling
- Transaction confirmation and receipts

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful animations and transitions
- Intuitive navigation
- Accessible components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components inspired by shadcn/ui and magicui
- **Form Handling**: React Hook Form + Zod validation
- **Date Picker**: react-day-picker
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
tabilink/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── hotels/            # Hotel listing and booking pages
│   ├── travel/            # Travel packages pages
│   ├── booking/           # Booking confirmation pages
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components (Header, Footer)
├── lib/
│   ├── utils.ts           # Utility functions
│   └── payment.ts         # Payment processing service
└── public/                # Static assets
```

## Key Pages

- **Home** (`/`) - Hero section, featured destinations, search
- **Hotels** (`/hotels`) - Browse and search hotels
- **Travel Packages** (`/travel`) - Browse travel packages
- **Hotel Booking** (`/hotels/[id]/book`) - Hotel booking checkout
- **Travel Booking** (`/travel/[id]/book`) - Travel package checkout
- **Confirmation** (`/booking/confirmation`) - Booking confirmation page
- **About** (`/about`) - About TabiLink
- **Contact** (`/contact`) - Contact form

## Payment Integration

The payment system is implemented with security best practices:

- Client-side validation using Zod schemas
- Secure payment processing service (`lib/payment.ts`)
- Mock payment processor (ready for Stripe/PayPal integration)
- Transaction confirmation with unique booking IDs

### To integrate a real payment processor:

1. Update `lib/payment.ts` with your payment provider's API
2. Add environment variables for API keys
3. Implement server-side payment verification
4. Add webhook handlers for payment status updates

## Form Validation

All forms use React Hook Form with Zod validation:

- Client-side validation with immediate feedback
- Type-safe form handling
- Accessible error messages
- Required field indicators

## Security Features

- Secure payment form validation
- Card number masking utilities
- SSL encryption indicators
- Secure transaction IDs
- Input sanitization

## Customization

### Styling
- Customize colors in `app/globals.css`
- Modify component styles in `components/ui/`
- Update theme variables in CSS custom properties

### Adding New Destinations
- Update the `featuredDestinations` array in `app/page.tsx`
- Add hotel data in `app/hotels/page.tsx`
- Add travel packages in `app/travel/page.tsx`

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

For production, you'll want to add:

```env
# Payment Processor (e.g., Stripe)
PAYMENT_API_KEY=your_api_key
PAYMENT_SECRET_KEY=your_secret_key

# Database (if adding backend)
DATABASE_URL=your_database_url
```

## Future Enhancements

- User authentication and accounts
- Booking history and management
- Reviews and ratings system
- Real-time availability updates
- Multi-language support
- Email notifications
- Admin dashboard
- Integration with hotel/travel APIs

## License

This project is created for educational purposes.

## Support

For questions or support, please contact support@tabilink.com
