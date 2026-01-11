import express from 'express';
import {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getHotels).post(authenticate, authorize('admin', 'super_admin'), createHotel);
router
  .route('/:id')
  .get(getHotel)
  .put(authenticate, authorize('admin', 'super_admin'), updateHotel)
  .delete(authenticate, authorize('admin', 'super_admin'), deleteHotel);

export default router;









