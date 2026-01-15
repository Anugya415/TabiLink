import express from 'express';
import {
  getDiscounts,
  getDiscount,
  validateDiscountCode,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from '../controllers/discountController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/validate', authenticate, validateDiscountCode);
router.get('/', getDiscounts);
router.get('/:id', getDiscount);

// Admin routes
router.post('/', authenticate, authorize('admin', 'super_admin'), createDiscount);
router.put('/:id', authenticate, authorize('admin', 'super_admin'), updateDiscount);
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), deleteDiscount);

export default router;


