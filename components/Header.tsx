'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronDown, Mail, ArrowUpRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { useModals } from './ModalContext';
import { CATEGORIES } from '@/data/categories';
import Logo from './Logo';

const PRIMARY_NAV = [
  { name: 'Culture', href: '/category/culture' },
  { name: 'Lifestyle', href: '/category/lifestyle' },
  { name: 'Tech', href: '/category/tech' },
  { name: 'Business', href: '/category/business' },
  { name: 'Ideas', href: '/category/ideas' },
  { name: 'Design', href: '/category/design' },
];

const MORE_NAV = [
  { name: 'Climate', href: '/category/climate', desc: 'Energy, rewiring & carbon systems' },
  { name: 'Wellness', href: '/category/wellness', desc: 'Circadian health, brain longevity & somatic rest' },
];

export default function Header() {
  const pathname = usePathname();
  const { openSearch, openNewsletter } = useModals();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-[72px] bg-white/95 backdrop-blur-md border-b transition-all duration-200 ${
          scrolled ? 'border-slate-200 shadow-sm' : 'border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Wordmark Logo */}
          <Logo size="md" href="/" />

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {PRIMARY_NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-1.5 text-[14px] font-semibold tracking-normal transition-colors rounded-lg ${
                    isActive
                      ? 'text-orange-600'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-600 rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 text-[14px] font-semibold rounded-lg transition-colors ${
                  pathname.startsWith('/category/climate') || pathname.startsWith('/category/wellness')
                    ? 'text-orange-600'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-dropdown border border-slate-200/80 p-2.5 z-50"
                  >
                    {MORE_NAV.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block p-2.5 rounded-xl hover:bg-orange-50/70 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-orange-600">
                            {item.name}
                          </span>
                          <span className="text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1.5 pt-1.5 px-2.5 pb-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        <span>Topics Index</span>
                        <Link href="/about" className="hover:text-orange-600">
                          About us
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right: Actions (Search + Subscribe Pill + Mobile Hamburger) */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Admin CMS Shortcut */}
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              title="WordPress-style CMS & SEO Suite"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-orange-600" />
              <span>CMS Admin</span>
            </Link>

            {/* Search Icon Button */}
            <button
              onClick={openSearch}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center relative"
              aria-label="Search stories"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Subscribe Pill CTA Button */}
            <button
              onClick={openNewsletter}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm shadow-orange-500/20 hover:shadow-md transition-all duration-200"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Subscribe</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle mobile navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Top */}
              <div className="h-[72px] px-6 border-b border-slate-100 flex items-center justify-between">
                <div onClick={() => setMobileMenuOpen(false)}>
                  <Logo size="sm" href="/" />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(CATEGORIES).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-sm font-bold text-slate-800 transition-colors border border-slate-100 flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.accentHex }} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Editorial & Collaborate
                  </p>
                  <div className="space-y-1">
                    <Link
                      href="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 rounded-lg hover:bg-slate-50"
                    >
                      About DailysMagazine
                    </Link>
                    <Link
                      href="/write-for-us"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 rounded-lg hover:bg-slate-50"
                    >
                      Write For Us / Pitch
                    </Link>
                    <Link
                      href="/advertise"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 rounded-lg hover:bg-slate-50"
                    >
                      Advertise & Media Kit
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 rounded-lg hover:bg-slate-50"
                    >
                      Contact Editorial Desk
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-bold text-orange-600 hover:text-orange-700 rounded-lg bg-orange-50/60"
                    >
                      CMS Admin Dashboard &rarr;
                    </Link>
                  </div>
                </div>

                {/* Newsletter Box in Drawer */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                  <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Free Daily Dispatch
                  </div>
                  <h4 className="font-bold text-base">Morning Curated Briefing</h4>
                  <p className="text-xs text-slate-300 mt-1 mb-3">
                    Join 45,000+ readers getting our signature 5-minute weekday email.
                  </p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openNewsletter();
                    }}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>

              {/* Drawer Bottom */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>© 2026 DailysMagazine</span>
                <Link href="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="hover:text-orange-600">
                  Privacy Policy
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
