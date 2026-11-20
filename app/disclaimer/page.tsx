import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial Disclaimer | DailysMagazine',
  description: 'Editorial standards, informational disclaimers, external links disclosures, and advertising demarcations for DailysMagazine.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200/80 pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
            Editorial Transparency & Standards
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight">
            Editorial Disclaimer
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Published by DailysMagazine Editorial Board • Effective Date: November 2026
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
              1. General Informational and Educational Purpose
            </h2>
            <p>
              The articles, essays, commentary, podcasts, and data visualizations published on <strong>DailysMagazine</strong> (&ldquo;dailysmagazine.com&rdquo;) are intended solely for general journalistic, informational, cultural, and educational purposes. While our editorial desk enforces rigorous fact-checking standards, the perspectives shared represent the informed viewpoints of our contributors at the time of publication.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              2. Professional Advice Disclaimers (Financial, Medical, Legal)
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-sm text-amber-950">
                <strong>No Financial or Investment Advice:</strong> Articles published in our Business, Tech, and Ideas sections discussing venture capital, market trends, cryptocurrencies, public securities, or corporate valuations do not constitute registered investment, tax, or legal counsel. Consult a qualified fiduciary advisor before deploying capital.
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-sm text-emerald-950">
                <strong>No Medical or Health Advice:</strong> Dispatches in our Wellness and Climate sections addressing circadian rhythms, neuroscience, dietary protocols, or mental health practices are for informational discussion only and are not substitutes for professional clinical diagnosis or medical care. Always consult licensed medical practitioners.
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              3. Sponsored Content & Brand Demarcation
            </h2>
            <p>
              DailysMagazine maintains an uncompromising firewall between editorial judgment and commercial partnerships. Whenever a brand pays for a placement, that content is explicitly marked with typography such as <strong>&ldquo;Sponsored Editorial&rdquo;</strong>, <strong>&ldquo;Brand Partner&rdquo;</strong>, or <strong>&ldquo;Presented by&rdquo;</strong>. Our editorial team retains full veto authority over partner content to ensure it meets our intellectual standards.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              4. External Outbound Links
            </h2>
            <p>
              Articles on DailysMagazine frequently link to external third-party research journals, academic repositories, and external web resources for citation and provenance. DailysMagazine does not control, endorse, or accept legal liability for the content, security policies, or operational practices of any external third-party websites.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
              5. Corrections and Ethical Inquiries
            </h2>
            <p>
              When a factual error is discovered, DailysMagazine issues a prominent correction note at the top or bottom of the affected article detailing the change and date of amendment. To report potential inaccuracies, contact:
            </p>
            <div className="p-4 bg-slate-100 rounded-2xl text-sm font-semibold text-slate-800">
              Email: <a href="mailto:corrections@dailysmagazine.com" className="text-orange-600 underline">corrections@dailysmagazine.com</a>
              <br />
              Attn: Standards & Ethics Desk
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
