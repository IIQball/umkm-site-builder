import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { getAiLogs } from '@/services/ai/monitoring.service';

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
    const isTestingParam = url.searchParams.get('isTesting');
    let isTesting: boolean | undefined = undefined;
    if (isTestingParam === 'true' || isTestingParam === '1') {
      isTesting = true;
    } else if (isTestingParam === 'false' || isTestingParam === '0') {
      isTesting = false;
    }

    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit') || url.searchParams.get('pageSize');
    const statusParam = url.searchParams.get('status') || undefined;
    const featureTypeParam = url.searchParams.get('featureType') || undefined;
    const searchParam = url.searchParams.get('search') || undefined;

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
    const limit = limitParam ? Math.max(1, Math.min(100, parseInt(limitParam, 10) || 10)) : 10;

    const result = await getAiLogs({
      isTesting,
      page,
      limit,
      status: statusParam,
      featureType: featureTypeParam,
      search: searchParam,
    });

    return jsonSuccess(result);
  });
};
