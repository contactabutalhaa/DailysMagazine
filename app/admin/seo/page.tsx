'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  FileText,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';

export default function SiteAuditDashboardPage() {
  const { seoAudit, posts, pages, showToast } = useAdmin();
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const errors = seoAudit.issues.filter((i) => i.type === 'error');
  const warnings = seoAudit.issues.filter((i) => i.type === 'warning');
  const notices = seoAudit.issues.filter((i) => i.type === 'info');

  const filteredIssues = seoAudit.issues.filter((issue) => {
    if (filterType === 'all') return true;
    return issue.type === filterType;
  });

  const handleRunAudit = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Technical SEO site audit refreshed!', 'success');
    }, 600);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 border-emerald-500';
    if (score >= 60) return 'text-amber-500 border-amber-500';
    return 'text-rose-500 border-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              Technical SEO Audit & Health
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Score: {seoAudit.overallScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated crawler diagnostics inspecting meta tags, orphan pages, broken structures, and indexability.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Crawling...' : 'Re-Run Audit'}
        </button>
      </div>

      {/* Top Health Gauge & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-extrabold text-xl ${getScoreColor(
              seoAudit.overallScore
            )}`}
          >
            {seoAudit.overallScore}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase">Health Score</h3>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {seoAudit.overallScore >= 80 ? 'Grade A - Optimized' : 'Grade B - Good'}
            </p>
            <p className="text-[11px] text-slate-400">Inspected {posts.length + pages.length} URLs</p>
          </div>
        </div>

        {/* Errors */}
        <button
          onClick={() => setFilterType('error')}
          className={`bg-white border rounded-xl p-5 shadow-xs text-left transition ${
            filterType === 'error' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-xs font-bold uppercase">Errors</span>
            <XCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{errors.length}</p>
          <p className="text-[11px] text-slate-400">Must fix immediately</p>
        </button>

        {/* Warnings */}
        <button
          onClick={() => setFilterType('warning')}
          className={`bg-white border rounded-xl p-5 shadow-xs text-left transition ${
            filterType === 'warning' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold uppercase">Warnings</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{warnings.length}</p>
          <p className="text-[11px] text-slate-400">Recommended improvements</p>
        </button>

        {/* Notices */}
        <button
          onClick={() => setFilterType('info')}
          className={`bg-white border rounded-xl p-5 shadow-xs text-left transition ${
            filterType === 'info' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-blue-500">
            <span className="text-xs font-bold uppercase">Notices</span>
            <HelpCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{notices.length}</p>
          <p className="text-[11px] text-slate-400">Optimization opportunities</p>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            filterType === 'all'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Issues ({seoAudit.issues.length})
        </button>
        <button
          onClick={() => setFilterType('error')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            filterType === 'error'
              ? 'bg-rose-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Errors ({errors.length})
        </button>
        <button
          onClick={() => setFilterType('warning')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            filterType === 'warning'
              ? 'bg-amber-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Warnings ({warnings.length})
        </button>
        <button
          onClick={() => setFilterType('info')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            filterType === 'info'
              ? 'bg-blue-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Notices ({notices.length})
        </button>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-400 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">Zero issues in this category!</p>
            <p className="text-xs">Your magazine fulfills all technical search guidelines for this criterion.</p>
          </div>
        ) : (
          filteredIssues.map((issue, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {issue.type === 'error' ? (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  ) : issue.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  )}

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{issue.message}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Category:{' '}
                      <span className="font-semibold text-slate-700 uppercase">
                        {issue.category}
                      </span>{' '}
                      &bull; Impact: <span className="font-medium text-slate-600">{issue.type.toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap border border-slate-200/60">
                  {issue.affectedUrls.length} affected
                </span>
              </div>

              {/* Affected URLs list */}
              {issue.affectedUrls.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Sample Affected URLs:
                  </span>
                  <div className="space-y-1">
                    {issue.affectedUrls.slice(0, 4).map((url, uIdx) => (
                      <div
                        key={uIdx}
                        className="flex items-center justify-between p-2 rounded bg-slate-50 font-mono text-[11px] border border-slate-200/60"
                      >
                        <span className="text-slate-700 truncate">{url}</span>
                        <Link
                          href={url.startsWith('/') ? `/admin/posts` : url}
                          className="text-orange-600 hover:text-orange-700 font-sans font-semibold inline-flex items-center gap-1 shrink-0 ml-2"
                        >
                          Resolve <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
