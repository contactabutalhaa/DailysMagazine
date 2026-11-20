'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useModals } from './ModalContext';

export default function NewsletterModal() {
  const { isNewsletterOpen, closeNewsletter } = useModals();
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState<string[]>([
    'Culture & Arts',
    'Tech & Ideas',
    'Modern Lifestyle',
    'Climate & Science',
  ]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    if (isNewsletterOpen) {
      document.body.style.overflow = 'hidden';
      setStatus('idle');
      setEmail('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isNewsletterOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNewsletterOpen) {
        closeNewsletter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewsletterOpen, closeNewsletter]);

  const toggleTopic = (topic: string) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 700);
  };

  return (
    <AnimatePresence>
      {isNewsletterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNewsletter}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
          >
            {/* Close button */}
            <button
              onClick={closeNewsletter}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {status === 'success' ? (
              <div className="p-8 text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2 font-heading">
                  Welcome to DailysMagazine!
                </h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto mb-6">
                  We&apos;ve sent a confirmation to <span className="font-semibold text-slate-900">{email}</span>. Your first curated daily briefing arrives at 7:00 AM tomorrow.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  Free forever. Zero spam. One-click unsubscribe.
                </div>
                <div className="mt-8">
                  <button
                    onClick={closeNewsletter}
                    className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-orange-500/20"
                  >
                    Back to Reading Stories
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header banner */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold tracking-wider uppercase mb-3 border border-orange-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    Morning Editorial Dispatch
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading leading-tight">
                    Start Your Morning <span className="text-orange-400">Smarter</span>.
                  </h3>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                    Join 45,000+ founders, thinkers, designers, and cultural leaders receiving our 5-minute weekday briefing.
                  </p>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Tailor Your Interests
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Culture & Arts',
                        'Tech & Ideas',
                        'Modern Lifestyle',
                        'Climate & Science',
                      ].map((topic) => {
                        const checked = topics.includes(topic);
                        return (
                          <button
                            type="button"
                            key={topic}
                            onClick={() => toggleTopic(topic)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                              checked
                                ? 'bg-orange-50 border-orange-300 text-orange-800 font-semibold shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span>{topic}</span>
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                                checked
                                  ? 'bg-orange-600 border-orange-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {checked && '✓'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="modal-email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="modal-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{status === 'submitting' ? 'Subscribing...' : 'Get Free Morning Dispatch'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>No advertising trackers. Unsubscribe at any time with one click.</span>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
