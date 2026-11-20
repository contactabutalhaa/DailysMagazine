'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { useModals } from './ModalContext';
import { ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { Article } from '@/types';
import { convertCmsPostToArticle } from '@/lib/article-converter';
import { CmsPost } from '@/types/admin';

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useModals();
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';

      fetch('/api/posts')
        .then((res) => (res.ok ? res.json() : []))
        .then((customPosts: CmsPost[]) => {
          if (Array.isArray(customPosts) && customPosts.length > 0) {
            const published = customPosts
              .filter((p) => p.status === 'published')
              .map(convertCmsPostToArticle);
            setArticles([...published, ...ARTICLES]);
          }
        })
        .catch(() => {});
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  const cleanQuery = query.trim().toLowerCase();
  const filteredArticles = cleanQuery
    ? articles.filter((article) => {
        const matchTitle = article.title.toLowerCase().includes(cleanQuery);
        const matchSubtitle = article.subtitle.toLowerCase().includes(cleanQuery);
        const matchCategory = article.categoryName.toLowerCase().includes(cleanQuery);
        const matchTags = article.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
        const matchAuthor = article.author.name.toLowerCase().includes(cleanQuery);
        return matchTitle || matchSubtitle || matchCategory || matchTags || matchAuthor;
      })
    : [];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <Search className="w-5 h-5 text-orange-500 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stories by title, topic, author, or keyword..."
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base font-medium focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeSearch}
                className="text-xs uppercase font-bold tracking-wider text-slate-400 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[60vh] overflow-y-auto p-5">
              {!cleanQuery ? (
                <div className="py-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Popular Topics & Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Urbanism', 'Quantum', 'Workplace', 'Circadian', 'Biophilic', 'Analog Media', 'Democracy', 'Supply Chain'].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-slate-200/80 transition-all"
                        >
                          <Tag className="w-3 h-3 text-orange-500" />
                          {tag}
                        </button>
                      )
                    )}
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Explore By Category
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.values(CATEGORIES).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={closeSearch}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-100 hover:border-orange-200 transition-all flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-50" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                    <span>Found {filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'}</span>
                    <span className="text-orange-600 font-semibold">Click to read</span>
                  </div>

                  {filteredArticles.map((article) => {
                    const cat = CATEGORIES[article.category];
                    return (
                      <Link
                        key={article.id}
                        href={`/${article.category}/${article.slug}`}
                        onClick={closeSearch}
                        className="group flex gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cat?.bgColor || 'bg-slate-100'} ${cat?.color || 'text-slate-700'}`}
                            >
                              {article.categoryName}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-400">{article.readTime}</span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 line-clamp-1 transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                            <span>By {article.author.name}</span>
                            <span>•</span>
                            <span>{article.publishedAt}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">No stories found</h4>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                    We couldn&apos;t find any stories matching &ldquo;{query}&rdquo;. Try another term or browse our primary categories above.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
