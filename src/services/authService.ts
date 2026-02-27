










// import { apiFetch, setAuthToken, setStoredUser, clearAuthToken } from '@/lib/api';

// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'student' | 'startup' | 'admin';
//   profileCompleted: boolean;
// }

// export interface LoginResponse {
//   user: User;
//   token: string;
//   onboardingStep?: 'profile' | 'plan' | 'completed' | 'startup-verification';
// }

// export interface RegisterData {
//   username: string;
//   email: string;
//   password: string;
//   role: 'student' | 'startup' | 'admin';
// }

// export interface StartupVerificationData {
//   legalName: string;
//   brandName?: string;
//   companyType: 'Private Limited' | 'LLP' | 'Sole Proprietorship';
//   yearOfIncorporation: number;
//   registeredCity: string;
//   registeredState: string;
//   cin?: string;
//   gstNumber?: string;
//   startupIndiaId?: string;
//   websiteUrl?: string;
//   founderName: string;
//   founderLinkedIn: string;
//   companyEmail: string;
//   founderPhone: string;
//   teamSize: string;
//   activeRoles: string;
//   businessCategory: string;
// }

// export const authService = {

//   async login(email: string, password: string): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
//     const result = await apiFetch('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });

//     if (result.success && result.data) {
//       setAuthToken(result.data.token);
//       setStoredUser(result.data.user);
//     }

//     return result;
//   },

//   async verifyEmail(email: string, token: string): Promise<{ success: boolean; data?: LoginResponse; error?: string; onboardingStep?: string }> {
//     const result = await apiFetch(`/auth/verify-email`, {
//       method: 'POST',
//       body: JSON.stringify({ email, token }),
//     });

//     if (result.success && result.data) {
//       setAuthToken(result.data.token);
//       setStoredUser(result.data.user);
//       return { ...result, onboardingStep: result.data.onboardingStep };
//     }

//     return result;
//   },

//   async resendVerification(email: string): Promise<{ success: boolean; error?: string; status?: number }> {
//     return apiFetch('/auth/resend-verification', {
//       method: 'POST',
//       body: JSON.stringify({ email }),
//     });
//   },

//   async register(data: RegisterData): Promise<{ success: boolean; data?: User; error?: string }> {
//     return apiFetch('/auth/signup', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   async logout(): Promise<{ success: boolean; error?: string }> {
//     const result = await apiFetch('/auth/logout', {
//       method: 'POST',
//     });
//     clearAuthToken();
//     return result;
//   },

//   async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
//     return apiFetch('/users/me');
//   },

//   async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
//     return apiFetch('/auth/forgot-password', {
//       method: 'POST',
//       body: JSON.stringify({ email }),
//     });
//   },

//   async resetPassword(token: string, password: string): Promise<{ success: boolean; message?: string; error?: string }> {
//     return apiFetch(`/auth/reset-password/${token}`, {
//       method: "POST",
//       body: JSON.stringify({ password }),
//     });
//   },

//   async submitStartupVerification(data: StartupVerificationData): Promise<{ success: boolean; error?: string; message?: string }> {
//     return apiFetch('/startup-verification', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   async getStartupVerificationStatus(): Promise<{ success: boolean; data?: any; error?: string }> {
//     return apiFetch('/startup-verification/status');
//   },


  


 
// };













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
  onboardingStep?: 'profile' | 'plan' | 'completed' | 'startup-verification';
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'startup' | 'admin';
}

export interface StartupVerificationData {
  companyName: string;
  brandName?: string;
  companyType: 'Private Limited' | 'LLP' | 'Sole Proprietorship';
  yearOfIncorporation: number;
  registeredCity: string;
  registeredState: string;
  cin?: string;
  gstNumber?: string;
  startupIndiaId?: string;
  websiteUrl?: string;
  founderName: string;
  founderLinkedIn: string;
  companyEmail: string;
  founderPhone: string;
  teamSize: string;
  activeRoles: string;
  businessCategory: string;
}

export const authService = {

  async login(email: string, password: string): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data) {
      setAuthToken(result.data.token);
      setStoredUser(result.data.user);
    }

    return result;
  },

  async verifyEmail(email: string, token: string): Promise<{ success: boolean; data?: LoginResponse; error?: string; onboardingStep?: string }> {
    const result = await apiFetch(`/auth/verify-email`, {
      method: 'POST',
      body: JSON.stringify({ email, token }),
    });

    if (result.success && result.data) {
      setAuthToken(result.data.token);
      setStoredUser(result.data.user);
      return { ...result, onboardingStep: result.data.onboardingStep };
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
    return apiFetch('/auth/signup', {
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
    return apiFetch('/users/me');
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

  async submitStartupVerification(data: StartupVerificationData): Promise<{ success: boolean; error?: string; message?: string }> {
    return apiFetch('/startup-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getStartupVerificationStatus(): Promise<{ success: boolean; data?: any; error?: string }> {
    return apiFetch('/startup-verification/status');
  },
};