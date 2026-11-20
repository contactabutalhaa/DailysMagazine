'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import PageEditor from '@/components/admin/PageEditor';
import { useAdmin } from '@/components/admin/AdminContext';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function EditPage() {
  const params = useParams();
  const { pages } = useAdmin();

  const id = params?.id as string;
  const page = pages.find((p) => p.id === id || p.slug === id);

  if (!page) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center max-w-xl mx-auto mt-12 space-y-4 shadow-xs">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Page Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested page <code className="text-orange-500 font-mono">"{id}"</code> could not be found.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Pages
          </Link>
        </div>
      </div>
    );
  }

  return <PageEditor initialPage={page} isNew={false} />;
}
