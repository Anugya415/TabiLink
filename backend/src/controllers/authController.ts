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

// @desc    Get all users (Admin/Super Admin)
// @route   GET /api/v1/auth/users
// @access  Private (Admin/Super Admin)
export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role, search, page = 1, limit = 50 } = req.query;
  
  const where: any = {};
  if (role && typeof role === 'string') {
    where.role = role;
  }
  if (search && typeof search === 'string') {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  const { count, rows } = await User.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password', 'passwordResetToken', 'emailVerificationToken'] },
  });

  res.json({
    success: true,
    data: {
      users: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    },
  });
});

// @desc    Create user (Admin/Super Admin)
// @route   POST /api/v1/auth/users
// @access  Private (Admin/Super Admin)
export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone, role = 'user', membershipTier = 'Silver' } = req.body;

  // Validate required fields
  if (!name || !email) {
    throw new AppError('Name and email are required', 400);
  }

  // Check if user exists
  const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Generate a default password if not provided or empty
  const userPassword = (password && password.trim().length >= 8) ? password : `Temp${Math.random().toString(36).slice(-8)}123`;

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: userPassword,
    phone,
    role: role || 'user',
    membershipTier: membershipTier || 'Silver',
    isEmailVerified: true,
  } as any);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        membershipTier: user.membershipTier,
        isActive: user.isActive,
        memberSince: user.memberSince,
      },
      // Only return password if it was auto-generated
      ...(!password && { generatedPassword: userPassword }),
    },
  });
});

// @desc    Update user (Admin/Super Admin)
// @route   PUT /api/v1/auth/users/:id
// @access  Private (Admin/Super Admin)
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, role, isActive, membershipTier, password } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent updating own role/status if admin
  if (req.user?.id === parseInt(id) && (role || isActive !== undefined)) {
    throw new AppError('You cannot modify your own role or status', 400);
  }

  if (email && email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }
    user.email = email.toLowerCase();
  }

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (membershipTier) user.membershipTier = membershipTier;
  if (password) user.password = password; // Will be hashed by beforeUpdate hook

  await user.save();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        membershipTier: user.membershipTier,
        isActive: user.isActive,
      },
    },
  });
});

// @desc    Delete user (Admin/Super Admin)
// @route   DELETE /api/v1/auth/users/:id
// @access  Private (Admin/Super Admin)
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent deleting own account
  if (req.user?.id === parseInt(id)) {
    throw new AppError('You cannot delete your own account', 400);
  }

  await user.destroy();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});
