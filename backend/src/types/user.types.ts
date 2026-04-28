// src/types/user.types.ts

export enum UserRole {
  CLIENT = 'CLIENT',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  savedMerchants?: string[];
  address?: {
    province?: string;
    district?: string;
    sector?: string;
    cell?: string;
    village?: string;
    streetAddress?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
