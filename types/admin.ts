import { CategorySlug } from './index';

export type PostStatus = 'published' | 'draft' | 'scheduled' | 'trash';
export type PageStatus = 'published' | 'draft' | 'trash';
export type SchemaType = 'Article' | 'NewsArticle' | 'BlogPosting' | 'FAQPage' | 'HowTo' | 'Review';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface PostSeoData {
  focusKeyword: string;
  secondaryKeywords: string[];
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  noindex?: boolean;
  nofollow?: boolean;
  robots: {
    index: boolean;
    follow: boolean;
    noarchive: boolean;
    nosnippet: boolean;
    maxImagePreview: 'large' | 'standard' | 'none';
  };
  breadcrumbTitle: string;
  isSponsored: boolean;
  schemaType: SchemaType;
  faqItems: FAQItem[];
  howToSteps: HowToStep[];
  reviewData?: {
    itemReviewed: string;
    ratingValue: number;
    bestRating: number;
  };
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  seoScore?: number;
}

export interface CmsPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // HTML / Rich Markdown content
  category: CategorySlug;
  categoryName: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  status: PostStatus;
  visibility: 'public' | 'private' | 'password';
  publishedAt: string;
  scheduledAt?: string;
  updatedAt: string;
  createdAt?: string;
  readTime: string;
  coverImage: string;
  coverImageAlt: string;
  coverImageCaption?: string;
  featured: boolean;
  trending: boolean;
  mustRead: boolean;
  seo: PostSeoData;
  seoScore: number; // 0 - 100
  internalLinksCount: number;
  externalLinksCount: number;
  incomingLinksCount: number;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: PageStatus;
  publishedAt: string;
  updatedAt: string;
  seo: PostSeoData;
  seoScore: number;
}

export interface CmsCategory {
  id: string;
  slug: CategorySlug | string;
  name: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  noindex: boolean;
  color: string;
  bgColor: string;
  accentHex: string;
  count: number;
}

export interface CmsTag {
  id: string;
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  noindex: boolean;
  count: number;
}

export interface MediaItem {
  id: string;
  filename?: string;
  url: string;
  title: string;
  altText: string;
  caption: string;
  fileSizeKb?: number;
  fileSize?: string;
  mimeType?: string;
  dimensions?: string;
  width?: number;
  height?: number;
  format: 'WebP' | 'JPEG' | 'PNG' | 'AVIF' | string;
  isWebPOrAvif?: boolean;
  uploadedAt: string;
}

export interface AuthorProfile {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  expertise: string[];
  sameAs?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  postsCount: number;
}

export type RedirectType = '301' | '302' | '307' | '410' | 301 | 302 | 307 | 410;

export interface RedirectRule {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  statusCode: RedirectType;
  isRegex: boolean;
  hits: number;
  lastHitAt?: string;
  createdAt: string;
}

export interface NotFoundLog {
  id: string;
  url: string;
  referrer: string;
  hits: number;
  firstDetectedAt: string;
  lastDetectedAt: string;
  lastSeen?: string;
}

export interface TechnicalSeoSettings {
  sitemaps: {
    includePosts: boolean;
    includePages: boolean;
    includeCategories: boolean;
    includeTags: boolean;
    includeAuthors: boolean;
    includeNews: boolean;
    postsPriority: string;
    pagesPriority: string;
    categoriesPriority: string;
    postsChangefreq: string;
    pagesChangefreq: string;
  };
  sitemap?: any;
  robotsTxt: any;
  aiBots?: { name: string; company: string; purpose: string; allowed: boolean }[];
  llmsTxt: any;
  globalSchema: any;
  verification: {
    googleSearchConsole: string;
    bingWebmaster: string;
    yandexVerification: string;
    pinterestVerification: string;
  };
  webmasterVerification?: any;
  indexing: {
    indexNowKey: string;
    autoPingOnPublish: boolean;
    googleIndexingJson: string;
    recentPingLogs: {
      url: string;
      service: 'IndexNow' | 'Google Indexing API';
      status: 'Success' | 'Queued' | 'Failed';
      timestamp: string;
    }[];
  };
  indexNow?: any;
  adsTxt: string;
  performance: {
    lazyLoadImages: boolean;
    preloadLcpHero: boolean;
    deferNonCriticalJs: boolean;
    minifyHtml: boolean;
    enforceTrailingSlash: boolean;
    forceHttps: boolean;
  };
}

export interface SeoAuditReport {
  overallScore: number;
  missingMetaTitles: number;
  missingMetaDescriptions: number;
  missingAltTags: number;
  orphanPages: number;
  thinContentCount: number;
  duplicateSlugsCount: number;
  brokenRedirectsCount: number;
  issues: {
    type: 'error' | 'warning' | 'info';
    message: string;
    category: string;
    affectedUrls: string[];
  }[];
  checks: {
    id: string;
    title: string;
    description: string;
    status: 'pass' | 'warning' | 'fail';
    count: number;
    impact: 'High' | 'Medium' | 'Low';
    affectedUrls?: string[];
  }[];
}
