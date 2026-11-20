'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Save,
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
  UploadCloud,
  FolderOpen,
  X,
  CheckCircle2,
} from 'lucide-react';
import { CmsPost, CmsCategory, AuthorProfile, PostStatus, PostSeoData, MediaItem } from '@/types/admin';
import { useAdmin } from './AdminContext';
import OnPageSeoMetabox from '@/components/seo/OnPageSeoMetabox';
import { CATEGORIES } from '@/data/categories';

interface PostEditorProps {
  initialPost?: CmsPost;
  isNew?: boolean;
}

// 8 Primary Editorial Categories definition guaranteed to always be available
const CORE_EDITORIAL_CATEGORIES = [
  { slug: 'culture', name: 'Culture', color: 'text-purple-600', bgColor: 'bg-purple-100', dot: 'bg-purple-500' },
  { slug: 'lifestyle', name: 'Lifestyle', color: 'text-orange-600', bgColor: 'bg-orange-100', dot: 'bg-orange-500' },
  { slug: 'tech', name: 'Tech', color: 'text-blue-600', bgColor: 'bg-blue-100', dot: 'bg-blue-500' },
  { slug: 'business', name: 'Business', color: 'text-amber-700', bgColor: 'bg-amber-100', dot: 'bg-amber-500' },
  { slug: 'ideas', name: 'Ideas', color: 'text-indigo-600', bgColor: 'bg-indigo-100', dot: 'bg-indigo-500' },
  { slug: 'design', name: 'Design', color: 'text-pink-600', bgColor: 'bg-pink-100', dot: 'bg-pink-500' },
  { slug: 'climate', name: 'Climate', color: 'text-emerald-700', bgColor: 'bg-emerald-100', dot: 'bg-emerald-500' },
  { slug: 'wellness', name: 'Wellness', color: 'text-teal-700', bgColor: 'bg-teal-100', dot: 'bg-teal-500' },
];

// Clean pasted HTML to remove Word / Google Docs junk while preserving editorial formatting
function cleanPastedHtml(rawHtml: string): string {
  if (typeof window === 'undefined') return rawHtml;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    // Remove scripts, styles, meta, xml comments
    const toRemove = doc.querySelectorAll('script, style, meta, link, noscript');
    toRemove.forEach((el) => el.remove());

    // Clean attributes from elements, keeping useful structural ones
    const allElements = doc.querySelectorAll('*');
    allElements.forEach((el) => {
      const allowedAttrs = ['href', 'src', 'alt', 'title', 'target', 'rel'];
      const attributes = Array.from(el.attributes);
      attributes.forEach((attr) => {
        if (!allowedAttrs.includes(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name);
        }
      });
      // Convert legacy bold/italic tags
      if (el.tagName.toLowerCase() === 'b') {
        const strong = doc.createElement('strong');
        strong.innerHTML = el.innerHTML;
        el.replaceWith(strong);
      } else if (el.tagName.toLowerCase() === 'i') {
        const em = doc.createElement('em');
        em.innerHTML = el.innerHTML;
        el.replaceWith(em);
      }
    });

    return doc.body.innerHTML;
  } catch (err) {
    return rawHtml;
  }
}

export default function PostEditor({ initialPost, isNew = false }: PostEditorProps) {
  const router = useRouter();
  const { categories, media, addMedia, authors, savePost, deletePost, saveCategory, showToast } = useAdmin();

  // Combine core categories with any custom categories created in CMS
  const allCategoriesMap = new Map<string, { slug: string; name: string; dot: string; color: string; bgColor: string }>();
  CORE_EDITORIAL_CATEGORIES.forEach((c) => allCategoriesMap.set(c.slug, c));
  categories.forEach((c) => {
    if (!allCategoriesMap.has(c.slug)) {
      allCategoriesMap.set(c.slug, {
        slug: c.slug,
        name: c.name,
        dot: 'bg-orange-500',
        color: c.color || 'text-orange-600',
        bgColor: c.bgColor || 'bg-orange-100',
      });
    }
  });
  const allDisplayCategories = Array.from(allCategoriesMap.values());

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
  const visualEditorRef = useRef<HTMLDivElement>(null);

  // Featured Image Upload & Media Picker State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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

  // Keep visual editor content in sync
  useEffect(() => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== content) {
        visualEditorRef.current.innerHTML = content || '<p>Start drafting your story or paste your article content here...</p>';
      }
    }
  }, [editorMode]);

  // Word count & stats
  const wordCount = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Headings outline
  const headingList = (content.match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi) || []).map((h) => {
    const isH2 = h.toLowerCase().startsWith('<h2');
    const isH3 = h.toLowerCase().startsWith('<h3');
    const text = h.replace(/<[^>]*>/g, '');
    return { level: isH2 ? 2 : isH3 ? 3 : 4, text };
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

  // Formatting Helper for Visual and HTML modes
  const applyCommand = (command: string, value: string | undefined = undefined) => {
    if (editorMode === 'visual') {
      document.execCommand(command, false, value);
      if (visualEditorRef.current) {
        setContent(visualEditorRef.current.innerHTML);
      }
    } else {
      if (command === 'bold') insertFormatting('<strong>', '</strong>');
      else if (command === 'italic') insertFormatting('<em>', '</em>');
      else if (command === 'strikeThrough') insertFormatting('<strike>', '</strike>');
      else if (command === 'insertUnorderedList') insertFormatting('<ul>\n  <li>', '</li>\n</ul>');
      else if (command === 'insertOrderedList') insertFormatting('<ol>\n  <li>', '</li>\n</ol>');
    }
  };

  const insertFormatting = (before: string, after: string = '') => {
    setContent((prev) => `${prev}\n${before}Selected text${after}\n`);
  };

  // Content Paste Handler - preserves rich text and website font styling
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardHtml = e.clipboardData.getData('text/html');
    const clipboardText = e.clipboardData.getData('text/plain');

    if (clipboardHtml) {
      const cleaned = cleanPastedHtml(clipboardHtml);
      document.execCommand('insertHTML', false, cleaned);
    } else if (clipboardText) {
      const paragraphs = clipboardText
        .split(/\r?\n\r?\n/)
        .map((p) => `<p>${p.trim().replace(/\r?\n/g, '<br/>')}</p>`)
        .filter(Boolean)
        .join('');
      document.execCommand('insertHTML', false, paragraphs || `<p>${clipboardText}</p>`);
    }

    if (visualEditorRef.current) {
      setContent(visualEditorRef.current.innerHTML);
    }
    showToast('Pasted content formatted to website editorial style.', 'info');
  };

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setContent(visualEditorRef.current.innerHTML);
    }
  };

  // Featured Image File Upload Handler
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, GIF).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setCoverImage(dataUrl);

      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      if (!coverImageAlt) {
        setCoverImageAlt(cleanTitle);
      }

      // Automatically register asset in media library
      const sizeStr = Math.round(file.size / 1024) + ' KB';
      try {
        addMedia({
          url: dataUrl,
          title: cleanTitle,
          altText: cleanTitle,
          caption: '',
          dimensions: 'Auto',
          fileSize: sizeStr,
          format: file.type.split('/')[1]?.toUpperCase() || 'JPEG',
        });
      } catch (err) {}

      showToast(`Featured image "${file.name}" uploaded successfully!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const insertLink = () => {
    if (!linkUrl) return;
    const rels: string[] = [];
    if (linkRelNofollow) rels.push('nofollow');
    if (linkRelSponsored) rels.push('sponsored');
    if (linkRelUgc) rels.push('ugc');
    const relAttr = rels.length > 0 ? ` rel="${rels.join(' ')}"` : '';
    const anchor = `<a href="${linkUrl}"${relAttr} target="_blank">${linkText || linkUrl}</a>`;

    if (editorMode === 'visual') {
      document.execCommand('insertHTML', false, anchor);
      if (visualEditorRef.current) {
        setContent(visualEditorRef.current.innerHTML);
      }
    } else {
      setContent((prev) => `${prev} ${anchor} `);
    }

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
    const catObj = allDisplayCategories.find((c) => c.slug === category);
    const finalSlug = slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const saved = savePost({
      id: initialPost?.id,
      title: title.trim(),
      slug: finalSlug,
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
      seo: {
        ...seoData,
        canonicalUrl: seoData.canonicalUrl || `https://dailysmagazine.com/${category || 'culture'}/${finalSlug}`,
        seoTitle: seoData.seoTitle || `${title} | DailysMagazine`,
        metaDescription: seoData.metaDescription || excerpt || subtitle || title,
      },
    });

    if (newStatus === 'published' && isNew) {
      router.push(`/admin/posts/${saved.id}`);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
        }}
      />

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
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

            {/* Editable Permalink Slug Bar with Dynamic Category */}
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

          {/* WordPress Rich Block / Content Editor with Exact Website Typography */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            {/* Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1 text-slate-700 text-xs">
                {/* Heading dropdown */}
                <select
                  onChange={(e) => {
                    const tag = e.target.value;
                    if (tag) applyCommand('formatBlock', `<${tag}>`);
                  }}
                  className="px-2 py-1 bg-white border border-slate-300 rounded-lg font-semibold text-xs text-slate-800 cursor-pointer"
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
                  onClick={() => applyCommand('bold')}
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyCommand('italic')}
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyCommand('strikeThrough')}
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                {/* Lists & Quotes */}
                <button
                  type="button"
                  onClick={() => applyCommand('insertUnorderedList')}
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyCommand('insertOrderedList')}
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editorMode === 'visual') {
                      document.execCommand(
                        'insertHTML',
                        false,
                        '<blockquote>&ldquo;Compelling quote statement goes here.&rdquo; &mdash; <cite>Quote Attribution</cite></blockquote><p></p>'
                      );
                      handleVisualInput();
                    } else {
                      insertFormatting('<blockquote>', '</blockquote>');
                    }
                  }}
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertFormatting(
                      '<table class="w-full border">\n  <thead><tr><th class="border p-2">Column 1</th><th class="border p-2">Column 2</th></tr></thead>\n  <tbody><tr><td class="border p-2">Data 1</td><td class="border p-2">Data 2</td></tr></tbody>\n</table>'
                    )
                  }
                  className="p-1.5 rounded hover:bg-slate-200 transition-colors"
                  title="Table"
                >
                  <TableIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                {/* Link Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(true)}
                  className="p-1.5 rounded hover:bg-slate-200 text-blue-600 font-bold flex items-center gap-1 transition-colors"
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
                  Visual (Rich Text)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (visualEditorRef.current) {
                      setContent(visualEditorRef.current.innerHTML);
                    }
                    setEditorMode('html');
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    editorMode === 'html' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-orange-600'
                  }`}
                >
                  Text / HTML
                </button>
              </div>
            </div>

            {/* Editor Canvas with Website Font Styling */}
            <div className="min-h-[460px]">
              {editorMode === 'html' ? (
                <div className="p-4 sm:p-6">
                  <textarea
                    rows={20}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter HTML or raw article markup..."
                    className="w-full font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
                  />
                </div>
              ) : (
                /* Rich Text Visual Canvas matching front-end website typography exactly */
                <div
                  ref={visualEditorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleVisualInput}
                  onPaste={handlePaste}
                  className="w-full min-h-[460px] p-6 focus:outline-none font-body text-[17px] leading-[1.7] text-slate-700 bg-white
                  [&_h1]:font-heading [&_h1]:font-extrabold [&_h1]:text-3xl [&_h1]:text-slate-900 [&_h1]:mb-4
                  [&_h2]:font-heading [&_h2]:font-extrabold [&_h2]:text-2xl [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-slate-100
                  [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-xl [&_h3]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-2
                  [&_h4]:font-heading [&_h4]:font-bold [&_h4]:text-lg [&_h4]:text-slate-900 [&_h4]:mt-4 [&_h4]:mb-2
                  [&_p]:mb-4 [&_p]:leading-[1.7]
                  [&_blockquote]:my-6 [&_blockquote]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:py-3 [&_blockquote]:bg-orange-50/50 [&_blockquote]:rounded-r-2xl [&_blockquote]:pr-4 [&_blockquote]:italic [&_blockquote]:font-serif [&_blockquote]:text-slate-900
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5
                  [&_li]:text-slate-700
                  [&_a]:text-orange-600 [&_a]:underline [&_a]:font-semibold
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                  [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2.5 [&_th]:text-left [&_th]:font-bold
                  [&_td]:border [&_td]:border-slate-200 [&_td]:p-2.5
                  [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:my-6 [&_img]:max-w-full"
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
                    <span className="text-[10px] text-slate-400 font-semibold">
                      +{headingList.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* On-Page SEO & Schema Metabox */}
          <OnPageSeoMetabox
            title={title}
            slug={slug}
            content={content}
            excerpt={excerpt}
            coverImage={coverImage}
            coverImageAlt={coverImageAlt}
            categoryName={allDisplayCategories.find((c) => c.slug === category)?.name || 'Culture'}
            authorName={authors.find((a) => a.id === authorId)?.name || 'Elena Vance'}
            authorAvatar={authors.find((a) => a.id === authorId)?.avatar}
            publishedAt={publishDate}
            seoData={seoData}
            onChange={(updatedSeo) => setSeoData(updatedSeo)}
          />
        </div>

        {/* Right Sidebar (4 cols ~ 30%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Publish / Status Metabox */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Publish Settings
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="trash">Trash</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Visibility:</span>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="password">Password Protected</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Publish Date:</span>
                <input
                  type="text"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold text-right w-36"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {!isNew && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Permanently delete this story?')) {
                      if (initialPost?.id) deletePost(initialPost.id);
                      router.push('/admin/posts');
                    }
                  }}
                  className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSave('published')}
                className="ml-auto px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                {status === 'published' ? 'Update Post' : 'Publish Story'}
              </button>
            </div>
          </div>

          {/* 2. Author Persona Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Author (E-E-A-T Persona)
            </h3>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Primary Category Checklist - All 8 Categories Guaranteed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
                  Primary Category
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">All 8 Core Sections</span>
              </div>
              <button
                type="button"
                onClick={() => setNewCatOpen(!newCatOpen)}
                className="text-xs text-orange-600 font-bold flex items-center gap-0.5 hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>Custom</span>
              </button>
            </div>

            {/* Inline Add Custom Category */}
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

            {/* List of All Categories */}
            <div className="space-y-1.5 text-xs">
              {allDisplayCategories.map((cat) => {
                const isSelected = category === cat.slug;
                return (
                  <label
                    key={cat.slug}
                    onClick={() => setCategory(cat.slug as any)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-orange-50/80 border-orange-300 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.dot} shrink-0`} />
                      <span className={`font-semibold ${isSelected ? 'text-orange-950 font-bold' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">/{cat.slug}</span>
                      <input
                        type="radio"
                        name="primary_category"
                        checked={isSelected}
                        onChange={() => setCategory(cat.slug as any)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Taxonomy Tags Input */}
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

          {/* 5. Featured Image Picker with Direct File Upload */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
                Featured Cover Image
              </h3>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Media Library</span>
              </button>
            </div>

            {/* Drag & Drop Upload Zone + Preview */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              className={`relative aspect-[16/9] w-full rounded-xl overflow-hidden border-2 transition-all group ${
                isDraggingOver
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              {coverImage ? (
                <>
                  <Image
                    src={coverImage}
                    alt={coverImageAlt || 'Featured Image'}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-md hover:bg-slate-100 flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-orange-600" />
                      <span>Replace from Computer</span>
                    </button>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer"
                >
                  <UploadCloud className="w-8 h-8 text-orange-500 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Click or drag image file here</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, WebP up to 10MB</p>
                </div>
              )}
            </div>

            {/* Direct Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-orange-600" />
              <span>Upload Image from Device</span>
            </button>

            {/* Image URL Input Option */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Or Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            {/* Required Alt Text for SEO */}
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

      {/* Media Library Picker Modal */}
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h4 className="font-heading font-bold text-slate-900 text-base flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-orange-500" />
                Select Image from Media Library
              </h4>
              <button onClick={() => setMediaPickerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {media.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCoverImage(item.url);
                      if (item.altText && !coverImageAlt) {
                        setCoverImageAlt(item.altText);
                      }
                      setMediaPickerOpen(false);
                      showToast(`Selected "${item.title}" from Media Library`, 'info');
                    }}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-orange-500 hover:ring-2 hover:ring-orange-500/20 transition-all bg-slate-100"
                  >
                    <Image src={item.url} alt={item.title} fill sizes="160px" className="object-cover" />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] text-white font-semibold truncate">{item.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMediaPickerOpen(false);
                  fileInputRef.current?.click();
                }}
                className="px-3.5 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100 flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload New Image</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
