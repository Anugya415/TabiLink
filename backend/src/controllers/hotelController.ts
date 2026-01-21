import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Hotel from '../models/Hotel';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';
import { Op } from 'sequelize';
import Booking from '../models/Booking';

// @desc    Get all hotels
// @route   GET /api/v1/hotels
// @access  Public
export const getHotels = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    city,
    country,
    isPopular,
    featured,
    page = 1,
    limit = 12,
    sort = '-rating',
    checkIn,
    checkOut,
  } = req.query;

  const where: any = { isActive: true };

  // Search
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { locationCity: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filters
  if (category) where.category = category;
  if (city) where.locationCity = { [Op.like]: `%${city}%` };
  if (country) where.locationCountry = { [Op.like]: `%${country}%` };
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

  // Date Availability Logic
  let validHotels = [];

  if (checkIn && checkOut) {
    // If dates are provided, we need to fetch ALL matching hotels first to filter by availability
    // because room capacity is in JSON and hard to query in SQL directly with bookings join.
    // This is an in-memory trade-off for the demo architecture.
    const allMatchingHotels = await Hotel.findAll({ where, order });

    // Fetch all confirmed bookings that overlap
    const existingBookings = await Booking.findAll({
      where: {
        checkIn: { [Op.lt]: new Date(checkOut as string) },
        checkOut: { [Op.gt]: new Date(checkIn as string) },
        status: 'confirmed',
        hotelId: { [Op.in]: allMatchingHotels.map(h => h.id) }
      }
    });

    // Filter hotels
    validHotels = allMatchingHotels.filter(hotel => {
      const hotelBookings = existingBookings.filter(b => b.hotelId === hotel.id);

      // Calculate total capacity across all rooms
      const totalCapacity = hotel.rooms.reduce((acc: number, room: any) => acc + (room.available || 0), 0);

      // Simple availability check: if bookings < capacity
      // A more advanced check would match room types, but this suffices for "is the hotel available?"
      return hotelBookings.length < totalCapacity;
    });

    // Manual Pagination
    const count = validHotels.length;
    const paginatedHotels = validHotels.slice(offset, offset + limitNum);

    res.json({
      success: true,
      count: paginatedHotels.length,
      total: count,
      page: pageNum,
      pages: Math.ceil(count / limitNum),
      data: {
        hotels: paginatedHotels,
      },
    });
    return;
  }

  const { count, rows: hotels } = await Hotel.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order,
  });

  res.json({
    success: true,
    count: hotels.length,
    total: count,
    page: pageNum,
    pages: Math.ceil(count / limitNum),
    data: {
      hotels,
    },
  });
});

// @desc    Get single hotel
// @route   GET /api/v1/hotels/:id
// @access  Public
export const getHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const hotel = await Hotel.findOne({
    where: { id: req.params.id, isActive: true },
  });

  if (!hotel) {
    throw new AppError('Hotel not found', 404);
  }

  res.json({
    success: true,
    data: {
      hotel,
    },
  });
});

// @desc    Create hotel
// @route   POST /api/v1/hotels
// @access  Private/Admin
export const createHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const hotel = await Hotel.create(req.body as any);

  res.status(201).json({
    success: true,
    message: 'Hotel created successfully',
    data: {
      hotel,
    },
  });
});

// @desc    Update hotel
// @route   PUT /api/v1/hotels/:id
// @access  Private/Admin
export const updateHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const hotel = await Hotel.findByPk(req.params.id);

  if (!hotel) {
    throw new AppError('Hotel not found', 404);
  }

  await hotel.update(req.body);

  res.json({
    success: true,
    message: 'Hotel updated successfully',
    data: {
      hotel,
    },
  });
});

// @desc    Delete hotel
// @route   DELETE /api/v1/hotels/:id
// @access  Private/Admin
export const deleteHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const hotel = await Hotel.findByPk(req.params.id);

  if (!hotel) {
    throw new AppError('Hotel not found', 404);
  }

  await hotel.update({ isActive: false });

  res.json({
    success: true,
    message: 'Hotel deleted successfully',
  });
});
