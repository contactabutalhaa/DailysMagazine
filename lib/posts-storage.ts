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
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (err) {
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

export { convertCmsPostToArticle } from './article-converter';
