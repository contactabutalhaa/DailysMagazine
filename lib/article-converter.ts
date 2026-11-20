import { CmsPost } from '@/types/admin';
import { Article } from '@/types';

/**
 * Client-safe converter that transforms a CmsPost into an Article object
 * without importing any Node.js dependencies (fs, path).
 */
export function convertCmsPostToArticle(post: CmsPost): Article {
  const html = post.content || '';

  // Extract headings and paragraphs from HTML
  const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h\1>/gi;
  const headings: { level: number; text: string }[] = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, '').trim(),
    });
  }

  // Split HTML into sections based on H2 tags if present
  const sectionParts = html.split(/<h2[^>]*>/i);
  let lead = post.excerpt || '';
  const sections: {
    heading: string;
    subheading?: string;
    body: string[];
    quote?: string;
    takeaways?: string[];
  }[] = [];

  if (sectionParts.length > 1) {
    lead = sectionParts[0].replace(/<[^>]*>/g, '').trim() || post.excerpt;
    for (let i = 1; i < sectionParts.length; i++) {
      const part = sectionParts[i];
      const endHeadingIdx = part.indexOf('</h2>');
      if (endHeadingIdx !== -1) {
        const headingText = part.substring(0, endHeadingIdx).replace(/<[^>]*>/g, '').trim();
        const bodyContent = part.substring(endHeadingIdx + 5);
        const paragraphs = bodyContent
          .split(/<\/p>/i)
          .map((p) => p.replace(/<[^>]*>/g, '').trim())
          .filter(Boolean);

        sections.push({
          heading: headingText || `Section ${i}`,
          body: paragraphs.length > 0 ? paragraphs : [bodyContent.replace(/<[^>]*>/g, '').trim()],
        });
      }
    }
  } else {
    // Single section fallback
    sections.push({
      heading: post.title,
      body: [html.replace(/<[^>]*>/g, '').trim() || post.excerpt],
    });
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle || '',
    excerpt: post.excerpt || '',
    category: (post.category || 'culture') as any,
    categoryName: post.categoryName || 'Culture',
    author: {
      name: post.author?.name || post.authorName || 'Editorial Staff',
      role: post.author?.role || 'Staff Writer',
      bio: 'Editorial contributor for DailysMagazine.',
      avatar:
        post.author?.avatar ||
        post.authorAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
    publishedAt:
      post.publishedAt ||
      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: post.readTime || '4 min read',
    coverImage:
      post.coverImage ||
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
    coverImageCaption: post.coverImageCaption || post.coverImageAlt || '',
    featured: !!post.featured,
    trending: !!post.trending,
    mustRead: !!post.mustRead,
    tags: post.tags || [post.categoryName || 'Culture'],
    content: {
      leadParagraph: lead || post.excerpt,
      sections: sections,
      rawHtml: post.content,
    } as any,
  };
}
