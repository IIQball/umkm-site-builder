import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { getTopTenantsAi } from '@/services/ai/top-tenants.service';

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
    const limitParam = url.searchParams.get('limit');
    const sortByParam = url.searchParams.get('sortBy');
    const orderParam = url.searchParams.get('order');
    const daysParam = url.searchParams.get('days');
    const yearParam = url.searchParams.get('year');
    const monthParam = url.searchParams.get('month');
    const isTestingParam = url.searchParams.get('isTesting');

    const limit = limitParam ? Math.max(1, Math.min(100, Number(limitParam) || 10)) : 10;
    const sortBy = sortByParam === 'generations' ? 'generations' : 'cost';
    const order = orderParam === 'asc' ? 'asc' : 'desc';
    const days = daysParam && Number(daysParam) > 0 ? Number(daysParam) : undefined;
    const year = yearParam ? parseInt(yearParam, 10) : undefined;
    const month = monthParam && monthParam !== 'all' ? parseInt(monthParam, 10) : undefined;

    let isTesting: boolean | undefined = undefined;
    if (isTestingParam === 'true' || isTestingParam === '1') {
      isTesting = true;
    } else if (isTestingParam === 'false' || isTestingParam === '0') {
      isTesting = false;
    }

    const data = await getTopTenantsAi({
      limit,
      sortBy,
      order,
      days,
      year,
      month,
      isTesting,
    });

    return jsonSuccess(data);
  });
};
