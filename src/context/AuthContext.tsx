"use client";

import React, { createContext, useContext, type ReactNode } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  verifySignupOTP: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  sendPasswordResetOTP: (email: string) => Promise<{ success: boolean; message?: string }>;
  verifyPasswordResetOTP: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: () => Promise<{ success: boolean; message?: string; user?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const mappedUser: User | null = session?.user
    ? {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || undefined,
        image: session.user.image || undefined,
        role: (session.user.role || 'USER') as User['role'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : null;

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, message: result.error };
    }
    return { success: true, user: mappedUser || undefined };
  };

  const googleLogin = async () => {
    // Ensure we don't try to link while an old session is active.
    await signOut({ redirect: false });
    await signIn('google', { prompt: 'select_account', callbackUrl: '/dashboard' });
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string) => {
    const res = await fetch('/api/auth/otp/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to send OTP' };
    }
    return { success: true, message: data.message };
  };

  const verifySignupOTP = async (email: string, otp: string) => {
    const res = await fetch('/api/auth/otp/signup/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data.message || 'Invalid OTP' };
    }
    return { success: true, message: data.message };
  };

  const sendPasswordResetOTP = async (email: string) => {
    const res = await fetch('/api/auth/otp/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to send OTP' };
    }
    return { success: true, message: data.message };
  };

  const verifyPasswordResetOTP = async (email: string, otp: string) => {
    const res = await fetch('/api/auth/otp/reset/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) {
      return false;
    }
    return true;
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const res = await fetch('/api/auth/otp/reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to reset password' };
    }
    return { success: true, message: data.message };
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const value: AuthContextType = {
    user: mappedUser,
    token: null,
    isAuthenticated: !!mappedUser,
    isAdmin: mappedUser?.role === 'ADMIN',
    isLoading: status === 'loading',
    login,
    signup,
    verifySignupOTP,
    logout,
    sendPasswordResetOTP,
    verifyPasswordResetOTP,
    resetPassword,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
