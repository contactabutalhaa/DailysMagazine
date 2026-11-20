'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PenTool, CheckCircle, AlertCircle, Sparkles, Send, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { CategorySlug } from '@/types';

export default function WriteForUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'culture' as CategorySlug,
    proposedHeadline: '',
    pitchSummary: '',
    sampleUrl: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      category: 'culture',
      proposedHeadline: '',
      pitchSummary: '',
      sampleUrl: '',
    });
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200/80 pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
            <PenTool className="w-3.5 h-3.5" />
            Contributor Guidelines & Pitches
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight">
            Write For DailysMagazine.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We are always seeking sharp, provocative essays, field investigations, and original cultural commentary from independent journalists and specialists worldwide.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-16">
        {/* Editorial Standards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              What We Look For
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Original Thesis:</strong> Articles must advance a novel perspective rather than summarizing existing consensus.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Primary Reporting:</strong> Direct interviews, on-the-ground observations, or rigorous analysis of fresh research.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Clarity & Voice:</strong> Accessible, evocative prose free of academic jargon and corporate buzzwords.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Word Length:</strong> Deep dives typically range between 1,200 and 2,500 words.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              What We Reject
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Automated AI Content:</strong> All submissions must be 100% human-crafted and fact-checked.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Commercial PR / Sponsored Pitches:</strong> If you represent a brand or client, consult our <Link href="/advertise" className="text-orange-600 underline">Advertising Desk</Link>.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Generic Listicles:</strong> &ldquo;10 Tools to Boost Your Day&rdquo; will be politely declined.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Simultaneous Submissions:</strong> We require a 7-day exclusive review window.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Categories We Accept */}
        <section className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200">
          <div className="max-w-2xl mb-6">
            <h3 className="font-heading font-extrabold text-2xl text-slate-900 mb-2">
              Topics Open For Commissioning
            </h3>
            <p className="text-slate-600 text-sm">
              We commission articles across our 8 core editorial pillars. Competitive rates are paid upon acceptance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.values(CATEGORIES).map((cat) => (
              <div
                key={cat.slug}
                className="p-3.5 rounded-xl bg-white border border-slate-200 text-center font-bold text-xs text-slate-800 shadow-sm"
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-1.5`} style={{ backgroundColor: cat.accentHex }} />
                {cat.name}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Pitch Submission Form */}
        <section id="pitch-form" className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-3xl mx-auto">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Pitch Received Successfully!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for pitching <strong className="text-slate-900">&ldquo;{formData.proposedHeadline}&rdquo;</strong>. Our commissioning editors review submissions every Tuesday and Thursday. You will hear back within 5 business days at <strong className="text-slate-900">{formData.email}</strong>.
              </p>
              <div className="pt-6">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Submit Another Pitch
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  Editorial Submission Desk
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                  Submit Your Article Pitch
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Please outline your thesis, target category, and include a link to your previous published work, or email your pitch directly to{' '}
                  <a href="mailto:lucamarvass@gmail.com" className="text-orange-600 underline font-semibold">
                    lucamarvass@gmail.com
                  </a>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jessica Morales"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Category Pillar *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategorySlug })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  >
                    {Object.values(CATEGORIES).map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} — {cat.tagline}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Proposed Headline / Working Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.proposedHeadline}
                    onChange={(e) => setFormData({ ...formData, proposedHeadline: e.target.value })}
                    placeholder="e.g. The Quiet Revolution in High-Altitude Timber Architecture"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pitch Summary & Thesis (200 - 400 words) *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.pitchSummary}
                    onChange={(e) => setFormData({ ...formData, pitchSummary: e.target.value })}
                    placeholder="Explain the central question of your story, what new insight it brings to our readers, who you plan to interview, and why this story matters right now..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Writing Sample / Portfolio URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.sampleUrl}
                    onChange={(e) => setFormData({ ...formData, sampleUrl: e.target.value })}
                    placeholder="https://yourportfolio.com or link to a published clip"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>{submitting ? 'Submitting Pitch...' : 'Transmit Pitch to Editorial Board'}</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  We reply to every serious pitch within 5 business days. You can also email your full outline or draft directly to{' '}
                  <a href="mailto:lucamarvass@gmail.com" className="text-orange-600 underline font-semibold">
                    lucamarvass@gmail.com
                  </a>. We do not accept sponsored content through this form.
                </p>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
