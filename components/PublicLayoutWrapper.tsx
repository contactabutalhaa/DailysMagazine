'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import TrendingTicker from '@/components/TrendingTicker';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import NewsletterModal from '@/components/NewsletterModal';
import { ModalProvider } from '@/components/ModalContext';

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ModalProvider>
      <Header />
      <TrendingTicker />
      <main className="flex-1">{children}</main>
      <Footer />
      <SearchModal />
      <NewsletterModal />
    </ModalProvider>
  );
}
