'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Users, Mail, Eye, CheckCircle2, Send, Download, Sparkles, Building2 } from 'lucide-react';

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    budgetRange: '$5,000 - $10,000',
    campaignGoals: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('DailysMagazine 2026 Media Kit downloaded successfully!');
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white pt-20 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/30">
            <Building2 className="w-3.5 h-3.5" />
            Partnerships & Media Kit
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            Connect With 450,000+ Discerning Minds.
          </h1>
          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            DailysMagazine connects ambitious, mission-driven brands with high-intent thinkers, founders, and cultural leaders who value craftsmanship and ideas.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#inquiry-form"
              className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-600/30"
            >
              Request Partnership Proposal
            </a>
            <button
              onClick={handleDownload}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-slate-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>{downloading ? 'Preparing Kit...' : 'Download Media Kit (PDF)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Audience Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Readers</span>
              <Eye className="w-4 h-4 text-orange-500" />
            </div>
            <h3 className="font-heading font-extrabold text-3xl text-slate-900">450K+</h3>
            <p className="text-xs text-slate-500 mt-1">Unique readers across North America & Europe</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Newsletter</span>
              <Mail className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-heading font-extrabold text-3xl text-slate-900">45,000+</h3>
            <p className="text-xs text-slate-500 mt-1">42% average open rate on weekday dispatches</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Audience Profile</span>
              <Users className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-heading font-extrabold text-3xl text-slate-900">82%</h3>
            <p className="text-xs text-slate-500 mt-1">Founders, operators, directors, and researchers</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Dwell Time</span>
              <BarChart3 className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="font-heading font-extrabold text-3xl text-slate-900">4.2 min</h3>
            <p className="text-xs text-slate-500 mt-1">High attention reader immersion and deep scrolls</p>
          </div>
        </div>
      </section>

      {/* Sponsorship Formats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
            Tailored Collaborations
          </span>
          <h2 className="font-heading font-extrabold text-3xl text-slate-900">
            Sponsorship & Campaign Formats
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            We build native, brand-respecting placements that inform our audience rather than distracting them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-orange-300 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider block mb-2">
                Format 01
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                Sponsored Editorial Feature
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A custom deep-dive essay crafted by our brand studio highlighting your industry thesis and technological vision.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
              Includes native homepage & category placement
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-orange-300 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider block mb-2">
                Format 02
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                Newsletter Header Takeover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exclusive top-of-dispatch placement delivered to 45,000+ verified executive and creator inboxes every morning.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
              Guaranteed 18,000+ unique opens per drop
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-orange-300 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider block mb-2">
                Format 03
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                Category Exclusive Pillar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Become the presenting partner for an entire editorial category (e.g. Climate, Tech, or Business) for 30 days.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
              100% Share-of-Voice across pillar archive
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-orange-300 transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider block mb-2">
                Format 04
              </span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                Brand Spotlight Series
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A 3-part investigative interview package showcasing your founder&apos;s story and breakthrough product innovation.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
              Syndicated across web and social channels
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Media Kit & Inquiry Form */}
      <section id="inquiry-form" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Inquiry Received!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Our partnerships director will review <strong className="text-slate-900">{formData.companyName}</strong>&apos;s goals and share our media deck and rate card to <strong className="text-slate-900">{formData.workEmail}</strong> within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  Partnerships & Brand Desk
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                  Request a Media Kit & Custom Proposal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tell us about your brand goals. We formulate bespoke campaign packages aligned with your target demographics.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Alexander Hamilton"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Lumina Technologies"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Estimated Campaign Budget *
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    >
                      <option value="$2,500 - $5,000">$2,500 – $5,000 (Newsletter Drop)</option>
                      <option value="$5,000 - $10,000">$5,000 – $10,000 (Sponsored Feature)</option>
                      <option value="$10,000 - $25,000">$10,000 – $25,000 (Multi-Channel Campaign)</option>
                      <option value="$25,000+">$25,000+ (Category Pillar Presenting Sponsor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Campaign Goals & Target Pillar *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.campaignGoals}
                    onChange={(e) => setFormData({ ...formData, campaignGoals: e.target.value })}
                    placeholder="Tell us what you want to achieve (e.g. brand awareness for our series A, driving developer signups, promoting executive thought leadership)..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Transmit Inquiry to Partnerships Desk</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Direct email: <a href="mailto:partners@dailysmagazine.com" className="text-orange-600 underline">partners@dailysmagazine.com</a>. We reply within one business day.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
