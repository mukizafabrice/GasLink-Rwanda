import api from './api';
import type {
  ApiResponse,
  CylinderType,
  LocationAddress,
  MerchantShop,
  Notification,
  Order,
  OrderStatus,
  ProductCatalogItem,
  Product,
  StockMovementType,
  User,
} from '../types';

export const merchantService = {
  getDashboard: async () => (await api.get<ApiResponse<any>>('/merchant/dashboard')).data,
  getInventory: async (params?: Record<string, unknown>) =>
    (await api.get<ApiResponse<Product[]>>('/merchant/inventory', { params })).data,
  getOrders: async (params?: Record<string, unknown>) =>
    (await api.get<ApiResponse<Order[]>>('/merchant/orders', { params })).data,
  updateOrderStatus: async (orderId: string, status: OrderStatus, note?: string) =>
    (await api.patch<ApiResponse<Order>>(`/merchant/orders/${orderId}/status`, { status, note })).data,
  getAnalytics: async () => (await api.get<ApiResponse<any>>('/merchant/analytics')).data,
  getShop: async () => (await api.get<ApiResponse<MerchantShop>>('/merchant/shop')).data,
  updateShop: async (payload: Partial<MerchantShop>) =>
    (await api.patch<ApiResponse<MerchantShop>>('/merchant/shop', payload)).data,
};

export const clientService = {
  browseMerchants: async (params?: Record<string, unknown>) =>
    (await api.get<ApiResponse<MerchantShop[]>>('/client/merchants', { params })).data,
  getMerchantStorefront: async (merchantId: string) =>
    (await api.get<ApiResponse<{ shop: MerchantShop; products: Product[]; reviews: any[] }>>(`/client/merchants/${merchantId}`)).data,
  placeOrder: async (payload: {
    merchantId: string;
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress: LocationAddress;
    deliveryFee?: number;
    clientNote?: string;
  }) => (await api.post<ApiResponse<Order>>('/client/orders', payload)).data,
  getOrderHistory: async () => (await api.get<ApiResponse<Order[]>>('/client/orders/history')).data,
  getSavedMerchants: async () => (await api.get<ApiResponse<MerchantShop[]>>('/client/saved-merchants')).data,
  saveMerchant: async (merchantId: string) =>
    (await api.post<ApiResponse<string[]>>(`/client/saved-merchants/${merchantId}`)).data,
  removeSavedMerchant: async (merchantId: string) =>
    (await api.delete<ApiResponse<string[]>>(`/client/saved-merchants/${merchantId}`)).data,
  getNotifications: async () => (await api.get<ApiResponse<Notification[]>>('/client/notifications')).data,
};

export const productService = {
  listCatalog: async (activeOnly = true) =>
    (await api.get<ApiResponse<ProductCatalogItem[]>>('/products/catalog', {
      params: { activeOnly }
    })).data,
  list: async (params?: Record<string, unknown>) =>
    (await api.get<ApiResponse<Product[]>>('/products', { params })).data,
  getById: async (productId: string) =>
    (await api.get<ApiResponse<Product>>(`/products/${productId}`)).data,
  create: async (payload: {
    catalogItemId: string;
    pricePerKg: number;
    stockQuantity: number;
  }) =>
    (await api.post<ApiResponse<Product>>('/products', payload)).data,
  update: async (productId: string, payload: {
    catalogItemId?: string;
    pricePerKg?: number;
    stockQuantity?: number;
    isAvailable?: boolean;
  }) =>
    (await api.patch<ApiResponse<Product>>(`/products/${productId}`, payload)).data,
  adjustStock: async (productId: string, payload: {
    movementType: StockMovementType;
    quantity: number;
    pricePerKg?: number;
    isAvailable?: boolean;
  }) =>
    (await api.patch<ApiResponse<Product>>(`/products/${productId}/stock`, payload)).data,
  remove: async (productId: string) =>
    (await api.delete<ApiResponse<void>>(`/products/${productId}`)).data,
};

export const adminService = {
  getStats: async () => (await api.get<ApiResponse<any>>('/admin/stats')).data,
  getUsers: async (params?: Record<string, unknown>) =>
    (await api.get<ApiResponse<User[]>>('/admin/users', { params })).data,
  toggleUserStatus: async (userId: string, isActive: boolean) =>
    (await api.patch<ApiResponse<any>>(`/admin/users/${userId}/status`, { isActive })).data,
  getMerchantVerifications: async () =>
    (await api.get<ApiResponse<MerchantShop[]>>('/admin/merchant-verifications')).data,
  updateMerchantVerification: async (
    shopId: string,
    payload: { verificationStatus: string; verificationNotes?: string }
  ) => (await api.patch<ApiResponse<MerchantShop>>(`/admin/merchant-verifications/${shopId}`, payload)).data,
  getProductCatalog: async () =>
    (await api.get<ApiResponse<{ entries: ProductCatalogItem[] }>>('/admin/product-catalog')).data,
  createProductCatalogEntry: async (payload: {
    productName: string;
    cylinderType?: CylinderType;
    sizeKg: number;
    isActive?: boolean;
  }) => (await api.post<ApiResponse<ProductCatalogItem>>('/admin/product-catalog', payload)).data,
  updateProductCatalogEntry: async (
    catalogId: string,
    payload: {
      productName?: string;
      cylinderType?: CylinderType;
      sizeKg?: number;
      isActive?: boolean;
    }
  ) => (await api.patch<ApiResponse<ProductCatalogItem>>(`/admin/product-catalog/${catalogId}`, payload)).data,
  deleteProductCatalogEntry: async (catalogId: string) =>
    (await api.delete<ApiResponse<ProductCatalogItem | void>>(`/admin/product-catalog/${catalogId}`)).data,
  getAnalytics: async () => (await api.get<ApiResponse<any>>('/admin/analytics')).data,
  getSettings: async () => (await api.get<ApiResponse<any>>('/admin/settings')).data,
  updateSettings: async (payload: Record<string, unknown>) =>
    (await api.patch<ApiResponse<any>>('/admin/settings', payload)).data,
};
