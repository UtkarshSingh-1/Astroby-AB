import MainLayout from '@/components/layout/MainLayout';
import Providers from '../providers';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <MainLayout>{children}</MainLayout>
    </Providers>
  );
}
