// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '@/services/authService';
import { getStoredUser, clearAuthToken } from '@/lib/api';

type AuthContextValue = {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; onboardingStep?: string; error?: string }>;
    register: (username: string, email: string, password: string, role: 'student' | 'startup' | 'admin') => Promise<{ success: boolean; error?: string }>;
    verifyEmail: (email: string, token: string) => Promise<{ success: boolean; onboardingStep?: string; error?: string }>;
    logout: () => Promise<void>;
    resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>; 
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<any> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            return getStoredUser();
        } catch {
            return null;
        }
    });

    useEffect(() => {
        // Keep local user in sync with storage
        const stored = getStoredUser();
        if (stored && !user) setUser(stored);
    }, []);

    const login = async (email: string, password: string) => {
        const result = await authService.login(email, password);
        if (result.success && result.data) {
            setUser(result.data.user);
            return { 
                success: true, 
                onboardingStep: result.data.onboardingStep 
            };
        }

        // Generic error message for security, but pass through verify message if present
        const message = result.error || 'Invalid credentials.';
        return { success: false, error: message };
    };

    const register = async (username: string, email: string, password: string, role: 'student' | 'startup' | 'admin') => {
        const result = await authService.register({ username, email, password, role });
        if (result.success) {
            // Do NOT auto-login; require email verification
            return { success: true };
        }
        return { success: false, error: result.error || 'Registration failed' };
    };

    const logout = async () => {
        await authService.logout();
        clearAuthToken();
        setUser(null);
    };

    const resendVerification = async (email: string) => {
        const result = await authService.resendVerification(email);
        if (result.success) return { success: true };
        return { success: false, error: result.error || 'Unable to resend verification' };
    };

    const verifyEmail = async (email: string, token: string) => {
        const result = await authService.verifyEmail(email, token);
        if (result.success && result.data) {
            setUser(result.data.user);
            return { 
                success: true, 
                onboardingStep: result.data.onboardingStep 
            };
        }
        return { success: false, error: result.error || 'Verification failed' };
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyEmail, logout, resendVerification }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
