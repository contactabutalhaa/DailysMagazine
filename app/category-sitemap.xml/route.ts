import { cmsStore } from '@/lib/cms-store';

export async function GET() {
  const categories = cmsStore.getCategories().filter((c) => !c.noindex);
  const now = new Date().toISOString();

  const urlElements = categories
    .map((c) => {
      const loc = `https://dailysmagazine.com/category/${c.slug}`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
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
