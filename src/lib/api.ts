// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api';

// Helper to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Helper to clear auth token
export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

// Helper to get stored user
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Helper to store user
export const setStoredUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Generic fetch wrapper with auth
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // For cookies
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'An error occurred' };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}
