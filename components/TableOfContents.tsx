'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { List, Flame } from 'lucide-react';
import { getTrendingArticles } from '@/data/articles';

interface Section {
  heading: string;
}

interface TOCProps {
  sections: Section[];
  currentSlug: string;
}

export default function TableOfContents({ sections, currentSlug }: TOCProps) {
  const safeSections = Array.isArray(sections) ? sections.filter((s) => s && s.heading) : [];
  const [activeId, setActiveId] = useState<string>('');
  const trending = getTrendingArticles().filter((a) => a.slug !== currentSlug).slice(0, 3);

  // Generate URL-friendly anchors from headings
  const slugify = (text: string) =>
    (text || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

  useEffect(() => {
    if (safeSections.length === 0) return;
    const handleScroll = () => {
      const headings = safeSections.map((s) => document.getElementById(slugify(s.heading))).filter(Boolean);
      const scrollPosition = window.scrollY + 160;

      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          return;
        }
      }
      if (headings[0]) {
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 sticky top-28">
      {/* Table of Contents Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
          <List className="w-4 h-4 text-orange-600" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Table of Contents
          </h4>
        </div>

        <nav className="space-y-1">
          {safeSections.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-1">Full article overview</p>
          ) : (
            safeSections.map((section) => {
              const id = slugify(section.heading);
              const isActive = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollToHeading(id)}
                  className={`block w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-bold border-l-2 border-orange-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {section.heading}
                </button>
              );
            })
          )}
        </nav>
      </div>

      {/* Trending Now Mini-List in Rail */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 shadow-subtle">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-200/80">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            Trending Across Dailys
          </h4>
        </div>

        <div className="space-y-3.5">
          {trending.map((item) => (
            <Link
              key={item.id}
              href={`/${item.category}/${item.slug}`}
              className="group block"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-0.5 block">
                {item.categoryName}
              </span>
              <h5 className="font-heading font-bold text-xs text-slate-800 group-hover:text-orange-600 line-clamp-2 transition-colors">
                {item.title}
              </h5>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {item.readTime}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
