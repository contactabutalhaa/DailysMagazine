'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { useModals } from './ModalContext';

export default function FullWidthNewsletterBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { openNewsletter } = useModals();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
    }, 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl">
        {/* Glow backdrop circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Essential Daily Reading</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            Start Your Morning <span className="text-orange-500">Smarter</span>.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Join <span className="font-bold text-white">45,000+ readers</span> getting DailysMagazine&apos;s daily digest. Fresh essays, bold cultural dispatches, and tech analyses delivered to your inbox every morning at 7 AM.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-400 text-sm font-bold shadow-lg animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>You&apos;re officially on the list! Welcome to DailysMagazine.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-orange-600/30 shrink-0 flex items-center justify-center gap-2"
              >
                <span>Get Dispatches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              100% Free • No Spam Ever
            </span>
            <span>•</span>
            <span>Unsubscribe anytime with 1 click</span>
            <span>•</span>
            <button
              type="button"
              onClick={openNewsletter}
              className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-4"
            >
              Customize Topic Preferences
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
