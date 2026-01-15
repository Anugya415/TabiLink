import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Reward from '../models/Reward';
import Redemption from '../models/Redemption';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';
import { Op } from 'sequelize';

// Point conversion rate: 100 points = $1 USD
const POINTS_TO_CURRENCY_RATE = 100;

// @desc    Get all available rewards
// @route   GET /api/v1/rewards
// @access  Private
export const getRewards = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { category, minPoints, maxPoints } = req.query;

  const where: any = {
    isActive: true,
    validFrom: { [Op.lte]: new Date() },
    validUntil: { [Op.gte]: new Date() },
  };

  if (category) {
    where.category = category;
  }

  if (minPoints) {
    where.pointsRequired = { [Op.gte]: parseInt(minPoints as string) };
  }

  if (maxPoints) {
    where.pointsRequired = {
      ...where.pointsRequired,
      [Op.lte]: parseInt(maxPoints as string),
    };
  }

  const rewards = await Reward.findAll({
    where,
    order: [['pointsRequired', 'ASC']],
  });

  // Filter out rewards that have reached max redemptions
  const availableRewards = rewards.filter((reward) => reward.isValid());

  res.json({
    success: true,
    count: availableRewards.length,
    data: {
      rewards: availableRewards,
    },
  });
});

// @desc    Get single reward
// @route   GET /api/v1/rewards/:id
// @access  Private
export const getReward = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reward = await Reward.findByPk(req.params.id);

  if (!reward) {
    throw new AppError('Reward not found', 404);
  }

  if (!reward.isValid()) {
    throw new AppError('Reward is no longer available', 400);
  }

  res.json({
    success: true,
    data: {
      reward,
    },
  });
});

// @desc    Get user's redemptions
// @route   GET /api/v1/rewards/redemptions
// @access  Private
export const getUserRedemptions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.query;

  const where: any = { userId: req.user?.id };
  if (status) {
    where.status = status;
  }

  const redemptions = await Redemption.findAll({
    where,
    include: [
      {
        model: Reward,
        as: 'reward',
        attributes: ['id', 'name', 'description', 'category', 'image'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    count: redemptions.length,
    data: {
      redemptions,
    },
  });
});

// @desc    Redeem points for a reward
// @route   POST /api/v1/rewards/:id/redeem
// @access  Private
export const redeemReward = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rewardId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  // Get user with current points
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get reward
  const reward = await Reward.findByPk(rewardId);
  if (!reward) {
    throw new AppError('Reward not found', 404);
  }

  // Validate reward
  if (!reward.isValid()) {
    throw new AppError('Reward is no longer available', 400);
  }

  // Check if user has enough points
  if (user.loyaltyPoints < reward.pointsRequired) {
    throw new AppError(
      `Insufficient points. You need ${reward.pointsRequired} points but only have ${user.loyaltyPoints}`,
      400
    );
  }

  // Generate discount code or voucher code if needed
  let discountCode: string | undefined;
  let voucherCode: string | undefined;
  let cashbackAmount: number | undefined;
  let expiresAt: Date | undefined;

  if (reward.category === 'discount') {
    // Generate a unique discount code
    const prefix = 'POINTS';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    discountCode = `${prefix}-${timestamp}-${random}`;
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Valid for 30 days
  } else if (reward.category === 'voucher' && reward.voucherCode) {
    voucherCode = reward.voucherCode;
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // Valid for 90 days
  } else if (reward.category === 'cashback' && reward.cashbackAmount) {
    cashbackAmount = parseFloat(reward.cashbackAmount.toString());
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60); // Valid for 60 days
  }

  // Create redemption record
  const redemption = await Redemption.create({
    userId,
    rewardId: reward.id,
    pointsUsed: reward.pointsRequired,
    status: 'completed',
    discountCode,
    voucherCode,
    cashbackAmount,
    expiresAt,
    redeemedAt: new Date(),
  } as any);

  // Deduct points from user
  user.loyaltyPoints -= reward.pointsRequired;
  await user.save();

  // Increment redemption count
  reward.redemptionCount += 1;
  await reward.save();

  // Reload redemption with reward data
  await redemption.reload({
    include: [
      {
        model: Reward,
        as: 'reward',
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: 'Reward redeemed successfully',
    data: {
      redemption,
      remainingPoints: user.loyaltyPoints,
    },
  });
});

// @desc    Get point conversion rate
// @route   GET /api/v1/rewards/conversion-rate
// @access  Private
export const getConversionRate = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      rate: POINTS_TO_CURRENCY_RATE,
      currency: 'USD',
      description: `${POINTS_TO_CURRENCY_RATE} points = $1 USD`,
    },
  });
});

// @desc    Calculate points value
// @route   POST /api/v1/rewards/calculate-value
// @access  Private
export const calculatePointsValue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { points } = req.body;

  if (!points || points < 0) {
    throw new AppError('Valid points amount is required', 400);
  }

  const currencyValue = points / POINTS_TO_CURRENCY_RATE;

  res.json({
    success: true,
    data: {
      points,
      currencyValue: Math.round(currencyValue * 100) / 100,
      currency: 'USD',
      rate: POINTS_TO_CURRENCY_RATE,
    },
  });
});

