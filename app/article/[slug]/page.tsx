import { notFound, permanentRedirect } from 'next/navigation';
import { getArticleBySlug, ARTICLES } from '@/data/articles';

interface ArticleRedirectProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export default function LegacyArticleRedirect({ params }: ArticleRedirectProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // 301 Permanent Redirect to the canonical category URL: /[category]/[slug]
  permanentRedirect(`/${article.category}/${article.slug}`);
}
