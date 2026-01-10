import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    statusCode: (err as AppError).statusCode,
  });

  // If it's already an AppError, use its statusCode and message
  // Check both instanceof and statusCode property as fallback
  if (err instanceof AppError || ((err as AppError).statusCode && (err as AppError).isOperational)) {
    const statusCode = (err as AppError).statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = (err as any).errors?.map((e: any) => e.message) || [err.message];
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = (err as any).errors?.[0]?.path || 'field';
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Handle Sequelize database errors
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'Database error occurred',
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    });
  }

  // Handle Zod validation errors (from validator middleware)
  if ((err as any).name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: (err as any).errors || [],
    });
  }

  // Default to 500 server error
  const statusCode = (err as AppError).statusCode || 500;
  const message = err.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};







