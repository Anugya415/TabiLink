import express from 'express';
import {
  getRewards,
  getReward,
  getUserRedemptions,
  redeemReward,
  getConversionRate,
  calculatePointsValue,
} from '../controllers/rewardsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/conversion-rate', getConversionRate);
router.post('/calculate-value', calculatePointsValue);
router.get('/redemptions', getUserRedemptions);
router.get('/', getRewards);
router.get('/:id', getReward);
router.post('/:id/redeem', redeemReward);

export default router;

