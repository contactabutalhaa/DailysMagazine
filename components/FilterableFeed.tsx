'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import ArticleCard from './ArticleCard';
import { ARTICLES, getMustReadArticles } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { CategorySlug } from '@/types';
import { useModals } from './ModalContext';

const FILTER_TABS: { label: string; slug: CategorySlug | 'all' }[] = [
  { label: 'All Stories', slug: 'all' },
  { label: 'Culture', slug: 'culture' },
  { label: 'Lifestyle', slug: 'lifestyle' },
  { label: 'Tech', slug: 'tech' },
  { label: 'Business', slug: 'business' },
  { label: 'Ideas', slug: 'ideas' },
  { label: 'Design', slug: 'design' },
  { label: 'Climate', slug: 'climate' },
  { label: 'Wellness', slug: 'wellness' },
];

export default function FilterableFeed() {
  const [activeFilter, setActiveFilter] = useState<CategorySlug | 'all'>('all');
  const [sidebarEmail, setSidebarEmail] = useState('');
  const [sidebarSuccess, setSidebarSuccess] = useState(false);
  const { openNewsletter } = useModals();

  const mustReadArticles = getMustReadArticles().slice(0, 4);

  const filteredArticles =
    activeFilter === 'all'
      ? ARTICLES
      : ARTICLES.filter((article) => article.category === activeFilter);

  const handleSidebarSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarEmail || !sidebarEmail.includes('@')) return;
    setSidebarSuccess(true);
    setTimeout(() => {
      setSidebarEmail('');
    }, 2500);
  };

  return (
    <section className="py-12 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                Explore The Desk
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Curated Stories & Deep Inquiries
            </h2>
          </div>

          <p className="text-xs text-slate-500 font-semibold">
            Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'}
          </p>
        </div>

        {/* 8 cols / 4 cols Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Interactive Filter Pills + Article Grid */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filter Pill Navigation Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.slug;
                return (
                  <button
                    key={tab.slug}
                    onClick={() => setActiveFilter(tab.slug)}
                    className={`relative px-4 py-2 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'text-white shadow-sm'
                        : 'text-slate-600 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilterPill"
                        className="absolute inset-0 bg-slate-900 rounded-full z-0"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3-Column Clean Article Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ArticleCard article={article} showExcerpt={true} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column (4 cols): Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* "MUST READ" Ranked Widget */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
                    Must Read Stories
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-orange-600">
                  Editor&apos;s Pick
                </span>
              </div>

              <div className="space-y-4">
                {mustReadArticles.map((article, idx) => {
                  const cat = CATEGORIES[article.category];
                  return (
                    <Link
                      key={article.id}
                      href={`/${article.category}/${article.slug}`}
                      className="group flex gap-3.5 items-start pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      {/* Number Rank */}
                      <span className="font-heading font-extrabold text-2xl text-slate-300 group-hover:text-orange-500 transition-colors w-7 shrink-0">
                        0{idx + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              cat?.color || 'text-slate-600'
                            }`}
                          >
                            {article.categoryName}
                          </span>
                          <span className="text-slate-300 text-xs">•</span>
                          <span className="text-[11px] text-slate-400">
                            {article.readTime}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {article.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Compact Sidebar Newsletter Box */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-card border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
              <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                The Morning Dispatch
              </div>
              <h3 className="font-heading font-extrabold text-xl leading-tight mb-2">
                Get smarter in just five minutes.
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Delivering crisp, original insights on tech, culture, and design directly to your inbox every morning at 7 AM.
              </p>

              {sidebarSuccess ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>You&apos;re subscribed! First briefing arrives tomorrow.</span>
                </div>
              ) : (
                <form onSubmit={handleSidebarSubscribe} className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={sidebarEmail}
                      onChange={(e) => setSidebarEmail(e.target.value)}
                      placeholder="Your email address..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/20"
                  >
                    Subscribe Free
                  </button>
                </form>
              )}

              <p className="text-[10px] text-slate-400 text-center mt-3">
                No spam ever. 1-click unsubscribe anytime.
              </p>
            </div>

            {/* Quick Links Widget */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">
                Participate in DailysMagazine
              </h4>
              <div className="space-y-2 text-xs font-semibold">
                <Link
                  href="/write-for-us"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-700 transition-colors"
                >
                  <span>Submit an Editorial Pitch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/advertise"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-700 transition-colors"
                >
                  <span>Download Media Kit 2026</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
