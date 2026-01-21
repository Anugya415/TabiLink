import express from 'express';
import { authenticate as protect } from '../middleware/auth';
import { getNotifications, markRead } from '../controllers/notificationController';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markRead); // :id can be 'all'

export default router;
