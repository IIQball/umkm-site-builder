import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { getAiCostTrends } from '@/services/ai/cost-trends.service';

export const prerender = false;

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);

    if (!user) {
      throw new AppError('Unauthorized', 401);
    }
    if (!isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    const url = new URL(context.request.url);
    const daysParam = url.searchParams.get('days');
    const depositLimitParam = url.searchParams.get('depositLimit');

    const days = daysParam ? Math.max(1, Math.min(90, Number(daysParam) || 14)) : 14;
    const depositLimitOverrideIdr = depositLimitParam && Number(depositLimitParam) > 0
      ? Number(depositLimitParam)
      : undefined;

    const data = await getAiCostTrends({
      days,
      depositLimitOverrideIdr,
    });

    return jsonSuccess(data);
  });
};
