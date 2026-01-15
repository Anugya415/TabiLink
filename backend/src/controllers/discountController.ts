import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Discount from '../models/Discount';
import Booking from '../models/Booking';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';
import { Op } from 'sequelize';

// @desc    Get all discounts (public - active only, admin - all)
// @route   GET /api/v1/discounts
// @access  Public/Private (Admin)
export const getDiscounts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { active, applicableTo } = req.query;
  const isAdmin = req.user?.role === 'admin' || req.user?.role === 'super_admin';

  const where: any = {};

  // Non-admin users only see active discounts
  if (!isAdmin) {
    where.isActive = true;
    where.startDate = { [Op.lte]: new Date() };
    where.endDate = { [Op.gte]: new Date() };
  } else if (active !== undefined) {
    where.isActive = active === 'true';
  }

  if (applicableTo) {
    where.applicableTo = applicableTo;
  }

  const discounts = await Discount.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    count: discounts.length,
    data: {
      discounts,
    },
  });
});

// @desc    Get single discount
// @route   GET /api/v1/discounts/:id
// @access  Public/Private (Admin)
export const getDiscount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const discount = await Discount.findByPk(req.params.id);

  if (!discount) {
    throw new AppError('Discount not found', 404);
  }

  // Non-admin users can only see active discounts
  const isAdmin = req.user?.role === 'admin' || req.user?.role === 'super_admin';
  if (!isAdmin && !discount.isValid()) {
    throw new AppError('Discount not found', 404);
  }

  res.json({
    success: true,
    data: {
      discount,
    },
  });
});

// @desc    Validate discount code
// @route   POST /api/v1/discounts/validate
// @access  Private
export const validateDiscountCode = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, subtotal, type, hotelId, travelPackageId } = req.body;

  if (!code) {
    throw new AppError('Discount code is required', 400);
  }

  const discount = await Discount.findOne({
    where: {
      code: code.toUpperCase().trim(),
      isActive: true,
    },
  });

  if (!discount) {
    throw new AppError('Invalid discount code', 404);
  }

  // Check if discount is valid
  if (!discount.isValid()) {
    throw new AppError('Discount code has expired or is no longer valid', 400);
  }

  // Check if discount applies to this booking type
  if (discount.applicableTo !== 'all') {
    if (discount.applicableTo === 'hotel' && type !== 'hotel') {
      throw new AppError('This discount code is only valid for hotel bookings', 400);
    }
    if (discount.applicableTo === 'travel' && type !== 'travel') {
      throw new AppError('This discount code is only valid for travel package bookings', 400);
    }
  }

  // Check if discount applies to specific hotels/packages
  if (discount.applicableTo === 'hotel' && discount.applicableHotelIds && hotelId) {
    if (!discount.applicableHotelIds.includes(parseInt(hotelId))) {
      throw new AppError('This discount code is not valid for the selected hotel', 400);
    }
  }

  if (discount.applicableTo === 'travel' && discount.applicableTravelPackageIds && travelPackageId) {
    if (!discount.applicableTravelPackageIds.includes(parseInt(travelPackageId))) {
      throw new AppError('This discount code is not valid for the selected travel package', 400);
    }
  }

  // Check minimum purchase amount
  if (discount.minPurchaseAmount && subtotal < parseFloat(discount.minPurchaseAmount.toString())) {
    throw new AppError(
      `Minimum purchase amount of ${discount.minPurchaseAmount} is required for this discount code`,
      400
    );
  }

  // Check user usage limit
  if (discount.userUsageLimit && req.user?.id) {
    const userUsageCount = await Booking.count({
      where: {
        userId: req.user.id,
        discount: { [Op.ne]: null },
      },
    });

    // Note: This is a simplified check. In production, you'd want to track which discount was used
    // by storing discountId in the booking or creating a separate DiscountUsage table
  }

  // Calculate discount amount
  const discountAmount = discount.calculateDiscount(subtotal || 0);

  res.json({
    success: true,
    data: {
      discount: {
        id: discount.id,
        code: discount.code,
        name: discount.name,
        description: discount.description,
        discountType: discount.discountType,
        discountValue: discount.discountValue,
        discountAmount,
      },
    },
  });
});

// @desc    Create discount
// @route   POST /api/v1/discounts
// @access  Private (Admin)
export const createDiscount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    code,
    name,
    description,
    discountType,
    discountValue,
    minPurchaseAmount,
    maxDiscountAmount,
    applicableTo,
    applicableHotelIds,
    applicableTravelPackageIds,
    startDate,
    endDate,
    usageLimit,
    userUsageLimit,
    isActive,
  } = req.body;

  // Validate discount value based on type
  if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
    throw new AppError('Percentage discount must be between 0 and 100', 400);
  }

  if (discountType === 'fixed' && discountValue < 0) {
    throw new AppError('Fixed discount must be greater than 0', 400);
  }

  // Check if code already exists
  const existingDiscount = await Discount.findOne({
    where: { code: code.toUpperCase().trim() },
  });

  if (existingDiscount) {
    throw new AppError('Discount code already exists', 400);
  }

  // Validate dates
  if (new Date(startDate) >= new Date(endDate)) {
    throw new AppError('End date must be after start date', 400);
  }

  const discount = await Discount.create({
    code: code.toUpperCase().trim(),
    name,
    description,
    discountType,
    discountValue,
    minPurchaseAmount,
    maxDiscountAmount,
    applicableTo: applicableTo || 'all',
    applicableHotelIds,
    applicableTravelPackageIds,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    usageLimit,
    userUsageLimit,
    isActive: isActive !== undefined ? isActive : true,
  } as any);

  res.status(201).json({
    success: true,
    message: 'Discount created successfully',
    data: {
      discount,
    },
  });
});

// @desc    Update discount
// @route   PUT /api/v1/discounts/:id
// @access  Private (Admin)
export const updateDiscount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const discount = await Discount.findByPk(req.params.id);

  if (!discount) {
    throw new AppError('Discount not found', 404);
  }

  const {
    code,
    name,
    description,
    discountType,
    discountValue,
    minPurchaseAmount,
    maxDiscountAmount,
    applicableTo,
    applicableHotelIds,
    applicableTravelPackageIds,
    startDate,
    endDate,
    usageLimit,
    userUsageLimit,
    isActive,
  } = req.body;

  // If code is being changed, check if new code exists
  if (code && code.toUpperCase().trim() !== discount.code) {
    const existingDiscount = await Discount.findOne({
      where: { code: code.toUpperCase().trim() },
    });

    if (existingDiscount) {
      throw new AppError('Discount code already exists', 400);
    }
  }

  // Validate discount value if provided
  if (discountType === 'percentage' && discountValue !== undefined) {
    if (discountValue < 0 || discountValue > 100) {
      throw new AppError('Percentage discount must be between 0 and 100', 400);
    }
  }

  if (discountType === 'fixed' && discountValue !== undefined && discountValue < 0) {
    throw new AppError('Fixed discount must be greater than 0', 400);
  }

  // Validate dates if provided
  const finalStartDate = startDate ? new Date(startDate) : discount.startDate;
  const finalEndDate = endDate ? new Date(endDate) : discount.endDate;

  if (finalStartDate >= finalEndDate) {
    throw new AppError('End date must be after start date', 400);
  }

  await discount.update({
    code: code ? code.toUpperCase().trim() : discount.code,
    name: name || discount.name,
    description: description !== undefined ? description : discount.description,
    discountType: discountType || discount.discountType,
    discountValue: discountValue !== undefined ? discountValue : discount.discountValue,
    minPurchaseAmount: minPurchaseAmount !== undefined ? minPurchaseAmount : discount.minPurchaseAmount,
    maxDiscountAmount: maxDiscountAmount !== undefined ? maxDiscountAmount : discount.maxDiscountAmount,
    applicableTo: applicableTo || discount.applicableTo,
    applicableHotelIds: applicableHotelIds !== undefined ? applicableHotelIds : discount.applicableHotelIds,
    applicableTravelPackageIds:
      applicableTravelPackageIds !== undefined
        ? applicableTravelPackageIds
        : discount.applicableTravelPackageIds,
    startDate: finalStartDate,
    endDate: finalEndDate,
    usageLimit: usageLimit !== undefined ? usageLimit : discount.usageLimit,
    userUsageLimit: userUsageLimit !== undefined ? userUsageLimit : discount.userUsageLimit,
    isActive: isActive !== undefined ? isActive : discount.isActive,
  } as any);

  res.json({
    success: true,
    message: 'Discount updated successfully',
    data: {
      discount,
    },
  });
});

// @desc    Delete discount
// @route   DELETE /api/v1/discounts/:id
// @access  Private (Admin)
export const deleteDiscount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const discount = await Discount.findByPk(req.params.id);

  if (!discount) {
    throw new AppError('Discount not found', 404);
  }

  await discount.destroy();

  res.json({
    success: true,
    message: 'Discount deleted successfully',
  });
});


