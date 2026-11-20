import { cmsStore } from '@/lib/cms-store';

export async function GET() {
  const settings = cmsStore.getTechnicalSeoSettings().sitemap;
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://dailysmagazine.com/post-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dailysmagazine.com/page-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dailysmagazine.com/category-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  ${
    settings.includeNews
      ? `<sitemap>
    <loc>https://dailysmagazine.com/news-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
      : ''
  }
</sitemapindex>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
