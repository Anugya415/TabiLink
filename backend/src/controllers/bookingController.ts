import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Booking from '../models/Booking';
import Hotel from '../models/Hotel';
import TravelPackage from '../models/TravelPackage';
import Discount from '../models/Discount';
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
  const { type, hotel, travelPackage, checkIn, checkOut, travelers, guests, discountCode, hotelRoomType, travelPackageTier } = req.body;

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

    // Use room type price if provided, otherwise use base hotel price
    let roomPrice = parseFloat(item.price.toString());
    if (hotelRoomType && item.rooms) {
      const selectedRoom = item.rooms.find((r: any) => r.type === hotelRoomType);
      if (selectedRoom) {
        roomPrice = parseFloat(selectedRoom.price.toString());
      }
    }

    price = roomPrice * nights * travelers;
  } else if (type === 'travel') {
    if (!travelPackage) {
      throw new AppError('Travel package is required', 400);
    }

    item = await TravelPackage.findByPk(travelPackage);
    if (!item || !item.isActive) {
      throw new AppError('Travel package not found', 404);
    }

    price = parseFloat(item.price.toString()) * travelers;

    // Add logic for travel package tiers if they exist in the model in the future
    // For now, we use the base price
  } else {
    throw new AppError('Invalid booking type', 400);
  }

  // Apply discount if discount code is provided
  let discountAmount = 0;
  let discountId: number | undefined;

  if (discountCode) {
    const discount = await Discount.findOne({
      where: {
        code: discountCode.toUpperCase().trim(),
        isActive: true,
      },
    });

    if (discount && discount.isValid()) {
      // Check if discount applies to this booking type
      if (
        discount.applicableTo === 'all' ||
        (discount.applicableTo === 'hotel' && type === 'hotel') ||
        (discount.applicableTo === 'travel' && type === 'travel')
      ) {
        // Check if discount applies to specific hotels/packages
        let appliesToItem = true;
        if (discount.applicableTo === 'hotel' && discount.applicableHotelIds && hotel) {
          appliesToItem = discount.applicableHotelIds.includes(parseInt(hotel));
        }
        if (discount.applicableTo === 'travel' && discount.applicableTravelPackageIds && travelPackage) {
          appliesToItem = discount.applicableTravelPackageIds.includes(parseInt(travelPackage));
        }

        if (appliesToItem) {
          // Check minimum purchase amount
          if (!discount.minPurchaseAmount || price >= parseFloat(discount.minPurchaseAmount.toString())) {
            discountAmount = discount.calculateDiscount(price);
            discountId = discount.id;

            // Increment usage count
            await discount.update({
              usageCount: discount.usageCount + 1,
            });
          }
        }
      }
    }
  }

  const subtotal = price;
  const tax = (subtotal - discountAmount) * 0.1;
  const total = subtotal - discountAmount + tax;

  // Generate booking ID
  const prefix = type === 'hotel' ? 'HOTEL' : 'TRAVEL';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const bookingId = `${prefix}-${timestamp}-${random}`;

  // Ensure user is authenticated
  if (!req.user?.id) {
    throw new AppError('Authentication required', 401);
  }

  try {
    const booking = await Booking.create({
      bookingId,
      userId: req.user.id,
      type,
      hotelId: type === 'hotel' ? parseInt(hotel) : undefined,
      travelPackageId: type === 'travel' ? parseInt(travelPackage) : undefined,
      checkIn: type === 'hotel' ? new Date(checkIn) : undefined,
      checkOut: type === 'hotel' ? new Date(checkOut) : undefined,
      hotelRoomType: type === 'hotel' ? hotelRoomType : undefined,
      travelPackageTier: type === 'travel' ? travelPackageTier : undefined,
      travelers,
      guests: guests || [],
      subtotal,
      discount: discountAmount > 0 ? discountAmount : undefined,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pending',
    } as any);

    console.log('Booking created successfully:', {
      bookingId: booking.bookingId,
      userId: booking.userId,
      type: booking.type,
      hotelId: booking.hotelId,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          id: booking.id,
          bookingId: booking.bookingId,
          userId: booking.userId,
          type: booking.type,
          hotelId: booking.hotelId,
          travelPackageId: booking.travelPackageId,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          travelers: booking.travelers,
          guests: booking.guests,
          subtotal: booking.subtotal,
          tax: booking.tax,
          total: booking.total,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          createdAt: booking.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    if (error.name === 'SequelizeValidationError') {
      throw new AppError('Validation error: ' + error.errors.map((e: any) => e.message).join(', '), 400);
    }
    throw error;
  }
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

// @desc    Modify booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
export const modifyBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { checkIn, checkOut, travelers, guests, hotelRoomType, travelPackageTier } = req.body;

  const booking = await Booking.findOne({
    where: { id: req.params.id, userId: req.user?.id },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  if (booking.status === 'cancelled' || booking.status === 'completed') {
    throw new AppError(`Cannot modify a ${booking.status} booking`, 400);
  }

  // Update dates if hotel booking
  if (booking.type === 'hotel') {
    if (checkIn) booking.checkIn = new Date(checkIn);
    if (checkOut) booking.checkOut = new Date(checkOut);
    if (hotelRoomType) booking.hotelRoomType = hotelRoomType;
  } else if (booking.type === 'travel') {
    if (travelPackageTier) booking.travelPackageTier = travelPackageTier;
  }

  if (travelers) booking.travelers = travelers;
  if (guests) booking.guests = guests;

  // Recalculate price
  let item: any;
  let price = 0;

  if (booking.type === 'hotel') {
    item = await Hotel.findByPk(booking.hotelId);
    if (!item) throw new AppError('Hotel not found', 404);

    const nights = Math.ceil(
      (new Date(booking.checkOut!).getTime() - new Date(booking.checkIn!).getTime()) / (1000 * 60 * 60 * 24)
    );

    let roomPrice = parseFloat(item.price.toString());
    if (booking.hotelRoomType && item.rooms) {
      const selectedRoom = item.rooms.find((r: any) => r.type === booking.hotelRoomType);
      if (selectedRoom) {
        roomPrice = parseFloat(selectedRoom.price.toString());
      }
    }

    price = roomPrice * nights * booking.travelers;
  } else {
    item = await TravelPackage.findByPk(booking.travelPackageId);
    if (!item) throw new AppError('Travel package not found', 404);

    price = parseFloat(item.price.toString()) * booking.travelers;
  }

  const subtotal = price;
  const discountAmount = booking.discount || 0;
  const tax = (subtotal - discountAmount) * 0.1;
  const total = subtotal - discountAmount + tax;

  await booking.update({
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    hotelRoomType: booking.hotelRoomType,
    travelPackageTier: booking.travelPackageTier,
    travelers: booking.travelers,
    guests: booking.guests,
    subtotal,
    tax,
    total,
    // If price increased, we might want to set payment status back to pending
    // depending on the business logic. For now, we'll just update the total.
  });

  res.json({
    success: true,
    message: 'Booking modified successfully',
    data: {
      booking,
    },
  });
});
