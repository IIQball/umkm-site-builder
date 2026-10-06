import type { APIRoute } from 'astro';
import { getPublicTemplates } from '@/services';
import { handleApiRoute, jsonSuccess } from '@/lib/utils';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const url = new URL(context.request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const list = await getPublicTemplates(page, 10);

    const res = jsonSuccess(list);
    res.headers.set('Cache-Control', 'public, max-age=10, s-maxage=30');
    return res;
  });
};

