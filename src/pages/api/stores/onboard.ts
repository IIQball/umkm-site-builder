import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { stores } from '@db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { OnboardStoreInput } from '@lib/stores/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import { ZodError } from 'zod';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';



async function hasExistingStore(userId: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(and(eq(stores.userId, userId), isNull(stores.deletedAt)))
    .limit(1);
  return !!existing;
}

async function isSubdomainTaken(subdomain: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(and(eq(stores.subdomain, subdomain), isNull(stores.deletedAt)))
    .limit(1);
  return !!existing;
}

export const POST: APIRoute = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return jsonError('Unauthorized', 401, undefined, 'UNAUTHORIZED');
  }

  if (user.status !== 'active') {
    return jsonError('Akun Anda ditangguhkan', 403, undefined, 'FORBIDDEN');
  }

  if (user.role !== 'tenant') {
    return jsonError('Hanya tenant yang dapat membuat profil toko', 403, undefined, 'FORBIDDEN');
  }

  try {
    const body = await request.json();
    const parsedData = OnboardStoreInput.parse(body);
    const { subdomain, name, waNumber, googleMapsUrl } = parsedData;

    if (await hasExistingStore(user.id)) {
      return jsonError('Anda sudah memiliki toko aktif', 409, undefined, 'INVALID_STATE');
    }

    if (await isSubdomainTaken(subdomain)) {
      return jsonError('Subdomain sudah digunakan', 409, undefined, 'DUPLICATE_KEY');
    }

    const storeId = crypto.randomUUID();

    await db.insert(stores).values({
      id: storeId,
      name,
      subdomain,
      userId: user.id,
      templateId: 'system-default-template',
      waNumber,
      googleMapsUrl,
      status: 'active',
      customization: { isOnboarded: true },
    });

    return jsonSuccess({ storeId, subdomain, name }, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      return jsonError(err.errors[0]?.message || 'Validation failed', 400, err.errors);
    }

    console.error('[STORE] onboard failed:', err);
    return jsonError('Internal server error', 500, undefined, 'INTERNAL');
  }
};