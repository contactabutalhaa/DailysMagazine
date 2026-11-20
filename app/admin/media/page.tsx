'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Grid,
  List as ListIcon,
  Search,
  Copy,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { MediaItem } from '@/types/admin';

export default function MediaLibraryPage() {
  const { media, addMedia, updateMedia, deleteMedia, showToast } = useAdmin();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // New Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newSize, setNewSize] = useState('120 KB');
  const [newDimensions, setNewDimensions] = useState('1200x800');
  const [newFormat, setNewFormat] = useState('webp');

  const filteredMedia = media.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Image URL copied to clipboard!', 'success');
  };

  const handleUpdateSelected = () => {
    if (!selectedItem) return;
    updateMedia(selectedItem.id, {
      altText: selectedItem.altText,
      title: selectedItem.title,
      caption: selectedItem.caption,
    });
    showToast('Media details updated successfully', 'success');
  };

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) {
      showToast('Image URL and Title are required', 'error');
      return;
    }

    const created = addMedia({
      url: newUrl.trim(),
      altText: newAlt.trim(),
      title: newTitle.trim(),
      caption: '',
      dimensions: newDimensions,
      fileSize: newSize,
      format: newFormat,
      isWebPOrAvif: newFormat.toLowerCase() === 'webp' || newFormat.toLowerCase() === 'avif',
    });

    setIsUploading(false);
    setNewUrl('');
    setNewTitle('');
    setNewAlt('');
    setSelectedItem(created);
    showToast('Asset uploaded to Media Library!', 'success');
  };

  // Check if size is over 150KB
  const isSizeOver150KB = (sizeStr?: string) => {
    if (!sizeStr) return false;
    const num = parseFloat(sizeStr);
    if (sizeStr.toLowerCase().includes('mb')) return true;
    if (sizeStr.toLowerCase().includes('kb') && num > 150) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-slate-900">Media Library</h1>
            <button
              onClick={() => setIsUploading(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-xs transition"
            >
              <UploadCloud className="w-3.5 h-3.5" /> Add New Media
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage magazine assets, Alt Text SEO validation, WebP compression, and image weights.
          </p>
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search images or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
            />
          </div>

          <div className="flex items-center bg-white border border-slate-300 rounded-md p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition ${
                viewMode === 'grid'
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition ${
                viewMode === 'list'
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-orange-500" /> Add New Asset
              </h3>
              <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMedia} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Image URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Urban solar architecture skyline"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alt Text (SEO Recommended)
                </label>
                <input
                  type="text"
                  placeholder="Descriptive text for accessibility & image search..."
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Size</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  >
                    <option value="webp">WebP</option>
                    <option value="avif">AVIF</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded shadow-xs"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid: Media Items on Left, Attachment Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media items (7 or 8 cols if details open) */}
        <div className={`${selectedItem ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isHeavy = isSizeOver150KB(item.fileSize);
                const hasNoAlt = !item.altText.trim();

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative bg-white border rounded-xl overflow-hidden cursor-pointer transition shadow-xs ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="aspect-video relative bg-slate-100 overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.altText || item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        unoptimized
                      />

                      {/* Warning badges */}
                      <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                        {hasNoAlt && (
                          <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            No Alt Text
                          </span>
                        )}
                        {isHeavy && (
                          <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            &gt;150KB
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-1.5 right-1.5">
                        <span className="bg-slate-900/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded uppercase">
                          {item.format}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 text-xs">
                      <p className="font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.dimensions} &bull; {item.fileSize}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3">File</th>
                    <th className="py-2.5 px-3">Alt Text</th>
                    <th className="py-2.5 px-3 text-center">Format</th>
                    <th className="py-2.5 px-3 text-center">Size</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedia.map((item) => {
                    const isHeavy = isSizeOver150KB(item.fileSize);
                    const hasNoAlt = !item.altText.trim();

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`hover:bg-slate-50/70 cursor-pointer ${
                          selectedItem?.id === item.id ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 flex items-center gap-3">
                          <div className="w-12 h-9 relative rounded overflow-hidden shrink-0 bg-slate-100">
                            <Image src={item.url} alt="" fill className="object-cover" unoptimized />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{item.dimensions}</p>
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          {hasNoAlt ? (
                            <span className="text-rose-600 font-semibold flex items-center gap-1 text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5" /> Missing
                            </span>
                          ) : (
                            <span className="text-slate-600 line-clamp-1">{item.altText}</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                              item.isWebPOrAvif
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {item.format}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`font-mono text-[11px] ${
                              isHeavy ? 'text-amber-600 font-bold' : 'text-slate-500'
                            }`}
                          >
                            {item.fileSize}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyUrl(item.url);
                            }}
                            className="p-1 text-slate-400 hover:text-orange-600"
                            title="Copy URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Attachment Details Drawer */}
        {selectedItem && (
          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Attachment Details</h3>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              <Image src={selectedItem.url} alt={selectedItem.altText} fill className="object-contain" unoptimized />
            </div>

            {/* Diagnostics Bar */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Size & Weight</span>
                <span
                  className={`font-mono font-bold text-xs mt-0.5 block ${
                    isSizeOver150KB(selectedItem.fileSize) ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {selectedItem.fileSize}
                  {isSizeOver150KB(selectedItem.fileSize) && ' (!)'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Format</span>
                <span
                  className={`font-mono font-bold text-xs mt-0.5 block ${
                    selectedItem.isWebPOrAvif ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {selectedItem.format.toUpperCase()} {selectedItem.isWebPOrAvif ? '✓' : '(Legacy)'}
                </span>
              </div>
            </div>

            {/* Red Missing Alt Warning */}
            {!selectedItem.altText.trim() && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Missing Alt Text!</p>
                  <p className="text-[11px] mt-0.5 text-rose-700">
                    Images without alternative text hurt Google Image SEO indexing and fail accessibility standards.
                  </p>
                </div>
              </div>
            )}

            {/* Editable Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alt Text <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Describe the image context..."
                  value={selectedItem.altText}
                  onChange={(e) => setSelectedItem({ ...selectedItem, altText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={selectedItem.title}
                  onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={selectedItem.caption || ''}
                  onChange={(e) => setSelectedItem({ ...selectedItem, caption: e.target.value })}
                  placeholder="Visible editorial caption..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">File URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.url}
                    className="w-full px-2 py-1.5 font-mono text-[11px] bg-slate-100 border border-slate-200 rounded text-slate-500 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(selectedItem.url)}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded shrink-0 transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Permanently delete "${selectedItem.title}"?`)) {
                    deleteMedia(selectedItem.id);
                    setSelectedItem(null);
                    showToast('Asset deleted from library', 'info');
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                Delete Permanently
              </button>

              <button
                type="button"
                onClick={handleUpdateSelected}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded shadow-xs transition"
              >
                Update Metadata
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
