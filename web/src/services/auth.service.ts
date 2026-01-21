// src/services/auth.service.ts
import { api } from '@/lib/api';
import type { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types';

export const authService = {
  // Login user
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout user (client-side only)
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
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

  // Save auth data to localStorage
  setAuthData: (token: string, user: any): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth data
  clearAuthData: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};