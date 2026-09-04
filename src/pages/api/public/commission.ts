import type { APIRoute } from 'astro';
import { getPlatformFeePercentage } from '@/services/finance';
import { handleApiRoute, jsonSuccess } from '@/lib/utils';

export const GET: APIRoute = async (): Promise<Response> => {
  return handleApiRoute(async () => {
    const platformFeePercentage = await getPlatformFeePercentage();
    const designerPercentage = Math.max(0, 100 - platformFeePercentage);

    const res = jsonSuccess({
      platformFeePercentage,
      designerPercentage,
    }, 'Informasi split komisi berhasil diambil');

    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  });
};

