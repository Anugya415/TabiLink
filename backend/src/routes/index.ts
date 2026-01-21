import express from 'express';
import authRoutes from './authRoutes';
import hotelRoutes from './hotelRoutes';
import packageRoutes from './packageRoutes';
import bookingRoutes from './bookingRoutes';
import contactRoutes from './contactRoutes';
import discountRoutes from './discountRoutes';
import rewardsRoutes from './rewardsRoutes';
import ticketRoutes from './ticketRoutes';
import savedSearchRoutes from './savedSearchRoutes';
import socialRoutes from './socialRoutes';
import alertRoutes from './alertRoutes';
import notificationRoutes from './notificationRoutes';

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
      rewards: '/api/v1/rewards',
      tickets: '/api/v1/tickets',
      savedSearches: '/api/v1/saved-searches',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/contact', contactRoutes);
router.use('/discounts', discountRoutes);
router.use('/rewards', rewardsRoutes);
router.use('/tickets', ticketRoutes);
router.use('/saved-searches', savedSearchRoutes);
router.use('/social', socialRoutes);
router.use('/alerts', alertRoutes);
router.use('/notifications', notificationRoutes);

export default router;


