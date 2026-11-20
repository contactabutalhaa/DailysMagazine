'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';

export default function PagesManagerPage() {
  const { pages, deletePage, showToast } = useAdmin();
  const [search, setSearch] = useState('');

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-slate-900">Pages</h1>
            <Link
              href="/admin/pages/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Page
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage essential institutional and legal pages with custom On-Page SEO meta & schema markup.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-3">Slug</th>
                <th className="py-3 px-3 text-center">SEO Score</th>
                <th className="py-3 px-3 text-center">Index</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPages.map((page) => {
                const score = page.seo?.seoScore || 85;
                const scoreBg =
                  score >= 80
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200';

                return (
                  <tr key={page.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="font-semibold text-slate-900 hover:text-orange-600"
                      >
                        {page.title}
                      </Link>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="hover:text-orange-600 inline-flex items-center gap-1"
                      >
                        /{page.slug} <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${scoreBg}`}>
                        {score}/100
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {page.seo?.noindex ? (
                        <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                          noindex
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          index
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {page.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(page.publishedAt || page.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/pages/${page.id}`}
                          className="p-1 text-slate-500 hover:text-orange-600 transition"
                          title="Edit page"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete page "${page.title}"?`)) {
                              deletePage(page.id);
                              showToast('Page deleted', 'info');
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-rose-600 transition"
                          title="Delete page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
