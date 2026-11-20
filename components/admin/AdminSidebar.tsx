'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Files,
  Image as ImageIcon,
  Users,
  Palette,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Flame,
  Globe,
  Bot,
  Shuffle,
  Binary,
  Link2,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from './AdminContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { posts, notFoundLogs } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  // Determine active parent sections
  const isPostsActive = pathname.startsWith('/admin/posts');
  const isPagesActive = pathname.startsWith('/admin/pages');
  const isSeoActive = pathname.startsWith('/admin/seo');

  const [postsOpen, setPostsOpen] = useState(true);
  const [pagesOpen, setPagesOpen] = useState(true);
  const [seoOpen, setSeoOpen] = useState(true);

  return (
    <aside
      className={`bg-white text-slate-700 border-r border-slate-200 transition-all duration-200 flex flex-col shrink-0 select-none shadow-xs ${
        collapsed ? 'w-16' : 'w-56 lg:w-60'
      }`}
    >
      {/* Navigation Links */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto no-scrollbar text-[13px]">
        {/* Dashboard */}
        <Link
          href="/admin"
          className={`flex items-center px-4 py-2.5 transition-colors relative group ${
            pathname === '/admin'
              ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500'
              : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-medium'
          }`}
          title="Dashboard"
        >
          <LayoutDashboard className={`w-4 h-4 shrink-0 ${pathname === '/admin' ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
          {!collapsed && <span className="ml-3 truncate">Dashboard</span>}
        </Link>

        {/* Separator */}
        <div className="h-px bg-slate-100 my-2 mx-3" />

        {/* Posts Group */}
        <div>
          <div
            onClick={() => !collapsed && setPostsOpen(!postsOpen)}
            className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
              isPostsActive
                ? 'bg-orange-50/70 text-orange-600 font-bold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-medium'
            }`}
          >
            <Link
              href="/admin/posts"
              className="flex items-center flex-1"
              title="Posts"
            >
              <FileText className={`w-4 h-4 shrink-0 ${isPostsActive ? 'text-orange-500' : 'text-slate-400'}`} />
              {!collapsed && (
                <span className="ml-3 truncate flex-1 flex items-center justify-between">
                  <span>Posts</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold ml-1 border border-slate-200">
                    {posts.length}
                  </span>
                </span>
              )}
            </Link>
            {!collapsed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPostsOpen(!postsOpen);
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                {postsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {!collapsed && postsOpen && (
            <div className="bg-slate-50/80 border-y border-slate-100 py-1 text-xs">
              <Link
                href="/admin/posts"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/posts'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                All Posts
              </Link>
              <Link
                href="/admin/posts/new"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/posts/new'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Add New Post
              </Link>
              <Link
                href="/admin/posts/categories"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/posts/categories'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Categories
              </Link>
              <Link
                href="/admin/posts/tags"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/posts/tags'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Tags
              </Link>
            </div>
          )}
        </div>

        {/* Pages Group */}
        <div>
          <div
            onClick={() => !collapsed && setPagesOpen(!pagesOpen)}
            className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
              isPagesActive
                ? 'bg-orange-50/70 text-orange-600 font-bold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-medium'
            }`}
          >
            <Link
              href="/admin/pages"
              className="flex items-center flex-1"
              title="Pages"
            >
              <Files className={`w-4 h-4 shrink-0 ${isPagesActive ? 'text-orange-500' : 'text-slate-400'}`} />
              {!collapsed && <span className="ml-3 truncate">Pages</span>}
            </Link>
            {!collapsed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPagesOpen(!pagesOpen);
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                {pagesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {!collapsed && pagesOpen && (
            <div className="bg-slate-50/80 border-y border-slate-100 py-1 text-xs">
              <Link
                href="/admin/pages"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/pages'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                All Pages
              </Link>
              <Link
                href="/admin/pages/new"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/pages/new'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Add New Page
              </Link>
            </div>
          )}
        </div>

        {/* Media */}
        <Link
          href="/admin/media"
          className={`flex items-center px-4 py-2.5 transition-colors relative group ${
            pathname === '/admin/media'
              ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500'
              : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-medium'
          }`}
          title="Media"
        >
          <ImageIcon className={`w-4 h-4 shrink-0 ${pathname === '/admin/media' ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
          {!collapsed && <span className="ml-3 truncate">Media Library</span>}
        </Link>

        {/* Authors & E-E-A-T */}
        <Link
          href="/admin/authors"
          className={`flex items-center px-4 py-2.5 transition-colors relative group ${
            pathname === '/admin/authors'
              ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500'
              : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-medium'
          }`}
          title="Authors & E-E-A-T Personas"
        >
          <Users className={`w-4 h-4 shrink-0 ${pathname === '/admin/authors' ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
          {!collapsed && <span className="ml-3 truncate">Authors & E-E-A-T</span>}
        </Link>

        {/* Appearance & Monetization */}
        <Link
          href="/admin/appearance"
          className={`flex items-center px-4 py-2.5 transition-colors relative group ${
            pathname === '/admin/appearance'
              ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500'
              : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-medium'
          }`}
          title="Appearance & Ads"
        >
          <Palette className={`w-4 h-4 shrink-0 ${pathname === '/admin/appearance' ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
          {!collapsed && <span className="ml-3 truncate">Appearance & Ads</span>}
        </Link>

        {/* Separator: SEO Suite Section */}
        <div className="h-px bg-slate-100 my-2 mx-3" />

        {/* Technical SEO Header */}
        {!collapsed && (
          <div className="px-4 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Technical SEO Suite</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 font-bold">
              PRO
            </span>
          </div>
        )}

        {/* Technical SEO Group */}
        <div>
          <div
            onClick={() => !collapsed && setSeoOpen(!seoOpen)}
            className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
              isSeoActive
                ? 'bg-orange-50/70 text-orange-600 font-bold'
                : 'hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-medium'
            }`}
          >
            <Link
              href="/admin/seo"
              className="flex items-center flex-1"
              title="SEO Audit & Tools"
            >
              <ShieldCheck className={`w-4 h-4 shrink-0 ${isSeoActive ? 'text-orange-500' : 'text-slate-400'}`} />
              {!collapsed && <span className="ml-3 truncate">SEO Suite</span>}
            </Link>
            {!collapsed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSeoOpen(!seoOpen);
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                {seoOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {!collapsed && seoOpen && (
            <div className="bg-slate-50/80 border-y border-slate-100 py-1 text-xs">
              <Link
                href="/admin/seo"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/seo'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Site Audit & Health
              </Link>
              <Link
                href="/admin/seo/sitemaps"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/seo/sitemaps'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                XML Sitemaps
              </Link>
              <Link
                href="/admin/seo/robots"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/seo/robots'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Robots.txt & AI Bots
              </Link>
              <Link
                href="/admin/seo/redirects"
                className={`block pl-11 pr-4 py-1.5 transition-colors flex items-center justify-between ${
                  pathname === '/admin/seo/redirects'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                <span>301 & 404 Manager</span>
                {notFoundLogs.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-bold">
                    {notFoundLogs.length}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/seo/schema"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/seo/schema'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Global Schema
              </Link>
              <Link
                href="/admin/seo/internal-links"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/seo/internal-links'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Internal Links Graph
              </Link>
              <Link
                href="/admin/seo/indexing"
                className={`block pl-11 pr-4 py-1.5 transition-colors ${
                  pathname === '/admin/seo/indexing'
                    ? 'text-orange-600 font-bold bg-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-100/60'
                }`}
              >
                Indexing & APIs
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Collapse/Expand Toggle Button at bottom */}
      <div className="border-t border-slate-200 p-2 bg-slate-50/60 flex items-center justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
