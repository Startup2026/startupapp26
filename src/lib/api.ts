// src/lib/api.ts

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultApiBaseUrl = import.meta.env.PROD
  ? 'https://rest.wostup.com/api'
  : 'http://localhost:3000/api';

const resolveApiBaseUrl = (): string => {
  if (!configuredApiBaseUrl) return defaultApiBaseUrl;

  // Keep explicit absolute URLs as-is.
  if (/^https?:\/\//i.test(configuredApiBaseUrl)) {
    return configuredApiBaseUrl;
  }

  // In dev, map relative '/api' style config to backend origin.
  if (configuredApiBaseUrl.startsWith('/')) {
    const devBackendOrigin = import.meta.env.VITE_DEV_BACKEND_ORIGIN?.trim() || 'http://localhost:3000';
    return `${devBackendOrigin.replace(/\/$/, '')}${configuredApiBaseUrl}`;
  }

  return configuredApiBaseUrl;
};

export const API_BASE_URL = resolveApiBaseUrl().replace(/\/$/, '');

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  // Define routes that don't require authentication
  const publicRoutes = ['/auth/signup', '/auth/verify-email', '/auth/resend-verification', '/auth/login', '/auth/admin-login'];
  const isPublic = publicRoutes.some(route => endpoint.includes(route));

  if (!token && !isPublic) {
    console.warn(`[apiFetch] No auth_token found. Request to ${endpoint} might fail.`);
  }

  const headers: HeadersInit = {
    ...(typeof FormData !== 'undefined' && options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    
    // Return status code to handle 401s specifically
    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || data.message || 'An error occurred',
        status: response.status 
      };
    }

    return { ...data, status: response.status, success: true };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};