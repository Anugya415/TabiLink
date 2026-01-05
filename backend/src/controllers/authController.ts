import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { generateToken, generateRefreshToken } from '../utils/generateToken';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';
import { Op } from 'sequelize';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
  } as any);

  // Generate tokens
  const token = generateToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    },
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Check user and password (include password in scope)
  const user = await User.scope('withPassword').findOne({
    where: { email: email.toLowerCase() },
  });
  
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is inactive. Please contact support', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const token = generateToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        membershipTier: user.membershipTier,
      },
      token,
      refreshToken,
    },
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.user?.id);

  res.json({
    success: true,
    data: {
      user,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, phone, preferences } = req.body;

  const user = await User.findByPk(req.user?.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user,
    },
  });
});
