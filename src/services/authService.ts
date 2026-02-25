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
  onboardingStep?: 'profile' | 'plan' | 'completed';
}

export interface RegisterData {
  username: string; // Changed from name to username
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

  async verifyEmail(email: string, token: string): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
    // Calls universal verification endpoint using email + otp token
    const result = await apiFetch<LoginResponse>(`/auth/verify-email`, {
      method: 'POST',
      body: JSON.stringify({ email, token }),
    });

    if (result.success && result.data) {
      setAuthToken(result.data.token);
      setStoredUser(result.data.user);
    }

    return result;
  },

  async resendVerification(email: string): Promise<{ success: boolean; error?: string; status?: number }> {
    return apiFetch('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

async register(data: RegisterData): Promise<{ success: boolean; data?: User; error?: string }> {
    return apiFetch<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data), // This now sends { username, email, password, role }
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

  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return apiFetch(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },
};
