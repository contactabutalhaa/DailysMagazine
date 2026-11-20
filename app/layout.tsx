import type { Metadata } from 'next';
import './globals.css';
import PublicLayoutWrapper from '@/components/PublicLayoutWrapper';
import { cmsStore } from '@/lib/cms-store';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema-generator';

export function generateMetadata(): Metadata {
  const seo = cmsStore.getTechnicalSeoSettings();
  const v = seo.webmasterVerification;

  return {
    title: 'DailysMagazine | Fresh Perspectives, Bold Ideas & Modern Living',
    description:
      'DailysMagazine (dailysmagazine.com) is a modern digital publication delivering crisp editorial journalism across culture, lifestyle, technology, business, ideas, design, climate, and wellness.',
    metadataBase: new URL('https://dailysmagazine.com'),
    keywords: [
      'DailysMagazine',
      'Culture',
      'Lifestyle',
      'Tech',
      'Business',
      'Ideas',
      'Design',
      'Climate',
      'Wellness',
      'Editorial Magazine',
    ],
    authors: [{ name: 'DailysMagazine Editorial Board' }],
    openGraph: {
      title: 'DailysMagazine — Fresh Perspectives & Modern Inquiries',
      description: 'Curated daily journalism on culture, technology, and intentional modern living.',
      url: 'https://dailysmagazine.com',
      siteName: 'DailysMagazine',
      type: 'website',
    },
    verification: {
      google: v.googleSiteVerification,
      other: {
        'msvalidate.01': v.bingVerification,
        'yandex-verification': v.yandexVerification,
        'p:domain_verify': v.pinterestVerification,
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = cmsStore.getTechnicalSeoSettings().globalSchema;
  const orgJson = generateOrganizationSchema(globalSchema);
  const webSiteJson = generateWebSiteSchema(globalSchema);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJson) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-body selection:bg-orange-100 selection:text-orange-900">
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
