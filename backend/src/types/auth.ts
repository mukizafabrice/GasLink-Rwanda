export interface RegisterInput {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'ADMIN';
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  streetAddress?: string;
}

export interface LoginInput {
  emailOrPhone: string;
  password: string;
}

export interface AuthResponse {
  status: 'success';
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      role: string;
      province: string;
      district: string;
      sector: string;
      cell: string;
      village: string;
      emailVerified: boolean;
      phoneVerified: boolean;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}