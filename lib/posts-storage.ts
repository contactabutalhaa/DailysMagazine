import fs from 'fs';
import path from 'path';
import { CmsPost } from '@/types/admin';
import { Article } from '@/types';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'custom-posts.json');

// Ensure storage file exists
function ensureStorageFile(): void {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(STORAGE_FILE)) {
      fs.writeFileSync(STORAGE_FILE, '[]', 'utf8');
    }
  } catch (err) {
    console.error('Failed to ensure custom posts storage file:', err);
  }
}

export function getCustomPosts(): CmsPost[] {
  try {
    ensureStorageFile();
    const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read custom posts from disk:', err);
    return [];
  }
}

export function saveCustomPost(post: CmsPost): CmsPost {
  try {
    ensureStorageFile();
    const posts = getCustomPosts();
    const index = posts.findIndex((p) => p.id === post.id || p.slug === post.slug);

    if (index >= 0) {
      posts[index] = {
        ...posts[index],
        ...post,
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
    } else {
      posts.unshift(post);
    }

    fs.writeFileSync(STORAGE_FILE, JSON.stringify(posts, null, 2), 'utf8');
    return post;
  } catch (err) {
    console.error('Failed to save custom post to disk:', err);
    return post;
  }
}

export function deleteCustomPost(id: string): boolean {
  try {
    ensureStorageFile();
    const posts = getCustomPosts();
    const filtered = posts.filter((p) => p.id !== id && p.slug !== id);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to delete custom post from disk:', err);
    return false;
  }
}

// Convert HTML content into structured sections and lead paragraph
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
      avatar: post.author?.avatar || post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
    publishedAt: post.publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: post.readTime || '4 min read',
    coverImage: post.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
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
