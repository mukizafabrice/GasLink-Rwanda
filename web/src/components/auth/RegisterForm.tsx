// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Building, MapPin, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from './AuthLayout';

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'CLIENT' | 'MERCHANT'>('CLIENT');
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'CLIENT' as 'CLIENT' | 'MERCHANT',
    
    // Merchant specific
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessLicense: '',
    description: '',
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUserTypeSelect = (type: 'CLIENT' | 'MERCHANT') => {
    setUserType(type);
    setFormData(prev => ({ ...prev, role: type }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.role === 'MERCHANT') {
      const requiredMerchantFields = [
        'businessName', 'businessPhone', 'province', 
        'district', 'sector', 'cell', 'village'
      ];
      
      for (const field of requiredMerchantFields) {
        if (!formData[field as keyof typeof formData]) {
          setError(`Please fill all required merchant fields`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      // Prepare data for API
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
        ...(formData.role === 'MERCHANT' && {
          businessName: formData.businessName,
          businessEmail: formData.businessEmail || formData.email,
          businessPhone: formData.businessPhone,
          businessLicense: formData.businessLicense,
          description: formData.description,
          province: formData.province,
          district: formData.district,
          sector: formData.sector,
          cell: formData.cell,
          village: formData.village,
        })
      };

      const response = await authService.register(registerData);
      
      if (response.success && response.data) {
        // Save auth data
        authService.setAuthData(response.data.token, response.data.user);
        
        // Update auth context
        login(response.data.user);
        
        // Redirect based on role
        if (response.data.user.role === 'MERCHANT') {
          navigate('/merchant/dashboard?pending=true');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred during registration'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Rwandan provinces (simplified)
  const rwandanProvinces = [
    'Kigali City',
    'Southern Province',
    'Western Province',
    'Northern Province',
    'Eastern Province'
  ];

  // Districts based on province (simplified)
  const getDistricts = () => {
    switch (formData.province) {
      case 'Kigali City':
        return ['Gasabo', 'Kicukiro', 'Nyarugenge'];
      case 'Southern Province':
        return ['Huye', 'Muhanga', 'Kamonyi', 'Ruhango'];
      case 'Western Province':
        return ['Rubavu', 'Rusizi', 'Nyamasheke', 'Karongi'];
      case 'Northern Province':
        return ['Musanze', 'Burera', 'Gicumbi', 'Rulindo'];
      case 'Eastern Province':
        return ['Kayonza', 'Ngoma', 'Bugesera', 'Rwamagana'];
      default:
        return [];
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join GasLink Rwanda's LPG marketplace"
      type="register"
      footerText="Already have an account?"
      footerLinkText="Sign in here"
      footerLinkTo="/login"
    >
      {step === 1 ? (
        // Step 1: User Type Selection
        <div className="space-y-6">
          <div className="text-center">
            <p className="mb-8 text-gray-600">
              Select your account type to get started
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Client Card */}
            <button
              onClick={() => handleUserTypeSelect('CLIENT')}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                userType === 'CLIENT' 
                  ? 'border-primary-500 bg-primary-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg mr-4 ${
                  userType === 'CLIENT' ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <User className={`h-6 w-6 ${
                    userType === 'CLIENT' ? 'text-primary-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Client</h3>
                  <p className="text-sm text-gray-500">Buy LPG products</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                  Browse merchants & products
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                  Place orders & track history
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                  Save trusted merchants
                </li>
              </ul>
            </button>

            {/* Merchant Card */}
            <button
              onClick={() => handleUserTypeSelect('MERCHANT')}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                userType === 'MERCHANT' 
                  ? 'border-primary-500 bg-primary-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg mr-4 ${
                  userType === 'MERCHANT' ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <Building className={`h-6 w-6 ${
                    userType === 'MERCHANT' ? 'text-primary-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Merchant</h3>
                  <p className="text-sm text-gray-500">Sell LPG products</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                  Manage inventory & pricing
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                  Receive & process orders
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                  Grow your LPG business
                </li>
              </ul>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-center text-gray-500">
              Admin accounts are created internally. Contact support for admin access.
            </p>
          </div>
        </div>
      ) : (
        // Step 2: Registration Form
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Account Type Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            userType === 'CLIENT' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {userType === 'CLIENT' ? '👤 Client Account' : '🏪 Merchant Account'}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              Change
            </button>
          </div>

          {/* Personal Information */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="John"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Doe"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+250788123456"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Security</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Specific Fields */}
          {userType === 'MERCHANT' && (
            <>
              {/* Business Information */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Business Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Kigali Gas Supplies Ltd"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Business Email
                      </label>
                      <input
                        type="email"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="info@business.rw"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Business Phone *
                      </label>
                      <input
                        type="tel"
                        name="businessPhone"
                        required
                        value={formData.businessPhone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="+250788123456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Business License Number
                    </label>
                    <input
                      type="text"
                      name="businessLicense"
                      value={formData.businessLicense}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="LIC-001-2024"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Business Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe your LPG business..."
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Business Location *</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Province *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                      <select
                        name="province"
                        required
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full p-3 pl-10 border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Province</option>
                        {rwandanProvinces.map(province => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      District *
                    </label>
                    <select
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      disabled={!formData.province}
                      className="w-full p-3 border border-gray-300 appearance-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    >
                      <option value="">Select District</option>
                      {getDistricts().map(district => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Sector *
                    </label>
                    <input
                      type="text"
                      name="sector"
                      required
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Nyamirambo"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Cell *
                    </label>
                    <input
                      type="text"
                      name="cell"
                      required
                      value={formData.cell}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g.,