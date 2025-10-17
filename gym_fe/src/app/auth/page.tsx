'use client';
import React from 'react';
import { useState } from 'react';
import LoginForm from './login/page';
import RegisterForm from './register/page';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-700 ${
          isLoginMode 
            ? 'bg-gradient-to-br from-blue-200 to-indigo-200' 
            : 'bg-gradient-to-br from-green-200 to-emerald-200'
        }`}></div>
        <div className={`absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-700 ${
          isLoginMode 
            ? 'bg-gradient-to-tr from-purple-200 to-pink-200' 
            : 'bg-gradient-to-tr from-teal-200 to-cyan-200'
        }`}></div>
      </div>
      
      {/* Auth Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md transition-all duration-500">
        <div className="transition-all duration-500 ease-in-out">
          {isLoginMode ? (
            <LoginForm onSwitchToRegister={() => setIsLoginMode(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 text-center text-gray-500 text-sm">
        © 2025 Your Company. All rights reserved.
      </div>
    </div>
  );
}

export default LoginLayout;