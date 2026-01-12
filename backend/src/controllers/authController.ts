import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { generateToken, generateRefreshToken } from '../utils/generateToken';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

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

  try {
    // Check user and password (include password in scope)
    const user = await User.scope('withPassword').findOne({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
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
  } catch (error: any) {
    // Re-throw AppError as-is
    if (error instanceof AppError) {
      throw error;
    }
    // Log unexpected errors
    console.error('Login error:', error);
    throw new AppError('Login failed. Please try again.', 500);
  }
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

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters', 400);
  }

  const user = await User.scope('withPassword').findByPk(req.user?.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password (will be hashed by beforeUpdate hook)
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Google OAuth login
// @route   POST /api/v1/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new AppError('Google ID token is required', 400);
  }

  try {
    // Initialize Google OAuth client
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new AppError('Google Sign-In is not available. Please contact the administrator.', 503);
    }

    const client = new OAuth2Client(clientId);
    
    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AppError('Invalid Google token', 401);
    }

    const { email, name, picture } = payload;

    if (!email) {
      throw new AppError('Email not provided by Google', 400);
    }

    // Check if user exists
    let user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (user) {
      // User exists, update last login
      user.lastLogin = new Date();
      if (!user.avatar && picture) {
        user.avatar = picture;
      }
      await user.save();
    } else {
      // Create new user with a random password (OAuth users won't use password)
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) + 'Aa1!';
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        avatar: picture || null,
        password: randomPassword,
        isEmailVerified: true,
      } as any);
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive. Please contact support', 401);
    }

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
      message: 'Google login successful',
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
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Google login error:', error);
    throw new AppError('Google authentication failed. Please try again.', 500);
  }
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

