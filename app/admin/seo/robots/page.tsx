'use client';

import React, { useState } from 'react';
import {
  Bot,
  Save,
  RotateCcw,
  Sliders,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';

export default function RobotsAndAiCrawlersPage() {
  const { seoSettings, updateSeoSettings, showToast } = useAdmin();

  const [robotsTxt, setRobotsTxt] = useState(seoSettings.robotsTxt);
  const [aiBots, setAiBots] = useState(seoSettings.aiBots || []);
  const [llmsTxt, setLlmsTxt] = useState(seoSettings.llmsTxt);
  const [activeTab, setActiveTab] = useState<'robots' | 'aibots' | 'llms'>('robots');

  // Presets
  const applyPreset = (type: 'default' | 'disallow' | 'allow') => {
    if (type === 'default') {
      const def = `# DailysMagazine robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemaps
Sitemap: https://dailysmagazine.com/sitemap.xml`;
      setRobotsTxt(def);
      showToast('Applied Default SEO Friendly preset', 'info');
    } else if (type === 'disallow') {
      const dis = `# Disallow All (Staging / Private)
User-agent: *
Disallow: /`;
      setRobotsTxt(dis);
      showToast('Applied Disallow All preset', 'info');
    } else {
      const all = `# Allow All
User-agent: *
Allow: /
Sitemap: https://dailysmagazine.com/sitemap.xml`;
      setRobotsTxt(all);
      showToast('Applied Allow All preset', 'info');
    }
  };

  const syncBotsToRobotsTxt = () => {
    let customRules = `\n# AI & LLM Crawler Directives (Auto-Generated)\n`;
    (aiBots || []).forEach((bot) => {
      customRules += `User-agent: ${bot.name}\n${bot.allowed ? 'Allow: /' : 'Disallow: /'}\n\n`;
    });

    // Remove existing AI section if any and append
    const cleanRobots = robotsTxt.split('# AI & LLM Crawler Directives')[0].trim();
    const updated = `${cleanRobots}\n${customRules}`.trim();
    setRobotsTxt(updated);
    showToast('AI Bot rules injected into robots.txt', 'success');
  };

  const handleToggleBot = (name: string) => {
    const updated = (aiBots || []).map((b) => (b.name === name ? { ...b, allowed: !b.allowed } : b));
    setAiBots(updated);
  };

  const handleSaveAll = () => {
    updateSeoSettings({
      robotsTxt,
      aiBots,
      llmsTxt,
    });
    showToast('Robots.txt & AI crawler settings saved!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Robots.txt & AI Crawler Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fine-tune search engine crawling rules, control LLM data scraping bots, and manage `/llms.txt`.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/robots.txt"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition border border-slate-200"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View /robots.txt
          </a>
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" /> Save Directives
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('robots')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            activeTab === 'robots'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          robots.txt Editor
        </button>
        <button
          onClick={() => setActiveTab('aibots')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            activeTab === 'aibots'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          AI Bot Matrix (10 Bots)
        </button>
        <button
          onClick={() => setActiveTab('llms')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            activeTab === 'llms'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          llms.txt AI Guide
        </button>
      </div>

      {/* Tab 1: Robots.txt Editor */}
      {activeTab === 'robots' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700 font-mono">
                /robots.txt (Live Text File)
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(robotsTxt);
                  showToast('robots.txt copied to clipboard', 'success');
                }}
                className="text-xs text-slate-500 hover:text-orange-600 flex items-center gap-1 font-medium"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>

            <textarea
              rows={16}
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50/50 focus:bg-white border-t border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y leading-relaxed"
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                Quick Presets
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => applyPreset('default')}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-orange-500 transition"
                >
                  <p className="font-bold text-slate-800">Default SEO Friendly</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Allows public pages, blocks /admin/ and /api/</p>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('disallow')}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-rose-500 transition"
                >
                  <p className="font-bold text-rose-600">Disallow All</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Strictly blocks all bots (staging mode)</p>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('allow')}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 transition"
                >
                  <p className="font-bold text-emerald-600">Allow All</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Zero disallow restrictions across the site</p>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={syncBotsToRobotsTxt}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                >
                  Sync AI Bot Matrix Directives &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Bot Matrix */}
      {activeTab === 'aibots' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-orange-500" />
                  AI & LLM Web Crawler Permissions Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Control whether generative AI foundations (OpenAI, Anthropic, Google, Perplexity) can crawl your articles for model training.
                </p>
              </div>

              <button
                onClick={syncBotsToRobotsTxt}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                Sync with robots.txt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(aiBots || []).map((bot) => (
                <div
                  key={bot.name}
                  className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-slate-300 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{bot.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                        {bot.company}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{bot.purpose}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleBot(bot.name)}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                        bot.allowed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {bot.allowed ? 'ALLOWED' : 'BLOCKED'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: llms.txt */}
      {activeTab === 'llms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700 font-mono">
                /llms.txt (Standard Markdown AI Documentation Feed)
              </span>
              <a
                href="/llms.txt"
                target="_blank"
                className="text-xs text-slate-500 hover:text-orange-600 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Live
              </a>
            </div>

            <textarea
              rows={16}
              value={llmsTxt}
              onChange={(e) => setLlmsTxt(e.target.value)}
              className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50/50 focus:bg-white border-t border-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y leading-relaxed"
            />
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              About /llms.txt
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <code>/llms.txt</code> is the emerging web standard for providing LLMs and autonomous agents with concise, markdown-formatted structured summaries of your site's core content, taxonomy, and authoritative feeds.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              When AI models (like Gemini, ChatGPT, or Claude) access your domain, they consult this file to accurately answer queries and cite your magazine's editorial work.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
