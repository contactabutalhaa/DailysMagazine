'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Article } from '@/types';
import { CATEGORIES } from '@/data/categories';

interface ArticleCardProps {
  article: Article;
  aspect?: '16:9' | '4:3' | 'square';
  showExcerpt?: boolean;
}

export default function ArticleCard({
  article,
  aspect = '16:9',
  showExcerpt = true,
}: ArticleCardProps) {
  const cat = CATEGORIES[article.category];

  const aspectClass =
    aspect === 'square'
      ? 'aspect-square'
      : aspect === '4:3'
      ? 'aspect-[4/3]'
      : 'aspect-[16/9]';

  const storyHref = `/${article.category}/${article.slug}`;

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      {/* Cover Image Container */}
      <Link
        href={storyHref}
        className={`relative w-full ${aspectClass} overflow-hidden bg-slate-100 block`}
      >
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              cat?.bgColor || 'bg-white'
            } ${cat?.color || 'text-slate-800'}`}
          >
            {article.categoryName}
          </span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Read time and date */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {article.readTime}
            </span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-slate-900 text-lg leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors duration-200 mb-2">
            <Link href={storyHref}>{article.title}</Link>
          </h3>

          {/* Excerpt */}
          {showExcerpt && (
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Author Byline */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200 shrink-0">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-slate-700">
              {article.author.name}
            </span>
          </div>

          <Link
            href={storyHref}
            className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform"
          >
            Read Story →
          </Link>
        </div>
      </div>
    </article>
  );
}
