// src/types/index.ts

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CLIENT' | 'MERCHANT' | 'ADMIN';
  
  // Merchant specific
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessLicense?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  description?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CLIENT' | 'MERCHANT' | 'ADMIN';
    phone?: string;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'MERCHANT' | 'ADMIN';
  phone?: string;
  merchantProfile?: {
    id: string;
    businessName: string;
    isVerified: boolean;
  };
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}