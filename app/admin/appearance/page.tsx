'use client';

import React, { useState } from 'react';
import {
  Palette,
  Layout,
  DollarSign,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  Check,
  Code,
  Globe,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
}

export default function AppearanceAndMonetizationPage() {
  const { showToast } = useAdmin();

  // Navigation Menus State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', label: 'Culture', url: '/category/culture' },
    { id: '2', label: 'Lifestyle', url: '/category/lifestyle' },
    { id: '3', label: 'Tech', url: '/category/tech' },
    { id: '4', label: 'Business', url: '/category/business' },
    { id: '5', label: 'Ideas', url: '/category/ideas' },
    { id: '6', label: 'Design', url: '/category/design' },
    { id: '7', label: 'Climate', url: '/category/climate' },
    { id: '8', label: 'Wellness', url: '/category/wellness' },
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Monetization Slots State
  const [headerAdEnabled, setHeaderAdEnabled] = useState(true);
  const [headerAdCode, setHeaderAdCode] = useState(
    '<!-- Google AdSense / Header Leaderboard (728x90) -->\n<div class="ad-leaderboard flex items-center justify-center p-2 bg-slate-100 rounded text-xs text-slate-400 font-mono">\n  Sponsored Ad Placement (728x90)\n</div>'
  );

  const [inArticleAdEnabled, setInArticleAdEnabled] = useState(true);
  const [inArticleAdCode, setInArticleAdCode] = useState(
    '<!-- Mid-Article Sponsorship Slot -->\n<div class="my-6 p-4 border border-dashed border-orange-300 bg-orange-50/50 rounded-xl text-center text-xs text-slate-600">\n  <span class="font-bold text-orange-600 uppercase text-[10px] block mb-1">Sponsored Recommendation</span>\n  Modern tools for high-performing editorial and creative teams.\n</div>'
  );

  const [sidebarAdEnabled, setSidebarAdEnabled] = useState(true);
  const [sidebarAdCode, setSidebarAdCode] = useState(
    '<!-- Sticky Sidebar Ad Slot (300x250) -->\n<div class="ad-sidebar p-4 bg-slate-100 rounded-xl text-center text-xs text-slate-500 font-mono border border-slate-200">\n  Sidebar Sticky Placement (300x250)\n</div>'
  );

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newUrl.trim()) {
      showToast('Please provide both label and URL', 'error');
      return;
    }

    setMenuItems([
      ...menuItems,
      {
        id: Date.now().toString(),
        label: newLabel.trim(),
        url: newUrl.trim(),
      },
    ]);
    setNewLabel('');
    setNewUrl('');
    showToast('Menu item added', 'success');
  };

  const handleMoveMenu = (index: number, direction: 'up' | 'down') => {
    const updated = [...menuItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMenuItems(updated);
  };

  const handleDeleteMenu = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    showToast('Menu item deleted', 'info');
  };

  const handleSaveAll = () => {
    showToast('Appearance & Monetization settings updated!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Appearance & Monetization
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure primary navigation hierarchy, footer structures, and sponsored ad insertion slots.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-xs transition"
        >
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Navigation Menu Builder */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Layout className="w-4 h-4 text-orange-500" />
              Header Navigation Menu Structure
            </h2>

            {/* Menu Items List */}
            <div className="space-y-2">
              {menuItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono text-slate-400 font-semibold">{idx + 1}</span>
                    <span className="font-bold text-slate-800">{item.label}</span>
                    <span className="font-mono text-[11px] text-slate-400">({item.url})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveMenu(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveMenu(idx, 'down')}
                      disabled={idx === menuItems.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Item */}
            <form onSubmit={handleAddMenuItem} className="pt-3 border-t border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Add Custom Navigation Link
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Link Label (e.g. Podcasts)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                />
                <input
                  type="text"
                  placeholder="URL (e.g. /category/podcasts)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900 font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded shadow-xs transition"
              >
                + Add To Menu
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (6 cols): Monetization & Sponsored Placements */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Monetization & Sponsored Placements
            </h2>

            {/* Slot 1: Header Leaderboard */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Header Banner / Leaderboard (728x90)
                  </span>
                  <span className="text-[11px] text-slate-400">Displayed below sticky navigation on desktop</span>
                </div>
                <input
                  type="checkbox"
                  checked={headerAdEnabled}
                  onChange={(e) => setHeaderAdEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </div>
              <textarea
                rows={3}
                value={headerAdCode}
                onChange={(e) => setHeaderAdCode(e.target.value)}
                disabled={!headerAdEnabled}
                className="w-full p-2.5 bg-slate-50 text-slate-800 font-mono text-[11px] rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-40"
              />
            </div>

            {/* Slot 2: In-Article Content Slot */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    In-Article Mid-Post Slot
                  </span>
                  <span className="text-[11px] text-slate-400">Injected dynamically after paragraph 3 in articles</span>
                </div>
                <input
                  type="checkbox"
                  checked={inArticleAdEnabled}
                  onChange={(e) => setInArticleAdEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </div>
              <textarea
                rows={3}
                value={inArticleAdCode}
                onChange={(e) => setInArticleAdCode(e.target.value)}
                disabled={!inArticleAdEnabled}
                className="w-full p-2.5 bg-slate-50 text-slate-800 font-mono text-[11px] rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-40"
              />
            </div>

            {/* Slot 3: Sidebar Placement */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Sticky Sidebar Widget (300x250)
                  </span>
                  <span className="text-[11px] text-slate-400">Positioned in right sidebar below newsletter</span>
                </div>
                <input
                  type="checkbox"
                  checked={sidebarAdEnabled}
                  onChange={(e) => setSidebarAdEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4"
                />
              </div>
              <textarea
                rows={3}
                value={sidebarAdCode}
                onChange={(e) => setSidebarAdCode(e.target.value)}
                disabled={!sidebarAdEnabled}
                className="w-full p-2.5 bg-slate-50 text-slate-800 font-mono text-[11px] rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
