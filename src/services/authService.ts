import { apiFetch, setAuthToken, setStoredUser, clearAuthToken } from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'startup' | 'admin';
  profileCompleted: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'startup' | 'admin';
}

export const authService = {
  async login(email: string, password: string): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
    const result = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data) {
      setAuthToken(result.data.token);
      setStoredUser(result.data.user);
    }

    return result;
  },

  async register(data: RegisterData): Promise<{ success: boolean; data?: User; error?: string }> {
    return apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    const result = await apiFetch('/auth/logout', {
      method: 'POST',
    });
    clearAuthToken();
    return result;
  },

  async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    return apiFetch<User>('/users/me');
  },
};
