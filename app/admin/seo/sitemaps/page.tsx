'use client';

import React, { useState } from 'react';
import {
  FileCode,
  Save,
  ExternalLink,
  RefreshCw,
  Check,
  Copy,
  Radio,
  Sliders,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';

export default function SitemapsManagerPage() {
  const { seoSettings, updateSeoSettings, posts, pages, categories, showToast, pingIndexNow } = useAdmin();

  const [settings, setSettings] = useState(seoSettings.sitemap);
  const [activePreview, setActivePreview] = useState<'index' | 'posts' | 'pages' | 'categories' | 'news'>('index');
  const [isPinging, setIsPinging] = useState(false);

  const handleSave = () => {
    updateSeoSettings({ sitemap: settings });
    showToast('XML Sitemap settings updated successfully!', 'success');
  };

  const handlePing = async () => {
    setIsPinging(true);
    await pingIndexNow('https://dailysmagazine.com/sitemap.xml');
    setIsPinging(false);
  };

  // Generate real-time XML previews
  const getIndexXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://dailysmagazine.com/post-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dailysmagazine.com/page-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dailysmagazine.com/category-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  ${
    settings.includeNews
      ? `<sitemap>
    <loc>https://dailysmagazine.com/news-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
      : ''
  }
</sitemapindex>`;
  };

  const getPostsXml = () => {
    const list = posts.filter((p) => !p.seo.noindex && p.status === 'published');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${list
  .map(
    (p) => `  <url>
    <loc>https://dailysmagazine.com/${p.category || 'culture'}/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt || p.createdAt || Date.now()).toISOString()}</lastmod>
    <changefreq>${settings.postsChangefreq}</changefreq>
    <priority>${settings.postsPriority}</priority>
    ${
      p.coverImage
        ? `<image:image>
      <image:loc>${p.coverImage}</image:loc>
      <image:title>${p.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;
  };

  const getPagesXml = () => {
    const list = pages.filter((p) => !p.seo?.noindex);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list
  .map(
    (p) => `  <url>
    <loc>https://dailysmagazine.com/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt || p.publishedAt).toISOString()}</lastmod>
    <changefreq>${settings.pagesChangefreq}</changefreq>
    <priority>${settings.pagesPriority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  };

  const getCategoriesXml = () => {
    const list = categories.filter((c) => !c.noindex);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list
  .map(
    (c) => `  <url>
    <loc>https://dailysmagazine.com/category/${c.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  };

  const getNewsXml = () => {
    const list = posts.filter((p) => !p.seo.noindex && p.status === 'published').slice(0, 10);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${list
  .map(
    (p) => `  <url>
    <loc>https://dailysmagazine.com/${p.category || 'culture'}/${p.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>DailysMagazine</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(p.publishedAt || p.createdAt || Date.now()).toISOString()}</news:publication_date>
      <news:title>${p.title.replace(/&/g, '&amp;')}</news:title>
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>`;
  };

  const getActiveXml = () => {
    if (activePreview === 'index') return getIndexXml();
    if (activePreview === 'posts') return getPostsXml();
    if (activePreview === 'pages') return getPagesXml();
    if (activePreview === 'categories') return getCategoriesXml();
    if (activePreview === 'news') return getNewsXml();
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">XML Sitemaps Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure XML index partitions, Google News publication schemas, change frequencies, and crawler priority weights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePing}
            disabled={isPinging}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md shadow-xs transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isPinging ? 'animate-spin' : ''}`} />
            {isPinging ? 'Pinging Search Engines...' : 'Ping Search Engines'}
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" /> Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Sitemaps Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Sliders className="w-4 h-4 text-orange-500" />
              Sitemap Partitions & Rules
            </h2>

            {/* Post Types Inclusion */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-slate-700 block">Include Content Types</span>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200/60">
                <span className="font-medium text-slate-700">Articles / Posts (`post-sitemap.xml`)</span>
                <input
                  type="checkbox"
                  checked={settings.includePosts}
                  onChange={(e) => setSettings({ ...settings, includePosts: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200/60">
                <span className="font-medium text-slate-700">Pages (`page-sitemap.xml`)</span>
                <input
                  type="checkbox"
                  checked={settings.includePages}
                  onChange={(e) => setSettings({ ...settings, includePages: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200/60">
                <span className="font-medium text-slate-700">Categories (`category-sitemap.xml`)</span>
                <input
                  type="checkbox"
                  checked={settings.includeCategories}
                  onChange={(e) => setSettings({ ...settings, includeCategories: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200/60">
                <div>
                  <span className="font-medium text-slate-700 block">Google News Sitemap</span>
                  <span className="text-[10px] text-slate-400">Strictly 48-hour recency for News tab</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.includeNews}
                  onChange={(e) => setSettings({ ...settings, includeNews: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Frequencies & Priorities */}
            <div className="pt-3 border-t border-slate-200 space-y-4 text-xs">
              <span className="font-bold text-slate-700 block">Frequencies & Weights</span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Posts Changefreq</label>
                  <select
                    value={settings.postsChangefreq}
                    onChange={(e) => setSettings({ ...settings, postsChangefreq: e.target.value as any })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                  >
                    <option value="always">always</option>
                    <option value="hourly">hourly</option>
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Posts Priority</label>
                  <select
                    value={settings.postsPriority}
                    onChange={(e) => setSettings({ ...settings, postsPriority: e.target.value })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono"
                  >
                    <option value="1.0">1.0 (Maximum)</option>
                    <option value="0.9">0.9</option>
                    <option value="0.8">0.8 (Standard)</option>
                    <option value="0.6">0.6</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Pages Changefreq</label>
                  <select
                    value={settings.pagesChangefreq}
                    onChange={(e) => setSettings({ ...settings, pagesChangefreq: e.target.value as any })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                  >
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                    <option value="yearly">yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Pages Priority</label>
                  <select
                    value={settings.pagesPriority}
                    onChange={(e) => setSettings({ ...settings, pagesPriority: e.target.value })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono"
                  >
                    <option value="0.8">0.8</option>
                    <option value="0.7">0.7</option>
                    <option value="0.6">0.6 (Standard)</option>
                    <option value="0.5">0.5</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Direct Sitemap Endpoints */}
            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Live Next.js Endpoints</span>
              <div className="space-y-1.5">
                {[
                  { name: 'Sitemap Index', url: '/sitemap.xml' },
                  { name: 'Posts Sitemap', url: '/post-sitemap.xml' },
                  { name: 'Pages Sitemap', url: '/page-sitemap.xml' },
                  { name: 'Categories Sitemap', url: '/category-sitemap.xml' },
                  { name: 'Google News Sitemap', url: '/news-sitemap.xml' },
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 font-mono text-[11px] transition border border-slate-200/60"
                  >
                    <span>{s.url}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Live XML Code Preview */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-1">
              {(['index', 'posts', 'pages', 'categories', 'news'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePreview(tab)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded uppercase font-mono transition ${
                    activePreview === tab
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(getActiveXml());
                showToast('XML copied to clipboard', 'success');
              }}
              className="text-xs text-slate-500 hover:text-orange-600 flex items-center gap-1 font-medium"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <pre className="p-4 bg-slate-50 text-slate-800 font-mono text-xs overflow-x-auto flex-1 leading-relaxed max-h-[600px] border-t border-slate-100">
            {getActiveXml()}
          </pre>
        </div>
      </div>
    </div>
  );
}
