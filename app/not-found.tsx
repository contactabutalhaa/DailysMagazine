import Link from 'next/link';
import { ArrowLeft, Home, Compass, Mail } from 'lucide-react';

export default function NotFound() {
  const categories = [
    { name: 'Culture', href: '/category/culture', color: 'hover:border-violet-500 hover:text-violet-600' },
    { name: 'Lifestyle', href: '/category/lifestyle', color: 'hover:border-orange-500 hover:text-orange-600' },
    { name: 'Tech', href: '/category/tech', color: 'hover:border-blue-500 hover:text-blue-600' },
    { name: 'Business', href: '/category/business', color: 'hover:border-amber-500 hover:text-amber-600' },
    { name: 'Ideas', href: '/category/ideas', color: 'hover:border-sky-500 hover:text-sky-600' },
    { name: 'Design', href: '/category/design', color: 'hover:border-pink-500 hover:text-pink-600' },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider">
          Error 404
        </div>

        {/* Big 404 & Headline */}
        <div className="space-y-3">
          <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tight font-sans">
            4<span className="text-orange-500">0</span>4
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Page Not Found
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            The story, article, or resource you are looking for may have moved, been renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-sm transition"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
          <a
            href="mailto:lucamarvass@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold text-sm shadow-xs transition"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            Contact Editorial
          </a>
        </div>

        {/* Explore Categories */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-center gap-1.5">
            <Compass className="w-4 h-4" /> Explore Categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 transition ${cat.color}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
