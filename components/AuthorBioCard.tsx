'use client';

import React from 'react';
import Image from 'next/image';
import { Twitter, Linkedin, Feather } from 'lucide-react';
import { Author } from '@/types';

interface AuthorBioCardProps {
  author: Author;
}

export default function AuthorBioCard({ author }: AuthorBioCardProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle my-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-md">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block">
                Editorial Contributor
              </span>
              <h4 className="font-heading font-extrabold text-xl text-slate-900">
                {author.name}
              </h4>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-2">
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-white text-slate-600 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition-colors"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {author.linkedin && (
                <a
                  href={`https://${author.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-white text-slate-600 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-500">
            {author.role}
          </p>

          <p className="text-sm text-slate-600 leading-relaxed pt-1">
            {author.bio}
          </p>
        </div>
      </div>
    </div>
  );
}
