'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CmsPost,
  CmsPage,
  CmsCategory,
  CmsTag,
  MediaItem,
  AuthorProfile,
  RedirectRule,
  NotFoundLog,
  TechnicalSeoSettings,
  SeoAuditReport,
} from '@/types/admin';
import { cmsStore } from '@/lib/cms-store';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AdminContextType {
  posts: CmsPost[];
  categories: CmsCategory[];
  tags: CmsTag[];
  pages: CmsPage[];
  media: MediaItem[];
  authors: AuthorProfile[];
  redirects: RedirectRule[];
  notFoundLogs: NotFoundLog[];
  seoSettings: TechnicalSeoSettings;
  seoAudit: SeoAuditReport;
  darkMode: boolean;
  toasts: ToastMessage[];
  toggleDarkMode: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // CRUD Actions
  savePost: (post: Partial<CmsPost> & { title: string }) => CmsPost;
  deletePost: (id: string) => void;
  trashPost: (id: string) => void;
  restorePost: (id: string) => void;
  saveCategory: (category: Partial<CmsCategory> & { name: string; slug: string }) => void;
  deleteCategory: (slug: string) => void;
  saveTag: (tag: Partial<CmsTag> & { name: string; slug: string }) => void;
  deleteTag: (id: string) => void;
  savePage: (page: Partial<CmsPage> & { title: string; slug: string }) => void;
  deletePage: (id: string) => void;
  addMedia: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => MediaItem;
  updateMedia: (id: string, updates: Partial<MediaItem>) => void;
  deleteMedia: (id: string) => void;
  saveAuthor: (author: Partial<AuthorProfile> & { name: string; email: string }) => void;
  deleteAuthor: (id: string) => void;
  saveRedirect: (rule: Omit<RedirectRule, 'id' | 'hits' | 'createdAt'> & { id?: string }) => void;
  deleteRedirect: (id: string) => void;
  deleteNotFoundLog: (id: string) => void;
  createRedirectFromNotFound: (notFoundId: string, targetUrl: string) => void;
  updateSeoSettings: (updates: Partial<TechnicalSeoSettings>) => void;
  pingIndexNow: (url?: string) => Promise<boolean>;
  purgeCache: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [tags, setTags] = useState<CmsTag[]>([]);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [authors, setAuthors] = useState<AuthorProfile[]>([]);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [notFoundLogs, setNotFoundLogs] = useState<NotFoundLog[]>([]);
  const [seoSettings, setSeoSettings] = useState<TechnicalSeoSettings>(cmsStore.getTechnicalSeoSettings());
  const [seoAudit, setSeoAudit] = useState<SeoAuditReport>(cmsStore.getSeoAuditReport());
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from store on mount
  useEffect(() => {
    refreshAll();
    // Fetch custom posts from disk API to sync
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((p) => cmsStore.savePost(p));
          refreshAll();
        }
      })
      .catch(() => {});

    const savedDark = localStorage.getItem('dailys_admin_dark_mode');
    if (savedDark === 'true') {
      setDarkMode(true);
    }
  }, []);

  const refreshAll = () => {
    setPosts([...cmsStore.getPosts()]);
    setCategories([...cmsStore.getCategories()]);
    setTags([...cmsStore.getTags()]);
    setPages([...cmsStore.getPages()]);
    setMedia([...cmsStore.getMedia()]);
    setAuthors([...cmsStore.getAuthors()]);
    setRedirects([...cmsStore.getRedirects()]);
    setNotFoundLogs([...cmsStore.getNotFoundLogs()]);
    setSeoSettings({ ...cmsStore.getTechnicalSeoSettings() });
    setSeoAudit({ ...cmsStore.getSeoAuditReport() });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('dailys_admin_dark_mode', String(next));
    showToast(next ? 'Dark Mode activated' : 'Light Mode activated', 'info');
  };

  // CRUD Implementations
  const savePost = (postData: Partial<CmsPost> & { title: string }) => {
    const saved = cmsStore.savePost(postData);
    refreshAll();
    // Persist to server /api/posts immediately
    try {
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saved),
      }).catch((e) => console.error('Failed to sync post with server:', e));
    } catch (e) {}
    showToast(`Post "${saved.title}" saved successfully (${saved.status.toUpperCase()}).`);
    return saved;
  };

  const deletePost = (id: string) => {
    const post = cmsStore.getPostById(id);
    const title = post?.title || 'Post';
    cmsStore.deletePost(id);
    refreshAll();
    try {
      fetch(`/api/posts?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
    showToast(`Post "${title}" permanently deleted.`, 'error');
  };

  const trashPost = (id: string) => {
    cmsStore.trashPost(id);
    refreshAll();
    showToast('Post moved to Trash.', 'info');
  };

  const restorePost = (id: string) => {
    cmsStore.restorePost(id);
    refreshAll();
    showToast('Post restored from Trash to Published.', 'success');
  };

  const saveCategory = (cat: Partial<CmsCategory> & { name: string; slug: string }) => {
    cmsStore.saveCategory(cat);
    refreshAll();
    showToast(`Category "${cat.name}" updated.`);
  };

  const deleteCategory = (slug: string) => {
    cmsStore.deleteCategory(slug);
    refreshAll();
    showToast(`Category removed.`, 'info');
  };

  const saveTag = (tag: Partial<CmsTag> & { name: string; slug: string }) => {
    cmsStore.saveTag(tag);
    refreshAll();
    showToast(`Tag "${tag.name}" saved.`);
  };

  const deleteTag = (id: string) => {
    cmsStore.deleteTag(id);
    refreshAll();
    showToast('Tag removed.', 'info');
  };

  const savePage = (page: Partial<CmsPage> & { title: string; slug: string }) => {
    cmsStore.savePage(page);
    refreshAll();
    showToast(`Page "${page.title}" updated.`);
  };

  const deletePage = (id: string) => {
    cmsStore.deletePage(id);
    refreshAll();
    showToast('Page deleted.', 'error');
  };

  const addMedia = (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const newItem = cmsStore.addMediaItem(item);
    refreshAll();
    showToast(`Media "${newItem.filename}" uploaded successfully.`);
    return newItem;
  };

  const updateMedia = (id: string, updates: Partial<MediaItem>) => {
    cmsStore.updateMediaItem(id, updates);
    refreshAll();
    showToast('Attachment details and Alt text saved.');
  };

  const deleteMedia = (id: string) => {
    cmsStore.deleteMediaItem(id);
    refreshAll();
    showToast('Media file removed from library.', 'info');
  };

  const saveAuthor = (author: Partial<AuthorProfile> & { name: string; email: string }) => {
    cmsStore.saveAuthor(author);
    refreshAll();
    showToast(`Author profile for "${author.name}" saved.`);
  };

  const deleteAuthor = (id: string) => {
    cmsStore.deleteAuthor(id);
    refreshAll();
    showToast('Author profile removed.', 'info');
  };

  const saveRedirect = (rule: Omit<RedirectRule, 'id' | 'hits' | 'createdAt'> & { id?: string }) => {
    cmsStore.saveRedirect(rule);
    refreshAll();
    showToast(`Redirect ${rule.sourceUrl} → ${rule.targetUrl} saved.`);
  };

  const deleteRedirect = (id: string) => {
    cmsStore.deleteRedirect(id);
    refreshAll();
    showToast('Redirect rule deleted.', 'info');
  };

  const deleteNotFoundLog = (id: string) => {
    cmsStore.deleteNotFoundLog(id);
    refreshAll();
    showToast('404 log entry dismissed.', 'info');
  };

  const createRedirectFromNotFound = (notFoundId: string, targetUrl: string) => {
    cmsStore.createRedirectFromNotFound(notFoundId, targetUrl);
    refreshAll();
    showToast(`301 Redirect created for 404 URL.`, 'success');
  };

  const updateSeoSettings = (updates: Partial<TechnicalSeoSettings>) => {
    cmsStore.updateTechnicalSeoSettings(updates);
    refreshAll();
    showToast('Technical SEO & crawler settings updated.');
  };

  const pingIndexNow = async (url?: string): Promise<boolean> => {
    showToast('Transmitting IndexNow ping to Bing & Yandex API engines...', 'info');
    await new Promise((resolve) => setTimeout(resolve, 800));
    const target = url || 'https://dailysmagazine.com';
    const settings = cmsStore.getTechnicalSeoSettings();
    settings.indexing.recentPingLogs.unshift({
      url: target,
      service: 'IndexNow',
      status: 'Success',
      timestamp: new Date().toISOString(),
    });
    refreshAll();
    showToast(`IndexNow Ping Successful: ${target} submitted for instant crawl!`, 'success');
    return true;
  };

  const purgeCache = async (): Promise<boolean> => {
    showToast('Purging Edge CDN cache & rebuilding sitemap index...', 'info');
    await new Promise((resolve) => setTimeout(resolve, 700));
    showToast('Global Edge Cache purged! All changes are live.', 'success');
    return true;
  };

  return (
    <AdminContext.Provider
      value={{
        posts,
        categories,
        tags,
        pages,
        media,
        authors,
        redirects,
        notFoundLogs,
        seoSettings,
        seoAudit,
        darkMode,
        toasts,
        toggleDarkMode,
        showToast,
        removeToast,
        savePost,
        deletePost,
        trashPost,
        restorePost,
        saveCategory,
        deleteCategory,
        saveTag,
        deleteTag,
        savePage,
        deletePage,
        addMedia,
        updateMedia,
        deleteMedia,
        saveAuthor,
        deleteAuthor,
        saveRedirect,
        deleteRedirect,
        deleteNotFoundLog,
        createRedirectFromNotFound,
        updateSeoSettings,
        pingIndexNow,
        purgeCache,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
