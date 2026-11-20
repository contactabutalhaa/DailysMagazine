'use client';

import React, { useState } from 'react';
import {
  Code,
  Save,
  Check,
  Copy,
  ExternalLink,
  Building,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/schema-generator';

export default function GlobalSchemaSettingsPage() {
  const { seoSettings, updateSeoSettings, showToast } = useAdmin();

  const [settings, setSettings] = useState(seoSettings.globalSchema);
  const [activePreview, setActivePreview] = useState<'organization' | 'website'>('organization');

  const handleSave = () => {
    updateSeoSettings({ globalSchema: settings });
    showToast('Global Schema settings saved successfully!', 'success');
  };

  const orgSchema = generateOrganizationSchema(settings);
  const webSiteSchema = generateWebSiteSchema(settings);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Global Schema & Knowledge Graph
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure site-wide structured data: NewsMediaOrganization, Google Sitelinks Searchbox, and BreadcrumbList.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://validator.schema.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition border border-slate-200"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Schema Validator
          </a>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" /> Save Global Schema
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Global Schema Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Organization Settings */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Building className="w-4 h-4 text-orange-500" />
              Organization & Publisher Identity
            </h2>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={settings.organizationName}
                    onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alternate / Wordmark
                  </label>
                  <input
                    type="text"
                    value={settings.alternateName}
                    onChange={(e) => setSettings({ ...settings, alternateName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Publisher URL</label>
                <input
                  type="url"
                  value={settings.organizationUrl}
                  onChange={(e) => setSettings({ ...settings, organizationUrl: e.target.value })}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Logo URL (Min 600x60 for Google News)
                </label>
                <input
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900 resize-none"
                />
              </div>
            </div>

            {/* SameAs Social Profiles */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Social Profiles (`sameAs`)
              </span>

              <div className="space-y-2">
                {(settings.socialProfiles || []).map((url: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const updated = [...settings.socialProfiles];
                        updated[idx] = e.target.value;
                        setSettings({ ...settings, socialProfiles: updated });
                      }}
                      className="w-full px-3 py-1.5 font-mono text-xs bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = settings.socialProfiles.filter((_: string, i: number) => i !== idx);
                        setSettings({ ...settings, socialProfiles: updated });
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      socialProfiles: [...settings.socialProfiles, 'https://'],
                    })
                  }
                  className="text-xs text-orange-600 font-semibold hover:underline"
                >
                  + Add Social URL
                </button>
              </div>
            </div>
          </div>

          {/* Sitelinks Searchbox & Breadcrumbs */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Search className="w-4 h-4 text-blue-500" />
              Sitelinks Searchbox & Site Features
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Google Sitelinks Searchbox Schema
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Generates <code>potentialAction: SearchAction</code> in WebSite JSON-LD
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sitelinksSearchbox}
                  onChange={(e) => setSettings({ ...settings, sitelinksSearchbox: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Automatic BreadcrumbList Schema
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Emits hierarchical breadcrumbs on category archives and post pages
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.breadcrumbsEnabled}
                  onChange={(e) => setSettings({ ...settings, breadcrumbsEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Live JSON-LD Code Preview */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePreview('organization')}
                className={`px-3 py-1 text-xs font-semibold rounded font-mono transition ${
                  activePreview === 'organization'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Organization JSON-LD
              </button>
              <button
                onClick={() => setActivePreview('website')}
                className={`px-3 py-1 text-xs font-semibold rounded font-mono transition ${
                  activePreview === 'website'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                WebSite (Searchbox) JSON-LD
              </button>
            </div>

            <button
              onClick={() => {
                const json = JSON.stringify(
                  activePreview === 'organization' ? orgSchema : webSiteSchema,
                  null,
                  2
                );
                navigator.clipboard.writeText(json);
                showToast('JSON-LD copied to clipboard', 'success');
              }}
              className="text-xs text-slate-500 hover:text-orange-600 flex items-center gap-1 font-medium"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <pre className="p-4 bg-slate-50 text-slate-800 font-mono text-xs overflow-x-auto flex-1 leading-relaxed max-h-[600px] border-t border-slate-100">
            {JSON.stringify(activePreview === 'organization' ? orgSchema : webSiteSchema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
