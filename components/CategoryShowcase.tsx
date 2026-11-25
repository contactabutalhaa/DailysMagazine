'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Cpu, Palette, Briefcase, Leaf, Heart } from 'lucide-react';
import { getArticlesByCategory, ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import { Article } from '@/types';
import { convertCmsPostToArticle } from '@/lib/article-converter';
import { CmsPost } from '@/types/admin';

interface CategoryShowcaseProps {
  initialArticles?: Article[];
}

export default function CategoryShowcase({ initialArticles }: CategoryShowcaseProps) {
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

  const getByCat = (cat: string) => {
    const list = articles.filter((a) => a.category === cat);
    return list.length > 0 ? list : getArticlesByCategory(cat);
  };

  // Grab articles per category
  const techArticles = getByCat('tech');
  const ideasArticles = getByCat('ideas');
  const cultureArticles = getByCat('culture');
  const designArticles = getByCat('design');
  const businessArticles = getByCat('business');
  const climateArticles = getByCat('climate');
  const wellnessArticles = getByCat('wellness');

  // Combine Tech & Ideas (4 items)
  const techIdeasSpotlight = [...techArticles.slice(0, 2), ...ideasArticles.slice(0, 2)];

  // Culture & Design (3 wide items)
  const cultureDesignStrip = [
    cultureArticles[0] || ARTICLES[0],
    designArticles[0] || ARTICLES[1],
    cultureArticles[1] || cultureArticles[0] || ARTICLES[2],
  ];

  // Business (3 items)
  const businessList = businessArticles.slice(0, 3);

  // Climate & Wellness (3 curated items)
  const climateWellnessItems = [
    climateArticles[0] || ARTICLES[3],
    wellnessArticles[0] || ARTICLES[4],
    climateArticles[1] || climateArticles[0] || ARTICLES[5],
  ];

  return (
    <div className="space-y-16 py-12">
      {/* 1. TECH & IDEAS SPOTLIGHT (4-column clean card row with blue/orange badges) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                Frontier Paradigms
              </span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Tech & Ideas Spotlight
              </h3>
            </div>
          </div>
          <Link
            href="/category/tech"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>View All Tech & Ideas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {techIdeasSpotlight.map((article) => {
            const cat = CATEGORIES[article.category] || { bgColor: 'bg-blue-100', color: 'text-blue-800' };
            const cover = article.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80';
            return (
              <div
                key={article.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300"
              >
                <Link
                  href={`/${article.category}/${article.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-slate-100 block"
                >
                  <Image
                    src={cover}
                    alt={article.title}
                    fill
                    unoptimized={cover.startsWith('data:')}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${cat.bgColor || 'bg-blue-100'} ${cat.color || 'text-blue-800'}`}
                    >
                      {article.categoryName}
                    </span>
                  </div>
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                      {article.readTime} • {article.publishedAt}
                    </span>
                    <h4 className="font-heading font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/${article.category}/${article.slug}`}>{article.title}</Link>
                    </h4>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">By {article.author?.name || 'Editorial Staff'}</span>
                    <span className="text-blue-600 font-bold group-hover:underline">Read →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. CULTURE & DESIGN VISUAL STRIP (3-column wide-card gallery with rich photography) */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                  Aesthetic & Tactile Worlds
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                  Culture & Design Visual Strip
                </h3>
              </div>
            </div>
            <Link
              href="/category/design"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 group"
            >
              <span>Explore Visual Arts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cultureDesignStrip.map((article) => (
              <Link
                key={article.id}
                href={`/${article.category}/${article.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800 shadow-xl block"
              >
                <Image
                  src={article.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80'}
                  alt={article.title}
                  fill
                  unoptimized={article.coverImage?.startsWith('data:')}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-600/90 text-white backdrop-blur-sm shadow-md">
                    {article.categoryName}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs text-rose-300 font-semibold mb-1 block">
                    {article.readTime} • By {article.author?.name || 'Editorial Staff'}
                  </span>
                  <h4 className="font-heading font-extrabold text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-rose-300 transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-1 opacity-90">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BUSINESS & WORKPLACE DIGEST (2-column split list with crisp borders and read times) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                Economics & Enterprise
              </span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                Business & Workplace Digest
              </h3>
            </div>
          </div>
          <Link
            href="/category/business"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>All Business Dispatches</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Featured Business Spotlight Card */}
          {(() => {
            const leadBusiness = businessList[0] || ARTICLES[0];
            const cover = leadBusiness.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80';
            return (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-slate-100">
                    <Image
                      src={cover}
                      alt={leadBusiness.title}
                      fill
                      unoptimized={cover.startsWith('data:')}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800">
                        Lead Analysis
                      </span>
                    </div>
                  </div>
                  <h4 className="font-heading font-extrabold text-xl text-slate-900 hover:text-amber-700 transition-colors mb-2">
                    <Link href={`/${leadBusiness.category}/${leadBusiness.slug}`}>
                      {leadBusiness.title}
                    </Link>
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {leadBusiness.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">By {leadBusiness.author?.name || 'Editorial Staff'}</span>
                  <Link
                    href={`/${leadBusiness.category}/${leadBusiness.slug}`}
                    className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    Read Deep Dive →
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* Right: Crisp Stacked List */}
          <div className="space-y-4 flex flex-col justify-between">
            {businessList.slice(1).map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle hover:border-amber-300 transition-all flex flex-col justify-between flex-1"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400 font-medium">
                    <span className="text-amber-700 font-bold uppercase tracking-wider text-[11px]">
                      Strategy
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-slate-900 text-base leading-snug hover:text-amber-700 transition-colors mb-2">
                    <Link href={`/${article.category}/${article.slug}`}>{article.title}</Link>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Published {article.publishedAt}</span>
                  <Link
                    href={`/${article.category}/${article.slug}`}
                    className="font-bold text-amber-700 hover:underline"
                  >
                    Read Analysis →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLIMATE & WELLNESS CORNER (Soft sage/mint-tinted container #F0FDF4 featuring 3 curated stories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F0FDF4] rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-emerald-200/70 mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  Vitality & Planetary Resilience
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-emerald-950 tracking-tight">
                  Climate & Wellness Corner
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <Link
                href="/category/climate"
                className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
              >
                Climate ({climateArticles.length})
              </Link>
              <Link
                href="/category/wellness"
                className="px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors"
              >
                Wellness ({wellnessArticles.length})
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {climateWellnessItems.map((article) => {
              const isClimate = article.category === 'climate';
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <Link
                    href={`/${article.category}/${article.slug}`}
                    className="relative aspect-[16/10] overflow-hidden bg-emerald-50 block"
                  >
                    <Image
                      src={article.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80'}
                      alt={article.title}
                      fill
                      unoptimized={article.coverImage?.startsWith('data:')}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                          isClimate
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {article.categoryName}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block mb-1">
                        {article.readTime} • By {article.author?.name || 'Editorial Staff'}
                      </span>
                      <h4 className="font-heading font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2">
                        <Link href={`/${article.category}/${article.slug}`}>{article.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{article.publishedAt}</span>
                      <Link
                        href={`/${article.category}/${article.slug}`}
                        className="font-bold text-emerald-700 hover:text-emerald-800 group-hover:underline"
                      >
                        Read Story →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
