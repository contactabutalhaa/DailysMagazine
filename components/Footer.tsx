'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Mail, Check, Twitter, Linkedin, Instagram, Rss } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand Info + Quick Subscribe Bar */}
        <div className="pb-12 border-b border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <Logo variant="dark" size="md" href="/" />
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Fresh perspectives on culture, technology, modern living, and bold ideas—curated daily for the modern intellectual and conscious operator.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Subscribe Input */}
          <div className="lg:col-span-7 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                The Morning Dispatch
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-3">
              Receive our top 3 editorial deep dives every morning.
            </h4>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-sm font-semibold">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Thank you! You are subscribed to DailysMagazine dispatches.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for the daily briefing..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-500/20 shrink-0"
                >
                  Join 45,000+ Readers
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Categories */}
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/category/culture" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Culture
                </Link>
              </li>
              <li>
                <Link href="/category/lifestyle" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link href="/category/tech" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Tech
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: More Topics */}
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              More Topics
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/category/ideas" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Ideas
                </Link>
              </li>
              <li>
                <Link href="/category/design" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/category/climate" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Climate
                </Link>
              </li>
              <li>
                <Link href="/category/wellness" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Collaborate */}
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              Collaborate
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/write-for-us" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Write For Us & Pitch
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Advertise & Media Kit
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-orange-400 transition-colors">
                  About DailysMagazine
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Contact Editorial Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              Legal & Standards
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Editorial Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-orange-400 transition-colors">
                  Ethics & Fact-Checking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors flex items-center gap-1">
                  CMS Admin Dashboard &rarr;
                </Link>
              </li>
              <li className="pt-1 flex items-center gap-2 text-xs text-slate-500 font-mono">
                <a href="/sitemap.xml" target="_blank" className="hover:text-slate-300">sitemap</a>
                <span>&bull;</span>
                <a href="/robots.txt" target="_blank" className="hover:text-slate-300">robots</a>
                <span>&bull;</span>
                <a href="/llms.txt" target="_blank" className="hover:text-slate-300">llms.txt</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 DailysMagazine. All rights reserved. Designed for independent minds.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
