'use client';

import React, { useId } from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export default function Logo({
  variant = 'light',
  size = 'md',
  showTagline = true,
  href = '/',
  className = '',
}: LogoProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');

  const isDark = variant === 'dark';

  // Sizing definitions
  const markDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  const taglineSizes = {
    sm: 'text-[8px] tracking-[0.2em] -mt-0.5',
    md: 'text-[9.5px] tracking-[0.22em] -mt-1',
    lg: 'text-[11px] tracking-[0.25em] -mt-1',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* 1. Iconic Stylized Editorial Mark */}
      <div
        className={`relative ${markDimensions} shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Primary Orange Radiant Gradient */}
            <linearGradient id={`gradOrange-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="55%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Layered Accent Gradient for Inner Fold */}
            <linearGradient id={`gradAccent-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.2" />
            </linearGradient>

            {/* Shadow Filter */}
            <filter id={`shadow-${id}`} x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#EA580C" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Outer Rounded Squircle Frame with Gradient */}
          <rect
            x="2"
            y="2"
            width="40"
            height="40"
            rx="11"
            fill={`url(#gradOrange-${id})`}
            filter={`url(#shadow-${id})`}
          />

          {/* Subtle Inner Highlight Ring */}
          <rect
            x="3"
            y="3"
            width="38"
            height="38"
            rx="10"
            stroke="white"
            strokeOpacity="0.25"
            strokeWidth="1.2"
          />

          {/* Stylized Modern Editorial 'D' Symbol */}
          {/* Vertical Backbone of 'D' (representing editorial spine) */}
          <rect x="11.5" y="11" width="4.5" height="22" rx="2.25" fill="white" />

          {/* Dynamic Curved Right Wing of 'D' (representing turning pages) */}
          <path
            d="M17 11H25.5C29.6421 11 33 14.3579 33 18.5V25.5C33 29.6421 29.6421 33 25.5 33H17V28H24.5C26.1569 28 27.5 26.6569 27.5 25V19C27.5 17.3431 26.1569 16 24.5 16H17V11Z"
            fill="white"
          />

          {/* Architectural Page Fold Accent inside 'D' */}
          <path
            d="M18 16.5H23.5C24.8807 16.5 26 17.6193 26 19V25C26 26.3807 24.8807 27.5 23.5 27.5H18V16.5Z"
            fill={`url(#gradAccent-${id})`}
          />

          {/* Editorial Illumination Spark (4-point sparkle at the crown) */}
          <path
            d="M29 9L29.7 11.3L32 12L29.7 12.7L29 15L28.3 12.7L26 12L28.3 11.3L29 9Z"
            fill="#FFF7ED"
          />
        </svg>
      </div>

      {/* 2. Typographic Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          {/* "Dailys" in Vibrant Tangerine Orange */}
          <span
            className={`font-heading font-black tracking-tight text-orange-500 transition-colors ${titleSizes}`}
          >
            Dailys
          </span>

          {/* "Magazine" in Deep Slate Navy (or pure white in dark mode) */}
          <span
            className={`font-heading font-black tracking-tight transition-colors ml-0.5 ${
              isDark
                ? 'text-white group-hover:text-slate-100'
                : 'text-slate-900 group-hover:text-slate-800'
            } ${titleSizes}`}
          >
            Magazine
          </span>

          {/* Dynamic Editorial Dot Accent */}
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mb-1 ml-0.5 animate-pulse" />
        </div>

        {/* 3. Refined Editorial Tagline Kicker */}
        {showTagline && (
          <span
            className={`font-mono font-bold uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            } ${taglineSizes}`}
          >
            Digital Editorial
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-hidden">
        {content}
      </Link>
    );
  }

  return content;
}
