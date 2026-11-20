'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  CheckSquare,
  Square,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { PostStatus, CmsPost } from '@/types/admin';

export default function AllPostsPage() {
  const { posts, categories, authors, deletePost, trashPost, restorePost, savePost, showToast } = useAdmin();

  // Filters & State
  const [activeTab, setActiveTab] = useState<PostStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedSeoGrade, setSelectedSeoGrade] = useState<'all' | 'good' | 'ok' | 'poor'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

  // Quick edit modal state
  const [quickEditingPost, setQuickEditingPost] = useState<CmsPost | null>(null);
  const [qeTitle, setQeTitle] = useState('');
  const [qeSlug, setQeSlug] = useState('');
  const [qeStatus, setQeStatus] = useState<PostStatus>('published');
  const [qeCategory, setQeCategory] = useState('');

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: posts.filter((p) => p.status !== 'trash').length,
      published: posts.filter((p) => p.status === 'published').length,
      draft: posts.filter((p) => p.status === 'draft').length,
      scheduled: posts.filter((p) => p.status === 'scheduled').length,
      trash: posts.filter((p) => p.status === 'trash').length,
    };
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Tab filter
      if (activeTab === 'all') {
        if (post.status === 'trash') return false;
      } else {
        if (post.status !== activeTab) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }

      // Author filter
      if (selectedAuthor !== 'all' && (post.author?.name || post.authorName) !== selectedAuthor) {
        return false;
      }

      // SEO Grade filter
      if (selectedSeoGrade !== 'all') {
        const score = post.seo.seoScore || 85;
        if (selectedSeoGrade === 'good' && score < 80) return false;
        if (selectedSeoGrade === 'ok' && (score < 60 || score >= 80)) return false;
        if (selectedSeoGrade === 'poor' && score >= 60) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesSlug = post.slug.toLowerCase().includes(q);
        const matchesKeyword = post.seo.focusKeyword?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSlug && !matchesKeyword) return false;
      }

      return true;
    });
  }, [posts, activeTab, selectedCategory, selectedAuthor, selectedSeoGrade, searchQuery]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPostIds(filteredPosts.map((p) => p.id));
    } else {
      setSelectedPostIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedPostIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleApplyBulkAction = () => {
    if (!bulkAction) {
      showToast('Select an action to apply', 'info');
      return;
    }
    if (selectedPostIds.length === 0) {
      showToast('No posts selected', 'error');
      return;
    }

    if (bulkAction === 'trash') {
      selectedPostIds.forEach((id) => trashPost(id));
      setSelectedPostIds([]);
      showToast(`Moved ${selectedPostIds.length} posts to Trash`, 'success');
    } else if (bulkAction === 'delete') {
      selectedPostIds.forEach((id) => deletePost(id));
      setSelectedPostIds([]);
      showToast(`Permanently deleted ${selectedPostIds.length} posts`, 'success');
    } else if (bulkAction === 'publish') {
      selectedPostIds.forEach((id) => {
        const p = posts.find((item) => item.id === id);
        if (p) savePost({ ...p, status: 'published' });
      });
      setSelectedPostIds([]);
      showToast(`Published ${selectedPostIds.length} posts`, 'success');
    }
    setBulkAction('');
  };

  const openQuickEdit = (post: CmsPost) => {
    setQuickEditingPost(post);
    setQeTitle(post.title);
    setQeSlug(post.slug);
    setQeStatus(post.status);
    setQeCategory(post.category);
  };

  const saveQuickEdit = () => {
    if (!quickEditingPost) return;
    savePost({
      ...quickEditingPost,
      title: qeTitle,
      slug: qeSlug,
      status: qeStatus,
      category: qeCategory as any,
    });
    setQuickEditingPost(null);
    showToast('Post updated via Quick Edit', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add New Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-slate-900">Posts</h1>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Post
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your articles, schema classifications, and technical indexation status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
          />
        </div>
      </div>

      {/* WordPress-Style Filter Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-4 text-xs border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`font-semibold pb-1 border-b-2 transition ${
            activeTab === 'all'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          All <span className="text-slate-400 font-normal">({counts.all})</span>
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setActiveTab('published')}
          className={`font-semibold pb-1 border-b-2 transition ${
            activeTab === 'published'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Published <span className="text-slate-400 font-normal">({counts.published})</span>
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setActiveTab('draft')}
          className={`font-semibold pb-1 border-b-2 transition ${
            activeTab === 'draft'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Drafts <span className="text-slate-400 font-normal">({counts.draft})</span>
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`font-semibold pb-1 border-b-2 transition ${
            activeTab === 'scheduled'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Scheduled <span className="text-slate-400 font-normal">({counts.scheduled})</span>
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setActiveTab('trash')}
          className={`font-semibold pb-1 border-b-2 transition ${
            activeTab === 'trash'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Trash <span className="text-slate-400 font-normal">({counts.trash})</span>
        </button>
      </div>

      {/* Action Bar: Bulk Actions & Secondary Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none"
          >
            <option value="">Bulk actions</option>
            {activeTab !== 'trash' ? (
              <>
                <option value="trash">Move to Trash</option>
                <option value="publish">Mark as Published</option>
              </>
            ) : (
              <option value="delete">Delete Permanently</option>
            )}
          </select>
          <button
            onClick={handleApplyBulkAction}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-xs transition border border-slate-200"
          >
            Apply
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Author Filter */}
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none"
          >
            <option value="all">All Authors</option>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          {/* SEO Score Filter */}
          <select
            value={selectedSeoGrade}
            onChange={(e) => setSelectedSeoGrade(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none"
          >
            <option value="all">All SEO Scores</option>
            <option value="good">Good (80-100)</option>
            <option value="ok">Needs Work (60-79)</option>
            <option value="poor">Poor (0-59)</option>
          </select>

          {(selectedCategory !== 'all' || selectedAuthor !== 'all' || selectedSeoGrade !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedAuthor('all');
                setSelectedSeoGrade('all');
                setSearchQuery('');
              }}
              className="text-orange-600 hover:text-orange-700 font-semibold px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredPosts.length > 0 && selectedPostIds.length === filteredPosts.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                </th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Categories</th>
                <th className="py-3 px-3">Tags</th>
                <th className="py-3 px-3 text-center">SEO Score</th>
                <th className="py-3 px-3 text-center">Index</th>
                <th className="py-3 px-3 text-center">Schema</th>
                <th className="py-3 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No posts matched the current filters.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const score = post.seo.seoScore || 85;
                  const isSelected = selectedPostIds.includes(post.id);

                  return (
                    <tr
                      key={post.id}
                      className={`group hover:bg-slate-50/70 transition ${
                        isSelected ? 'bg-orange-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(post.id)}
                          className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                        />
                      </td>

                      {/* Title & Quick Actions */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          <Link href={`/admin/posts/${post.id}`} className="hover:text-orange-600">
                            {post.title}
                          </Link>
                          {post.status !== 'published' && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              {post.status}
                            </span>
                          )}
                        </div>

                        {/* Permalink Slug */}
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          /{post.slug}
                          {post.seo.focusKeyword && (
                            <span className="ml-2 text-slate-500 font-sans">
                              &bull; Focus: <span className="text-orange-600 font-semibold">{post.seo.focusKeyword}</span>
                            </span>
                          )}
                        </div>

                        {/* Hover Action Links (Classic WordPress Style) */}
                        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                          {post.status !== 'trash' ? (
                            <>
                              <Link
                                href={`/admin/posts/${post.id}`}
                                className="text-orange-600 hover:text-orange-700 font-medium"
                              >
                                Edit
                              </Link>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => openQuickEdit(post)}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Quick Edit
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => {
                                  trashPost(post.id);
                                  showToast(`"${post.title}" moved to trash`, 'info');
                                }}
                                className="text-rose-600 hover:text-rose-700 font-medium"
                              >
                                Trash
                              </button>
                              <span className="text-slate-300">|</span>
                              <Link
                                href={`/${post.category || 'culture'}/${post.slug}`}
                                target="_blank"
                                className="text-slate-500 hover:text-slate-700 font-medium inline-flex items-center gap-0.5"
                              >
                                View <ExternalLink className="w-3 h-3" />
                              </Link>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  restorePost(post.id);
                                  showToast(`"${post.title}" restored`, 'success');
                                }}
                                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" /> Restore
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => {
                                  deletePost(post.id);
                                  showToast(`"${post.title}" permanently deleted`, 'info');
                                }}
                                className="text-rose-600 hover:text-rose-700 font-medium"
                              >
                                Delete Permanently
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                        {post.author?.name || post.authorName}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          {post.category}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {post.tags.slice(0, 2).map((t, i) => (
                            <span key={i} className="text-[10px] text-slate-500">
                              #{t}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{post.tags.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* SEO Score Badge */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            score >= 80
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : score >= 60
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {score}/100
                        </span>
                      </td>

                      {/* Index Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {post.seo.noindex ? (
                          <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            noindex
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            index
                          </span>
                        )}
                      </td>

                      {/* Schema Type */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {post.seo.schemaType || 'NewsArticle'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-right text-slate-500 whitespace-nowrap">
                        <div className="font-medium text-slate-900">
                          {post.status === 'published' ? 'Published' : 'Modified'}
                        </div>
                        <div className="text-[11px]">
                          {new Date(post.publishedAt || post.updatedAt || Date.now()).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {quickEditingPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
              Quick Edit: {quickEditingPost.title}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={qeTitle}
                  onChange={(e) => setQeTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slug (Permalink)</label>
                <input
                  type="text"
                  value={qeSlug}
                  onChange={(e) => setQeSlug(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={qeCategory}
                    onChange={(e) => setQeCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={qeStatus}
                    onChange={(e) => setQeStatus(e.target.value as PostStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setQuickEditingPost(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={saveQuickEdit}
                className="px-4 py-2 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded transition shadow-xs"
              >
                Update Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
