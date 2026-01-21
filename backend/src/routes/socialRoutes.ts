import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    createReview,
    getReviews,
    createTrip,
    getTrips,
    getTrip,
    addBookingToTrip,
    inviteCollaborator,
    getPublicTrip
} from '../controllers/socialController';

const router = Router();

// Reviews
router.post('/reviews', authenticate, createReview);
router.get('/reviews', getReviews); // Public

// Trips
router.post('/trips', authenticate, createTrip);
router.get('/trips', authenticate, getTrips);
router.get('/trips/:id', authenticate, getTrip);
router.post('/trips/:tripId/bookings', authenticate, addBookingToTrip);
router.post('/trips/:id/invite', authenticate, inviteCollaborator);

// Public Sharing
router.get('/trips/share/:token', getPublicTrip);

export default router;
