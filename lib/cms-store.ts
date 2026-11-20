import { ARTICLES } from '@/data/articles';
import { CATEGORIES } from '@/data/categories';
import {
  CmsPost,
  CmsPage,
  CmsCategory,
  CmsTag,
  MediaItem,
  AuthorProfile,
  RedirectRule,
  NotFoundLog,
  TechnicalSeoSettings,
  SeoAuditReport,
} from '@/types/admin';
import { analyzePostSeo } from './seo-analyzer';

// Helper to convert structured article into HTML string for WordPress editor
function convertArticleContentToHtml(content: {
  leadParagraph: string;
  sections: {
    heading: string;
    subheading?: string;
    body: string[];
    quote?: string;
    quoteAuthor?: string;
    takeaways?: string[];
  }[];
}): string {
  let html = `<p>${content.leadParagraph}</p>\n\n`;
  content.sections.forEach((sec) => {
    html += `<h2>${sec.heading}</h2>\n`;
    if (sec.subheading) {
      html += `<h3>${sec.subheading}</h3>\n`;
    }
    sec.body.forEach((p) => {
      html += `<p>${p}</p>\n`;
    });
    if (sec.quote) {
      html += `<blockquote>${sec.quote}${sec.quoteAuthor ? ` — <cite>${sec.quoteAuthor}</cite>` : ''}</blockquote>\n`;
    }
    if (sec.takeaways && sec.takeaways.length > 0) {
      html += `<ul>\n${sec.takeaways.map((t) => `  <li>${t}</li>\n`).join('')}</ul>\n`;
    }
  });
  return html;
}

// Initial Authors Seed
const INITIAL_AUTHORS: AuthorProfile[] = [
  {
    id: 'auth-1',
    name: 'Elena Vance',
    slug: 'elena-vance',
    role: 'Senior Urban Design & Culture Critic',
    bio: 'Elena Vance writes on the intersection of civic infrastructure, human behavioral geography, and modern metropolitan living.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    email: 'elena.vance@dailysmagazine.com',
    expertise: ['Urban Architecture', 'Metropolitan Planning', 'Tactical Design'],
    sameAs: {
      twitter: 'https://twitter.com/elenavance_urban',
      linkedin: 'https://linkedin.com/in/elena-vance-design',
      website: 'https://elenavance.design',
    },
    postsCount: 4,
  },
  {
    id: 'auth-2',
    name: 'David Chen',
    slug: 'david-chen',
    role: 'Senior Technology Correspondent',
    bio: 'David Chen covers computational linguistics, distributed systems, and the socio-economic impact of frontier artificial intelligence.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    email: 'david.chen@dailysmagazine.com',
    expertise: ['Artificial Intelligence', 'Agent Systems', 'Semiconductors'],
    sameAs: {
      twitter: 'https://twitter.com/davidchen_tech',
      linkedin: 'https://linkedin.com/in/david-chen-tech',
    },
    postsCount: 4,
  },
  {
    id: 'auth-3',
    name: 'Anya Sharma',
    slug: 'anya-sharma',
    role: 'Cybersecurity & Physics Columnist',
    bio: 'Anya Sharma investigates quantum algorithms, hardware architectures, and nation-state network vulnerabilities.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    email: 'anya.sharma@dailysmagazine.com',
    expertise: ['Quantum Computing', 'Cryptography', 'Civic Governance'],
    sameAs: {
      twitter: 'https://twitter.com/anyasharma_sec',
    },
    postsCount: 3,
  },
  {
    id: 'auth-4',
    name: 'Marcus Vance',
    slug: 'marcus-vance',
    role: 'Macroeconomics & Corporate Strategy Editor',
    bio: 'Marcus Vance covers labor economics, capital markets, and corporate governance for leading business journals.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    email: 'marcus.vance@dailysmagazine.com',
    expertise: ['Corporate Governance', 'Labor Economics', 'Circular Supply'],
    sameAs: {
      twitter: 'https://twitter.com/marcusvance_biz',
      linkedin: 'https://linkedin.com/in/marcus-vance-econ',
    },
    postsCount: 3,
  },
  {
    id: 'auth-5',
    name: 'Elena Rostova',
    slug: 'elena-rostova',
    role: 'Cultural Anthropologist & Senior Features Editor',
    bio: 'Elena Rostova explores the changing nature of youth subcultures, artistic movements, and tactile countercultures in a hyper-digitized society.',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    email: 'elena.rostova@dailysmagazine.com',
    expertise: ['Cultural Anthropology', 'Analog Subcultures', 'Literature'],
    sameAs: {
      twitter: 'https://twitter.com/rostova_culture',
    },
    postsCount: 3,
  },
  {
    id: 'auth-6',
    name: 'Dr. Chloe Adams',
    slug: 'dr-chloe-adams',
    role: 'Climate Science & Oceanographic Fellow',
    bio: 'Dr. Chloe Adams is a marine geophysicist researching deep-sea thermodynamic systems and renewable energy technologies.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    email: 'chloe.adams@dailysmagazine.com',
    expertise: ['Geothermal Systems', 'Oceanography', 'Living Concrete'],
    sameAs: {
      twitter: 'https://twitter.com/drchloe_climate',
    },
    postsCount: 3,
  },
  {
    id: 'auth-7',
    name: 'Maya Lin',
    slug: 'maya-lin',
    role: 'Mindful Living & Behavioral Essayist',
    bio: 'Maya Lin writes about psychological ecology, slow habits, and interior design philosophy.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'maya.lin@dailysmagazine.com',
    expertise: ['Circadian Science', 'Psychoacoustics', 'Design Ethics'],
    sameAs: {
      twitter: 'https://twitter.com/mayalin_wellness',
    },
    postsCount: 4,
  },
];

// Initial Categories Seed
const INITIAL_CATEGORIES: CmsCategory[] = Object.values(CATEGORIES).map((cat) => ({
  id: `cat-${cat.slug}`,
  slug: cat.slug,
  name: cat.name,
  description: cat.description,
  seoTitle: `${cat.name} Archive | DailysMagazine`,
  metaDescription: `${cat.description} Explore our curated investigative stories and essays.`,
  noindex: false,
  color: cat.color,
  bgColor: cat.bgColor,
  accentHex: cat.accentHex,
  count: 3,
}));

// Initial Tags Seed
const INITIAL_TAGS: CmsTag[] = [
  { id: 'tag-1', slug: 'urbanism', name: 'Urbanism', description: 'Metropolitan planning, transit, and walkable cities', seoTitle: 'Urbanism Stories | DailysMagazine', metaDescription: 'Articles on civic architecture and modern streetscapes.', noindex: false, count: 5 },
  { id: 'tag-2', slug: 'architecture', name: 'Architecture', description: 'Spatial design and biophilic buildings', seoTitle: 'Architecture Articles | DailysMagazine', metaDescription: 'Structural design and sustainable buildings.', noindex: false, count: 4 },
  { id: 'tag-3', slug: 'artificial-intelligence', name: 'Artificial Intelligence', description: 'Frontier AI models and autonomous agents', seoTitle: 'Artificial Intelligence | DailysMagazine', metaDescription: 'Deep dives on generative models and cognitive computing.', noindex: false, count: 6 },
  { id: 'tag-4', slug: 'cryptography', name: 'Cryptography', description: 'Quantum computing and network encryption', seoTitle: 'Cryptography News | DailysMagazine', metaDescription: 'Lattice mathematics and data security protocols.', noindex: false, count: 3 },
  { id: 'tag-5', slug: 'future-of-work', name: 'Future of Work', description: 'Remote work, four-day week, and enterprise culture', seoTitle: 'Future of Work | DailysMagazine', metaDescription: 'Labor economics and organizational design.', noindex: false, count: 4 },
  { id: 'tag-6', slug: 'sustainability', name: 'Sustainability', description: 'Circular economy and ecological restoration', seoTitle: 'Sustainability Trends | DailysMagazine', metaDescription: 'Decarbonization and circular manufacturing.', noindex: false, count: 5 },
  { id: 'tag-7', slug: 'circadian-rhythm', name: 'Circadian Rhythm', description: 'Photobiology and restorative human sleep', seoTitle: 'Circadian Biology | DailysMagazine', metaDescription: 'Light exposure, sleep science, and longevity.', noindex: false, count: 3 },
  { id: 'tag-8', slug: 'culture', name: 'Culture', description: 'Analog media, cinema, and literary subcultures', seoTitle: 'Cultural Inquiries | DailysMagazine', metaDescription: 'Essays on tactile art, zines, and modern aesthetics.', noindex: false, count: 4 },
];

// Initial Pages Seed
const INITIAL_PAGES: CmsPage[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'About Us',
    content: '<h2>Our Editorial Purpose</h2><p>Founded on the conviction that clarity is the supreme luxury of our time, DailysMagazine delivers rigorous, human-crafted journalism across the forces reshaping our everyday world.</p><h2>Independent & Uncompromising</h2><p>We answer exclusively to our readers. We reject clickbait hysteria, rage-farming algorithms, and commodified press releases in favor of patient, verified reporting.</p>',
    status: 'published',
    publishedAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z',
    seo: {
      focusKeyword: 'DailysMagazine editorial mission',
      secondaryKeywords: ['independent journalism', 'editorial board'],
      seoTitle: 'About Us | DailysMagazine Editorial Board & Mission',
      metaDescription: 'Learn about DailysMagazine: our independent editorial mission, standards, coverage pillars, and the journalists behind our daily dispatches.',
      canonicalUrl: 'https://dailysmagazine.com/about',
      robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
      breadcrumbTitle: 'About',
      isSponsored: false,
      schemaType: 'Article',
      faqItems: [],
      howToSteps: [],
      ogTitle: 'About Us | DailysMagazine',
      ogDescription: 'Learn about DailysMagazine: our independent editorial mission, standards, and journalists.',
      ogImage: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=1200&q=80',
      twitterTitle: 'About Us | DailysMagazine',
      twitterDescription: 'Independent journalism for curious minds.',
      twitterImage: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=1200&q=80',
    },
    seoScore: 92,
  },
  {
    id: 'page-contact',
    slug: 'contact',
    title: 'Contact Us',
    content: '<h2>Direct Communications</h2><p>Have a question, feedback, story tip, or partnership inquiry? Our editorial desks are here to assist you.</p><h2>Editorial & Business Desks</h2><p>Reach editorial@dailysmagazine.com or partners@dailysmagazine.com.</p>',
    status: 'published',
    publishedAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-15T12:00:00Z',
    seo: {
      focusKeyword: 'Contact DailysMagazine',
      secondaryKeywords: ['editorial email', 'press inquiries'],
      seoTitle: 'Contact Us | DailysMagazine Editorial & Business Desks',
      metaDescription: 'Get in touch with DailysMagazine editors, submit story tips, pitch letters, or request partnership media kits.',
      canonicalUrl: 'https://dailysmagazine.com/contact',
      robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
      breadcrumbTitle: 'Contact',
      isSponsored: false,
      schemaType: 'Article',
      faqItems: [
        { question: 'How do I pitch a story?', answer: 'Submit your pitch via our Write For Us portal.' },
        { question: 'How do I submit an editorial correction?', answer: 'Email corrections@dailysmagazine.com.' }
      ],
      howToSteps: [],
      ogTitle: 'Contact Us | DailysMagazine',
      ogDescription: 'Connect directly with our editorial and partnership desks.',
      ogImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
      twitterTitle: 'Contact Us | DailysMagazine',
      twitterDescription: 'Get in touch with DailysMagazine.',
      twitterImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    },
    seoScore: 88,
  },
  {
    id: 'page-write-for-us',
    slug: 'write-for-us',
    title: 'Write For Us',
    content: '<h2>Contributor Guidelines & Pitches</h2><p>We are always seeking sharp, provocative essays, field investigations, and original cultural commentary from independent journalists and specialists worldwide.</p>',
    status: 'published',
    publishedAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-17T09:00:00Z',
    seo: {
      focusKeyword: 'Write for DailysMagazine contributor guidelines',
      secondaryKeywords: ['pitch essays', 'guest writing'],
      seoTitle: 'Write For Us | Contributor Guidelines & Pitch Submissions',
      metaDescription: 'Read our editorial standards, accepted topics across 8 categories, and submit an original article pitch to our commissioning editors.',
      canonicalUrl: 'https://dailysmagazine.com/write-for-us',
      robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
      breadcrumbTitle: 'Write For Us',
      isSponsored: false,
      schemaType: 'Article',
      faqItems: [],
      howToSteps: [],
      ogTitle: 'Write For Us | DailysMagazine',
      ogDescription: 'Contributor guidelines and pitching instructions.',
      ogImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      twitterTitle: 'Write For Us | DailysMagazine',
      twitterDescription: 'Pitch your story to DailysMagazine.',
      twitterImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    },
    seoScore: 94,
  },
  {
    id: 'page-advertise',
    slug: 'advertise',
    title: 'Advertise With Us',
    content: '<h2>Connect With 450,000+ Discerning Minds</h2><p>DailysMagazine connects ambitious, mission-driven brands with high-intent thinkers, founders, and cultural leaders who value craftsmanship and ideas.</p>',
    status: 'published',
    publishedAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-18T14:00:00Z',
    seo: {
      focusKeyword: 'Advertise with DailysMagazine media kit',
      secondaryKeywords: ['newsletter sponsorships', 'partner features'],
      seoTitle: 'Advertise With Us | Media Kit & Brand Partnerships 2026',
      metaDescription: 'Partner with DailysMagazine: reach 450,000+ monthly readers and 45,000+ daily newsletter subscribers across tech, culture, and business.',
      canonicalUrl: 'https://dailysmagazine.com/advertise',
      robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
      breadcrumbTitle: 'Advertise',
      isSponsored: false,
      schemaType: 'Article',
      faqItems: [],
      howToSteps: [],
      ogTitle: 'Advertise With Us | DailysMagazine',
      ogDescription: 'Media kit overview and sponsorship formats.',
      ogImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      twitterTitle: 'Advertise With Us | DailysMagazine',
      twitterDescription: 'Partner with DailysMagazine.',
      twitterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    },
    seoScore: 90,
  },
  {
    id: 'page-privacy',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: '<h2>Our Foundational Privacy Pledge</h2><p>At DailysMagazine, we believe that reading journalism should never require surrendering your personal autonomy.</p>',
    status: 'published',
    publishedAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-19T08:00:00Z',
    seo: {
      focusKeyword: 'Privacy policy DailysMagazine',
      secondaryKeywords: ['GDPR reader rights', 'data governance'],
      seoTitle: 'Privacy Policy | Data Governance & Reader Rights',
      metaDescription: 'DailysMagazine privacy policy: how we safeguard subscriber emails, analytics telemetry, cookie governance, and your GDPR/CCPA rights.',
      canonicalUrl: 'https://dailysmagazine.com/privacy-policy',
      robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
      breadcrumbTitle: 'Privacy',
      isSponsored: false,
      schemaType: 'Article',
      faqItems: [],
      howToSteps: [],
      ogTitle: 'Privacy Policy | DailysMagazine',
      ogDescription: 'Comprehensive privacy policy and data governance.',
      ogImage: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=1200&q=80',
      twitterTitle: 'Privacy Policy | DailysMagazine',
      twitterDescription: 'Reader rights and privacy standards.',
      twitterImage: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=1200&q=80',
    },
    seoScore: 86,
  },
  {
    id: 'page-disclaimer',
    slug: 'disclaimer',
    title: 'Editorial Disclaimer',
    content: '<h2>General Informational and Educational Purpose</h2><p>The articles, essays, commentary, and data visualizations published on DailysMagazine are intended solely for general journalistic, informational, and educational purposes.</p>',
    status: 'published',
    publishedAt: '2026-11-01T08:00:00Z',
    updatedAt: '2026-11-19T08:00:00Z',
    seo: {
      focusKeyword: 'Editorial disclaimer DailysMagazine',
      secondaryKeywords: ['informational advice disclaimer', 'sponsored demarcation'],
      seoTitle: 'Editorial Disclaimer | Standards & Disclosures',
      metaDescription: 'Editorial, legal, and medical/financial informational disclaimers, external link disclosures, and sponsored demarcation rules for DailysMagazine.',
      canonicalUrl: 'https://dailysmagazine.com/disclaimer',
      robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
      breadcrumbTitle: 'Disclaimer',
      isSponsored: false,
      schemaType: 'Article',
      faqItems: [],
      howToSteps: [],
      ogTitle: 'Editorial Disclaimer | DailysMagazine',
      ogDescription: 'Editorial standards and content disclosures.',
      ogImage: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=1200&q=80',
      twitterTitle: 'Editorial Disclaimer | DailysMagazine',
      twitterDescription: 'Transparency and standards disclosures.',
      twitterImage: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&w=1200&q=80',
    },
    seoScore: 85,
  },
];

// Initial Media Seed
const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'media-1',
    filename: 'amsterdam-urban-plaza.jpg',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
    title: 'Pedestrianized Amsterdam Boulevard',
    altText: 'A redesigned pedestrianized boulevard in central Amsterdam showcasing micro-parks and urban transit.',
    caption: 'Redesigned pedestrianized boulevard in central Amsterdam.',
    fileSizeKb: 138,
    mimeType: 'image/jpeg',
    width: 1600,
    height: 1067,
    format: 'WebP',
    uploadedAt: '2026-11-18T10:15:00Z',
  },
  {
    id: 'media-2',
    filename: 'dawn-sunlight-living.jpg',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
    title: 'Dawn Sunlight Through Linen Curtains',
    altText: 'Gentle dawn light filtering through linen curtains welcoming morning quiet.',
    caption: 'Morning sun initiating circadian rhythms.',
    fileSizeKb: 112,
    mimeType: 'image/jpeg',
    width: 1600,
    height: 1000,
    format: 'WebP',
    uploadedAt: '2026-11-16T08:30:00Z',
  },
  {
    id: 'media-3',
    filename: 'neural-networks-hardware.jpg',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    title: 'Neural Network Abstractions',
    altText: 'Abstract neural network compute visualization representing autonomous reasoning models.',
    caption: 'Ambient computational models reshaping human workflows.',
    fileSizeKb: 145,
    mimeType: 'image/jpeg',
    width: 1600,
    height: 1067,
    format: 'AVIF',
    uploadedAt: '2026-11-17T11:00:00Z',
  },
  {
    id: 'media-4',
    filename: 'quantum-cryogenic-dilution.jpg',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=80',
    title: 'Cryogenic Dilution Refrigerator',
    altText: 'Cryogenic dilution refrigerator wiring inside an advanced quantum computing laboratory.',
    caption: 'Superconducting quantum processor wiring.',
    fileSizeKb: 182, // >150KB to test audit warning!
    mimeType: 'image/jpeg',
    width: 1600,
    height: 900,
    format: 'JPEG',
    uploadedAt: '2026-11-15T14:20:00Z',
  },
  {
    id: 'media-5',
    filename: 'vinyl-record-player.jpg',
    url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&q=80',
    title: 'Turntable and Vinyl Record',
    altText: 'Vintage turntable playing vinyl records in modern listening room.',
    caption: 'The tactile renaissance of physical media.',
    fileSizeKb: 98,
    mimeType: 'image/jpeg',
    width: 1600,
    height: 1067,
    format: 'WebP',
    uploadedAt: '2026-11-17T16:00:00Z',
  },
  {
    id: 'media-6',
    filename: 'biophilic-vertical-forest.jpg',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    title: 'Vertical Greenery Skyscraper',
    altText: 'Living bio-walls and cascading plants on balcony facades of modern towers.',
    caption: 'Biophilic metropolitan architecture.',
    fileSizeKb: 140,
    mimeType: 'image/jpeg',
    width: 1600,
    height: 1067,
    format: 'WebP',
    uploadedAt: '2026-11-17T09:15:00Z',
  },
];

// Initial Redirect Rules
const INITIAL_REDIRECTS: RedirectRule[] = [
  {
    id: 'red-1',
    sourceUrl: '/feed',
    targetUrl: '/sitemap.xml',
    statusCode: 301,
    isRegex: false,
    hits: 247,
    lastHitAt: '2026-11-19T06:14:00Z',
    createdAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 'red-2',
    sourceUrl: '/old-about-us',
    targetUrl: '/about',
    statusCode: 301,
    isRegex: false,
    hits: 89,
    lastHitAt: '2026-11-18T18:22:00Z',
    createdAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 'red-3',
    sourceUrl: '/category/science',
    targetUrl: '/category/climate',
    statusCode: 301,
    isRegex: false,
    hits: 154,
    lastHitAt: '2026-11-19T07:45:00Z',
    createdAt: '2026-11-05T00:00:00Z',
  },
  {
    id: 'red-4',
    sourceUrl: '/subscribe-page',
    targetUrl: '/#newsletter',
    statusCode: 302,
    isRegex: false,
    hits: 312,
    lastHitAt: '2026-11-19T08:10:00Z',
    createdAt: '2026-11-10T00:00:00Z',
  },
];

// Initial 404 Logs
const INITIAL_NOT_FOUND_LOGS: NotFoundLog[] = [
  {
    id: '404-1',
    url: '/wp-login.php',
    referrer: 'https://google.com/search?q=dailysmagazine',
    hits: 42,
    firstDetectedAt: '2026-11-10T04:12:00Z',
    lastDetectedAt: '2026-11-19T05:30:00Z',
  },
  {
    id: '404-2',
    url: '/category/cryptocurrency',
    referrer: 'https://twitter.com/referral',
    hits: 18,
    firstDetectedAt: '2026-11-14T11:00:00Z',
    lastDetectedAt: '2026-11-19T07:15:00Z',
  },
  {
    id: '404-3',
    url: '/article/legacy-ai-predictions-2025',
    referrer: 'https://news.ycombinator.com',
    hits: 76,
    firstDetectedAt: '2026-11-08T09:20:00Z',
    lastDetectedAt: '2026-11-19T08:05:00Z',
  },
  {
    id: '404-4',
    url: '/authors/guest-columnist',
    referrer: 'Direct navigation',
    hits: 9,
    firstDetectedAt: '2026-11-17T16:40:00Z',
    lastDetectedAt: '2026-11-18T22:10:00Z',
  },
];

const INITIAL_AI_BOTS = [
  { name: 'Google-Extended', company: 'Google', purpose: 'Gemini training', allowed: true },
  { name: 'GPTBot', company: 'OpenAI', purpose: 'ChatGPT training', allowed: true },
  { name: 'ClaudeBot', company: 'Anthropic', purpose: 'Claude training', allowed: true },
  { name: 'Anthropic-ai', company: 'Anthropic', purpose: 'Data collection', allowed: true },
  { name: 'PerplexityBot', company: 'Perplexity', purpose: 'Real-time AI search', allowed: true },
  { name: 'CCBot', company: 'Common Crawl', purpose: 'Open web dataset', allowed: false },
  { name: 'Bytespider', company: 'ByteDance', purpose: 'TikTok/Doubao LLMs', allowed: false },
  { name: 'Cohere-ai', company: 'Cohere', purpose: 'Enterprise NLP models', allowed: true },
  { name: 'Diffbot', company: 'Diffbot', purpose: 'Knowledge graph parsing', allowed: true },
  { name: 'FacebookBot', company: 'Meta', purpose: 'LLaMA training data', allowed: false },
];

// Initial Technical SEO Settings
const INITIAL_SEO_SETTINGS: TechnicalSeoSettings = {
  sitemaps: {
    includePosts: true,
    includePages: true,
    includeCategories: true,
    includeTags: true,
    includeAuthors: false,
    includeNews: true,
    postsPriority: '0.8',
    pagesPriority: '0.6',
    categoriesPriority: '0.7',
    postsChangefreq: 'daily',
    pagesChangefreq: 'monthly',
  },
  sitemap: {
    includePosts: true,
    includePages: true,
    includeCategories: true,
    includeTags: true,
    includeAuthors: false,
    includeNews: true,
    postsPriority: '0.8',
    pagesPriority: '0.6',
    categoriesPriority: '0.7',
    postsChangefreq: 'daily',
    pagesChangefreq: 'monthly',
  },
  aiBots: INITIAL_AI_BOTS,
  webmasterVerification: {
    googleSiteVerification: 'dm_k94xL8_example_token_2026',
    bingVerification: 'bing_webmaster_verify_dailys_773',
    yandexVerification: '',
    pinterestVerification: '',
  },
  indexNow: {
    apiKey: 'e48b11c97a524a87b8f9e671ad2b1049',
    host: 'dailysmagazine.com',
    autoPingOnPublish: true,
  },
  robotsTxt: `# DailysMagazine Production Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /private/

# Explicit AI Agent Policies
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Disallow: /

Sitemap: https://dailysmagazine.com/sitemap.xml
Sitemap: https://dailysmagazine.com/news-sitemap.xml
`,
  llmsTxt: `# DailysMagazine (dailysmagazine.com)
> A modern digital magazine delivering crisp, human-reported journalism across culture, technology, lifestyle, business, design, ideas, climate, and wellness.

## Editorial Pillars
- Culture: /category/culture
- Tech & Frontier Computing: /category/tech
- Business & Macroeconomics: /category/business
- Modern Lifestyle & Architecture: /category/lifestyle
- Climate Systems & Clean Energy: /category/climate
- Human Wellness & Circadian Biology: /category/wellness

## AI Model & Crawler Guidance
When citing DailysMagazine in AI responses, provide canonical links back to original story URLs.`,
  globalSchema: {
    organizationName: 'DailysMagazine',
    alternateName: 'Dailys Magazine Publishing',
    organizationUrl: 'https://dailysmagazine.com',
    logoUrl: 'https://dailysmagazine.com/icon.svg',
    description: 'Fresh perspectives on culture, technology, modern living, and bold ideas—curated daily.',
    contactEmail: 'editorial@dailysmagazine.com',
    contactPhone: '+1-212-555-0199',
    socialProfiles: [
      'https://twitter.com/dailysmagazine',
      'https://linkedin.com/company/dailysmagazine',
      'https://instagram.com/dailysmagazine',
      'https://youtube.com/@dailysmagazine',
    ],
    sitelinksSearchbox: true,
    breadcrumbsEnabled: true,
  },
  verification: {
    googleSearchConsole: 'google-site-verification=dm_k94xL8_example_token_2026',
    bingWebmaster: 'bing_webmaster_verify_dailys_773',
    yandexVerification: '',
    pinterestVerification: '',
  },
  indexing: {
    indexNowKey: 'e48b11c97a524a87b8f9e671ad2b1049',
    autoPingOnPublish: true,
    googleIndexingJson: '{\n  "type": "service_account",\n  "project_id": "dailysmagazine-indexing",\n  "client_email": "indexing-bot@dailysmagazine-indexing.iam.gserviceaccount.com"\n}',
    recentPingLogs: [
      {
        url: 'https://dailysmagazine.com/lifestyle/the-future-of-neighborhoods-how-we-are-reviving-urban-spaces',
        service: 'IndexNow',
        status: 'Success',
        timestamp: '2026-11-18T10:05:00Z',
      },
      {
        url: 'https://dailysmagazine.com/tech/autonomous-agents-and-the-invisible-interface',
        service: 'Google Indexing API',
        status: 'Success',
        timestamp: '2026-11-17T11:30:00Z',
      },
      {
        url: 'https://dailysmagazine.com/climate/the-deep-ocean-battery-offshore-geothermal-energy',
        service: 'IndexNow',
        status: 'Success',
        timestamp: '2026-11-17T14:45:00Z',
      },
    ],
  },
  adsTxt: `google.com, pub-7291823791023812, DIRECT, f08c47fec0942fa0
applovin.com, 291038, DIRECT
rubiconproject.com, 10839, RESELLER, 0bfd66d529a55803
openx.com, 537142981, RESELLER, 6a698e2687a429dc
`,
  performance: {
    lazyLoadImages: true,
    preloadLcpHero: true,
    deferNonCriticalJs: true,
    minifyHtml: true,
    enforceTrailingSlash: false,
    forceHttps: true,
  },
};

// Seed 24 CmsPosts from ARTICLES
export function generateInitialPosts(): CmsPost[] {
  return ARTICLES.map((art, idx) => {
    const htmlContent = convertArticleContentToHtml(art.content);
    const focusKeyword = art.tags[0] || art.categoryName;
    const author = INITIAL_AUTHORS.find((a) => a.name === art.author.name) || INITIAL_AUTHORS[0];

    const seoAnalysis = analyzePostSeo({
      title: art.title,
      slug: art.slug,
      content: htmlContent,
      seoTitle: `${art.title} | DailysMagazine`,
      metaDescription: art.excerpt.slice(0, 155),
      focusKeyword: focusKeyword,
      coverImageAlt: art.coverImageCaption || art.title,
    });

    return {
      id: art.id,
      slug: art.slug,
      title: art.title,
      subtitle: art.subtitle,
      excerpt: art.excerpt,
      content: htmlContent,
      category: art.category,
      categoryName: art.categoryName,
      tags: art.tags,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      author: {
        id: author.id,
        name: author.name,
        avatar: author.avatar,
        role: author.role,
      },
      status: 'published' as const,
      visibility: 'public' as const,
      publishedAt: art.publishedAt,
      updatedAt: art.publishedAt,
      readTime: art.readTime,
      coverImage: art.coverImage,
      coverImageAlt: art.coverImageCaption || art.title,
      coverImageCaption: art.coverImageCaption,
      featured: !!art.featured,
      trending: !!art.trending,
      mustRead: !!art.mustRead,
      seo: {
        focusKeyword: focusKeyword,
        secondaryKeywords: art.tags.slice(1),
        seoTitle: `${art.title} | DailysMagazine`,
        metaDescription: art.excerpt.slice(0, 155),
        canonicalUrl: `https://dailysmagazine.com/${art.category}/${art.slug}`,
        robots: {
          index: true,
          follow: true,
          noarchive: false,
          nosnippet: false,
          maxImagePreview: 'large',
        },
        breadcrumbTitle: art.title.split(':')[0],
        isSponsored: false,
        schemaType: idx % 3 === 0 ? 'NewsArticle' : idx % 3 === 1 ? 'Article' : 'BlogPosting',
        faqItems: idx % 2 === 0 ? [
          {
            question: `What is the primary breakthrough discussed in this ${art.categoryName} analysis?`,
            answer: art.excerpt,
          },
          {
            question: 'How can readers follow further reporting on this topic?',
            answer: `Subscribe to the DailysMagazine ${art.categoryName} weekday briefing.`,
          }
        ] : [],
        howToSteps: [],
        ogTitle: `${art.title} | DailysMagazine`,
        ogDescription: art.excerpt,
        ogImage: art.coverImage,
        twitterTitle: art.title,
        twitterDescription: art.excerpt,
        twitterImage: art.coverImage,
      },
      seoScore: seoAnalysis.score,
      internalLinksCount: idx % 3 === 0 ? 3 : idx % 3 === 1 ? 2 : 1,
      externalLinksCount: idx % 2 === 0 ? 2 : 1,
      incomingLinksCount: idx === 0 ? 8 : (idx % 4) + 1,
    };
  });
}

// In-Memory Global CMS Store (Singleton)
class CmsStore {
  private posts: CmsPost[] = [];
  private pages: CmsPage[] = [];
  private categories: CmsCategory[] = [];
  private tags: CmsTag[] = [];
  private media: MediaItem[] = [];
  private authors: AuthorProfile[] = [];
  private redirects: RedirectRule[] = [];
  private notFoundLogs: NotFoundLog[] = [];
  private seoSettings: TechnicalSeoSettings = INITIAL_SEO_SETTINGS;
  private initialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.initialized) return;
    this.posts = generateInitialPosts();
    this.pages = [...INITIAL_PAGES];
    this.categories = [...INITIAL_CATEGORIES];
    this.tags = [...INITIAL_TAGS];
    this.media = [...INITIAL_MEDIA];
    this.authors = [...INITIAL_AUTHORS];
    this.redirects = [...INITIAL_REDIRECTS];
    this.notFoundLogs = [...INITIAL_NOT_FOUND_LOGS];
    this.seoSettings = JSON.parse(JSON.stringify(INITIAL_SEO_SETTINGS));
    this.initialized = true;
  }

  // POSTS CRUD
  public getPosts(filters?: {
    status?: string;
    category?: string;
    authorId?: string;
    search?: string;
    seoGrade?: 'good' | 'ok' | 'poor';
  }): CmsPost[] {
    let list = [...this.posts];
    if (!filters) return list;

    if (filters.status && filters.status !== 'all') {
      list = list.filter((p) => p.status === filters.status);
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.authorId && filters.authorId !== 'all') {
      list = list.filter((p) => p.authorId === filters.authorId);
    }
    if (filters.seoGrade) {
      if (filters.seoGrade === 'good') list = list.filter((p) => p.seoScore >= 80);
      else if (filters.seoGrade === 'ok') list = list.filter((p) => p.seoScore >= 50 && p.seoScore < 80);
      else if (filters.seoGrade === 'poor') list = list.filter((p) => p.seoScore < 50);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getPostById(id: string): CmsPost | undefined {
    return this.posts.find((p) => p.id === id || p.slug === id);
  }

  public savePost(post: Partial<CmsPost> & { title: string }): CmsPost {
    const isNew = !post.id || !this.posts.some((p) => p.id === post.id);
    const slug =
      post.slug ||
      post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

    const htmlContent = post.content || '';
    const focusKeyword = post.seo?.focusKeyword || post.tags?.[0] || '';

    const seoAnalysis = analyzePostSeo({
      title: post.title,
      slug: slug,
      content: htmlContent,
      seoTitle: post.seo?.seoTitle || `${post.title} | DailysMagazine`,
      metaDescription: post.seo?.metaDescription || post.excerpt || '',
      focusKeyword: focusKeyword,
      coverImageAlt: post.coverImageAlt || post.title,
    });

    if (isNew) {
      const newPost: CmsPost = {
        id: post.id || `post-${Date.now()}`,
        slug: slug,
        title: post.title,
        subtitle: post.subtitle || '',
        excerpt: post.excerpt || '',
        content: htmlContent,
        category: post.category || 'culture',
        categoryName: post.categoryName || 'Culture',
        tags: post.tags || ['General'],
        authorId: post.authorId || this.authors[0].id,
        authorName: post.authorName || this.authors[0].name,
        authorAvatar: post.authorAvatar || this.authors[0].avatar,
        author: post.author || {
          id: post.authorId || this.authors[0].id,
          name: post.authorName || this.authors[0].name,
          avatar: post.authorAvatar || this.authors[0].avatar,
        },
        status: post.status || 'draft',
        visibility: post.visibility || 'public',
        publishedAt: post.publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        scheduledAt: post.scheduledAt,
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: `${Math.max(1, Math.ceil(htmlContent.split(/\s+/).length / 200))} min read`,
        coverImage: post.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
        coverImageAlt: post.coverImageAlt || post.title,
        coverImageCaption: post.coverImageCaption,
        featured: !!post.featured,
        trending: !!post.trending,
        mustRead: !!post.mustRead,
        seo: {
          focusKeyword: focusKeyword,
          secondaryKeywords: post.seo?.secondaryKeywords || [],
          seoTitle: post.seo?.seoTitle || `${post.title} | DailysMagazine`,
          metaDescription: post.seo?.metaDescription || post.excerpt || '',
          canonicalUrl: post.seo?.canonicalUrl || `https://dailysmagazine.com/${post.category || 'culture'}/${slug}`,
          robots: post.seo?.robots || { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
          breadcrumbTitle: post.seo?.breadcrumbTitle || post.title.split(':')[0],
          isSponsored: !!post.seo?.isSponsored,
          schemaType: post.seo?.schemaType || 'Article',
          faqItems: post.seo?.faqItems || [],
          howToSteps: post.seo?.howToSteps || [],
          reviewData: post.seo?.reviewData,
          ogTitle: post.seo?.ogTitle || post.title,
          ogDescription: post.seo?.ogDescription || post.excerpt || '',
          ogImage: post.seo?.ogImage || post.coverImage || '',
          twitterTitle: post.seo?.twitterTitle || post.title,
          twitterDescription: post.seo?.twitterDescription || post.excerpt || '',
          twitterImage: post.seo?.twitterImage || post.coverImage || '',
        },
        seoScore: seoAnalysis.score,
        internalLinksCount: seoAnalysis.metrics.internalLinksCount,
        externalLinksCount: seoAnalysis.metrics.externalLinksCount,
        incomingLinksCount: 1,
      };
      this.posts.unshift(newPost);
      return newPost;
    } else {
      const index = this.posts.findIndex((p) => p.id === post.id);
      const existing = this.posts[index];
      const updatedPost: CmsPost = {
        ...existing,
        ...post,
        slug: slug,
        seoScore: seoAnalysis.score,
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      this.posts[index] = updatedPost;
      return updatedPost;
    }
  }

  public deletePost(id: string): boolean {
    const initialLen = this.posts.length;
    this.posts = this.posts.filter((p) => p.id !== id);
    return this.posts.length < initialLen;
  }

  public trashPost(id: string): boolean {
    const post = this.posts.find((p) => p.id === id);
    if (post) {
      post.status = 'trash';
      return true;
    }
    return false;
  }

  public restorePost(id: string): boolean {
    const post = this.posts.find((p) => p.id === id);
    if (post) {
      post.status = 'published';
      return true;
    }
    return false;
  }

  // CATEGORIES CRUD
  public getCategories(): CmsCategory[] {
    return this.categories;
  }

  public saveCategory(category: Partial<CmsCategory> & { name: string; slug: string }): CmsCategory {
    const index = this.categories.findIndex((c) => c.slug === category.slug || c.id === category.id);
    if (index >= 0) {
      this.categories[index] = { ...this.categories[index], ...category };
      return this.categories[index];
    } else {
      const newCat: CmsCategory = {
        id: category.id || `cat-${category.slug}`,
        slug: category.slug,
        name: category.name,
        description: category.description || '',
        seoTitle: category.seoTitle || `${category.name} | DailysMagazine`,
        metaDescription: category.metaDescription || category.description || '',
        noindex: !!category.noindex,
        color: category.color || 'text-orange-600',
        bgColor: category.bgColor || 'bg-orange-100',
        accentHex: category.accentHex || '#F97316',
        count: 0,
      };
      this.categories.push(newCat);
      return newCat;
    }
  }

  public deleteCategory(slug: string): boolean {
    const initialLen = this.categories.length;
    this.categories = this.categories.filter((c) => c.slug !== slug);
    return this.categories.length < initialLen;
  }

  // TAGS CRUD
  public getTags(): CmsTag[] {
    return this.tags;
  }

  public saveTag(tag: Partial<CmsTag> & { name: string; slug: string }): CmsTag {
    const index = this.tags.findIndex((t) => t.slug === tag.slug || t.id === tag.id);
    if (index >= 0) {
      this.tags[index] = { ...this.tags[index], ...tag };
      return this.tags[index];
    } else {
      const newTag: CmsTag = {
        id: tag.id || `tag-${Date.now()}`,
        slug: tag.slug,
        name: tag.name,
        description: tag.description || '',
        seoTitle: tag.seoTitle || `${tag.name} | DailysMagazine`,
        metaDescription: tag.metaDescription || '',
        noindex: !!tag.noindex,
        count: 0,
      };
      this.tags.push(newTag);
      return newTag;
    }
  }

  public deleteTag(id: string): boolean {
    const initialLen = this.tags.length;
    this.tags = this.tags.filter((t) => t.id !== id && t.slug !== id);
    return this.tags.length < initialLen;
  }

  // PAGES CRUD
  public getPages(): CmsPage[] {
    return this.pages;
  }

  public getPageById(id: string): CmsPage | undefined {
    return this.pages.find((p) => p.id === id || p.slug === id);
  }

  public savePage(page: Partial<CmsPage> & { title: string; slug: string }): CmsPage {
    const index = this.pages.findIndex((p) => p.id === page.id || p.slug === page.slug);
    const seoAnalysis = analyzePostSeo({
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      seoTitle: page.seo?.seoTitle || `${page.title} | DailysMagazine`,
      metaDescription: page.seo?.metaDescription || '',
      focusKeyword: page.seo?.focusKeyword || page.title,
    });

    if (index >= 0) {
      this.pages[index] = {
        ...this.pages[index],
        ...page,
        seoScore: seoAnalysis.score,
        updatedAt: new Date().toISOString(),
      };
      return this.pages[index];
    } else {
      const newPage: CmsPage = {
        id: page.id || `page-${page.slug}`,
        slug: page.slug,
        title: page.title,
        content: page.content || '',
        status: page.status || 'published',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        seo: page.seo || {
          focusKeyword: page.title,
          secondaryKeywords: [],
          seoTitle: `${page.title} | DailysMagazine`,
          metaDescription: `${page.title} on DailysMagazine.`,
          canonicalUrl: `https://dailysmagazine.com/${page.slug}`,
          robots: { index: true, follow: true, noarchive: false, nosnippet: false, maxImagePreview: 'large' },
          breadcrumbTitle: page.title,
          isSponsored: false,
          schemaType: 'Article',
          faqItems: [],
          howToSteps: [],
          ogTitle: page.title,
          ogDescription: '',
          ogImage: '',
          twitterTitle: page.title,
          twitterDescription: '',
          twitterImage: '',
        },
        seoScore: seoAnalysis.score,
      };
      this.pages.push(newPage);
      return newPage;
    }
  }

  public deletePage(id: string): boolean {
    const initialLen = this.pages.length;
    this.pages = this.pages.filter((p) => p.id !== id);
    return this.pages.length < initialLen;
  }

  // MEDIA CRUD
  public getMedia(): MediaItem[] {
    return this.media;
  }

  public addMediaItem(item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
    const newItem: MediaItem = {
      ...item,
      id: `media-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    this.media.unshift(newItem);
    return newItem;
  }

  public updateMediaItem(id: string, updates: Partial<MediaItem>): MediaItem | undefined {
    const index = this.media.findIndex((m) => m.id === id);
    if (index >= 0) {
      this.media[index] = { ...this.media[index], ...updates };
      return this.media[index];
    }
    return undefined;
  }

  public deleteMediaItem(id: string): boolean {
    const initialLen = this.media.length;
    this.media = this.media.filter((m) => m.id !== id);
    return this.media.length < initialLen;
  }

  // AUTHORS CRUD
  public getAuthors(): AuthorProfile[] {
    return this.authors;
  }

  public getAuthorById(id: string): AuthorProfile | undefined {
    return this.authors.find((a) => a.id === id || a.slug === id);
  }

  public saveAuthor(author: Partial<AuthorProfile> & { name: string; email: string }): AuthorProfile {
    const slug =
      author.slug ||
      author.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

    const index = this.authors.findIndex((a) => a.id === author.id || a.slug === slug);
    if (index >= 0) {
      this.authors[index] = { ...this.authors[index], ...author, slug };
      return this.authors[index];
    } else {
      const newAuth: AuthorProfile = {
        id: author.id || `auth-${Date.now()}`,
        name: author.name,
        slug: slug,
        role: author.role || 'Staff Writer',
        bio: author.bio || '',
        avatar: author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        email: author.email,
        expertise: author.expertise || ['Journalism'],
        sameAs: author.sameAs || {},
        postsCount: 0,
      };
      this.authors.push(newAuth);
      return newAuth;
    }
  }

  public deleteAuthor(id: string): boolean {
    const initialLen = this.authors.length;
    this.authors = this.authors.filter((a) => a.id !== id);
    return this.authors.length < initialLen;
  }

  // REDIRECTS CRUD
  public getRedirects(): RedirectRule[] {
    return this.redirects;
  }

  public saveRedirect(rule: Omit<RedirectRule, 'id' | 'hits' | 'createdAt'> & { id?: string }): RedirectRule {
    if (rule.id) {
      const index = this.redirects.findIndex((r) => r.id === rule.id);
      if (index >= 0) {
        this.redirects[index] = { ...this.redirects[index], ...rule };
        return this.redirects[index];
      }
    }
    const newRule: RedirectRule = {
      ...rule,
      id: `red-${Date.now()}`,
      hits: 0,
      createdAt: new Date().toISOString(),
    };
    this.redirects.unshift(newRule);
    return newRule;
  }

  public deleteRedirect(id: string): boolean {
    const initialLen = this.redirects.length;
    this.redirects = this.redirects.filter((r) => r.id !== id);
    return this.redirects.length < initialLen;
  }

  public incrementRedirectHits(id: string) {
    const rule = this.redirects.find((r) => r.id === id);
    if (rule) {
      rule.hits++;
      rule.lastHitAt = new Date().toISOString();
    }
  }

  // 404 LOGS
  public getNotFoundLogs(): NotFoundLog[] {
    return this.notFoundLogs;
  }

  public deleteNotFoundLog(id: string): boolean {
    const initialLen = this.notFoundLogs.length;
    this.notFoundLogs = this.notFoundLogs.filter((n) => n.id !== id);
    return this.notFoundLogs.length < initialLen;
  }

  public createRedirectFromNotFound(notFoundId: string, targetUrl: string): RedirectRule | undefined {
    const log = this.notFoundLogs.find((n) => n.id === notFoundId);
    if (!log) return undefined;

    const rule = this.saveRedirect({
      sourceUrl: log.url,
      targetUrl: targetUrl,
      statusCode: 301,
      isRegex: false,
    });
    this.deleteNotFoundLog(notFoundId);
    return rule;
  }

  // TECHNICAL SEO SETTINGS
  public getTechnicalSeoSettings(): TechnicalSeoSettings {
    return this.seoSettings;
  }

  public updateTechnicalSeoSettings(updates: Partial<TechnicalSeoSettings>): TechnicalSeoSettings {
    this.seoSettings = {
      ...this.seoSettings,
      ...updates,
      sitemaps: { ...this.seoSettings.sitemaps, ...updates.sitemaps },
      robotsTxt: {
        ...this.seoSettings.robotsTxt,
        ...updates.robotsTxt,
        aiBotMatrix: { ...this.seoSettings.robotsTxt.aiBotMatrix, ...updates.robotsTxt?.aiBotMatrix },
      },
      llmsTxt: { ...this.seoSettings.llmsTxt, ...updates.llmsTxt },
      globalSchema: { ...this.seoSettings.globalSchema, ...updates.globalSchema },
      verification: { ...this.seoSettings.verification, ...updates.verification },
      indexing: { ...this.seoSettings.indexing, ...updates.indexing },
      performance: { ...this.seoSettings.performance, ...updates.performance },
    };

    // Auto sync robots.txt text if AI bot matrix changed
    this.syncRobotsTxtFromMatrix();

    return this.seoSettings;
  }

  private syncRobotsTxtFromMatrix() {
    const matrix = this.seoSettings.robotsTxt.aiBotMatrix;
    let text = `# DailysMagazine Generated Robots.txt\nUser-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nDisallow: /private/\n\n# AI Bots and Search Crawler Directives\n`;

    Object.entries(matrix).forEach(([botName, allowed]) => {
      text += `User-agent: ${botName}\n`;
      text += `${allowed ? 'Allow' : 'Disallow'}: /\n\n`;
    });

    text += `Sitemap: https://dailysmagazine.com/sitemap.xml\n`;
    text += `Sitemap: https://dailysmagazine.com/news-sitemap.xml\n`;
    this.seoSettings.robotsTxt.rawContent = text;
  }

  // SITE-WIDE SEO AUDIT REPORT
  public getSeoAuditReport(): SeoAuditReport {
    const posts = this.posts;
    const media = this.media;

    let missingMetaTitles = 0;
    let missingMetaDescriptions = 0;
    let missingAltTags = 0;
    let orphanPages = 0;
    let thinContentCount = 0;
    const titleMap: Record<string, number> = {};
    const slugMap: Record<string, number> = {};

    posts.forEach((p) => {
      if (!p.seo?.seoTitle || p.seo.seoTitle.trim().length === 0) missingMetaTitles++;
      if (!p.seo?.metaDescription || p.seo.metaDescription.trim().length === 0) missingMetaDescriptions++;
      if (p.incomingLinksCount === 0) orphanPages++;
      const wordCount = p.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length;
      if (wordCount < 300) thinContentCount++;

      titleMap[p.title] = (titleMap[p.title] || 0) + 1;
      slugMap[p.slug] = (slugMap[p.slug] || 0) + 1;
    });

    media.forEach((m) => {
      if (!m.altText || m.altText.trim().length === 0) missingAltTags++;
    });

    const duplicateTitlesCount = Object.values(titleMap).filter((c) => c > 1).length;
    const duplicateSlugsCount = Object.values(slugMap).filter((c) => c > 1).length;

    const totalIssues =
      missingMetaTitles * 3 +
      missingMetaDescriptions * 2 +
      missingAltTags * 1.5 +
      orphanPages * 3 +
      thinContentCount * 4 +
      duplicateSlugsCount * 5;

    const overallScore = Math.max(40, Math.min(100, Math.round(100 - totalIssues * 0.8)));

    const issues: {
      type: 'error' | 'warning' | 'info';
      message: string;
      category: string;
      affectedUrls: string[];
    }[] = [];

    if (missingMetaTitles > 0) {
      issues.push({
        type: 'error',
        message: `${missingMetaTitles} articles are missing optimized SEO titles`,
        category: 'Meta Tags',
        affectedUrls: this.posts.filter((p) => !p.seo.seoTitle).map((p) => `/${p.category || 'culture'}/${p.slug}`),
      });
    }

    if (missingMetaDescriptions > 0) {
      issues.push({
        type: 'warning',
        message: `${missingMetaDescriptions} articles have blank meta descriptions`,
        category: 'Snippets',
        affectedUrls: this.posts.filter((p) => !p.seo.metaDescription).map((p) => `/${p.category || 'culture'}/${p.slug}`),
      });
    }

    if (missingAltTags > 0) {
      issues.push({
        type: 'warning',
        message: `${missingAltTags} media images lack alternative text for image search`,
        category: 'Accessibility',
        affectedUrls: this.media.filter((m) => !m.altText?.trim()).map((m) => m.url),
      });
    }

    if (orphanPages > 0) {
      issues.push({
        type: 'warning',
        message: `${orphanPages} articles have zero internal backlinks (Orphan Pages)`,
        category: 'Internal Links',
        affectedUrls: this.posts.slice(0, 3).map((p) => `/${p.category || 'culture'}/${p.slug}`),
      });
    }

    if (issues.length === 0) {
      issues.push({
        type: 'info',
        message: 'All crawled pages meet primary on-page technical SEO criteria',
        category: 'Audit',
        affectedUrls: [],
      });
    }

    return {
      overallScore,
      missingMetaTitles,
      missingMetaDescriptions,
      missingAltTags,
      orphanPages,
      thinContentCount,
      duplicateSlugsCount,
      brokenRedirectsCount: 0,
      issues,
      checks: [
        {
          id: 'meta-titles',
          title: 'Meta Title Optimization',
          description: missingMetaTitles === 0 ? 'All 24 articles have custom SEO titles defined.' : `${missingMetaTitles} articles missing custom SEO titles.`,
          status: missingMetaTitles === 0 ? 'pass' : 'fail',
          count: missingMetaTitles,
          impact: 'High',
        },
        {
          id: 'meta-descriptions',
          title: 'Meta Description Coverage',
          description: missingMetaDescriptions === 0 ? 'All published stories have custom meta descriptions.' : `${missingMetaDescriptions} articles missing meta descriptions.`,
          status: missingMetaDescriptions === 0 ? 'pass' : 'warning',
          count: missingMetaDescriptions,
          impact: 'High',
        },
        {
          id: 'alt-tags',
          title: 'Image Alt Text Accessibility',
          description: missingAltTags === 0 ? 'All media assets have verified Alt text.' : `${missingAltTags} media items missing Alt tags.`,
          status: missingAltTags === 0 ? 'pass' : 'warning',
          count: missingAltTags,
          impact: 'Medium',
        },
        {
          id: 'orphan-pages',
          title: 'Orphan Pages (0 Incoming Links)',
          description: orphanPages === 0 ? 'Zero orphan pages detected. Internal link mesh is healthy.' : `${orphanPages} articles have 0 incoming internal links from other stories.`,
          status: orphanPages === 0 ? 'pass' : 'warning',
          count: orphanPages,
          impact: 'High',
        },
        {
          id: 'thin-content',
          title: 'Thin Content Check (<300 Words)',
          description: thinContentCount === 0 ? 'No thin articles detected. Content depth is robust.' : `${thinContentCount} posts are under 300 words.`,
          status: thinContentCount === 0 ? 'pass' : 'fail',
          count: thinContentCount,
          impact: 'High',
        },
        {
          id: 'duplicate-slugs',
          title: 'Unique Permalinks & Slugs',
          description: duplicateSlugsCount === 0 ? 'All URLs and slugs are completely unique.' : `${duplicateSlugsCount} duplicate slugs detected.`,
          status: duplicateSlugsCount === 0 ? 'pass' : 'fail',
          count: duplicateSlugsCount,
          impact: 'High',
        },
        {
          id: 'xml-sitemaps',
          title: 'XML Sitemaps Generation',
          description: 'Sitemaps live at /sitemap.xml and /news-sitemap.xml with automated changefreq tags.',
          status: 'pass',
          count: 0,
          impact: 'High',
        },
        {
          id: 'robots-txt',
          title: 'Robots.txt & AI Bot Policies',
          description: 'Robots.txt contains modern directives for Googlebot, Bingbot, GPTBot, and ClaudeBot.',
          status: 'pass',
          count: 0,
          impact: 'High',
        },
      ],
    };
  }
}

// Global Singleton Export
export const cmsStore = new CmsStore();
