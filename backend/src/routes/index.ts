import express from 'express';
import authRoutes from './authRoutes';
import hotelRoutes from './hotelRoutes';
import packageRoutes from './packageRoutes';
import bookingRoutes from './bookingRoutes';
import contactRoutes from './contactRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/contact', contactRoutes);

export default router;

