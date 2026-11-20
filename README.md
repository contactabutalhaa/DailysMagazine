# DailysMagazine (dailysmagazine.com)

A modern digital magazine, multi-category editorial publication, and WordPress-style blog CMS with an enterprise-grade On-Page & Technical SEO Suite. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Framer Motion**.

---

## 🌟 Key Features

### 📰 Digital Magazine Front-End
- **Dynamic Category Permalinks:** Articles routed directly under their respective categories (`/[category]/[slug]`, e.g., `/lifestyle/the-future-of-neighborhoods`, `/tech/autonomous-agents`).
- **8 Core Editorial Categories:** Culture, Lifestyle, Tech, Business, Ideas, Design, Climate, and Wellness.
- **Hero & Curated Showcases:**
  - 3-Column Split Hero with animated lead story and trending ticker.
  - Interactive Framer Motion category filter bar.
  - Category showcase strips across Tech, Culture, Business, and Climate/Wellness.
- **Reading Experience:**
  - Dynamic scroll reading progress bar.
  - Auto-generated Table of Contents with section highlighting.
  - Interactive social sharing (Twitter/X, LinkedIn, WhatsApp, Copy Link).
  - Editorial key takeaways, drop-caps, and author bio cards.
  - Fast live search overlay with category and tag filters.

### 🛠️ WordPress-Style CMS & Admin Dashboard (`/admin`)
- **Luminous Light Editorial Theme:** Pure white cards (`#FFFFFF`), subtle slate dividers, and vibrant tangerine accents (`#F97316`).
- **2-Column Editorial Editor (`/admin/posts/new`):**
  - Live permalink preview dynamic to chosen category (`https://dailysmagazine.com/{category}/{slug}`).
  - Rich text editor with formatting, blockquotes, tables, and HTML view switcher.
  - Taxonomy selectors (Categories & Tags), Author E-E-A-T persona selector, and featured image uploader.
- **Pages Manager (`/admin/pages`):** Manage About Us, Contact, Privacy Policy, Terms, Write For Us, and Advertise.
- **Media Library (`/admin/media`):** Drag-and-drop asset management with Alt-text verification and WebP checks.
- **Authors & E-E-A-T Profiles (`/admin/authors`):** Author personas mapped to Schema.org `Person` JSON-LD.
- **Appearance & Monetization (`/admin/appearance`):** Navigation builder and header/in-article ad slot injector.

### 🚀 Built-In Technical SEO Suite (`/admin/seo`)
- **Live On-Page SEO Analyzer:** Real-time 0–100 score, keyword density checks, H1–H6 hierarchy validation, internal/external links tracker.
- **SERP Snippet Previews:** Toggle between Google Desktop & Mobile search results.
- **Automated JSON-LD Schema Generator:** NewsArticle, Article, BlogPosting, Breadcrumbs, FAQPage, HowTo, Review, and Organization.
- **XML Sitemaps Engine:** Auto-generated dynamic sitemaps (`/sitemap.xml`, `/post-sitemap.xml`, `/category-sitemap.xml`, `/news-sitemap.xml`).
- **Robots.txt & AI Scraper Firewall:** Interactive permissions editor for Googlebot, Bingbot, GPTBot, ClaudeBot, and `/llms.txt`.
- **301 & 404 Redirect Manager:** Monitor broken links and create instant 301/308 redirects.
- **IndexNow & Webmaster Push:** Instant one-click ping to Bing and Yandex APIs.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/contactabutalhaa/DailysMagazine.git

# Navigate into the project directory
cd DailysMagazine

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

---

## 📁 Project Architecture

```
├── app/
│   ├── [category]/[slug]/     # Canonical article page routed under respective category
│   ├── article/[slug]/        # 301 permanent redirect handler for legacy URLs
│   ├── category/[slug]/       # Category archive feed
│   ├── admin/                 # WordPress-style CMS & SEO dashboard
│   ├── sitemap.xml/           # Dynamic XML sitemap index
│   ├── post-sitemap.xml/      # Article sitemap
│   ├── robots.txt/            # Dynamic robots.txt
│   ├── llms.txt/              # LLM scraper documentation
│   └── layout.tsx             # Root editorial layout & global JSON-LD
├── components/
│   ├── admin/                 # CMS sidebar, topbar, post & page editors
│   ├── seo/                   # On-Page SEO analyzer, SERP preview & metabox
│   └── ...                    # Editorial cards, tickers, navigation, hero
├── data/
│   ├── articles.ts            # Curated editorial content across 8 categories
│   └── categories.ts          # Taxonomy colors, slugs, and descriptions
├── lib/
│   ├── cms-store.ts           # State-driven CRUD store for posts, pages & SEO
│   ├── schema-generator.ts    # JSON-LD structured data generator
│   └── seo-analyzer.ts        # Real-time SEO auditing engine
└── types/                     # TypeScript definitions
```

---

## 📄 License
This project is proprietary and built for DailysMagazine (`dailysmagazine.com`). All rights reserved.
