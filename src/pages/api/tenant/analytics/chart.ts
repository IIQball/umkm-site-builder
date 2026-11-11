import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { stores } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { handleApiRoute, jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { getStoreTrafficSeries, type TrafficRange } from '@/services/analytics.service';

const VALID_RANGES: TrafficRange[] = ['7d', '30d', '12m'];

export const GET: APIRoute = async ({ request, url }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const rangeParam = (url.searchParams.get('range') ?? '12m') as TrafficRange;
    if (!VALID_RANGES.includes(rangeParam)) {
      return jsonError('Parameter range harus 7d, 30d, atau 12m', 400, undefined, 'VALIDATION_ERROR');
    }

    const [store] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(and(eq(stores.userId, user.id), isNull(stores.deletedAt)))
      .limit(1);

    if (!store) {
      return jsonSuccess({ range: rangeParam, points: [] }, 200);
    }

    const points = await getStoreTrafficSeries(store.id, rangeParam);
    return jsonSuccess({ range: rangeParam, points }, 200);
  });
};
