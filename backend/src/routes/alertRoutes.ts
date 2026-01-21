import express from 'express';
import { authenticate as protect } from '../middleware/auth';
import { createAlert, getAlerts, deleteAlert, checkAlertStatus } from '../controllers/alertController';

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
    .post(createAlert)
    .get(getAlerts);

router.get('/status', checkAlertStatus);
router.delete('/:id', deleteAlert);

export default router;
