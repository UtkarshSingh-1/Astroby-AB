import AdminLayout from '@/components/layout/AdminLayout';
import AdminGuard from './guard';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Providers from '../../providers';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user) {
    redirect('/signin?redirectTo=/admin');
  }
  if (role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <Providers>
      <AdminGuard>
        <AdminLayout>{children}</AdminLayout>
      </AdminGuard>
    </Providers>
  );
}
