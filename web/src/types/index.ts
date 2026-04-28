export enum UserRole {
  CLIENT = 'CLIENT',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
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

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface LocationAddress {
  province: string;
  district: string;
  sector: string;
  cell?: string;
  village?: string;
  streetAddress?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  savedMerchants?: string[];
  address?: LocationAddress;
  shop?: MerchantShop;
  lastLoginAt?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
  customer?: {
    totalOrders?: number;
    totalSpent?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MerchantShop {
  _id: string;
  owner: string | User;
  shopName: string;
  slug: string;
  description?: string;
  businessEmail?: string;
  businessPhone: string;
  businessLicense?: string;
  address: LocationAddress;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string | User;
  isOpen: boolean;
  isFeatured: boolean;
  deliveryFee: number;
  minimumOrderAmount: number;
  averageRating: number;
  totalReviews: number;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  merchant: string | User;
  shop: string | MerchantShop;
  catalogItem?: string | ProductCatalogItem;
  productName?: string;
  cylinderType?: CylinderType;
  sizeKg?: number;
  name: string;
  category?: ProductCategory | string;
  unit: string;
  pricePerKg?: number;
  price: number;
  currentStock: number;
  minStockLevel: number;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCatalogItem {
  _id: string;
  productName: string;
  cylinderType: CylinderType;
  sizeKg: number;
  category: ProductCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  order: string;
  product: string | Product;
  merchant: string;
  client: string;
  productName: string;
  productCategory: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  client: string | User;
  merchant: string | User;
  shop: string | MerchantShop;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress: LocationAddress;
  clientNote?: string;
  merchantNote?: string;
  stockCommitted: boolean;
  statusHistory: Array<{
    status: OrderStatus;
    changedAt: string;
    changedBy: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  order: string;
  client: string | User;
  merchant: string;
  product?: string | Product;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

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
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessLicense?: string;
  description?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  streetAddress?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  [key: string]: number | string;
}
