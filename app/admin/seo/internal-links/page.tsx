'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Link as LinkIcon,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText,
  Zap,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { CmsPost } from '@/types/admin';

export default function InternalLinksPage() {
  const { posts, showToast } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterOrphansOnly, setFilterOrphansOnly] = useState(false);

  // Computed internal link data
  // Incoming links count estimation based on keywords and cross-references
  const postsWithLinkMetrics = posts.map((post) => {
    // Count how many other posts mention this post's slug or focusKeyword
    const incomingCount = posts.filter((other) => {
      if (other.id === post.id) return false;
      const mentionsSlug = other.content.includes(post.slug);
      const mentionsKeyword =
        post.seo.focusKeyword &&
        other.content.toLowerCase().includes(post.seo.focusKeyword.toLowerCase());
      return mentionsSlug || mentionsKeyword;
    }).length;

    // Outgoing internal links in content
    const outgoingInternal = (post.content.match(/href="\/article\//g) || []).length;
    // Outgoing external links in content
    const outgoingExternal = (post.content.match(/href="https?:\/\//g) || []).length;

    return {
      ...post,
      incomingCalculated: incomingCount,
      outgoingInternalCalculated: Math.max(post.internalLinksCount || 0, outgoingInternal),
      outgoingExternalCalculated: Math.max(post.externalLinksCount || 0, outgoingExternal),
      isOrphan: incomingCount === 0,
    };
  });

  const orphans = postsWithLinkMetrics.filter((p) => p.isOrphan);

  const filteredPosts = postsWithLinkMetrics.filter((p) => {
    if (filterOrphansOnly && !p.isOrphan) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Internal Linking & PageRank Graph
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Detect orphan pages, optimize internal equity flow, and discover high-value anchor text opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOrphansOnly(!filterOrphansOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              filterOrphansOnly
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {filterOrphansOnly ? 'Showing Orphans Only' : `Filter Orphans (${orphans.length})`}
          </button>
        </div>
      </div>

      {/* Orphan Alert Card */}
      {orphans.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-amber-900">
              {orphans.length} Orphan Articles Detected
            </h3>
            <p className="text-amber-800/90 mt-0.5">
              Articles with 0 incoming internal links cannot efficiently receive PageRank from topical authority hubs.
              We recommend linking to them from relevant category anchor paragraphs.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-xs text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search article titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
          />
        </div>

        <span className="text-xs text-slate-400 font-medium">{filteredPosts.length} Articles Analyzed</span>
      </div>

      {/* Internal Link Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Article Title & Slug</th>
                <th className="py-3 px-3 text-center">Incoming Links</th>
                <th className="py-3 px-3 text-center">Outgoing Internal</th>
                <th className="py-3 px-3 text-center">Outgoing External</th>
                <th className="py-3 px-3 text-center">Link Health</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map((post) => {
                const isOrphan = post.incomingCalculated === 0;

                return (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="font-semibold text-slate-900 hover:text-orange-600 line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                        <span>/{post.slug}</span>
                        {post.seo.focusKeyword && (
                          <span className="text-slate-500 font-sans">
                            &bull; Keyword: <span className="text-orange-600 font-medium">{post.seo.focusKeyword}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Incoming */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-bold font-mono text-[11px] ${
                          post.incomingCalculated > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {post.incomingCalculated}
                      </span>
                    </td>

                    {/* Outgoing Internal */}
                    <td className="py-3 px-3 text-center font-bold font-mono text-slate-700">
                      {post.outgoingInternalCalculated}
                    </td>

                    {/* Outgoing External */}
                    <td className="py-3 px-3 text-center font-bold font-mono text-slate-500">
                      {post.outgoingExternalCalculated}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      {isOrphan ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> Orphan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1 text-[11px]"
                      >
                        Edit Links <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
