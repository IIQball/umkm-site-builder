import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const origin = context.url.origin && context.url.origin !== 'null'
    ? context.url.origin
    : (process.env.PUBLIC_SITE_URL || 'https://pinoka-landing-page.23withv.workers.dev');

  const content = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /builder/
Disallow: /onboarding/
Disallow: /checkout/
Disallow: /designer/

# Allow indexing public assets & files
Allow: /og-image.png
Allow: /icon-512x512.svg
Allow: /icon-desktop-512.svg
Allow: /apple-touch-icon.svg
Allow: /favicon.svg
Allow: /site.webmanifest
Allow: /llms.txt
Allow: /images/
Allow: /frames/

# AI Search & LLM Agents
User-agent: GPTBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /builder/

User-agent: ClaudeBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /builder/

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
