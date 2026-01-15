import express from 'express';
import authRoutes from './authRoutes';
import hotelRoutes from './hotelRoutes';
import packageRoutes from './packageRoutes';
import bookingRoutes from './bookingRoutes';
import contactRoutes from './contactRoutes';
import discountRoutes from './discountRoutes';

const router = express.Router();

// Root API endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TabiLink API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      hotels: '/api/v1/hotels',
      packages: '/api/v1/packages',
      bookings: '/api/v1/bookings',
      contact: '/api/v1/contact',
      discounts: '/api/v1/discounts',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/contact', contactRoutes);
router.use('/discounts', discountRoutes);

export default router;


