import type { APIRoute } from 'astro';
import { handleApiRoute, jsonSuccess, jsonError } from '@/lib/utils/api-handler';

const ALLOWED_MAPS_HOSTS = new Set([
  'maps.app.goo.gl',
  'goo.gl',
  'maps.google.com',
  'www.google.com',
]);

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  return handleApiRoute(async () => {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      return jsonSuccess({ canonicalUrl: '' });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return jsonError('URL tidak valid', 400);
    }

    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return jsonError('Protokol URL tidak didukung', 400);
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const isGoogleMaps =
      ALLOWED_MAPS_HOSTS.has(hostname) ||
      hostname.endsWith('.google.com');

    if (!isGoogleMaps) {
      return jsonSuccess({ canonicalUrl: targetUrl });
    }

    try {
      const headRes = await fetch(targetUrl, {
        redirect: 'manual',
        signal: AbortSignal.timeout(3000),
      });
      const redirectLocation = headRes.headers.get('location');
      const canonical = redirectLocation || targetUrl;
      return jsonSuccess({ canonicalUrl: canonical }, 200);
    } catch {
      return jsonSuccess({ canonicalUrl: targetUrl }, 200);
    }
  });
};
