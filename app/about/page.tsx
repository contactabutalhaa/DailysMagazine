import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Compass, Users, Sparkles, BookOpen, Target, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';

export const metadata: Metadata = {
  title: 'About Us | DailysMagazine',
  description:
    'Learn about DailysMagazine: our independent editorial mission, standards, coverage pillars, and the journalists behind our daily dispatches.',
};

const EDITORS = [
  {
    name: 'Elena Vance',
    role: 'Editor-in-Chief & Urban Architecture Critic',
    bio: 'Former senior editor at Architectural Review. Elena directs editorial vision, longform investigations, and architectural features.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'David Chen',
    role: 'Executive Editor, Technology & Systems',
    bio: 'Pioneered computational linguistics reporting for leading silicon valley quarterlies. Oversees deep tech, AI agents, and semiconductor investigations.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Elena Rostova',
    role: 'Features Editor, Culture & Society',
    bio: 'Cultural anthropologist exploring analog subcultures, tactile arts, and international cinematic movements.',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Marcus Vance',
    role: 'Senior Editor, Business & Economics',
    bio: 'Specialist in labor economics, steward ownership models, and circular industrial supply systems.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Dr. Chloe Adams',
    role: 'Contributing Editor, Climate & Deep Oceans',
    bio: 'Marine geophysicist investigating offshore geothermal energy, bio-concrete, and hydrologic basin rewilding.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Maya Lin',
    role: 'Wellness & Behavioral Sciences Editor',
    bio: 'Researches circadian biology, chronotype nutrition, and psychoacoustic recovery environments.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="bg-slate-50 border-b border-slate-200/80 pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Our Editorial Purpose
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight">
            Journalism for Curious Minds in an Age of Automated Noise.
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed pt-2">
            Founded on the conviction that clarity is the supreme luxury of our time, <strong className="text-slate-900 font-bold">DailysMagazine</strong> delivers rigorous, human-crafted journalism across the forces reshaping our everyday world.
          </p>
        </div>
      </section>

      {/* Mission & Values Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-3">
              Independent & Uncompromising
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We answer exclusively to our readers. We reject clickbait hysteria, rage-farming algorithms, and commodified press releases in favor of patient, verified reporting.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-3">
              Depth Over Speed
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              When a major event breaks, we don&apos;t rush to publish reactive thirty-second takes. We investigate the underlying systemic causes, historical context, and human implications.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 mb-3">
              Ethical Standards & Transparency
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every factual assertion undergoes primary source verification. Commercial sponsorships are demarcated with total typographic clarity.
            </p>
          </div>
        </div>

        {/* Coverage Pillars */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
              What We Cover
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-slate-900">
              Our 8 Editorial Pillars
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Every category is staffed by dedicated specialists committed to accessible intellectual rigor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.values(CATEGORIES).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="p-6 rounded-2xl border border-slate-200/90 hover:border-orange-300 hover:shadow-card transition-all group bg-white"
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${cat.bgColor} ${cat.color} inline-block mb-3`}
                >
                  {cat.name}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {cat.description}
                </p>
                <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                  Explore {cat.name} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Meet the Editors Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
              The Masthead
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-slate-900">
              Meet the Editors
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              The journalists, critics, and researchers shaping DailysMagazine every morning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EDITORS.map((editor) => (
              <div
                key={editor.name}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col items-start"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 mb-4 border border-slate-100">
                  <Image
                    src={editor.avatar}
                    alt={editor.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900">
                  {editor.name}
                </h3>
                <span className="text-xs font-bold text-orange-600 mb-2">
                  {editor.role}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {editor.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-20 p-10 bg-slate-900 text-white rounded-3xl text-center space-y-4">
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Want to write for DailysMagazine?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            We actively commission original investigative essays, cultural critiques, and industry dispatches from writers worldwide. Reach our editorial desk directly at{' '}
            <a
              href="mailto:lucamarvass@gmail.com"
              className="text-orange-400 hover:text-orange-300 underline font-semibold transition-colors"
            >
              lucamarvass@gmail.com
            </a>.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/write-for-us"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl transition-all shadow-md"
            >
              <span>Read Contributor Guidelines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:lucamarvass@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm rounded-xl transition-all border border-slate-700"
            >
              <span>Email Editorial Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
