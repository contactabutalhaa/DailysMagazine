'use client';

import React, { useState } from 'react';
import {
  Zap,
  Save,
  Check,
  Send,
  ExternalLink,
  ShieldCheck,
  FileText,
  Clock,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';

export default function IndexingAndVerificationPage() {
  const { seoSettings, updateSeoSettings, pingIndexNow, showToast } = useAdmin();

  // Settings State
  const [verification, setVerification] = useState(seoSettings.webmasterVerification);
  const [indexNow, setIndexNow] = useState(seoSettings.indexNow);
  const [adsTxt, setAdsTxt] = useState(seoSettings.adsTxt);

  // Manual Submission State
  const [urlToSubmit, setUrlToSubmit] = useState('https://dailysmagazine.com/');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pingHistory, setPingHistory] = useState([
    {
      id: '1',
      url: 'https://dailysmagazine.com/lifestyle/the-future-of-neighborhoods',
      status: 200,
      timestamp: '2026-11-19 14:32:10',
      service: 'IndexNow (Bing/Yandex)',
    },
    {
      id: '2',
      url: 'https://dailysmagazine.com/culture/quiet-luxury-fashion-zeitgeist',
      status: 200,
      timestamp: '2026-11-19 12:15:44',
      service: 'IndexNow (Bing/Yandex)',
    },
    {
      id: '3',
      url: 'https://dailysmagazine.com/sitemap.xml',
      status: 200,
      timestamp: '2026-11-19 09:00:22',
      service: 'Google Sitemap Ping',
    },
  ]);

  const handleManualPing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlToSubmit.trim()) return;

    setIsSubmitting(true);
    const success = await pingIndexNow(urlToSubmit.trim());
    setIsSubmitting(false);

    if (success) {
      setPingHistory([
        {
          id: Date.now().toString(),
          url: urlToSubmit.trim(),
          status: 200,
          timestamp: new Date().toLocaleString(),
          service: 'IndexNow API',
        },
        ...pingHistory,
      ]);
    }
  };

  const handleSaveAll = () => {
    updateSeoSettings({
      webmasterVerification: verification,
      indexNow,
      adsTxt,
    });
    showToast('Indexing & Verification settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Search Indexing, APIs & Webmaster Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure IndexNow instant search crawling, Search Console ownership tags, and authorized seller `ads.txt`.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-xs transition"
        >
          <Save className="w-3.5 h-3.5" /> Save All Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): IndexNow & Instant Push */}
        <div className="lg:col-span-6 space-y-6">
          {/* IndexNow API Configuration */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Zap className="w-4 h-4 text-orange-500" />
              IndexNow Instant Crawling Protocol
            </h2>

            <p className="text-xs text-slate-500 leading-relaxed">
              IndexNow instantly notifies Bing, Yandex, Seznam, and Naver whenever editorial content is created, updated, or deleted, skipping weeks of periodic crawler delay.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Automatic Ping on Article Publish
                  </span>
                  <span className="text-[11px] text-slate-400">Notifies search endpoints immediately upon saving</span>
                </div>
                <input
                  type="checkbox"
                  checked={indexNow.autoPingOnPublish}
                  onChange={(e) => setIndexNow({ ...indexNow, autoPingOnPublish: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">IndexNow API Key</label>
                <input
                  type="text"
                  value={indexNow.apiKey}
                  onChange={(e) => setIndexNow({ ...indexNow, apiKey: e.target.value })}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Host</label>
                <input
                  type="text"
                  value={indexNow.host}
                  onChange={(e) => setIndexNow({ ...indexNow, host: e.target.value })}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                />
              </div>
            </div>

            {/* Manual Ping Tool */}
            <form onSubmit={handleManualPing} className="pt-3 border-t border-slate-200 space-y-2">
              <label className="block font-bold text-slate-700 text-xs">
                Manual Instant URL Submission
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={urlToSubmit}
                  onChange={(e) => setUrlToSubmit(e.target.value)}
                  placeholder="https://dailysmagazine.com/tech/your-story..."
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold rounded text-xs shrink-0 inline-flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 text-slate-500 ${isSubmitting ? 'animate-spin' : ''}`} />
                  {isSubmitting ? 'Submitting...' : 'Ping IndexNow'}
                </button>
              </div>
            </form>

            {/* Ping History Log */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Recent Ping Activity Log
              </span>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {pingHistory.map((h) => (
                  <div
                    key={h.id}
                    className="p-2 rounded bg-slate-50 border border-slate-200/60 text-xs flex items-center justify-between font-mono"
                  >
                    <div className="truncate mr-2">
                      <span className="text-slate-800 block truncate">{h.url}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{h.timestamp}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      HTTP {h.status} OK
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Webmaster Verification & ads.txt */}
        <div className="lg:col-span-6 space-y-6">
          {/* Search Console Meta Verification */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Webmaster Ownership Verification
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Google Search Console (`google-site-verification`)
                </label>
                <input
                  type="text"
                  placeholder="e.g. d_f8g9h1k2l3m4n5o6p7q8r9s0t"
                  value={verification.googleSiteVerification}
                  onChange={(e) => setVerification({ ...verification, googleSiteVerification: e.target.value })}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bing Webmaster Tools (`msvalidate.01`)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7E2B4C5D6F8A9B0C1D2E3F4A5B6C7D8E"
                  value={verification.bingVerification}
                  onChange={(e) => setVerification({ ...verification, bingVerification: e.target.value })}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Yandex Webmaster
                  </label>
                  <input
                    type="text"
                    value={verification.yandexVerification}
                    onChange={(e) => setVerification({ ...verification, yandexVerification: e.target.value })}
                    className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pinterest Verification
                  </label>
                  <input
                    type="text"
                    value={verification.pinterestVerification}
                    onChange={(e) => setVerification({ ...verification, pinterestVerification: e.target.value })}
                    className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ads.txt Editor */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                ads.txt Manager (Authorized Digital Sellers)
              </h2>
              <a
                href="/ads.txt"
                target="_blank"
                className="text-xs text-slate-500 hover:text-orange-600 flex items-center gap-1 font-mono"
              >
                <ExternalLink className="w-3.5 h-3.5" /> /ads.txt
              </a>
            </div>

            <p className="text-xs text-slate-500">
              Declares programmatic ad networks authorized to sell inventory on DailysMagazine, preventing ad fraud.
            </p>

            <textarea
              rows={5}
              value={adsTxt}
              onChange={(e) => setAdsTxt(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-50 text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
