import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/authService';
import { getStoredUser, clearAuthToken, getAuthToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: 'student' | 'startup' | 'admin') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = getAuthToken();
    if (token) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.data) {
      setUser(result.data.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

// src/contexts/AuthContext.tsx

const register = async (name: string, email: string, password: string, role: 'student' | 'startup' | 'admin') => {
  // Pass 'name' as 'username' to match the updated service interface
  const result = await authService.register({ username: name, email, password, role });
  if (result.success) {
    return await login(email, password);
  }
  return { success: false, error: result.error };
};

  const logout = async () => {
    await authService.logout();
    setUser(null);
    clearAuthToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
