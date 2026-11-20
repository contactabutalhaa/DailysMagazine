'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Folder,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  Globe,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { CmsCategory } from '@/types/admin';

export default function CategoriesManagerPage() {
  const { categories, posts, saveCategory, deleteCategory, showToast } = useAdmin();

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [noindex, setNoindex] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CmsCategory | null>(null);

  // Search
  const [search, setSearch] = useState('');

  const autoGenerateSlug = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
      setSeoTitle(`${val} Stories & Analysis | DailysMagazine`);
      setMetaDescription(`Explore the latest in-depth articles, reporting, and cultural trends in ${val} from DailysMagazine.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    const finalSlug = slug.trim()
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    saveCategory({
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      seoTitle: seoTitle.trim() || `${name} | DailysMagazine`,
      metaDescription: metaDescription.trim() || description.trim(),
      noindex,
    });

    showToast(editingCategory ? `Category "${name}" updated!` : `Category "${name}" created!`, 'success');
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setSeoTitle('');
    setMetaDescription('');
    setNoindex(false);
    setEditingCategory(null);
  };

  const handleEdit = (cat: CmsCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setSeoTitle(cat.seoTitle || '');
    setMetaDescription(cat.metaDescription || '');
    setNoindex(!!cat.noindex);
  };

  const handleDelete = (slugToDelete: string) => {
    if (confirm(`Are you sure you want to delete category "${slugToDelete}"?`)) {
      deleteCategory(slugToDelete);
      showToast(`Category "${slugToDelete}" removed`, 'info');
      if (editingCategory?.slug === slugToDelete) {
        resetForm();
      }
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">Categories</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage editorial category taxonomies, archive SEO metadata, and search robot indexation rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Add / Edit Category Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Folder className="w-4 h-4 text-orange-500" />
              {editingCategory ? `Edit: ${editingCategory.name}` : 'Add New Category'}
            </h2>
            {editingCategory && (
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
                placeholder="e.g. Climate"
                value={name}
                onChange={(e) => autoGenerateSlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">The name is how it appears on your magazine.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                placeholder="e.g. climate"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The “slug” is the URL-friendly version. Flat URL: <span className="font-mono">/category/{slug || 'example'}</span>
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Category summary for taxonomy archives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 resize-none"
              />
            </div>

            {/* Taxonomy SEO Metabox */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
                Category Archive SEO Meta
              </span>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  placeholder="e.g. Climate & Environment Stories | DailysMagazine"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  placeholder="Target 140-160 characters for search engine snippets..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="category-noindex"
                  checked={noindex}
                  onChange={(e) => setNoindex(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="category-noindex" className="font-semibold text-slate-700 select-none">
                  Set this category archive to <code className="text-rose-600 font-mono">noindex</code>
                </label>
              </div>
              <p className="text-[11px] text-slate-400">
                Prevents search engines from indexing the category pagination archive if thin content is a concern.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-xs transition"
              >
                {editingCategory ? 'Update Category' : 'Add New Category'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (7 cols): Categories List Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none text-slate-900"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">{filteredCategories.length} Categories</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-3">Slug</th>
                  <th className="py-2.5 px-3 text-center">Index</th>
                  <th className="py-2.5 px-3 text-center">Posts</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCategories.map((cat) => {
                  const postCount = posts.filter(
                    (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                  ).length;

                  return (
                    <tr key={cat.slug} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900">{cat.name}</span>
                        {cat.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{cat.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        <Link
                          href={`/category/${cat.slug}`}
                          target="_blank"
                          className="hover:text-orange-600 inline-flex items-center gap-1"
                        >
                          /{cat.slug} <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {cat.noindex ? (
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
                        <Link href={`/admin/posts?category=${cat.name}`} className="hover:text-orange-600">
                          {postCount}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-1 text-slate-500 hover:text-orange-600 transition"
                            title="Edit Category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.slug)}
                            className="p-1 text-slate-500 hover:text-rose-600 transition"
                            title="Delete Category"
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
