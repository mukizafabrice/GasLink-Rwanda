import api from './api';
import type { AuthResponse, ApiResponse, Notification, RegisterRequest, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Invalid email or password',
        error: 'Invalid credentials'
      };
    }
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User | (User & { shop?: unknown })>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await api.get('/auth/notifications');
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!token && !!user;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  setAuthData: (token: string, user: User): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuthData: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
