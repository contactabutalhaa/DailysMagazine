'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Plus,
  Zap,
  RefreshCw,
  ChevronDown,
  Activity,
  FileText,
  FolderPlus,
  Sparkles,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from './AdminContext';

export default function AdminTopBar() {
  const {
    seoAudit,
    purgeCache,
    pingIndexNow,
    showToast,
  } = useAdmin();

  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [purging, setPurging] = useState(false);
  const [pinging, setPinging] = useState(false);

  const handlePurge = async () => {
    setPurging(true);
    await purgeCache();
    setPurging(false);
  };

  const handlePing = async () => {
    setPinging(true);
    await pingIndexNow();
    setPinging(false);
  };

  const scoreBadgeColor =
    seoAudit.overallScore >= 80
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : seoAudit.overallScore >= 60
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <header className="sticky top-0 z-50 h-12 bg-white text-slate-800 border-b border-slate-200/90 flex items-center justify-between px-3 sm:px-5 text-xs font-medium select-none shadow-xs">
      {/* Left: Brand + Quick Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Brand mark */}
        <Link
          href="/admin"
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          title="DailysMagazine Admin Dashboard"
        >
          <span className="w-5 h-5 rounded-md bg-orange-500 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
            D
          </span>
          <span className="font-heading font-extrabold tracking-tight text-sm text-slate-900">
            Dailys<span className="text-orange-500 font-extrabold">Magazine</span>
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 uppercase tracking-wide">
              CMS
            </span>
          </span>
        </Link>

        <span className="h-4 w-px bg-slate-200" />

        {/* View Live Site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
          title="Open public magazine in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600" />
          <span className="hidden sm:inline font-semibold">View Live Site</span>
        </Link>

        {/* "+ New" Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNewMenuOpen(!newMenuOpen)}
            onBlur={() => setTimeout(() => setNewMenuOpen(false), 200)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80 bg-slate-50/70"
          >
            <Plus className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-semibold">New</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {newMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-orange-500" />
                <span>New Article Post</span>
              </Link>
              <Link
                href="/admin/pages/new"
                className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>New Page</span>
              </Link>
              <Link
                href="/admin/posts/categories"
                className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
              >
                <FolderPlus className="w-3.5 h-3.5 text-emerald-500" />
                <span>Category</span>
              </Link>
              <Link
                href="/admin/media"
                className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Upload Media</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right: SEO Health Score + Cache Purge + IndexNow + Profile */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* SEO Health Badge */}
        <Link
          href="/admin/seo"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-tight hover:shadow-xs transition-all ${scoreBadgeColor}`}
          title="Overall Site SEO Health Score. Click to inspect full audit report."
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SEO Health: {seoAudit.overallScore}/100</span>
        </Link>

        {/* Purge Cache Button */}
        <button
          onClick={handlePurge}
          disabled={purging}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80 bg-white"
          title="Purge Varnish/CDN Edge Cache & rebuild dynamic sitemaps"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${purging ? 'animate-spin text-orange-500' : ''}`} />
          <span>{purging ? 'Purging...' : 'Purge Cache'}</span>
        </button>

        {/* Ping IndexNow Button */}
        <button
          onClick={handlePing}
          disabled={pinging}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold transition-all shadow-xs"
          title="Notify search engines (Bing, IndexNow) of recent updates"
        >
          <Zap className={`w-3.5 h-3.5 text-white ${pinging ? 'animate-bounce' : ''}`} />
          <span>{pinging ? 'Pinging...' : 'Ping IndexNow'}</span>
        </button>

        {/* Admin Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            onBlur={() => setTimeout(() => setProfileMenuOpen(false), 200)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
              EV
            </div>
            <span className="hidden xl:inline text-slate-800 text-xs font-semibold">
              Elena Vance
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {profileMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                <p className="font-bold text-slate-900 text-xs">Elena Vance</p>
                <p className="text-[11px] text-slate-400">Editor-in-Chief & Lead Critic</p>
              </div>
              <Link
                href="/admin/authors"
                className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
              >
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span>Author E-E-A-T Profile</span>
              </Link>
              <button
                onClick={() => showToast('Session locked. Re-authenticate when required.', 'info')}
                className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors font-medium"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
