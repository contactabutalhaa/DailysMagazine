import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | DailysMagazine',
  description: 'Privacy Policy and data governance standards for readers and subscribers of DailysMagazine (dailysmagazine.com).',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200/80 pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            Data Protection & Reader Rights
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Effective Date: November 1, 2026 • Last Updated: November 19, 2026
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to DailysMagazine Home</span>
          </Link>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed text-[16px]">
          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              1. Our Foundational Privacy Pledge
            </h2>
            <p>
              At <strong>DailysMagazine</strong> (&ldquo;dailysmagazine.com&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we believe that reading journalism should never require surrendering your personal autonomy. We design our publication with aggressive data-minimization principles: we do not trade, sell, or rent your personal identity to programmatic data brokers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              2. Information We Collect
            </h2>
            <p>We only collect data that is strictly necessary to deliver high-quality editorial experiences:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Newsletter Subscription Data:</strong> When you subscribe to our daily morning dispatch, we store your email address and stated category preferences. You can update your preferences or unsubscribe at any time with one click.
              </li>
              <li>
                <strong>Contributor & Inquiry Submissions:</strong> Information provided via our &ldquo;Write For Us&rdquo;, &ldquo;Advertise&rdquo;, or &ldquo;Contact&rdquo; forms (name, professional email, pitch content, portfolio URLs) is utilized solely for editorial evaluation.
              </li>
              <li>
                <strong>Aggregated Web Telemetry:</strong> We collect privacy-respecting, anonymized telemetry (pageviews, browser family, approximate country-level geolocation, and referrers) to measure article interest and maintain platform security.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              3. Cookies and Local Storage
            </h2>
            <p>
              DailysMagazine utilizes minimal functional cookies to remember your session state, reading progress, and local user interface preferences. We do not deploy intrusive third-party cross-site behavioral tracking beacons or finger-printing scripts.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              4. Third-Party Service Providers
            </h2>
            <p>
              To maintain our technical infrastructure, we partner with reputable cloud and communications infrastructure vendors who are bound by strict data processing agreements:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Hosting & Content Delivery: Next.js edge infrastructure and global CDN caching.</li>
              <li>Newsletter Delivery: Encrypted transactional email service providers complying with CAN-SPAM and GDPR mandates.</li>
              <li>Form Processing: Secure endpoints utilizing TLS 1.3 cryptographic transport.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              5. Your Global Reader Rights (GDPR & CCPA/CPRA)
            </h2>
            <p>
              Regardless of your geographical residence, DailysMagazine extends universal data sovereignty rights to all readers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Right to Access & Portability</h4>
                <p className="text-xs text-slate-600">Request an export of all personal data tied to your email address.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Right to Total Erasure</h4>
                <p className="text-xs text-slate-600">Demand the permanent purging of your email and inquiry records from our databases.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              6. Contacting the Data Protection Officer
            </h2>
            <p>
              If you have inquiries, audit requests, or wish to exercise your statutory privacy rights, contact our Data Governance Officer at:
            </p>
            <div className="p-4 bg-slate-100 rounded-2xl text-sm font-semibold text-slate-800">
              Email: <a href="mailto:privacy@dailysmagazine.com" className="text-orange-600 underline">privacy@dailysmagazine.com</a>
              <br />
              Subject: Privacy Inquiries & Reader Data Request
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
