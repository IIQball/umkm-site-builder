import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { stores } from '@db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { CheckSubdomainInput } from '@lib/stores/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import { ZodError } from 'zod';
import { handleApiRoute, jsonSuccess, jsonError } from '@/lib/utils/api-handler';

async function handleCheckSubdomain(request: Request, rawInput: unknown) {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
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
        return jsonError(err.errors[0]?.message || 'Validasi gagal', 400, err.errors, 'VALIDATION_ERROR');
      }
      throw err;
    }
  });
}

export const GET: APIRoute = async ({ request, url }) => {
  return handleCheckSubdomain(request, { subdomain: url.searchParams.get('subdomain') || '' });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  return handleCheckSubdomain(request, body);
};
