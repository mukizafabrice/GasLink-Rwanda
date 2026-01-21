// src/lib/api.ts
import axios from 'axios';

// Get API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle 401 Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
      
      // Show toast notification (optional)
      // toast.error('Session expired. Please login again.');
    }
    
    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      // toast.error('You do not have permission to perform this action.');
      window.location.href = '/dashboard'; // Redirect to dashboard
    }
    
    // Handle 500 Server errors
    if (error.response?.status === 500) {
      // toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default apiClient;

// Helper functions for common HTTP methods
export const api = {
  get: (url: string, config?: any) => apiClient.get(url, config),
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  patch: (url: string, data?: any, config?: any) => apiClient.patch(url, data, config),
  delete: (url: string, config?: any) => apiClient.delete(url, config),
};