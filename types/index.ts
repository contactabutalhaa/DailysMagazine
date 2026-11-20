export type CategorySlug = 
  | 'culture'
  | 'lifestyle'
  | 'tech'
  | 'business'
  | 'ideas'
  | 'design'
  | 'climate'
  | 'wellness';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  description: string;
  color: string; // Tailwind text or hex
  bgColor: string; // Badge background
  borderColor: string;
  accentHex: string;
  tagline: string;
}

export interface Author {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  twitter?: string;
  linkedin?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: CategorySlug;
  categoryName: string;
  author: Author;
  publishedAt: string; // e.g. "Nov 18, 2026"
  readTime: string; // e.g. "6 min read"
  coverImage: string;
  coverImageCaption?: string;
  featured?: boolean;
  trending?: boolean;
  mustRead?: boolean;
  tags: string[];
  content: {
    leadParagraph: string;
    sections: {
      heading: string;
      subheading?: string;
      body: string[];
      quote?: string;
      quoteAuthor?: string;
      takeaways?: string[];
      inlineImage?: {
        url: string;
        caption: string;
      };
    }[];
  };
}

export interface ContributorPitch {
  name: string;
  email: string;
  category: CategorySlug;
  proposedHeadline: string;
  pitchSummary: string;
  sampleUrl: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  inquiryType: 'editorial' | 'advertising' | 'press' | 'general';
  message: string;
}

export interface AdvertiseInquiry {
  fullName: string;
  companyName: string;
  workEmail: string;
  budgetRange: string;
  campaignGoals: string;
}
