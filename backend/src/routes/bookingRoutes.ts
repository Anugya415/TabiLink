import express from 'express';
import {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking,
  modifyBooking,
} from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.route('/').get(getBookings).post(createBooking);
router.route('/:id').get(getBooking).put(modifyBooking);
router.route('/:id/cancel').put(cancelBooking);

export default router;






















