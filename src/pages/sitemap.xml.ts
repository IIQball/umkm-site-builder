import type { APIRoute } from 'astro';
import { db, stores } from '@/db';
import { eq, and, isNull } from 'drizzle-orm';
import { getStoreDirectUrl } from '@/lib/domain';

interface SitemapRoute {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

export const GET: APIRoute = async (context) => {
  const baseUrl = context.url.origin && context.url.origin !== 'null'
    ? context.url.origin
    : (process.env.PUBLIC_SITE_URL || 'https://pinoka-landing-page.23withv.workers.dev');

  const staticRoutes: SitemapRoute[] = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/umkm', priority: '0.9', changefreq: 'daily' },
    { loc: '/templates', priority: '0.8', changefreq: 'weekly' },
    { loc: '/auth/login', priority: '0.5', changefreq: 'monthly' },
    { loc: '/auth/register', priority: '0.5', changefreq: 'monthly' },
    { loc: '/terms', priority: '0.3', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'monthly' },
  ];

  let dynamicRoutes: SitemapRoute[] = [];

  try {
    const activeStores = await db.query.stores.findMany({
      where: and(eq(stores.status, 'active'), isNull(stores.deletedAt)),
      columns: {
        subdomain: true,
        updatedAt: true,
      },
      limit: 500,
    });

    dynamicRoutes = activeStores.map((s) => ({
      loc: `${getStoreDirectUrl(s.subdomain, context.url.host, context.url.protocol)}/`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: s.updatedAt ? new Date(s.updatedAt).toISOString() : undefined,
    }));
  } catch (error) {
    console.error('Error fetching stores for sitemap:', error);
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${r.loc.startsWith('http://') || r.loc.startsWith('https://') ? r.loc : `${baseUrl}${r.loc}`}</loc>
    <lastmod>${r.lastmod || now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
