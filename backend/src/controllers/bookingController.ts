import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Booking from '../models/Booking';
import Hotel from '../models/Hotel';
import TravelPackage from '../models/TravelPackage';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get user bookings
// @route   GET /api/v1/bookings
// @access  Private
export const getBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, type, page = 1, limit = 10 } = req.query;

  const where: any = { userId: req.user?.id };
  if (status) where.status = status;
  if (type) where.type = type;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  const { count, rows: bookings } = await Booking.findAndCountAll({
    where,
    include: [
      {
        model: Hotel,
        as: 'hotel',
        attributes: ['id', 'name', 'locationCity', 'locationCountry', 'images'],
        required: false,
      },
      {
        model: TravelPackage,
        as: 'travelPackage',
        attributes: ['id', 'title', 'destination', 'images'],
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: limitNum,
    offset,
  });

  res.json({
    success: true,
    count: bookings.length,
    total: count,
    page: pageNum,
    pages: Math.ceil(count / limitNum),
    data: {
      bookings,
    },
  });
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findOne({
    where: { id: req.params.id, userId: req.user?.id },
    include: [
      { model: Hotel, as: 'hotel', required: false },
      { model: TravelPackage, as: 'travelPackage', required: false },
      { model: require('../models/User').default, as: 'user', attributes: ['id', 'name', 'email'], required: false },
    ],
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  res.json({
    success: true,
    data: {
      booking,
    },
  });
});

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, hotel, travelPackage, checkIn, checkOut, travelers, guests } = req.body;

  let item: any;
  let price = 0;

  if (type === 'hotel') {
    if (!hotel || !checkIn || !checkOut) {
      throw new AppError('Hotel, check-in, and check-out dates are required', 400);
    }

    item = await Hotel.findByPk(hotel);
    if (!item || !item.isActive) {
      throw new AppError('Hotel not found', 404);
    }

    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    price = parseFloat(item.price.toString()) * nights * travelers;
  } else if (type === 'travel') {
    if (!travelPackage) {
      throw new AppError('Travel package is required', 400);
    }

    item = await TravelPackage.findByPk(travelPackage);
    if (!item || !item.isActive) {
      throw new AppError('Travel package not found', 404);
    }

    price = parseFloat(item.price.toString()) * travelers;
  } else {
    throw new AppError('Invalid booking type', 400);
  }

  const tax = price * 0.1;
  const total = price + tax;

  // Generate booking ID
  const prefix = type === 'hotel' ? 'HOTEL' : 'TRAVEL';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const bookingId = `${prefix}-${timestamp}-${random}`;

  const booking = await Booking.create({
    bookingId,
    userId: req.user?.id!,
    type,
    hotelId: type === 'hotel' ? parseInt(hotel) : undefined,
    travelPackageId: type === 'travel' ? parseInt(travelPackage) : undefined,
    checkIn: type === 'hotel' ? new Date(checkIn) : undefined,
    checkOut: type === 'hotel' ? new Date(checkOut) : undefined,
    travelers,
    guests,
    subtotal: price,
    tax,
    total,
    status: 'pending',
    paymentStatus: 'pending',
  } as any);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking,
    },
  });
});

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cancellationReason } = req.body;

  const booking = await Booking.findOne({
    where: { id: req.params.id, userId: req.user?.id },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  if (booking.status === 'cancelled') {
    throw new AppError('Booking is already cancelled', 400);
  }

  await booking.update({
    status: 'cancelled',
    cancellationReason,
    cancelledAt: new Date(),
  });

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      booking,
    },
  });
});
