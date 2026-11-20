'use client';

import React, { useState } from 'react';
import {
  Shuffle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  Download,
  Upload,
  Search,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { RedirectRule, RedirectType, NotFoundLog } from '@/types/admin';

export default function RedirectsManagerPage() {
  const {
    redirects,
    notFoundLogs,
    saveRedirect,
    deleteRedirect,
    deleteNotFoundLog,
    createRedirectFromNotFound,
    showToast,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'redirects' | '404s'>('redirects');
  const [search, setSearch] = useState('');

  // New / Edit Redirect Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<RedirectRule | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [statusCode, setStatusCode] = useState<RedirectType>('301');
  const [isRegex, setIsRegex] = useState(false);

  // 1-Click Fix 404 Modal State
  const [fixingNotFound, setFixingNotFound] = useState<NotFoundLog | null>(null);
  const [fixTargetUrl, setFixTargetUrl] = useState('');

  const openNewRedirectModal = () => {
    setEditingRedirect(null);
    setSourceUrl('');
    setTargetUrl('');
    setStatusCode('301');
    setIsRegex(false);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: RedirectRule) => {
    setEditingRedirect(rule);
    setSourceUrl(rule.sourceUrl);
    setTargetUrl(rule.targetUrl);
    setStatusCode(rule.statusCode);
    setIsRegex(!!rule.isRegex);
    setIsModalOpen(true);
  };

  const handleSaveRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl.trim() || (!targetUrl.trim() && statusCode !== '410')) {
      showToast('Source URL and Target URL are required', 'error');
      return;
    }

    saveRedirect({
      id: editingRedirect?.id,
      sourceUrl: sourceUrl.trim(),
      targetUrl: statusCode === '410' ? '' : targetUrl.trim(),
      statusCode,
      isRegex,
    });

    setIsModalOpen(false);
    showToast(
      editingRedirect
        ? `Redirect for "${sourceUrl}" updated!`
        : `Redirect rule (${statusCode}) created successfully!`,
      'success'
    );
  };

  const handleFix404Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fixingNotFound || !fixTargetUrl.trim()) {
      showToast('Please enter a target URL to redirect the 404 to', 'error');
      return;
    }

    createRedirectFromNotFound(fixingNotFound.id, fixTargetUrl.trim());
    setFixingNotFound(null);
    setFixTargetUrl('');
    showToast(`Created 301 redirect and resolved 404 error!`, 'success');
  };

  const handleExportCsv = () => {
    const header = 'Source URL,Target URL,Status Code,Hits,Regex\n';
    const rows = redirects
      .map((r) => `"${r.sourceUrl}","${r.targetUrl}","${r.statusCode}",${r.hits},${r.isRegex ? 'true' : 'false'}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dailysmagazine-redirects-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Redirects exported to CSV!', 'success');
  };

  const filteredRedirects = redirects.filter(
    (r) =>
      r.sourceUrl.toLowerCase().includes(search.toLowerCase()) ||
      r.targetUrl.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotFound = notFoundLogs.filter((n) =>
    n.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Redirects & 404 Error Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Preserve link equity and prevent crawl dead-ends with 301 permanent redirects and real-time 404 log capture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={openNewRedirectModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Redirect
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setActiveTab('redirects')}
            className={`font-semibold pb-1 border-b-2 transition ${
              activeTab === 'redirects'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Redirects ({redirects.length})
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setActiveTab('404s')}
            className={`font-semibold pb-1 border-b-2 transition ${
              activeTab === '404s'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            404 Error Log ({notFoundLogs.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'redirects' ? 'Filter redirects...' : 'Filter 404 paths...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
          />
        </div>
      </div>

      {/* Tab 1: Active Redirects Table */}
      {activeTab === 'redirects' && (
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Source URL</th>
                  <th className="py-3 px-3 text-center">Type</th>
                  <th className="py-3 px-4">Target Destination</th>
                  <th className="py-3 px-3 text-center">Hits</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRedirects.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {rule.sourceUrl}
                      {rule.isRegex && (
                        <span className="ml-2 text-[10px] font-sans px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                          Regex
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                          rule.statusCode === '301'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rule.statusCode === '410'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rule.statusCode}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {rule.statusCode === '410' ? (
                        <span className="text-rose-500 italic font-sans">HTTP 410 Gone (Purged Content)</span>
                      ) : (
                        rule.targetUrl
                      )}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {rule.hits}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(rule)}
                          className="p-1 text-slate-400 hover:text-orange-600"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete redirect for "${rule.sourceUrl}"?`)) {
                              deleteRedirect(rule.id);
                              showToast('Redirect rule removed', 'info');
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: 404 Error Log Table */}
      {activeTab === '404s' && (
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">404 Requested Path</th>
                  <th className="py-3 px-3 text-center">Hits</th>
                  <th className="py-3 px-3">Last Attempted</th>
                  <th className="py-3 px-3">Referrer</th>
                  <th className="py-3 px-3 text-right">Fix 404</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotFound.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-rose-600">
                      {log.url}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {log.hits}
                    </td>

                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {new Date(log.lastDetectedAt || log.lastSeen || Date.now()).toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-slate-500 text-[11px] truncate max-w-xs">
                      {log.referrer || 'Direct / None'}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            setFixingNotFound(log);
                            setFixTargetUrl('/');
                          }}
                          className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded text-[11px] transition inline-flex items-center gap-1 shadow-xs"
                        >
                          <Plus className="w-3 h-3" /> 1-Click 301
                        </button>
                        <button
                          onClick={() => {
                            deleteNotFoundLog(log.id);
                            showToast('Log entry removed', 'info');
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Dismiss"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Redirect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-orange-500" />
                {editingRedirect ? 'Edit Redirect Rule' : 'Create New Redirect'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRedirect} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Source URL (Path to catch) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. /old-article-slug"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Destination URL {statusCode !== '410' && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. /culture/new-slug or https://..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  disabled={statusCode === '410'}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 disabled:opacity-40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Code</label>
                  <select
                    value={statusCode}
                    onChange={(e) => setStatusCode(e.target.value as RedirectType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                  >
                    <option value="301">301 Moved Permanently (Passes 100% Equity)</option>
                    <option value="302">302 Found (Temporary)</option>
                    <option value="307">307 Temporary Redirect</option>
                    <option value="410">410 Content Deleted / Gone</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is-regex"
                    checked={isRegex}
                    onChange={(e) => setIsRegex(e.target.checked)}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="is-regex" className="font-semibold text-slate-700">
                    Regular Expression Match
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded shadow-xs"
                >
                  {editingRedirect ? 'Update Rule' : 'Create Redirect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-Click Fix 404 Modal */}
      {fixingNotFound && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Resolve 404: {fixingNotFound.url}
              </h3>
              <button onClick={() => setFixingNotFound(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFix404Submit} className="space-y-3 text-xs">
              <p className="text-slate-600">
                This URL triggered <strong>{fixingNotFound.hits} dead-end hits</strong>. Creating a 301 permanent redirect will restore user traffic and Google crawl signals.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /category/culture or /culture/new-slug"
                  value={fixTargetUrl}
                  onChange={(e) => setFixTargetUrl(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setFixingNotFound(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded shadow-xs"
                >
                  Create 301 & Clear 404
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
