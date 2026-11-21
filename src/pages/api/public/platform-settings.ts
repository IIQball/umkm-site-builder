import type { APIRoute } from 'astro';
import { getPlatformSettings } from '@/services/finance';
import { handleApiRoute, jsonSuccess } from '@/lib/utils';

export const prerender = false;

export const GET: APIRoute = async (): Promise<Response> => {
  return handleApiRoute(async () => {
    const settings = await getPlatformSettings();

    const res = jsonSuccess({
      maxStoreBranches: settings.maxStoreBranches,
      platformFeePercentage: settings.platformFeePercentage,
      contactPhone: settings.contactPhone,
      contactEmail: settings.contactEmail,
    });

    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    return res;
  });
};
