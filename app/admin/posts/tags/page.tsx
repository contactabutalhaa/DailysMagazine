'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tag as TagIcon,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Search,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { CmsTag } from '@/types/admin';

export default function TagsManagerPage() {
  const { tags, posts, saveTag, deleteTag, showToast } = useAdmin();

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [noindex, setNoindex] = useState(false);
  const [editingTag, setEditingTag] = useState<CmsTag | null>(null);

  // Search
  const [search, setSearch] = useState('');

  const autoGenerateSlug = (val: string) => {
    setName(val);
    if (!editingTag) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
      setSeoTitle(`${val} Articles & Stories | DailysMagazine`);
      setMetaDescription(`Curated reporting, editorials, and opinions tagged with #${val} on DailysMagazine.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Tag name is required', 'error');
      return;
    }
    const finalSlug = slug.trim()
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    saveTag({
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      seoTitle: seoTitle.trim(),
      metaDescription: metaDescription.trim(),
      noindex,
    });

    showToast(editingTag ? `Tag #${name} updated!` : `Tag #${name} created!`, 'success');
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setSeoTitle('');
    setMetaDescription('');
    setNoindex(false);
    setEditingTag(null);
  };

  const handleEdit = (tag: CmsTag) => {
    setEditingTag(tag);
    setName(tag.name);
    setSlug(tag.slug);
    setDescription(tag.description || '');
    setSeoTitle(tag.seoTitle || '');
    setMetaDescription(tag.metaDescription || '');
    setNoindex(!!tag.noindex);
  };

  const handleDelete = (id: string, tagName: string) => {
    if (confirm(`Are you sure you want to delete tag #${tagName}?`)) {
      deleteTag(id);
      showToast(`Tag #${tagName} deleted`, 'info');
      if (editingTag?.id === id) {
        resetForm();
      }
    }
  };

  const filteredTags = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Tags</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage keyword topic tags, archive metadata, and search engine crawling parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Add / Edit Tag Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-orange-500" />
              {editingTag ? `Edit: #${editingTag.name}` : 'Add New Tag'}
            </h2>
            {editingTag && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. artificial-intelligence"
                value={name}
                onChange={(e) => autoGenerateSlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                placeholder="e.g. artificial-intelligence"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Optional tag description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 resize-none"
              />
            </div>

            {/* Tag SEO Settings */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
                Tag Archive SEO Meta
              </span>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  placeholder="e.g. #AI Stories & News | DailysMagazine"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  placeholder="Meta description for search snippets..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="tag-noindex"
                  checked={noindex}
                  onChange={(e) => setNoindex(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="tag-noindex" className="font-semibold text-slate-700 select-none">
                  Set tag archive to <code className="text-rose-600 font-mono">noindex</code>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-xs transition"
              >
                {editingTag ? 'Update Tag' : 'Add New Tag'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (7 cols): Tags List Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none text-slate-900"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">{filteredTags.length} Tags</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-3">Slug</th>
                  <th className="py-2.5 px-3 text-center">Index</th>
                  <th className="py-2.5 px-3 text-center">Articles</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTags.map((tag) => {
                  const articleCount = posts.filter((p) =>
                    p.tags.some((t) => t.toLowerCase() === tag.name.toLowerCase() || t.toLowerCase() === tag.slug)
                  ).length;

                  return (
                    <tr key={tag.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        #{tag.name}
                        {tag.description && (
                          <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                            {tag.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">/{tag.slug}</td>
                      <td className="py-3 px-3 text-center">
                        {tag.noindex ? (
                          <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            noindex
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            index
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {articleCount}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(tag)}
                            className="p-1 text-slate-500 hover:text-orange-600 transition"
                            title="Edit Tag"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tag.id, tag.name)}
                            className="p-1 text-slate-500 hover:text-rose-600 transition"
                            title="Delete Tag"
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
    </div>
  );
}
