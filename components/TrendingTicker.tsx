'use client';

import React from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { getTrendingArticles } from '@/data/articles';

export default function TrendingTicker() {
  const trendingStories = getTrendingArticles();

  return (
    <div className="bg-white border-b border-slate-200/90 text-xs py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Label */}
        <div className="flex items-center gap-1.5 shrink-0 font-extrabold text-orange-600 uppercase tracking-wider text-[11px] bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
          <span>Trending Now:</span>
        </div>

        {/* Ticker headlines */}
        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center gap-3 text-slate-700">
          {trendingStories.map((story, idx) => (
            <React.Fragment key={story.id}>
              <Link
                href={`/${story.category}/${story.slug}`}
                className="font-medium hover:text-orange-600 transition-colors inline-block"
              >
                <span className="font-bold text-slate-900 mr-1.5">{story.categoryName}:</span>
                <span className="hover:underline">{story.title}</span>
              </Link>
              {idx < trendingStories.length - 1 && (
                <span className="text-slate-300 font-bold select-none">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
