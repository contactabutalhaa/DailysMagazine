import { cmsStore } from '@/lib/cms-store';

export async function GET() {
  const settings = cmsStore.getTechnicalSeoSettings();
  const content = settings.robotsTxt || `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://dailysmagazine.com/sitemap.xml`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
