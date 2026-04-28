import { UserRole } from './user.types';

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  FAILED = 'FAILED'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum NotificationType {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  SHOP_VERIFICATION = 'SHOP_VERIFICATION',
  SYSTEM = 'SYSTEM',
  REVIEW = 'REVIEW'
}

export enum ProductCategory {
  GAS_CYLINDER = 'GAS_CYLINDER'
}

export enum CylinderType {
  STANDARD = 'STANDARD'
}

export enum StockMovementType {
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT'
}

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
  catalogItemId: string;
  pricePerKg: number;
  stockQuantity: number;
}

export interface UpdateProductRequest {
  catalogItemId?: string;
  pricePerKg?: number;
  stockQuantity?: number;
  isAvailable?: boolean;
}

export interface AdjustProductStockRequest {
  movementType: StockMovementType;
  quantity: number;
  pricePerKg?: number;
}

// Order Types
export interface CreateOrderRequest {
  merchantId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  deliveryAddress?: {
    province: string;
    district: string;
    sector: string;
    cell?: string;
    village?: string;
    streetAddress?: string;
  };
  deliveryFee?: number;
  clientNote?: string;
  paymentMethod?: PaymentStatus;
}

export interface UpdateOrderRequest {
  status: OrderStatus;
}
