import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TravelPackage from '../models/TravelPackage';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';
import { Op } from 'sequelize';

// @desc    Get all travel packages
// @route   GET /api/v1/packages
// @access  Public
export const getPackages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    destination,
    isPopular,
    featured,
    page = 1,
    limit = 12,
    sort = '-rating',
  } = req.query;

  const where: any = { isActive: true };

  // Search
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filters
  if (category) where.category = category;
  if (destination) {
    where.destination = {
      [Op.like]: `%${destination}%`,
    };
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
  }
  if (minRating) where.rating = { [Op.gte]: Number(minRating) };
  if (isPopular !== undefined) where.isPopular = isPopular === 'true';
  if (featured !== undefined) where.featured = featured === 'true';

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  // Sort
  let order: any = [['rating', 'DESC']];
  if (sort === '-rating') order = [['rating', 'DESC']];
  else if (sort === 'rating') order = [['rating', 'ASC']];
  else if (sort === '-price') order = [['price', 'DESC']];
  else if (sort === 'price') order = [['price', 'ASC']];
  else if (sort === '-createdAt') order = [['createdAt', 'DESC']];

  const { count, rows: packages } = await TravelPackage.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order,
  });

  res.json({
    success: true,
    count: packages.length,
    total: count,
    page: pageNum,
    pages: Math.ceil(count / limitNum),
    data: {
      packages,
    },
  });
});

// @desc    Get single package
// @route   GET /api/v1/packages/:id
// @access  Public
export const getPackage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const travelPackage = await TravelPackage.findOne({
    where: { id: req.params.id, isActive: true },
  });

  if (!travelPackage) {
    throw new AppError('Travel package not found', 404);
  }

  res.json({
    success: true,
    data: {
      package: travelPackage,
    },
  });
});

// @desc    Create travel package
// @route   POST /api/v1/packages
// @access  Private/Admin
export const createPackage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const travelPackage = await TravelPackage.create(req.body as any);

  res.status(201).json({
    success: true,
    message: 'Travel package created successfully',
    data: {
      package: travelPackage,
    },
  });
});

// @desc    Update travel package
// @route   PUT /api/v1/packages/:id
// @access  Private/Admin
export const updatePackage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const travelPackage = await TravelPackage.findByPk(req.params.id);

  if (!travelPackage) {
    throw new AppError('Travel package not found', 404);
  }

  await travelPackage.update(req.body);

  res.json({
    success: true,
    message: 'Travel package updated successfully',
    data: {
      package: travelPackage,
    },
  });
});

// @desc    Delete travel package
// @route   DELETE /api/v1/packages/:id
// @access  Private/Admin
export const deletePackage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const travelPackage = await TravelPackage.findByPk(req.params.id);

  if (!travelPackage) {
    throw new AppError('Travel package not found', 404);
  }

  await travelPackage.update({ isActive: false });

  res.json({
    success: true,
    message: 'Travel package deleted successfully',
  });
});
