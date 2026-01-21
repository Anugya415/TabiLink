import express from 'express';
import {
    createTicket,
    getTickets,
    getTicket,
    updateTicket,
} from '../controllers/ticketController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.route('/')
    .get(getTickets)
    .post(createTicket);

router.route('/:id')
    .get(getTicket)
    .put(updateTicket);

export default router;
