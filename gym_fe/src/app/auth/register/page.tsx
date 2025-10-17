'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import { register } from '@/service/authService';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Ensure type and phoneNumber are included for the register API
      await register({
        ...formData,
        type: 0, // or whatever default type is appropriate
        phoneNumber: '',
        address: '',
        status: 1 // or get from formData if you have a phone number field
      });
      setApiSuccess('Registration successful! You can now log in.');
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      });
      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);
    } catch (err: any) {
      setApiError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
        <p className="text-gray-600">Join us and start your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-black">
        {apiError && <div className="text-red-600 text-center font-medium">{apiError}</div>}
        {apiSuccess && <div className="text-green-600 text-center font-medium">{apiSuccess}</div>}
        {/* Full Name Field */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                errors.fullName 
                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                  : 'border-gray-200 focus:border-green-500 bg-white hover:border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {formData.fullName && (
              <div className="absolute top-1 left-12 text-xs text-green-600 font-medium">
                Full Name
              </div>
            )}
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-600 ml-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                  : 'border-gray-200 focus:border-green-500 bg-white hover:border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {formData.email && (
              <div className="absolute top-1 left-12 text-xs text-green-600 font-medium">
                Email
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 ml-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                  : 'border-gray-200 focus:border-green-500 bg-white hover:border-gray-300'
              }`}
              placeholder="Create a password"
            />
            {formData.password && (
              <div className="absolute top-1 left-12 text-xs text-green-600 font-medium">
                Password
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 ml-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:border-red-500 bg-red-50' 
                  : 'border-gray-200 focus:border-green-500 bg-white hover:border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            {formData.confirmPassword && (
              <div className="absolute top-1 left-12 text-xs text-green-600 font-medium">
                Confirm Password
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 ml-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="space-y-1">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mt-1"
            />
            <span className="ml-3 text-sm text-gray-700 leading-relaxed">
              I agree to the{' '}
              <button type="button" className="text-green-600 hover:text-green-800 font-medium">
                Terms of Service
              </button>
              {' '}and{' '}
              <button type="button" className="text-green-600 hover:text-green-800 font-medium">
                Privacy Policy
              </button>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600 ml-1">{errors.agreeToTerms}</p>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Creating account...
            </div>
          ) : (
            <div className="flex items-center">
              Create account
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </button>

        {/* Login Link */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="text-green-600 hover:text-green-800 font-semibold transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}