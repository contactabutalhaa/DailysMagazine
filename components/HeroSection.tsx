'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { getFeaturedArticle, ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { Article } from '@/types';
import { convertCmsPostToArticle } from '@/lib/article-converter';
import { CmsPost } from '@/types/admin';

interface HeroSectionProps {
  initialArticles?: Article[];
}

export default function HeroSection({ initialArticles }: HeroSectionProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles || ARTICLES);

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setArticles(initialArticles);
    }
  }, [initialArticles]);

  useEffect(() => {
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
  }, []);

  const featured = articles.find((a) => a.featured) || articles[0];
  const cat = CATEGORIES[featured.category] || { accentHex: '#F97316', name: featured.categoryName };

  // Pick 3 latest stories for the right-hand column (excluding the featured one)
  const latestStories = articles.filter((a) => a.id !== featured.id).slice(0, 3);

  return (
    <section className="pt-6 pb-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Column Split Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-stretch">
          {/* Left Column (5 cols): Large rounded featured story thumbnail */}
          <div className="lg:col-span-5 flex flex-col">
            <Link
              href={`/${featured.category}/${featured.slug}`}
              className="group relative w-full h-72 sm:h-96 lg:h-full min-h-[320px] rounded-[16px] overflow-hidden bg-slate-100 shadow-md block"
            >
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-600 text-white shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Cover Story
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white sm:hidden">
                <p className="text-xs font-semibold text-orange-200">
                  {featured.categoryName} • {featured.readTime}
                </p>
                <h3 className="font-heading font-extrabold text-lg leading-tight line-clamp-2 mt-1">
                  {featured.title}
                </h3>
              </div>
            </Link>
          </div>

          {/* Middle Column (4 cols): Lead Editorial Content */}
          <div className="lg:col-span-4 flex flex-col justify-between py-2 sm:py-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link
                  href={`/category/${featured.category}`}
                  className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                >
                  {featured.categoryName}
                </Link>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl xl:text-4xl text-slate-950 tracking-tight leading-[1.15] mb-4 hover:text-orange-600 transition-colors">
                <Link href={`/${featured.category}/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h1>

              <p className="text-slate-600 text-base leading-relaxed line-clamp-3 mb-6">
                {featured.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  <Image
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    By {featured.author.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {featured.publishedAt}
                  </p>
                </div>
              </div>

              <Link
                href={`/${featured.category}/${featured.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition-all"
              >
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column (3 cols): "LATEST STORIES" vertical stack of 3 compact cards */}
          <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200/90 pt-6 lg:pt-0 lg:pl-6 xl:pl-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                Latest Stories
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Fresh Off The Desk
              </span>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {latestStories.map((story) => {
                const storyCat = CATEGORIES[story.category];
                return (
                  <Link
                    key={story.id}
                    href={`/${story.category}/${story.slug}`}
                    className="group flex gap-3.5 items-start p-2.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200/80"
                  >
                    {/* Square Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm">
                      <Image
                        src={story.coverImage}
                        alt={story.title}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider mb-1">
                        <span className={storyCat?.color || 'text-orange-600'}>
                          {story.categoryName} •
                        </span>
                        <span className="text-slate-400 font-normal">
                          {story.readTime}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        By {story.author.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
