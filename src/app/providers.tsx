"use client";

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </SessionProvider>
  );
}
