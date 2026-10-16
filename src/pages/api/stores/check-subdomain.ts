import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { stores } from '@db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { CheckSubdomainInput } from '@lib/stores/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import { ZodError } from 'zod';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';


async function handleCheckSubdomain(request: Request, rawInput: unknown) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return jsonError('Unauthorized', 401, undefined, 'UNAUTHORIZED');
  }

  try {
    const { subdomain } = CheckSubdomainInput.parse(rawInput);

    const [existing] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(and(eq(stores.subdomain, subdomain), isNull(stores.deletedAt)))
      .limit(1);

    return jsonSuccess({ available: !existing, subdomain }, 200);
  } catch (err) {
    if (err instanceof ZodError) {
      return jsonError(err.errors[0]?.message || 'Validation failed', 400, err.errors);
    }

    console.error('[STORE] check-subdomain failed:', err);
    return jsonError('Internal server error', 500, undefined, 'INTERNAL');
  }
}

export const GET: APIRoute = async ({ request, url }) => {
  return handleCheckSubdomain(request, { subdomain: url.searchParams.get('subdomain') || '' });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  return handleCheckSubdomain(request, body);
};

