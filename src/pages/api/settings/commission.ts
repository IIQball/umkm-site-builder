import type { APIRoute } from 'astro';
import { getPlatformFeePercentage, DEFAULT_PLATFORM_FEE_PERCENTAGE } from '@/services/finance';

export const GET: APIRoute = async (): Promise<Response> => {
  try {
    const platformFeePercentage = await getPlatformFeePercentage();
    const designerPercentage = Math.max(0, 100 - platformFeePercentage);

    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        data: {
          platformFeePercentage,
          designerPercentage,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        data: {
          platformFeePercentage: DEFAULT_PLATFORM_FEE_PERCENTAGE,
          designerPercentage: 100 - DEFAULT_PLATFORM_FEE_PERCENTAGE,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
