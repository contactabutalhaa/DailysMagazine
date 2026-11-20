'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';
import { useAdmin } from '@/components/admin/AdminContext';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { posts } = useAdmin();

  const id = params?.id as string;
  const post = posts.find((p) => p.id === id || p.slug === id);

  if (!post) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center max-w-xl mx-auto mt-12 space-y-4 shadow-xs">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Post Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested post with identifier <code className="text-orange-500 font-mono">"{id}"</code> could not be
          found in the CMS store.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Posts
          </Link>
        </div>
      </div>
    );
  }

  return <PostEditor initialPost={post} isNew={false} />;
}
