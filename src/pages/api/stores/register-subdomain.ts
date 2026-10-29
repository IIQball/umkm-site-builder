import type { APIRoute } from 'astro';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { RegisterSubdomainInput } from '@/lib/stores/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import { hasExistingStore, isSubdomainTaken } from '@/services/stores';
import { ZodError } from 'zod';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { resolveStoreCoordinates } from '@/lib/stores/coordinates';
import { logActivity } from '@/services/audit.service';
import { DEFAULT_TEMPLATE_ID } from '@/schemas';

export const POST: APIRoute = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return jsonError('Unauthorized', 401, undefined, 'UNAUTHORIZED');
  }

  if (user.status !== 'active') {
    return jsonError('Akun Anda ditangguhkan', 403, undefined, 'FORBIDDEN');
  }

  const isAdminOrSuper = user.role === 'admin' || user.role === 'superadmin';
  if (user.role !== 'tenant' && !isAdminOrSuper) {
    return jsonError('Akses ditolak. Hanya tenant atau admin yang dapat mendaftarkan subdomain', 403, undefined, 'FORBIDDEN');
  }

  try {
    const body = await request.json();
    const { subdomain, googleMapsUrl, tenantId } = RegisterSubdomainInput.parse(body);

    const targetUserId = (isAdminOrSuper && tenantId) ? tenantId : user.id;
    const registeredBy = isAdminOrSuper ? user.id : null;
    const lastEditedBy = user.id;

    if (await hasExistingStore(targetUserId)) {
      return jsonError('Pengguna ini sudah memiliki toko aktif', 409, undefined, 'INVALID_STATE');
    }

    if (await isSubdomainTaken(subdomain)) {
      return jsonError('Subdomain sudah digunakan', 409, undefined, 'DUPLICATE_KEY');
    }

    const storeId = crypto.randomUUID();
    const coords = await resolveStoreCoordinates({ googleMapsUrl });

    await db.insert(stores).values({
      id: storeId,
      name: subdomain,
      subdomain,
      userId: targetUserId,
      templateId: DEFAULT_TEMPLATE_ID,
      waNumber: '',
      googleMapsUrl,
      latitude: coords.lat,
      longitude: coords.lng,
      status: 'active',
      registeredBy,
      lastEditedBy,
    });

    await logActivity({
      userId: user.id,
      storeId,
      action: 'Register Subdomain',
      details: {
        subdomain,
        tenantId: targetUserId,
        registeredBy: registeredBy || null,
        assistedByAdmin: !!isAdminOrSuper,
      },
    });

    return jsonSuccess({ storeId, subdomain }, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      return jsonError(err.errors[0]?.message || 'Validation failed', 400, err.errors);
    }

    console.error('[STORE] register-subdomain failed:', err);
    return jsonError('Internal server error', 500, undefined, 'INTERNAL');
  }
};
