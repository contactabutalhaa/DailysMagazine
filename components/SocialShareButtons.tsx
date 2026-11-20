'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface SocialShareProps {
  title: string;
  slug: string;
  category?: string;
}

export default function SocialShareButtons({ title, slug, category }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const getArticleUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    const cat = category || 'story';
    return `https://dailysmagazine.com/${cat}/${slug}`;
  };

  const handleCopy = () => {
    const url = getArticleUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(getArticleUrl())}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    getArticleUrl()
  )}`;

  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} ${getArticleUrl()}`
  )}`;

  return (
    <div className="flex items-center gap-2 relative">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline-block">
        Share:
      </span>

      {/* Copy Link Button */}
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          copied
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
            : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-slate-200'
        }`}
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Twitter / X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white flex items-center justify-center transition-all border border-slate-200"
        aria-label="Share on X"
      >
        <Twitter className="w-3.5 h-3.5" />
      </a>

      {/* LinkedIn */}
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0077b5] text-slate-600 hover:text-white flex items-center justify-center transition-all border border-slate-200"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>

      {/* WhatsApp */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#25D366] text-slate-600 hover:text-white flex items-center justify-center transition-all border border-slate-200"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
