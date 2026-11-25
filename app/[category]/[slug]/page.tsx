import React from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Clock, Calendar, CheckCircle2, ChevronRight, Tag, BookOpen } from 'lucide-react';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import TableOfContents from '@/components/TableOfContents';
import SocialShareButtons from '@/components/SocialShareButtons';
import AuthorBioCard from '@/components/AuthorBioCard';
import ArticleCard from '@/components/ArticleCard';
import { getArticleBySlug, getRelatedArticles, ARTICLES } from '@/data/articles';
import { getCustomPosts, convertCmsPostToArticle } from '@/lib/posts-storage';
import { CATEGORIES } from '@/data/categories';
import { generatePostJsonLd } from '@/lib/schema-generator';

function resolveArticle(slug: string) {
  const staticArt = getArticleBySlug(slug);
  if (staticArt) return staticArt;
  try {
    const custom = getCustomPosts();
    const match = custom.find((p) => p.slug === slug);
    if (match) return convertCmsPostToArticle(match);
  } catch (err) {}
  return undefined;
}

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = resolveArticle(params.slug);
  if (!article) {
    return {
      title: 'Story Not Found | DailysMagazine',
    };
  }
  const articleUrl = `https://dailysmagazine.com/${article.category}/${article.slug}`;
  return {
    title: `${article.title} | DailysMagazine`,
    description: article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: `${article.title} — DailysMagazine`,
      description: article.excerpt,
      url: articleUrl,
      siteName: 'DailysMagazine',
      type: 'article',
      publishedTime: article.publishedAt,
      images: [{ url: article.coverImage, width: 1200, height: 675, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = resolveArticle(params.slug);

  if (!article) {
    notFound();
  }

  // Ensure canonical category URL matches
  if (params.category !== article.category) {
    permanentRedirect(`/${article.category}/${article.slug}`);
  }

  const category = CATEGORIES[article.category];
  const relatedArticles = getRelatedArticles(article.slug, article.category, 3);

  const contentBody = Array.isArray(article.content?.sections) && article.content.sections.length > 0
    ? article.content.sections.map((s) => (Array.isArray(s.body) ? s.body.join(' ') : s.body)).join(' ')
    : article.content?.leadParagraph || article.excerpt || '';

  const jsonLd = generatePostJsonLd({
    title: article.title,
    slug: article.slug,
    categorySlug: article.category,
    excerpt: article.excerpt,
    content: contentBody,
    coverImage: article.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80',
    publishedAt: article.publishedAt,
    updatedAt: (article as any).updatedAt || article.publishedAt,
    authorName: article.author?.name || 'Editorial Staff',
    authorAvatar: article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    authorRole: article.author?.role || 'Staff Writer',
    categoryName: article.categoryName,
    schemaType: 'NewsArticle',
  });

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

  return (
    <article className="bg-white min-h-screen">
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* 2. Story Header Container */}
      <header className="pt-8 pb-10 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-orange-600 transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <Link
              href={`/category/${article.category}`}
              className="hover:text-orange-600 transition-colors shrink-0"
            >
              {article.categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-400 truncate max-w-[240px] sm:max-w-none">
              {article.title}
            </span>
          </nav>

          {/* Category Pill */}
          <div className="mb-4">
            <Link
              href={`/category/${article.category}`}
              className={`inline-block px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm transition-transform hover:scale-105 ${
                category?.bgColor || 'bg-slate-100'
              } ${category?.color || 'text-slate-800'}`}
            >
              {article.categoryName}
            </Link>
          </div>

          {/* Large Bold Headline */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight leading-[1.14] mb-4">
            {article.title}
          </h1>

          {/* Engaging Subtitle / Deck */}
          <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed mb-8 max-w-4xl">
            {article.subtitle}
          </p>

          {/* Author Byline & Social Share Row */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                <Image
                  src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                  alt={article.author?.name || 'Author'}
                  fill
                  unoptimized={article.author?.avatar?.startsWith('data:')}
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {article.author.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {article.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <SocialShareButtons
              title={article.title}
              slug={article.slug}
              category={article.category}
            />
          </div>
        </div>
      </header>

      {/* 3. Featured Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md">
          <Image
            src={article.coverImage || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80'}
            alt={article.title}
            fill
            priority
            unoptimized={article.coverImage?.startsWith('data:')}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
        {article.coverImageCaption && (
          <p className="text-xs text-slate-500 italic mt-2.5 text-center">
            {article.coverImageCaption}
          </p>
        )}
      </div>

      {/* 4. 2-Column Reading Layout (Main Content 720px + Sticky Right Rail) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Story Body (720px max-width equivalent in 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {article.content.rawHtml ? (
              <div
                className="article-rich-body space-y-6 text-[17px] leading-[1.7] text-slate-700 font-normal [&_h2]:font-heading [&_h2]:font-extrabold [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:text-slate-900 [&_h2]:tracking-tight [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-slate-100 [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-xl [&_h3]:text-slate-900 [&_h4]:font-heading [&_h4]:font-bold [&_h4]:text-lg [&_h4]:text-slate-900 [&_blockquote]:my-6 [&_blockquote]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:py-3 [&_blockquote]:bg-orange-50/50 [&_blockquote]:rounded-r-2xl [&_blockquote]:pr-4 [&_blockquote]:italic [&_blockquote]:text-slate-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:text-slate-700 [&_a]:text-orange-600 [&_a]:underline [&_a]:font-semibold [&_p]:text-[17px] [&_p]:leading-[1.7] [&_p]:text-slate-700 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2.5 [&_th]:text-left [&_td]:border [&_td]:border-slate-200 [&_td]:p-2.5 [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:my-6"
                dangerouslySetInnerHTML={{ __html: article.content.rawHtml }}
              />
            ) : (
              <>
                {/* Lead Paragraph with Stylized Drop-Cap */}
                <p className="drop-cap text-[17px] leading-[1.7] text-slate-700 font-normal">
                  {article.content.leadParagraph}
                </p>

                {/* Structured Sections */}
                {article.content.sections.map((section, idx) => {
                  const headingId = slugify(section.heading);
                  return (
                    <section key={idx} id={headingId} className="space-y-6 pt-2 scroll-mt-28">
                      {/* H2 Heading */}
                      <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight pt-4 border-t border-slate-100">
                        {section.heading}
                      </h2>

                      {/* Optional Subheading */}
                      {section.subheading && (
                        <h3 className="font-heading font-bold text-base text-orange-600 uppercase tracking-wide">
                          {section.subheading}
                        </h3>
                      )}

                      {/* Body Paragraphs */}
                      {section.body.map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[17px] leading-[1.7] text-slate-700 font-normal"
                        >
                          {paragraph}
                        </p>
                      ))}

                      {/* Left-Bordered Orange Callout / Blockquote */}
                      {section.quote && (
                        <div className="my-8 pl-6 border-l-4 border-orange-500 py-3 bg-orange-50/50 rounded-r-2xl pr-4">
                          <blockquote className="font-heading font-bold text-lg sm:text-xl text-slate-900 leading-snug italic">
                            &ldquo;{section.quote}&rdquo;
                          </blockquote>
                          {section.quoteAuthor && (
                            <cite className="block text-xs font-semibold text-orange-700 uppercase tracking-wider not-italic mt-2">
                              — {section.quoteAuthor}
                            </cite>
                          )}
                        </div>
                      )}

                      {/* Key Takeaways Bullet Box */}
                      {section.takeaways && section.takeaways.length > 0 && (
                        <div className="my-8 p-6 bg-slate-50 border border-slate-200/90 rounded-2xl">
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-4 h-4 text-orange-600" />
                            <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-900">
                              Key Editorial Takeaways
                            </h4>
                          </div>
                          <ul className="space-y-2.5">
                            {section.takeaways.map((point, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Inline Image */}
                      {section.inlineImage && (
                        <div className="my-8 rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50">
                          <div className="relative aspect-[16/9] w-full">
                            <Image
                              src={section.inlineImage.url}
                              alt={section.inlineImage.caption || 'Article image'}
                              fill
                              sizes="(max-width: 768px) 100vw, 720px"
                              className="object-cover"
                              unoptimized={section.inlineImage.url.startsWith('data:')}
                            />
                          </div>
                          <p className="text-xs text-slate-500 italic p-3 text-center">
                            {section.inlineImage.caption}
                          </p>
                        </div>
                      )}
                    </section>
                  );
                })}
              </>
            )}

            {/* Clickable Respective Category Topics Tags */}
            <div className="pt-8 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  {article.categoryName} Topics:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/category/${article.category}`}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Share Buttons (Bottom) */}
            <div className="py-4 border-y border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Enjoyed this story? Share with your network:</span>
              <SocialShareButtons
                title={article.title}
                slug={article.slug}
                category={article.category}
              />
            </div>

            {/* Detailed Author Bio Card */}
            <AuthorBioCard author={article.author} />
          </div>

          {/* Right Sticky Rail (4 cols): Auto-generated TOC + Mini Trending List */}
          <aside className="lg:col-span-4 hidden lg:block">
            <TableOfContents
              sections={article.content?.sections || []}
              currentSlug={article.slug}
            />
          </aside>
        </div>
      </div>

      {/* 5. Bottom of Story: 3-column "More From DailysMagazine" related articles grid */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
                Continue Reading
              </span>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                More From {article.categoryName}
              </h3>
            </div>
            <Link
              href={`/category/${article.category}`}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>View All {article.categoryName}</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
