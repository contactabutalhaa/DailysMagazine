import { notFound, permanentRedirect } from 'next/navigation';
import { getArticleBySlug, ARTICLES } from '@/data/articles';
import { getCustomPosts } from '@/lib/posts-storage';

interface ArticleRedirectProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export default function LegacyArticleRedirect({ params }: ArticleRedirectProps) {
  let article = getArticleBySlug(params.slug);

  if (!article) {
    try {
      const custom = getCustomPosts();
      const match = custom.find((p) => p.slug === params.slug);
      if (match) {
        article = { category: match.category?.toLowerCase() || 'general' } as any;
      }
    } catch (e) {}
  }

  if (!article) {
    notFound();
  }

  // 301 Permanent Redirect to the canonical category URL: /[category]/[slug]
  permanentRedirect(`/${article.category}/${params.slug}`);
}
