import { CmsPost, SchemaType } from '@/types/admin';

export function generatePostJsonLd(post: {
  title: string;
  slug: string;
  categorySlug?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  authorSocial?: string;
  categoryName: string;
  schemaType: SchemaType;
  faqItems?: { question: string; answer: string }[];
  howToSteps?: { name: string; text: string; image?: string }[];
  reviewData?: { itemReviewed: string; ratingValue: number; bestRating: number };
  breadcrumbTitle?: string;
}): object {
  const siteUrl = 'https://dailysmagazine.com';
  const categorySegment = post.categorySlug || (post.categoryName ? post.categoryName.toLowerCase().replace(/\s+/g, '-') : 'story');
  const postUrl = `${siteUrl}/${categorySegment}/${post.slug}`;

  const baseSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': post.schemaType || 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    datePublished: post.publishedAt || new Date().toISOString(),
    dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
    articleSection: post.categoryName,
    author: {
      '@type': 'Person',
      name: post.authorName,
      jobTitle: post.authorRole || 'Editorial Contributor',
      image: post.authorAvatar,
      url: `${siteUrl}/about`,
      sameAs: post.authorSocial ? [post.authorSocial] : undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DailysMagazine',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.svg`,
        width: 512,
        height: 512,
      },
    },
  };

  // If FAQPage schema or has FAQ items
  if (post.schemaType === 'FAQPage' || (post.faqItems && post.faqItems.length > 0)) {
    if (post.schemaType === 'FAQPage') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (post.faqItems || []).map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
    } else if (post.faqItems && post.faqItems.length > 0) {
      // Attached multi-schema
      baseSchema.hasPart = {
        '@type': 'FAQPage',
        mainEntity: post.faqItems.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
    }
  }

  // If HowTo schema
  if (post.schemaType === 'HowTo' && post.howToSteps && post.howToSteps.length > 0) {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: post.title,
      description: post.excerpt,
      image: post.coverImage,
      step: post.howToSteps.map((step, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: step.name,
        text: step.text,
        image: step.image || post.coverImage,
      })),
    };
  }

  // If Review schema
  if (post.schemaType === 'Review' && post.reviewData) {
    baseSchema.reviewRating = {
      '@type': 'Rating',
      ratingValue: post.reviewData.ratingValue || 5,
      bestRating: post.reviewData.bestRating || 5,
    };
    baseSchema.itemReviewed = {
      '@type': 'Thing',
      name: post.reviewData.itemReviewed || post.title,
    };
  }

  return baseSchema;
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema(settings?: {
  organizationName?: string;
  alternateName?: string;
  organizationUrl?: string;
  logoUrl?: string;
  description?: string;
  socialProfiles?: string[];
}): object {
  const name = settings?.organizationName || 'DailysMagazine';
  const url = settings?.organizationUrl || 'https://dailysmagazine.com';
  const logo = settings?.logoUrl || 'https://dailysmagazine.com/icon.svg';

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name,
    alternateName: settings?.alternateName || 'Dailys',
    legalName: `${name} Publishing Co.`,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: 600,
      height: 60,
    },
    description:
      settings?.description ||
      'Fresh perspectives on culture, technology, modern living, and bold ideas—curated daily.',
    foundingDate: '2026',
    founders: [
      {
        '@type': 'Person',
        name: 'Elena Vance',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial support',
      email: 'editorial@dailysmagazine.com',
      url: `${url}/contact`,
    },
    sameAs: settings?.socialProfiles || [
      'https://twitter.com/dailysmagazine',
      'https://linkedin.com/company/dailysmagazine',
      'https://instagram.com/dailysmagazine',
    ],
  };
}

export const generateOrganizationJsonLd = generateOrganizationSchema;

export function generateWebSiteSchema(settings?: {
  organizationName?: string;
  organizationUrl?: string;
  sitelinksSearchbox?: boolean;
}): object {
  const name = settings?.organizationName || 'DailysMagazine';
  const url = settings?.organizationUrl || 'https://dailysmagazine.com';

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    description: 'Fresh perspectives on culture, technology, modern living, and bold ideas—curated daily.',
  };

  if (settings?.sitelinksSearchbox !== false) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

export const generateWebSiteJsonLd = generateWebSiteSchema;

export function generatePersonSchema(author: {
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: { twitter?: string; linkedin?: string; website?: string };
  sameAs?: { twitter?: string; linkedin?: string; website?: string };
  expertise?: string[];
}): object {
  const sameAs: string[] = [];
  const twitter = author.socialLinks?.twitter || author.sameAs?.twitter;
  const linkedin = author.socialLinks?.linkedin || author.sameAs?.linkedin;
  const website = author.socialLinks?.website || author.sameAs?.website;
  if (twitter) sameAs.push(twitter);
  if (linkedin) sameAs.push(linkedin);
  if (website) sameAs.push(website);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role || 'Senior Editorial Contributor',
    image: author.avatar,
    description: author.bio,
    worksFor: {
      '@type': 'Organization',
      name: 'DailysMagazine',
      url: 'https://dailysmagazine.com',
    },
    knowsAbout: author.expertise || ['Journalism', 'Culture', 'Technology'],
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export const generatePersonJsonLd = generatePersonSchema;
