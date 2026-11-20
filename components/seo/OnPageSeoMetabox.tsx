'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Settings,
  Code2,
  Share2,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Shield,
  Eye,
} from 'lucide-react';
import { PostSeoData, SchemaType, FAQItem, HowToStep } from '@/types/admin';
import { analyzePostSeo } from '@/lib/seo-analyzer';
import { generatePostJsonLd } from '@/lib/schema-generator';

interface OnPageSeoMetaboxProps {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  categoryName?: string;
  authorName?: string;
  authorAvatar?: string;
  publishedAt?: string;
  seoData?: PostSeoData;
  seo?: PostSeoData;
  postType?: string;
  onChange: (updatedSeo: PostSeoData) => void;
}

export default function OnPageSeoMetabox({
  title,
  slug,
  content,
  excerpt = '',
  coverImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
  coverImageAlt = '',
  categoryName = 'General',
  authorName = 'Editorial Board',
  authorAvatar,
  publishedAt = new Date().toISOString(),
  seoData: incomingSeoData,
  seo,
  onChange,
}: OnPageSeoMetaboxProps) {
  const seoData = incomingSeoData || seo || {
    focusKeyword: '',
    secondaryKeywords: [],
    seoTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
    breadcrumbTitle: '',
    isSponsored: false,
    schemaType: 'Article',
    faqItems: [],
    howToSteps: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
  };
  const [activeTab, setActiveTab] = useState<'general' | 'advanced' | 'schema' | 'social'>('general');
  const [serpView, setSerpView] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedJson, setCopiedJson] = useState(false);
  const [secondaryInput, setSecondaryInput] = useState('');

  // Run Real-time SEO analysis
  const effectiveTitle = seoData.seoTitle || (title ? `${title} | DailysMagazine` : '');
  const effectiveDesc = seoData.metaDescription || excerpt || '';

  const analysis = analyzePostSeo({
    title,
    slug,
    content,
    seoTitle: effectiveTitle,
    metaDescription: effectiveDesc,
    focusKeyword: seoData.focusKeyword,
    coverImageAlt: coverImageAlt || title,
  });

  // Calculate Title Bar Color
  const titleLen = effectiveTitle.length;
  const titleColor =
    titleLen >= 50 && titleLen <= 65
      ? 'bg-emerald-500'
      : titleLen >= 35 && titleLen < 50
      ? 'bg-amber-500'
      : 'bg-rose-500';

  // Calculate Description Bar Color
  const descLen = effectiveDesc.length;
  const descColor =
    descLen >= 130 && descLen <= 165
      ? 'bg-emerald-500'
      : descLen > 0 && descLen < 130
      ? 'bg-amber-500'
      : 'bg-rose-500';

  // Score Badge
  const scoreBadgeColor =
    analysis.score >= 80
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : analysis.score >= 50
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : 'bg-rose-100 text-rose-800 border-rose-300';

  // Handle Updates
  const updateSeo = (field: keyof PostSeoData, value: any) => {
    onChange({ ...seoData, [field]: value });
  };

  const updateRobots = (key: keyof PostSeoData['robots'], val: any) => {
    onChange({
      ...seoData,
      robots: { ...seoData.robots, [key]: val },
    });
  };

  const handleAddSecondary = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && secondaryInput.trim()) {
      e.preventDefault();
      const next = [...(seoData.secondaryKeywords || []), secondaryInput.trim()];
      updateSeo('secondaryKeywords', next);
      setSecondaryInput('');
    }
  };

  const removeSecondary = (kw: string) => {
    updateSeo(
      'secondaryKeywords',
      (seoData.secondaryKeywords || []).filter((k) => k !== kw)
    );
  };

  // FAQ Items Repeater
  const addFaqItem = () => {
    const next = [...(seoData.faqItems || []), { question: '', answer: '' }];
    updateSeo('faqItems', next);
  };

  const updateFaqItem = (index: number, key: keyof FAQItem, val: string) => {
    const next = [...(seoData.faqItems || [])];
    next[index] = { ...next[index], [key]: val };
    updateSeo('faqItems', next);
  };

  const removeFaqItem = (index: number) => {
    const next = (seoData.faqItems || []).filter((_, idx) => idx !== index);
    updateSeo('faqItems', next);
  };

  // HowTo Steps Repeater
  const addHowToStep = () => {
    const next = [...(seoData.howToSteps || []), { name: '', text: '' }];
    updateSeo('howToSteps', next);
  };

  const updateHowToStep = (index: number, key: keyof HowToStep, val: string) => {
    const next = [...(seoData.howToSteps || [])];
    next[index] = { ...next[index], [key]: val };
    updateSeo('howToSteps', next);
  };

  const removeHowToStep = (index: number) => {
    const next = (seoData.howToSteps || []).filter((_, idx) => idx !== index);
    updateSeo('howToSteps', next);
  };

  // Generate Real-time JSON-LD Schema
  const jsonLdObject = generatePostJsonLd({
    title: effectiveTitle || title || 'Untitled Story',
    slug: slug || 'story',
    excerpt: effectiveDesc,
    content,
    coverImage: coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
    publishedAt: publishedAt || new Date().toISOString(),
    authorName: authorName || 'Elena Vance',
    authorAvatar: authorAvatar,
    categoryName: categoryName || 'Culture',
    schemaType: seoData.schemaType || 'Article',
    faqItems: seoData.faqItems,
    howToSteps: seoData.howToSteps,
    reviewData: seoData.reviewData,
    breadcrumbTitle: seoData.breadcrumbTitle,
  });

  const jsonLdString = JSON.stringify(jsonLdObject, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonLdString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden mt-8">
      {/* Metabox Header */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-slate-900 text-base">
              On-Page SEO & Schema Engine
            </h3>
            <p className="text-xs text-slate-500">
              RankMath & Yoast-grade live analyzer, SERP simulator & JSON-LD generator
            </p>
          </div>
        </div>

        {/* Real-time Score Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full border text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${scoreBadgeColor}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEO Score: {analysis.score}/100</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'general'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>General & SERP Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'advanced'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Advanced & Robots Meta</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'schema'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Schema Markup (JSON-LD)</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'social'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social (OG & Twitter)</span>
        </button>
      </div>

      {/* Tab 1: General & SERP Preview */}
      {activeTab === 'general' && (
        <div className="p-6 space-y-6">
          {/* Keyword Target Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Primary Focus Keyword *
              </label>
              <input
                type="text"
                value={seoData.focusKeyword}
                onChange={(e) => updateSeo('focusKeyword', e.target.value)}
                placeholder="e.g. urban spaces, quantum computing..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The main query you want this article to rank for in Google.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Secondary Keywords (Press Enter to Add)
              </label>
              <input
                type="text"
                value={secondaryInput}
                onChange={(e) => setSecondaryInput(e.target.value)}
                onKeyDown={handleAddSecondary}
                placeholder="Type keyword and press Enter..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(seoData.secondaryKeywords || []).map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => removeSecondary(kw)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Live Google SERP Snippet Preview */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                Google SERP Snippet Preview
              </span>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSerpView('desktop')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    serpView === 'desktop' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpView('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                    serpView === 'mobile' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Google Search Card Simulator */}
            <div
              className={`bg-white p-4 rounded-xl border border-slate-200 font-sans ${
                serpView === 'mobile' ? 'max-w-sm mx-auto shadow-md' : 'w-full'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-orange-500 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                  D
                </div>
                <div className="text-[12px] text-slate-700 truncate leading-tight">
                  <span className="font-bold text-slate-800">DailysMagazine</span>
                  <span className="text-slate-400 ml-1">https://dailysmagazine.com › {categoryName.toLowerCase()} › {slug || 'story'}</span>
                </div>
              </div>

              {/* Title Link */}
              <h4 className="text-[#1a0dab] hover:underline font-normal text-base sm:text-lg leading-snug cursor-pointer line-clamp-2">
                {effectiveTitle || 'Your Post Title Here — DailysMagazine'}
              </h4>

              {/* Description Snippet */}
              <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2 mt-1">
                {effectiveDesc || 'Add a compelling meta description to describe your story to searchers on Google and increase organic click-through rates.'}
              </p>
            </div>
          </div>

          {/* Title & Description Form with Real-time Progress Meters */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                <span>SEO Title Tag</span>
                <span className={titleLen > 65 ? 'text-rose-600' : 'text-slate-500'}>
                  {titleLen} / 60 characters (~{analysis.metrics.titlePixelWidthEstimate}px / 580px max)
                </span>
              </div>
              <input
                type="text"
                value={seoData.seoTitle}
                onChange={(e) => updateSeo('seoTitle', e.target.value)}
                placeholder={`${title || 'Article Headline'} | DailysMagazine`}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full transition-all duration-200 ${titleColor}`}
                  style={{ width: `${Math.min(100, (titleLen / 60) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                <span>Meta Description</span>
                <span className={descLen > 165 ? 'text-rose-600' : 'text-slate-500'}>
                  {descLen} / 155 characters (~{analysis.metrics.descriptionPixelWidthEstimate}px / 960px max)
                </span>
              </div>
              <textarea
                rows={3}
                value={seoData.metaDescription}
                onChange={(e) => updateSeo('metaDescription', e.target.value)}
                placeholder={excerpt || 'Craft a descriptive summary incorporating your focus keyword...'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
              />
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full transition-all duration-200 ${descColor}`}
                  style={{ width: `${Math.min(100, (descLen / 155) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Automated On-Page SEO Checklist (Pass / Warning / Fail) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Automated SEO Audit Breakdown ({analysis.passedCount} Passed, {analysis.warningCount} Warnings, {analysis.failedCount} Failed)
              </h4>
            </div>

            <div className="space-y-2.5">
              {analysis.checks.map((check) => (
                <div
                  key={check.id}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                    check.status === 'pass'
                      ? 'bg-emerald-50/50 border-emerald-200/70 text-slate-800'
                      : check.status === 'warning'
                      ? 'bg-amber-50/50 border-amber-200/70 text-slate-800'
                      : 'bg-rose-50/50 border-rose-200/70 text-slate-800'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {check.status === 'pass' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : check.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{check.title}</p>
                    <p className="text-slate-600 mt-0.5">{check.description}</p>
                    {check.status !== 'pass' && (
                      <p className="text-[11px] font-semibold text-orange-700 mt-1">
                        Recommendation: {check.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Advanced & Robots Meta */}
      {activeTab === 'advanced' && (
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Canonical URL Override
            </label>
            <input
              type="url"
              value={seoData.canonicalUrl}
              onChange={(e) => updateSeo('canonicalUrl', e.target.value)}
              placeholder={`https://dailysmagazine.com/${(categoryName || 'culture').toLowerCase().replace(/\s+/g, '-')}/${slug || 'your-slug'}`}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to default automatically to the canonical self-referencing permalink.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Custom Breadcrumb Title Override
            </label>
            <input
              type="text"
              value={seoData.breadcrumbTitle}
              onChange={(e) => updateSeo('breadcrumbTitle', e.target.value)}
              placeholder={title ? title.split(':')[0] : 'Shorter title for breadcrumbs'}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Granular Robots Meta */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-2">
              <Shield className="w-4 h-4 text-orange-600" />
              Robots Meta Directives (X-Robots-Tag)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.robots?.index}
                  onChange={(e) => updateRobots('index', e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-semibold text-slate-800">Allow Indexing (index)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.robots?.follow}
                  onChange={(e) => updateRobots('follow', e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-semibold text-slate-800">Follow Links (follow)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.robots?.noarchive}
                  onChange={(e) => updateRobots('noarchive', e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-semibold text-slate-800">No Archive (noarchive)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.robots?.nosnippet}
                  onChange={(e) => updateRobots('nosnippet', e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-semibold text-slate-800">No Snippet (nosnippet)</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Max Image Preview:</span>
              <select
                value={seoData.robots?.maxImagePreview || 'large'}
                onChange={(e) => updateRobots('maxImagePreview', e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="large">max-image-preview: large</option>
                <option value="standard">max-image-preview: standard</option>
                <option value="none">max-image-preview: none</option>
              </select>
            </div>
          </div>

          {/* Sponsored Flag */}
          <div className="flex items-center justify-between p-4 bg-amber-50/60 rounded-xl border border-amber-200">
            <div>
              <p className="text-xs font-bold text-amber-900">Sponsored Editorial / Paid Placement</p>
              <p className="text-[11px] text-amber-700">
                Adds `rel=&quot;sponsored&quot;` and marks commercial demarcation for compliance.
              </p>
            </div>
            <input
              type="checkbox"
              checked={seoData.isSponsored}
              onChange={(e) => updateSeo('isSponsored', e.target.checked)}
              className="rounded border-amber-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Schema Markup (JSON-LD) */}
      {activeTab === 'schema' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Primary Schema Type
              </label>
              <select
                value={seoData.schemaType || 'Article'}
                onChange={(e) => updateSeo('schemaType', e.target.value as SchemaType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Article">Article (Standard Longform)</option>
                <option value="NewsArticle">NewsArticle (Time-Sensitive Breaking Story)</option>
                <option value="BlogPosting">BlogPosting (Casual Editorial Commentary)</option>
                <option value="FAQPage">FAQPage (Q&A Accordion Rich Snippet)</option>
                <option value="HowTo">HowTo (Instructional Step-by-Step)</option>
                <option value="Review">Review (Editorial Rating & Score)</option>
              </select>
            </div>
          </div>

          {/* Dynamic FAQ Repeater if FAQPage or selected */}
          {(seoData.schemaType === 'FAQPage' || (seoData.faqItems && seoData.faqItems.length > 0)) && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                  FAQ Schema Q&A Repeater
                </span>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="px-2.5 py-1 rounded bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Question</span>
                </button>
              </div>

              {(seoData.faqItems || []).map((faq, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => removeFaqItem(idx)}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                    placeholder={`Question #${idx + 1}`}
                    className="w-11/12 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                    placeholder={`Answer #${idx + 1}`}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Dynamic HowTo Step Repeater if HowTo selected */}
          {seoData.schemaType === 'HowTo' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  HowTo Step Repeater
                </span>
                <button
                  type="button"
                  onClick={addHowToStep}
                  className="px-2.5 py-1 rounded bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Step</span>
                </button>
              </div>

              {(seoData.howToSteps || []).map((step, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => removeHowToStep(idx)}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => updateHowToStep(idx, 'name', e.target.value)}
                    placeholder={`Step #${idx + 1} Name`}
                    className="w-11/12 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={step.text}
                    onChange={(e) => updateHowToStep(idx, 'text', e.target.value)}
                    placeholder="Step Instructions"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Live JSON-LD Code Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-orange-600" />
                Live Generated JSON-LD Code
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy Schema'}</span>
                </button>
                <a
                  href="https://validator.schema.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Test on Schema.org</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <pre className="p-4 bg-slate-50 text-slate-800 font-mono text-[11px] rounded-xl overflow-x-auto max-h-64 border border-slate-200">
              {jsonLdString}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Social Cards */}
      {activeTab === 'social' && (
        <div className="p-6 space-y-6">
          {/* Facebook / LinkedIn OG Card Preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <span>Open Graph Card Preview (Facebook & LinkedIn)</span>
            </h4>
            <div className="max-w-lg rounded-xl overflow-hidden border border-slate-200 shadow-md bg-white">
              <div className="relative aspect-[1.91/1] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={seoData.ogImage || coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80'}
                  alt="OG Preview"
                  fill
                  sizes="500px"
                  className="object-cover"
                />
              </div>
              <div className="p-3.5 bg-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  DAILYSMAGAZINE.COM
                </span>
                <h5 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                  {seoData.ogTitle || effectiveTitle}
                </h5>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {seoData.ogDescription || effectiveDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Social Overrides Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Custom OG Title Override
              </label>
              <input
                type="text"
                value={seoData.ogTitle}
                onChange={(e) => updateSeo('ogTitle', e.target.value)}
                placeholder={effectiveTitle}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Custom OG Image URL
              </label>
              <input
                type="url"
                value={seoData.ogImage}
                onChange={(e) => updateSeo('ogImage', e.target.value)}
                placeholder={coverImage}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
