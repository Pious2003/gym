import { API_BASE } from '@/lib/utils';
// TODO: Fix import path or provide type definitions for LoginCredentials, AuthResponse, User
// import { LoginCredentials, AuthResponse, User } from '../types/auth';

type LoginCredentials = {
  email: string;
  password: string;
};

type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  // password?: string; // Exclude password from user type if not needed
};

type AuthResponse = {
  user: User;
  token: string;
};

class AuthService {
  private baseUrl = '/api/auth';

  async login(credentials: LoginCredentials & { rememberMe: boolean }): Promise<any> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    const user = await res.json();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('user');
    // Clear user cookie
    document.cookie = 'user=; path=/; max-age=0; secure; samesite=strict';
  }
}

export default new AuthService();

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  type: number;
  phoneNumber: string;
  address: string;
  status: number;
}) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  return res.json();
}