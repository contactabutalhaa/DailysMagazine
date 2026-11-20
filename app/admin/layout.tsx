import type { Metadata } from 'next';
import { AdminProvider } from '@/components/admin/AdminContext';
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';

export const metadata: Metadata = {
  title: 'Dashboard ‹ DailysMagazine — WordPress-Style SEO & CMS',
  description: 'Enterprise Blog Content Management & Technical SEO Control Panel for DailysMagazine.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AdminProvider>
  );
}
