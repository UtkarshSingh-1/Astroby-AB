"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      signIn(undefined, { callbackUrl: '/signin?redirectTo=/admin' });
      return;
    }
    const role = (session.user as any).role;
    if (role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [router, session, status]);

  if (status === 'loading') {
    return null;
  }

  return <>{children}</>;
}
