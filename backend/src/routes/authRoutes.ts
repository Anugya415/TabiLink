import express from 'express';
import {
  register,
  login,
  googleLogin,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    preferences: z.object({
      currency: z.string().optional(),
      language: z.string().optional(),
      notifications: z.object({
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
        push: z.boolean().optional(),
      }).optional(),
    }).optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Google ID token is required'),
  }),
});

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.union([
      z.string().min(8, 'Password must be at least 8 characters'),
      z.literal(''),
      z.undefined()
    ]).optional(),
    phone: z.string().optional(),
    role: z.enum(['user', 'admin', 'super_admin']).optional(),
    membershipTier: z.enum(['Silver', 'Gold', 'Platinum']).optional(),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.enum(['user', 'admin', 'super_admin']).optional(),
    isActive: z.boolean().optional(),
    membershipTier: z.enum(['Silver', 'Gold', 'Platinum']).optional(),
    password: z.string().min(8).optional(),
  }),
});

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleLoginSchema), googleLogin);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

// Admin/Super Admin routes
router.get('/users', authenticate, authorize('admin', 'super_admin'), getAllUsers);
router.post('/users', authenticate, authorize('admin', 'super_admin'), validate(createUserSchema), createUser);
router.put('/users/:id', authenticate, authorize('admin', 'super_admin'), validate(updateUserSchema), updateUser);
router.delete('/users/:id', authenticate, authorize('admin', 'super_admin'), deleteUser);

export default router;




