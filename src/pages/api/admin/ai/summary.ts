import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { getAiMonitoringSummary } from '@/services/ai/monitoring.service';

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

    const year = yearParam ? parseInt(yearParam, 10) : undefined;
    const month = monthParam && monthParam !== 'all' ? parseInt(monthParam, 10) : undefined;

    const summary = await getAiMonitoringSummary({ year, month });
    return jsonSuccess(summary);
  });
};
