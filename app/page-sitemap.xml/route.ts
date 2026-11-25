import { cmsStore } from '@/lib/cms-store';

export async function GET() {
  const pages = cmsStore.getPages().filter((p) => !p.seo?.noindex);
  const settings = cmsStore.getTechnicalSeoSettings().sitemap;

  const urlElements = pages
    .map((p) => {
      const loc = `https://dailysmagazine.com/${p.slug}`;
      let lastmod = new Date().toISOString();
      try {
        const parsed = new Date(p.updatedAt || p.publishedAt || Date.now());
        if (!isNaN(parsed.getTime())) {
          lastmod = parsed.toISOString();
        }
      } catch (e) {}
      const changefreq = settings.pagesChangefreq || 'weekly';
      const priority = settings.pagesPriority || '0.6';

      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
