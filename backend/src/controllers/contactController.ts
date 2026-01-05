import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Contact from '../models/Contact';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Submit contact form
// @route   POST /api/v1/contact
// @access  Public
export const submitContact = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  } as any);

  res.status(201).json({
    success: true,
    message: 'Contact form submitted successfully. We will get back to you soon.',
    data: {
      contact,
    },
  });
});

// @desc    Get all contact submissions (Admin)
// @route   GET /api/v1/contact
// @access  Private/Admin
export const getContacts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, page = 1, limit = 20 } = req.query;

  const where: any = {};
  if (status) where.status = status;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  const { count, rows: contacts } = await Contact.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: limitNum,
    offset,
  });

  res.json({
    success: true,
    count: contacts.length,
    total: count,
    page: pageNum,
    pages: Math.ceil(count / limitNum),
    data: {
      contacts,
    },
  });
});
