import { NextRequest, NextResponse } from 'next/server';
import { getCustomPosts, saveCustomPost, deleteCustomPost } from '@/lib/posts-storage';
import { cmsStore } from '@/lib/cms-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    const customPosts = getCustomPosts();

    if (slug) {
      const match = customPosts.find((p) => p.slug === slug);
      if (match) {
        return NextResponse.json(match);
      }
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(customPosts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Save to disk storage
    const saved = saveCustomPost(body);

    // Also update server-side cmsStore singleton
    try {
      cmsStore.savePost(body);
    } catch (e) {
      // In case server store update fails, disk write succeeded
    }

    return NextResponse.json({ success: true, post: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    deleteCustomPost(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
