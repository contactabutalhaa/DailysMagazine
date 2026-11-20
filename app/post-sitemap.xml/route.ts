import { cmsStore } from '@/lib/cms-store';

export async function GET() {
  const posts = cmsStore.getPosts().filter((p) => p.status === 'published' && !p.seo.noindex);
  const settings = cmsStore.getTechnicalSeoSettings().sitemap;

  const urlElements = posts
    .map((p) => {
      const categorySlug = p.category ? p.category.toLowerCase() : 'culture';
      const loc = `https://dailysmagazine.com/${categorySlug}/${p.slug}`;
      let lastmod = new Date().toISOString();
      try {
        const parsed = new Date(p.updatedAt || p.createdAt || Date.now());
        if (!isNaN(parsed.getTime())) {
          lastmod = parsed.toISOString();
        }
      } catch (e) {}
      const changefreq = settings.postsChangefreq || 'daily';
      const priority = settings.postsPriority || '0.8';

      let imageTag = '';
      if (p.coverImage) {
        const cleanTitle = (p.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        imageTag = `
    <image:image>
      <image:loc>${p.coverImage}</image:loc>
      <image:title>${cleanTitle}</image:title>
    </image:image>`;
      }

      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageTag}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
