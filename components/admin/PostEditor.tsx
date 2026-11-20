'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Save,
  Eye,
  Send,
  Trash2,
  Calendar,
  Lock,
  Globe,
  Tag,
  Folder,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  Bold,
  Italic,
  Strikethrough,
  Table as TableIcon,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { CmsPost, CmsCategory, AuthorProfile, PostStatus, PostSeoData } from '@/types/admin';
import { useAdmin } from './AdminContext';
import OnPageSeoMetabox from '@/components/seo/OnPageSeoMetabox';

interface PostEditorProps {
  initialPost?: CmsPost;
  isNew?: boolean;
}

export default function PostEditor({ initialPost, isNew = false }: PostEditorProps) {
  const router = useRouter();
  const { categories, authors, savePost, deletePost, saveCategory, showToast } = useAdmin();

  // Core Form State
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [tempSlug, setTempSlug] = useState(slug);
  const [content, setContent] = useState(initialPost?.content || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [subtitle, setSubtitle] = useState(initialPost?.subtitle || '');
  const [category, setCategory] = useState(initialPost?.category || 'culture');
  const [tags, setTags] = useState<string[]>(initialPost?.tags || ['Culture']);
  const [tagInput, setTagInput] = useState('');
  const [authorId, setAuthorId] = useState(initialPost?.authorId || authors[0]?.id || 'auth-1');
  const [status, setStatus] = useState<PostStatus>(initialPost?.status || 'published');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'password'>(initialPost?.visibility || 'public');
  const [publishDate, setPublishDate] = useState(
    initialPost?.publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  );
  const [coverImage, setCoverImage] = useState(
    initialPost?.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80'
  );
  const [coverImageAlt, setCoverImageAlt] = useState(initialPost?.coverImageAlt || '');
  const [featured, setFeatured] = useState(!!initialPost?.featured);
  const [trending, setTrending] = useState(!!initialPost?.trending);
  const [mustRead, setMustRead] = useState(!!initialPost?.mustRead);

  // Editor View Mode: Visual vs HTML
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkRelNofollow, setLinkRelNofollow] = useState(false);
  const [linkRelSponsored, setLinkRelSponsored] = useState(false);
  const [linkRelUgc, setLinkRelUgc] = useState(false);

  // New Category Inline Form State
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // SEO Metabox State
  const [seoData, setSeoData] = useState<PostSeoData>(
    initialPost?.seo || {
      focusKeyword: initialPost?.tags?.[0] || 'Culture',
      secondaryKeywords: initialPost?.tags?.slice(1) || [],
      seoTitle: initialPost ? `${initialPost.title} | DailysMagazine` : '',
      metaDescription: initialPost?.excerpt || '',
      canonicalUrl: initialPost ? `https://dailysmagazine.com/${initialPost.category || 'culture'}/${initialPost.slug}` : '',
      robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
      breadcrumbTitle: initialPost?.title?.split(':')[0] || '',
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
    }
  );

  // Word count & stats
  const wordCount = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Headings outline
  const headingList = (content.match(/<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi) || []).map((h) => {
    const isH2 = h.toLowerCase().startsWith('<h2');
    const text = h.replace(/<[^>]*>/g, '');
    return { level: isH2 ? 2 : 3, text };
  });

  // Handle Slug Changes
  const handleSaveSlug = () => {
    const clean = tempSlug
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(clean);
    setIsEditingSlug(false);
  };

  // Add Tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  // Inline Category Add
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catSlug = newCatName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    saveCategory({
      name: newCatName.trim(),
      slug: catSlug,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      accentHex: '#F97316',
    });
    setCategory(catSlug as any);
    setNewCatName('');
    setNewCatOpen(false);
  };

  // Rich Text Insertion Helper
  const insertFormatting = (before: string, after: string = '') => {
    setContent((prev) => `${prev}\n${before}Selected text${after}\n`);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    const rels: string[] = [];
    if (linkRelNofollow) rels.push('nofollow');
    if (linkRelSponsored) rels.push('sponsored');
    if (linkRelUgc) rels.push('ugc');
    const relAttr = rels.length > 0 ? ` rel="${rels.join(' ')}"` : '';
    const anchor = `<a href="${linkUrl}"${relAttr} target="_blank">${linkText || linkUrl}</a>`;
    setContent((prev) => `${prev} ${anchor} `);
    setLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
    setLinkRelNofollow(false);
    setLinkRelSponsored(false);
    setLinkRelUgc(false);
  };

  // Main Save / Publish Handler
  const handleSave = (newStatus?: PostStatus) => {
    if (!title.trim()) {
      showToast('Please provide an article title before saving.', 'error');
      return;
    }

    const currentStatus = newStatus || status;
    const author = authors.find((a) => a.id === authorId) || authors[0];
    const catObj = categories.find((c) => c.slug === category);

    const saved = savePost({
      id: initialPost?.id,
      title: title.trim(),
      slug: slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      subtitle: subtitle.trim(),
      excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, '').slice(0, 150),
      content: content,
      category: category as any,
      categoryName: catObj?.name || 'Culture',
      tags: tags,
      authorId: author?.id || 'auth-1',
      authorName: author?.name || 'Elena Vance',
      authorAvatar: author?.avatar || '',
      status: currentStatus,
      visibility: visibility,
      publishedAt: publishDate,
      coverImage: coverImage,
      coverImageAlt: coverImageAlt || title,
      featured,
      trending,
      mustRead,
      seo: seoData,
    });

    if (isNew) {
      router.push(`/admin/posts/${saved.id}`);
    }
  };

  const selectedAuthor = authors.find((a) => a.id === authorId) || authors[0];
  const catObj = categories.find((c) => c.slug === category);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
            >
              ← Posts
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-500">
              {isNew ? 'Add New Post' : `Edit Post #${initialPost?.id}`}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {isNew ? 'Create New Editorial Story' : 'Edit Story & On-Page SEO'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={slug ? `/${category || 'culture'}/${slug}` : '#'}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Preview in Reader</span>
          </Link>

          <button
            onClick={() => handleSave('draft')}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSave('published')}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{status === 'published' ? 'Update Post' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column WordPress Layout (70% Left / 30% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column (8 cols ~ 70%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Post Title Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (isNew && !isEditingSlug) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                    );
                  }
                }}
                placeholder="Add Post Title (H1)..."
                className="w-full text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 placeholder-slate-300 focus:outline-none border-b border-transparent focus:border-orange-500 pb-2 transition-colors"
              />
            </div>

            {/* Editable Permalink Slug Bar */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-700">Permalink:</span>
              <span className="text-slate-400">https://dailysmagazine.com/{category || 'culture'}/</span>
              {isEditingSlug ? (
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    value={tempSlug}
                    onChange={(e) => setTempSlug(e.target.value)}
                    className="px-2 py-0.5 bg-white border border-orange-500 rounded text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveSlug}
                    className="px-2 py-0.5 bg-orange-600 text-white rounded text-[11px] font-bold"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempSlug(slug);
                      setIsEditingSlug(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 px-1 text-[11px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span className="font-bold text-orange-600 font-mono">{slug || 'your-slug'}</span>
              )}
              {!isEditingSlug && (
                <button
                  type="button"
                  onClick={() => {
                    setTempSlug(slug);
                    setIsEditingSlug(true);
                  }}
                  className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-semibold ml-1"
                >
                  Edit Slug
                </button>
              )}
            </div>

            {/* Subtitle / Deck */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Story Deck / Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Secondary deck explaining the core premise..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* WordPress Rich Block / Content Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            {/* Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1 text-slate-700 text-xs">
                {/* Heading dropdown */}
                <select
                  onChange={(e) => {
                    const tag = e.target.value;
                    if (tag) insertFormatting(`<${tag}>`, `</${tag}>`);
                  }}
                  className="px-2 py-1 bg-white border border-slate-300 rounded-lg font-semibold text-xs text-slate-800"
                >
                  <option value="">Headings</option>
                  <option value="h2">Heading 2 (H2)</option>
                  <option value="h3">Heading 3 (H3)</option>
                  <option value="h4">Heading 4 (H4)</option>
                  <option value="p">Paragraph</option>
                </select>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                {/* Inline formats */}
                <button
                  type="button"
                  onClick={() => insertFormatting('<strong>', '</strong>')}
                  className="p-1.5 rounded hover:bg-slate-200"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<em>', '</em>')}
                  className="p-1.5 rounded hover:bg-slate-200"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<strike>', '</strike>')}
                  className="p-1.5 rounded hover:bg-slate-200"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                {/* Lists & Quotes */}
                <button
                  type="button"
                  onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                  className="p-1.5 rounded hover:bg-slate-200"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                  className="p-1.5 rounded hover:bg-slate-200"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                  className="p-1.5 rounded hover:bg-slate-200"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<pre><code>', '</code></pre>')}
                  className="p-1.5 rounded hover:bg-slate-200"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertFormatting(
                      '<table class="w-full border">\n  <thead><tr><th class="border p-2">Column 1</th><th class="border p-2">Column 2</th></tr></thead>\n  <tbody><tr><td class="border p-2">Data 1</td><td class="border p-2">Data 2</td></tr></tbody>\n</table>'
                    )
                  }
                  className="p-1.5 rounded hover:bg-slate-200"
                  title="Table"
                >
                  <TableIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                {/* Link Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(true)}
                  className="p-1.5 rounded hover:bg-slate-200 text-blue-600 font-bold flex items-center gap-1"
                  title="Insert Link with SEO attributes"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="text-[11px]">Link</span>
                </button>
              </div>

              {/* Visual vs HTML View Switcher */}
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEditorMode('visual')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    editorMode === 'visual' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'
                  }`}
                >
                  Visual
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('html')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    editorMode === 'html' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'
                  }`}
                >
                  Text / HTML
                </button>
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="p-4 sm:p-6 min-h-[380px]">
              {editorMode === 'html' ? (
                <textarea
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter HTML or raw article markup..."
                  className="w-full font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                />
              ) : (
                <textarea
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your story body content here with headings, paragraphs, and quotes..."
                  className="w-full text-sm leading-relaxed text-slate-800 focus:outline-none resize-y"
                />
              )}
            </div>

            {/* WordPress Bottom Bar: Word Count & Heading Outline */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  Words: <strong className="text-slate-900">{wordCount}</strong>
                </span>
                <span>•</span>
                <span>
                  Est. Read: <strong className="text-slate-900">{readingTime} min</strong>
                </span>
                <span>•</span>
                <span>
                  Characters: <strong className="text-slate-900">{content.length}</strong>
                </span>
              </div>

              {/* Headings Structure Preview */}
              {headingList.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">Headings:</span>
                  {headingList.slice(0, 4).map((h, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700 truncate max-w-[120px]"
                      title={h.text}
                    >
                      H{h.level}: {h.text}
                    </span>
                  ))}
                  {headingList.length > 4 && (
                    <span className="text-[10px] text-slate-400">+{headingList.length - 4} more</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Embedded On-Page SEO Metabox (RankMath / Yoast style) */}
          <OnPageSeoMetabox
            title={title}
            slug={slug}
            content={content}
            excerpt={excerpt}
            coverImage={coverImage}
            coverImageAlt={coverImageAlt}
            categoryName={catObj?.name || 'Culture'}
            authorName={selectedAuthor?.name || 'Elena Vance'}
            authorAvatar={selectedAuthor?.avatar}
            publishedAt={publishDate}
            seoData={seoData}
            onChange={(updated) => setSeoData(updated)}
          />
        </div>

        {/* Right Sidebar (4 cols ~ 30%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Publish Metabox */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
                Publishing Controls
              </h3>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  status === 'published'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Status:
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="trash">Trash</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Visibility:
                </span>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="password">Password Protected</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Publish Date:
                </span>
                <input
                  type="text"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-32 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 text-right"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {initialPost && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Move this post to trash?')) {
                      deletePost(initialPost.id);
                      router.push('/admin/posts');
                    }
                  }}
                  className="text-rose-600 hover:text-rose-700 text-xs font-bold"
                >
                  Trash
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => handleSave()}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  {status === 'published' ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Author / Persona Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Author & E-E-A-T Persona
            </h3>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            >
              {authors.map((auth) => (
                <option key={auth.id} value={auth.id}>
                  {auth.name} — {auth.role}
                </option>
              ))}
            </select>
            {selectedAuthor && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <Image
                    src={selectedAuthor.avatar}
                    alt={selectedAuthor.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">{selectedAuthor.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{selectedAuthor.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Categories Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
                Primary Category
              </h3>
              <button
                type="button"
                onClick={() => setNewCatOpen(!newCatOpen)}
                className="text-xs text-orange-600 font-bold flex items-center gap-0.5 hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Inline Add Category */}
            {newCatOpen && (
              <form onSubmit={handleCreateCategory} className="p-3 bg-orange-50/60 rounded-xl border border-orange-200 space-y-2">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="New Category Name..."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-orange-600 text-white font-bold text-xs rounded-lg"
                >
                  Create & Select
                </button>
              </form>
            )}

            <div className="max-h-48 overflow-y-auto space-y-2 text-xs">
              {categories.map((cat) => (
                <label key={cat.slug} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat.slug}
                    onChange={() => setCategory(cat.slug as any)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Tags Input */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Taxonomy Tags
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag & press Enter..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200"
                >
                  <span>{t}</span>
                  <button type="button" onClick={() => removeTag(t)} className="text-slate-400 hover:text-slate-700">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 5. Featured Image Picker */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Featured Image
            </h3>
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={coverImage}
                alt={coverImageAlt || 'Featured Image'}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                <span>Required Alt Text *</span>
                {!coverImageAlt && <span className="text-rose-600 font-extrabold text-[10px]">MISSING (SEO PENALTY)</span>}
              </label>
              <input
                type="text"
                required
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder="Descriptive explanation for search engines..."
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold ${
                  !coverImageAlt ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* 6. Excerpt Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-2">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Article Excerpt
            </h3>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short custom excerpt for feeds, category cards, and archives..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed"
            />
          </div>

          {/* 7. Editorial Flags */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-2 text-xs">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Editorial Curation Flags
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="font-semibold text-slate-800">Featured (Homepage Hero Cover)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trending}
                onChange={(e) => setTrending(e.target.checked)}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="font-semibold text-slate-800">Trending Now Ticker</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mustRead}
                onChange={(e) => setMustRead(e.target.checked)}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="font-semibold text-slate-800">Must Read Sidebar Pick</span>
            </label>
          </div>
        </div>
      </div>

      {/* Link Insertion Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-md space-y-4">
            <h4 className="font-heading font-bold text-slate-900 text-base">
              Insert Link with SEO Attributes
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target URL *</label>
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Anchor Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <span className="font-bold text-slate-600 uppercase text-[10px] block">
                  Link Relations (rel attributes)
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkRelNofollow}
                    onChange={(e) => setLinkRelNofollow(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Add rel=&quot;nofollow&quot; (Instruct search bots not to endorse)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkRelSponsored}
                    onChange={(e) => setLinkRelSponsored(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Add rel=&quot;sponsored&quot; (Mark paid advertisements / affiliations)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkRelUgc}
                    onChange={(e) => setLinkRelUgc(e.target.checked)}
                    className="rounded text-orange-600"
                  />
                  <span>Add rel=&quot;ugc&quot; (User generated content / comments)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
