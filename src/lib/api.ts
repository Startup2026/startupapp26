// src/lib/api.ts

// export const API_BASE_URL = 'http://localhost:3000/api';
// export const API_BASE_URL = 'https://backend-f3js.onrender.com/api';
export const API_BASE_URL = 'http://localhost:3000/api';

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
  const publicRoutes = ['/auth/signup', '/auth/verify-email', '/auth/resend-verification', '/auth/login'];
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