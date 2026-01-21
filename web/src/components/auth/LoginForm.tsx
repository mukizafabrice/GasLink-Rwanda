// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from './AuthLayout';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success && response.data) {
        // Save auth data
        authService.setAuthData(response.data.token, response.data.user);
        
        // Update auth context
        login(response.data.user);
        
        // Redirect based on role
        const role = response.data.user.role;
        switch (role) {
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'MERCHANT':
            navigate('/merchant/dashboard');
            break;
          case 'CLIENT':
            navigate('/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const demoLogin = (role: 'client' | 'merchant' | 'admin') => {
    const demoAccounts = {
      client: { email: 'client@example.com', password: 'Client123!' },
      merchant: { email: 'merchant@example.com', password: 'Merchant123!' },
      admin: { email: 'admin@gaslink.rw', password: 'Admin123!' }
    };
    
    setFormData(demoAccounts[role]);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your GasLink account"
      type="login"
      footerText="Don't have an account?"
      footerLinkText="Register here"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Demo Accounts Section */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="mb-3 text-sm font-medium text-gray-700">Try Demo Accounts:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => demoLogin('client')}
              className="px-3 py-2 text-xs text-blue-700 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200"
            >
              Client Demo
            </button>
            <button
              type="button"
              onClick={() => demoLogin('merchant')}
              className="px-3 py-2 text-xs text-orange-700 transition-colors bg-orange-100 rounded-lg hover:bg-orange-200"
            >
              Merchant Demo
            </button>
            <button
              type="button"
              onClick={() => demoLogin('admin')}
              className="px-3 py-2 text-xs text-purple-700 transition-colors bg-purple-100 rounded-lg hover:bg-purple-200"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full py-3 pl-10 pr-3 placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full py-3 pl-10 pr-10 placeholder-gray-400 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full flex justify-center py-3 px-4 border border-transparent rounded-xl
              text-sm font-medium text-white
              ${loading 
                ? 'bg-primary-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }
              transition-colors duration-200
            `}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">Or continue with</span>
          </div>
        </div>

        {/* Social Login (Placeholder for future) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 shadow-sm cursor-not-allowed rounded-xl hover:bg-gray-50"
          >
            Google
          </button>
          <button
            type="button"
            disabled
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 shadow-sm cursor-not-allowed rounded-xl hover:bg-gray-50"
          >
            Facebook
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;