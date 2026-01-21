import { UserRole, OrderStatus } from '@prisma/client';

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
  role: UserRole;
  
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
    role: UserRole;
    phone?: string;
  };
}

// User Types
export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

// Location Types
export interface LocationQuery {
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
}

// Product Types
export interface CreateProductRequest {
  name: string;
  description?: string;
  category: string;
  unit: string;
  price: number;
  currentStock: number;
  minStockLevel?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: string;
  unit?: string;
  price?: number;
  currentStock?: number;
  minStockLevel?: number;
  isAvailable?: boolean;
}

// Order Types
export interface CreateOrderRequest {
  merchantId: string;
  productId: string;
  quantity: number;
  deliveryAddress?: string;
  deliveryFee?: number;
  clientNote?: string;
}

export interface UpdateOrderRequest {
  status: OrderStatus;
}