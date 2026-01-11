import express from 'express';
import { submitContact, getContacts } from '../controllers/contactController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = express.Router();

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  }),
});

router.post('/', validate(contactSchema), submitContact);
router.get('/', authenticate, authorize('admin', 'super_admin'), getContacts);

export default router;









