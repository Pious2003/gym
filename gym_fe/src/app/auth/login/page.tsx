"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import AuthService from "@/service/authService";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return null;
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 254) {
      newErrors.email = "Email address is too long";
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    return newErrors;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({ 
        title: "Validation Error", 
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare login data
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        rememberMe: formData.rememberMe
      };

      const res = await AuthService.login(loginData);
      
      // Validate response
      if (!res || typeof res !== 'object') {
        throw new Error('Invalid response from server');
      }

      if (!res.name) {
        throw new Error('Invalid user data received');
      }

      if (res.type === undefined || res.type === null) {
        throw new Error('User type not specified');
      }

      // Success - store user data and redirect
      const userData = {
        id: res.id,
        name: res.name,
        email: res.email,
        type: res.type,
        loginTime: new Date().toISOString()
      };

      // Set cookie with proper expiration
      const maxAge = formData.rememberMe ? 86400 * 30 : 86400; // 30 days if remember me, else 1 day
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=${maxAge}; secure; samesite=strict`;
      
      toast({ 
        title: "Login successful", 
        description: `Welcome back, ${res.name}!` 
      });

      // Redirect based on user type
      if (res.type === 0) {
        router.push("/admin/dashboard");
      } else if (res.type === 2) {
        router.push("/admin/pt-courses");
      } else if (res.type === 1) {
        router.push("/user");
      } else {
        throw new Error(`Unknown user type: ${res.type}`);
      }

    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.statusText) {
        errorMessage = err.response.statusText;
      }

      // Set general error for display
      setErrors({ general: errorMessage });
      
      toast({ 
        title: "Login failed", 
        description: errorMessage,
        variant: "destructive"
      });

      // Clear password field on error for security
      setFormData(prev => ({ ...prev, password: '' }));
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-600">Please sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errors.general}</p>
              </div>
            </div>
          </div>
        )}
        {/* Email Field */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                errors.email
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {formData.email && (
              <div className="absolute top-1 left-12 text-xs text-blue-600 font-medium">
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
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                errors.password
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            {formData.password && (
              <div className="absolute top-1 left-12 text-xs text-blue-600 font-medium">
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) =>
                handleInputChange("rememberMe", e.target.checked)
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Signing in...
            </div>
          ) : (
            <div className="flex items-center">
              Sign in
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </button>

        {/* Sign Up Link */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Sign up now
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
