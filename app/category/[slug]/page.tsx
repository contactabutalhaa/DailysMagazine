import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowLeft, Clock, ArrowRight, Layers, Flame } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { CATEGORIES, CATEGORY_LIST } from '@/data/categories';
import { getArticlesByCategory, ARTICLES } from '@/data/articles';
import { CategorySlug } from '@/types';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return CATEGORY_LIST.map((category) => ({
    slug: category.slug,
  }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = CATEGORIES[params.slug as CategorySlug];
  if (!category) {
    return {
      title: 'Category Not Found | DailysMagazine',
    };
  }
  return {
    title: `${category.name} | DailysMagazine`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES[params.slug as CategorySlug];

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.slug);
  const leadStory = articles[0];
  const gridArticles = articles.slice(1);

  // Other popular stories from other categories
  const otherHighlights = ARTICLES.filter((a) => a.category !== category.slug).slice(0, 4);

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* 1. Category Header Banner */}
      <div className="bg-slate-50 border-b border-slate-200/80 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb back */}
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Front Page</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${category.bgColor} ${category.color} border ${category.borderColor}`}
                >
                  Editorial Pillar
                </span>
                <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                  {articles.length} In-Depth {articles.length === 1 ? 'Story' : 'Stories'}
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
                {category.name}
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mt-3">
                {category.description}
              </p>
            </div>

            {/* Tagline Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle max-w-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
                Editorial Mission
              </span>
              <p className="text-xs text-slate-600 italic">
                &ldquo;{category.tagline}&rdquo;
              </p>
            </div>
          </div>

          {/* Quick-Switch Pills Between Categories */}
          <div className="pt-6 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Pillars:
            </span>
            {CATEGORY_LIST.map((cat) => {
              const isCurrent = cat.slug === category.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* 2. Featured Category Lead Story (Wide 2-column spotlight card) */}
        {leadStory && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Spotlight Lead in {category.name}
              </h2>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-stretch group">
              <Link
                href={`/${leadStory.category}/${leadStory.slug}`}
                className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px] overflow-hidden bg-slate-100 block"
              >
                <Image
                  src={leadStory.coverImage}
                  alt={leadStory.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </Link>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {leadStory.readTime}
                    </span>
                    <span>•</span>
                    <span>{leadStory.publishedAt}</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight group-hover:text-orange-600 transition-colors mb-3">
                    <Link href={`/${leadStory.category}/${leadStory.slug}`}>{leadStory.title}</Link>
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                    {leadStory.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                      <Image
                        src={leadStory.author.avatar}
                        alt={leadStory.author.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      By {leadStory.author.name}
                    </span>
                  </div>

                  <Link
                    href={`/${leadStory.category}/${leadStory.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Category Article Grid & Sidebar Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                All Stories in {category.name}
              </h3>
              <span className="text-xs text-slate-400">
                Chronological Archive
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {gridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="pt-8 text-center">
              <div className="inline-block p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-center">
                <p className="text-xs text-slate-500 font-semibold mb-2">
                  You&apos;ve reached the current edition limit for {category.name}.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-orange-600 font-bold text-xs hover:bg-orange-50 transition-colors"
                >
                  <span>Explore All Categories</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Popular in Other Categories */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Recommended Across Dailys
                </h4>
              </div>

              <div className="space-y-4">
                {otherHighlights.map((art) => {
                  const artCat = CATEGORIES[art.category];
                  return (
                    <Link
                      key={art.id}
                      href={`/${art.category}/${art.slug}`}
                      className="group flex gap-3 items-start pb-3.5 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={art.coverImage}
                          alt={art.title}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${artCat?.color}`}>
                          {art.categoryName}
                        </span>
                        <h5 className="font-heading font-bold text-xs text-slate-900 group-hover:text-orange-600 line-clamp-2 transition-colors mt-0.5">
                          {art.title}
                        </h5>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {art.readTime}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Callout in Sidebar */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
                Newsletter
              </span>
              <h4 className="font-heading font-bold text-lg leading-tight mb-2">
                Get {category.name} dispatches weekly.
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Receive deep dives into {category.name.toLowerCase()} trends every Wednesday.
              </p>
              <Link
                href="/#newsletter"
                className="block text-center py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Join Daily Briefing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
