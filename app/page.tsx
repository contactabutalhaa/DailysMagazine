import React from 'react';
import HeroSection from '@/components/HeroSection';
import FilterableFeed from '@/components/FilterableFeed';
import CategoryShowcase from '@/components/CategoryShowcase';
import FullWidthNewsletterBanner from '@/components/FullWidthNewsletterBanner';
import { ARTICLES } from '@/data/articles';
import { getCustomPosts } from '@/lib/posts-storage';
import { convertCmsPostToArticle } from '@/lib/article-converter';
import { Article } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  let allArticles: Article[] = ARTICLES;

  try {
    const custom = getCustomPosts().filter((p) => p.status === 'published');
    const converted = custom.map(convertCmsPostToArticle);
    allArticles = [...converted, ...ARTICLES];
  } catch (err) {
    console.error('Failed to load custom posts on homepage:', err);
  }

  return (
    <div className="flex flex-col">
      {/* 1. 3-Column Split Hero Section */}
      <HeroSection initialArticles={allArticles} />

      {/* 2. Interactive Filter Bar + Main Feed & Sticky Sidebar (8 cols / 4 cols) */}
      <FilterableFeed initialArticles={allArticles} />

      {/* 3. Dedicated Category Showcase Sections (Tech & Ideas, Culture & Design, Business, Climate & Wellness) */}
      <CategoryShowcase initialArticles={allArticles} />

      {/* 4. Full-Width Catchy Newsletter Banner */}
      <FullWidthNewsletterBanner />
    </div>
  );
}
