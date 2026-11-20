'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Save,
  Eye,
  Trash2,
  Calendar,
  Globe,
  FileText,
  ExternalLink,
  Code,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { CmsPage, PageStatus, PostSeoData } from '@/types/admin';
import { useAdmin } from './AdminContext';
import OnPageSeoMetabox from '@/components/seo/OnPageSeoMetabox';

interface PageEditorProps {
  initialPage?: CmsPage;
  isNew?: boolean;
}

export default function PageEditor({ initialPage, isNew = false }: PageEditorProps) {
  const router = useRouter();
  const { savePage, deletePage, showToast } = useAdmin();

  // Form State
  const [title, setTitle] = useState(initialPage?.title || '');
  const [slug, setSlug] = useState(initialPage?.slug || '');
  const [content, setContent] = useState(initialPage?.content || '');
  const [status, setStatus] = useState<PageStatus>(initialPage?.status || 'published');
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  // Default SEO State
  const [seo, setSeo] = useState<PostSeoData>(
    initialPage?.seo || {
      focusKeyword: '',
      secondaryKeywords: [],
      seoTitle: initialPage ? `${initialPage.title} | DailysMagazine` : '',
      metaDescription: '',
      canonicalUrl: initialPage ? `https://dailysmagazine.com/${initialPage.slug}` : '',
      noindex: false,
      nofollow: false,
      robots: {
        index: true,
        follow: true,
        noarchive: false,
        nosnippet: false,
        maxImagePreview: 'large',
      },
      breadcrumbTitle: initialPage?.title || '',
      isSponsored: false,
      schemaType: 'Article',
      faqItems: [],
      howToSteps: [],
      ogTitle: '',
      ogDescription: '',
      ogImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
      seoScore: 85,
    }
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew && !slug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
      setSeo((prev) => ({
        ...prev,
        seoTitle: `${val} | DailysMagazine`,
        canonicalUrl: `https://dailysmagazine.com/${generatedSlug}`,
      }));
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast('Page title cannot be empty', 'error');
      return;
    }

    const cleanSlug = slug.trim()
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    savePage({
      id: initialPage?.id,
      title: title.trim(),
      slug: cleanSlug,
      content,
      status,
      seo: {
        ...seo,
        seoTitle: seo.seoTitle || `${title} | DailysMagazine`,
        canonicalUrl: seo.canonicalUrl || `https://dailysmagazine.com/${cleanSlug}`,
      },
      seoScore: seo.seoScore || 85,
    });

    showToast(`Page "${title}" saved successfully!`, 'success');
    if (isNew) {
      router.push('/admin/pages');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              {isNew ? 'Add New Page' : `Edit Page: ${title}`}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              URL: https://dailysmagazine.com/{slug || '[page-slug]'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <Link
              href={`/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition"
            >
              <Eye className="w-3.5 h-3.5" /> View Page
            </Link>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            {isNew ? 'Publish Page' : 'Update Page'}
          </button>
        </div>
      </div>

      {/* 2-Column WordPress Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Main Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
            <input
              type="text"
              placeholder="Add Page Title (H1)..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-2xl font-bold font-serif text-slate-900 bg-transparent border-0 focus:outline-none placeholder-slate-400"
            />

            {/* Permalink bar */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-600">Permalink:</span>
              <span className="font-mono text-slate-400">https://dailysmagazine.com/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="font-mono text-orange-600 bg-transparent border-b border-dashed border-orange-400 focus:outline-none px-1"
              />
            </div>
          </div>

          {/* Page Content Editor */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700">Page Content</span>
              <button
                onClick={() => setIsHtmlMode(!isHtmlMode)}
                className="text-xs font-medium text-slate-600 hover:text-orange-600 flex items-center gap-1"
              >
                <Code className="w-3.5 h-3.5" />
                {isHtmlMode ? 'Visual Editor' : 'HTML Code'}
              </button>
            </div>

            <div className="p-4">
              <textarea
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write page content in HTML or plain paragraphs..."
                className="w-full text-sm font-sans text-slate-800 bg-transparent border-0 focus:outline-none resize-y leading-relaxed"
              />
            </div>
          </div>

          {/* On-Page SEO & Schema Metabox (RankMath / Yoast style) */}
          <OnPageSeoMetabox
            seo={seo}
            onChange={setSeo}
            content={content}
            title={title}
            slug={slug}
            postType="page"
          />
        </div>

        {/* Right Publish Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publish Metabox */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              Page Attributes
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PageStatus)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 font-medium"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Template:</span>
                <span className="font-semibold text-slate-700">Default Page</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">SEO Health:</span>
                <span className="font-bold text-emerald-600">{seo.seoScore || 85}/100</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              {!isNew && initialPage?.id && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this page permanently?')) {
                      deletePage(initialPage.id);
                      showToast('Page deleted', 'info');
                      router.push('/admin/pages');
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  Delete Page
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                className="ml-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-sm transition"
              >
                {isNew ? 'Publish' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
