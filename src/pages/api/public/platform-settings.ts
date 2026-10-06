import type { APIRoute } from 'astro';
import { getPlatformFeePercentage, getMaxStoreBranches } from '@/services/finance';
import { handleApiRoute, jsonSuccess } from '@/lib/utils';

export const prerender = false;

export const GET: APIRoute = async (): Promise<Response> => {
  return handleApiRoute(async () => {
    const maxStoreBranches = await getMaxStoreBranches();
    const platformFeePercentage = await getPlatformFeePercentage();

    const res = jsonSuccess({
      maxStoreBranches,
      platformFeePercentage,
    });

    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    return res;
  });
};
