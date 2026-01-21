import { Request, Response, NextFunction } from 'express';

// Custom error class for app-specific errors
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

// Error response interface
interface ErrorResponse {
  status: 'error';
  message: string;
  stack?: string;
}

// Global error handler middleware
const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack: string | undefined;

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle validation errors (we'll add specific validation later)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  // Handle JWT errors (we'll add authentication later)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // Handle JWT expiry errors
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    stack = err.stack;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Send error response
  const errorResponse: ErrorResponse = {
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack }),
  };

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;