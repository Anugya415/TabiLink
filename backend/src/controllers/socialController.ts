import { Request, Response } from 'express';
import Trip from '../models/Trip';
import TripCollaborator from '../models/TripCollaborator';
import Review from '../models/Review';
import Booking from '../models/Booking';
import User from '../models/User';
import Hotel from '../models/Hotel';
import { Op } from 'sequelize';

// --- Reviews ---

export const createReview = async (req: Request, res: Response) => {
    try {
        const { hotelId, travelPackageId, rating, comment, title, images } = req.body;
        const userId = (req as any).user.id;

        // Optional: Check if user has a completed booking for this entity so they can review it
        // For now, allowing open reviews or assuming frontend checks context

        const review = await Review.create({
            userId,
            hotelId,
            travelPackageId,
            rating,
            comment,
            title,
            images,
            type: hotelId ? 'hotel' : 'travel',
            bookingId: 0, // Placeholder if we don't strictly link to a specific booking ID yet, or passed in body
            status: 'pending' // Moderation
        });

        res.status(201).json({ success: true, data: review });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getReviews = async (req: Request, res: Response) => {
    try {
        const { hotelId, travelPackageId } = req.query;
        const whereClause: any = { status: 'approved' }; // Only public approved reviews

        if (hotelId) whereClause.hotelId = hotelId;
        if (travelPackageId) whereClause.travelPackageId = travelPackageId;

        const reviews = await Review.findAll({
            where: whereClause,
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: reviews });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Trips & Collaboration ---

export const createTrip = async (req: Request, res: Response) => {
    try {
        const { name, startDate, endDate } = req.body;
        const userId = (req as any).user.id;

        const trip = await Trip.create({
            ownerId: userId,
            name,
            startDate,
            endDate,
            status: 'planning'
        });

        res.status(201).json({ success: true, data: trip });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTrips = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // Get owned trips
        const ownedTrips = await Trip.findAll({ where: { ownerId: userId } });

        // Get collaborated trips
        const collaborations = await TripCollaborator.findAll({ where: { userId } });
        const collabTripIds = collaborations.map(c => c.tripId);

        const sharedTrips = await Trip.findAll({ where: { id: collabTripIds } });

        res.status(200).json({ success: true, data: { owned: ownedTrips, shared: sharedTrips } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTrip = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findByPk(id, {
            include: [
                {
                    model: Booking,
                    as: 'bookings',
                    include: [{ model: Hotel, as: 'hotel' }]
                },
                // We'll need to manually fetch collaborators or set up association in index.ts
            ]
        });

        if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

        res.status(200).json({ success: true, data: trip });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addBookingToTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;
        const { bookingId } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        booking.tripId = parseInt(tripId);
        await booking.save();

        res.status(200).json({ success: true, message: "Booking added to trip" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const inviteCollaborator = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Trip ID
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        await TripCollaborator.create({
            tripId: parseInt(id),
            userId: user.id,
            role: 'editor'
        });

        res.status(200).json({ success: true, message: "User invited" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getPublicTrip = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const trip = await Trip.findOne({
            where: { shareToken: token },
            include: [{
                model: Booking,
                as: 'bookings',
                include: [{ model: Hotel, as: 'hotel' }]
            }]
        });

        if (!trip) return res.status(404).json({ success: false, message: "Trip not found or expired link" });

        res.status(200).json({ success: true, data: trip });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
