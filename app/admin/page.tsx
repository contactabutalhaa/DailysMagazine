'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  ShieldCheck,
  Globe,
  AlertTriangle,
  Plus,
  ExternalLink,
  Edit,
  TrendingUp,
  Sparkles,
  RefreshCw,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';

export default function AdminDashboardPage() {
  const { posts, pages, notFoundLogs, seoAudit, savePost, showToast, pingIndexNow } = useAdmin();

  // Quick Draft State
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  // Computed metrics
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft' || p.status === 'scheduled').length;
  const indexableCount = posts.filter((p) => !p.seo.noindex).length + pages.filter((p) => !p.seo.noindex).length;
  const noindexCount = posts.filter((p) => p.seo.noindex).length + pages.filter((p) => p.seo.noindex).length;
  const notFoundCount = notFoundLogs.reduce((acc, curr) => acc + curr.hits, 0);

  const handleQuickDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) {
      showToast('Please enter a title for the quick draft', 'error');
      return;
    }
    setIsSubmittingDraft(true);
    try {
      const newPost = savePost({
        title: draftTitle,
        content: `<p>${draftContent}</p>`,
        excerpt: draftContent.slice(0, 140),
        status: 'draft',
      });
      setDraftTitle('');
      setDraftContent('');
      showToast(`Draft "${newPost.title}" saved successfully!`, 'success');
    } catch {
      showToast('Failed to save draft', 'error');
    } finally {
      setIsSubmittingDraft(false);
    }
  };

  const handlePingNow = async () => {
    setIsPinging(true);
    await pingIndexNow();
    setIsPinging(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner - Clean Editorial Light */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200/70 uppercase tracking-wider">
              WordPress-Style CMS + SEO Suite
            </span>
            <span className="text-xs text-slate-400 font-medium">DailysMagazine v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
            Editorial & Technical SEO Control Center
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Monitor real-time editorial output, automated on-page schema verification, and technical crawler health for{' '}
            <code className="text-orange-600 bg-orange-50 border border-orange-200/60 px-1.5 py-0.5 rounded text-xs font-mono font-medium">
              dailysmagazine.com
            </code>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={handlePingNow}
            disabled={isPinging}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isPinging ? 'animate-spin' : ''}`} />
            {isPinging ? 'Pinging...' : 'Ping IndexNow'}
          </button>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition"
          >
            <Plus className="w-4 h-4" />
            New Editorial Post
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Published Posts */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Posts</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{publishedCount}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% Live
            </span>
          </div>
          <Link
            href="/admin/posts?status=published"
            className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
          >
            View published &rarr;
          </Link>
        </div>

        {/* Drafts & Scheduled */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Drafts & Scheduled</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{draftCount}</span>
            <span className="text-xs text-slate-400">in pipeline</span>
          </div>
          <Link
            href="/admin/posts?status=draft"
            className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
          >
            Review drafts &rarr;
          </Link>
        </div>

        {/* SEO Health Score */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Site SEO Score</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold ${
                seoAudit.overallScore >= 80
                  ? 'text-emerald-600'
                  : seoAudit.overallScore >= 60
                  ? 'text-amber-500'
                  : 'text-red-500'
              }`}
            >
              {seoAudit.overallScore}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {seoAudit.overallScore >= 85 ? 'Optimized' : 'Good'}
            </span>
          </div>
          <Link
            href="/admin/seo"
            className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
          >
            Audit breakdown &rarr;
          </Link>
        </div>

        {/* Indexed URLs */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Indexed vs Noindex</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{indexableCount}</span>
            <span className="text-xs text-slate-400">({noindexCount} noindex)</span>
          </div>
          <Link
            href="/admin/seo/sitemaps"
            className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
          >
            Sitemap inspect &rarr;
          </Link>
        </div>

        {/* 404 Errors */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">404 Hits Logged</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{notFoundCount}</span>
            <span className="text-xs text-rose-500 font-medium">
              {notFoundLogs.length} paths
            </span>
          </div>
          <Link
            href="/admin/seo/redirects"
            className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
          >
            Fix with 301 &rarr;
          </Link>
        </div>
      </div>

      {/* Main Grid: Left (Recent Posts & Quick Draft), Right (SEO Checklist & Schema Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Posts Table */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Articles & SEO Scores</h2>
                <p className="text-xs text-slate-500">Latest published and modified editorial entries</p>
              </div>
              <Link
                href="/admin/posts"
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
              >
                All Posts ({posts.length}) &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="py-2.5 px-4">Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Author</th>
                    <th className="py-2.5 px-3 text-center">SEO Score</th>
                    <th className="py-2.5 px-3 text-center">Index</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {posts.slice(0, 7).map((post) => {
                    const score = post.seo.seoScore || 85;
                    const scoreBg =
                      score >= 80
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : score >= 60
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200';

                    return (
                      <tr key={post.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="font-semibold text-slate-900 hover:text-orange-600 line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span>/{post.slug}</span>
                            <span>&bull;</span>
                            <span>{new Date(post.publishedAt || post.updatedAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {post.author?.name || post.authorName}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${scoreBg}`}>
                            {score}/100
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {post.seo.noindex ? (
                            <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                              noindex
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              index
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/admin/posts/${post.id}`}
                              className="p-1 hover:text-orange-600 text-slate-400 hover:bg-slate-100 rounded transition"
                              title="Edit post"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/${post.category || 'culture'}/${post.slug}`}
                              target="_blank"
                              className="p-1 hover:text-blue-600 text-slate-400 hover:bg-slate-100 rounded transition"
                              title="View on site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Draft Widget (WordPress Style) */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Quick Draft
              </h3>
              <span className="text-xs text-slate-400">Save thoughts immediately</span>
            </div>
            <form onSubmit={handleQuickDraftSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Draft Title..."
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 transition"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="What's on your mind? Write a quick outline or paragraph..."
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 resize-none transition"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Drafts are saved with noindex until published.</span>
                <button
                  type="submit"
                  disabled={isSubmittingDraft || !draftTitle.trim()}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition shadow-xs"
                >
                  {isSubmittingDraft ? 'Saving...' : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (1 col): Technical SEO Checklist & Quick Tools */}
        <div className="space-y-6">
          {/* Technical SEO Checklist Widget */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Technical SEO Checklist
              </h3>
              <Link href="/admin/seo" className="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                Full Audit &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {seoAudit.issues.slice(0, 6).map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    issue.type === 'error'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : issue.type === 'warning'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-blue-50/70 border-blue-200 text-blue-900'
                  }`}
                >
                  {issue.type === 'error' ? (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  ) : issue.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{issue.message}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{issue.affectedUrls.length} affected URLs</span>
                      {issue.affectedUrls[0] && (
                        <Link
                          href={issue.affectedUrls[0]}
                          className="font-semibold text-orange-600 underline hover:no-underline text-[11px]"
                        >
                          Resolve &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Technical SEO Shortcuts */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Direct SEO Endpoints</h3>
            <p className="text-xs text-slate-500">Live dynamic route feeds generated by the CMS:</p>

            <div className="space-y-2 text-xs">
              <a
                href="/robots.txt"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 border border-slate-200/70 hover:border-orange-200 text-slate-700 hover:text-orange-700 transition"
              >
                <span className="font-mono font-medium">/robots.txt</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="/sitemap.xml"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 border border-slate-200/70 hover:border-orange-200 text-slate-700 hover:text-orange-700 transition"
              >
                <span className="font-mono font-medium">/sitemap.xml</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="/post-sitemap.xml"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 border border-slate-200/70 hover:border-orange-200 text-slate-700 hover:text-orange-700 transition"
              >
                <span className="font-mono font-medium">/post-sitemap.xml</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="/llms.txt"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 border border-slate-200/70 hover:border-orange-200 text-slate-700 hover:text-orange-700 transition"
              >
                <span className="font-mono font-medium">/llms.txt</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="/ads.txt"
                target="_blank"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50 border border-slate-200/70 hover:border-orange-200 text-slate-700 hover:text-orange-700 transition"
              >
                <span className="font-mono font-medium">/ads.txt</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
