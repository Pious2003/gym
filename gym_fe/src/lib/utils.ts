import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5231';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Helper function to get common headers for API requests
export const getApiHeaders = (additionalHeaders: Record<string, string> = {}) => ({
  'ngrok-skip-browser-warning': 'true',
  ...additionalHeaders
});