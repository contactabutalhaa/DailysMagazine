import React from 'react';
import HeroSection from '@/components/HeroSection';
import FilterableFeed from '@/components/FilterableFeed';
import CategoryShowcase from '@/components/CategoryShowcase';
import FullWidthNewsletterBanner from '@/components/FullWidthNewsletterBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. 3-Column Split Hero Section */}
      <HeroSection />

      {/* 2. Interactive Filter Bar + Main Feed & Sticky Sidebar (8 cols / 4 cols) */}
      <FilterableFeed />

      {/* 3. Dedicated Category Showcase Sections (Tech & Ideas, Culture & Design, Business, Climate & Wellness) */}
      <CategoryShowcase />

      {/* 4. Full-Width Catchy Newsletter Banner */}
      <FullWidthNewsletterBanner />
    </div>
  );
}
