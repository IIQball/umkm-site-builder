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
    const yearParam = url.searchParams.get('year');
    const monthParam = url.searchParams.get('month');
    const daysParam = url.searchParams.get('days');
    const rangeParam = url.searchParams.get('range') || url.searchParams.get('period');
    const depositLimitParam = url.searchParams.get('depositLimit');

    const year = yearParam ? parseInt(yearParam, 10) : undefined;
    const month = monthParam && monthParam !== 'all' ? parseInt(monthParam, 10) : (monthParam === 'all' ? 'all' : undefined);

    let days: number | undefined = undefined;
    if (!year) {
      days = 14;
      if (rangeParam === 'month' || rangeParam === 'current_month') {
        days = Math.max(1, new Date().getDate());
      } else if (rangeParam === '7d') {
        days = 7;
      } else if (rangeParam === '30d') {
        days = 30;
      } else if (daysParam) {
        days = Math.max(1, Math.min(90, Number(daysParam) || 14));
      }
    }
    const depositLimitOverrideIdr = depositLimitParam && Number(depositLimitParam) > 0
      ? Number(depositLimitParam)
      : undefined;

    const data = await getAiCostTrends({
      year,
      month,
      days,
      depositLimitOverrideIdr,
    });

    return jsonSuccess(data);
  });
};
