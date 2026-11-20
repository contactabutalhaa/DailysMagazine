import { cmsStore } from '@/lib/cms-store';

export async function GET() {
  const posts = cmsStore.getPosts().filter((p) => p.status === 'published' && !p.seo.noindex).slice(0, 15);

  const urlElements = posts
    .map((p) => {
      const categorySlug = p.category ? p.category.toLowerCase() : 'culture';
      const loc = `https://dailysmagazine.com/${categorySlug}/${p.slug}`;
      const pubDate = new Date(p.publishedAt || p.createdAt || Date.now()).toISOString();
      const cleanTitle = (p.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>DailysMagazine</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlElements}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  });
}
