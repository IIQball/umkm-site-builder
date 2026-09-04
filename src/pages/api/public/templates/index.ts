import type { APIRoute } from 'astro';
import { getPublicTemplates } from '@/services';
import { handleApiRoute, jsonSuccess } from '@/lib/utils';

export const GET: APIRoute = async (): Promise<Response> => {
  return handleApiRoute(async () => {
    const list = await getPublicTemplates();

    const res = jsonSuccess(list, 'Katalog template berhasil dimuat');
    res.headers.set('Cache-Control', 'public, max-age=10, s-maxage=30');
    return res;
  });
};

