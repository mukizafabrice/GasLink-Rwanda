import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user.types';
import { sendError } from '../utils/apiResponse';

const JWT_SECRET = process.env.JWT_SECRET || 'gaslink-secret-key';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: UserRole };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return sendError(res, 401, 'No token provided');

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    req.user = decoded;
    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid token');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, 401, 'Unauthorized');
    if (!roles.includes(req.user.role)) return sendError(res, 403, 'Forbidden');
    return next();
  };
};
