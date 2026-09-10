import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { stores, templates } from '@db/schema';
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

  const isAdminOrSuper = user.role === 'admin' || user.role === 'superadmin';
  if (user.role !== 'tenant' && !isAdminOrSuper) {
    return jsonError('Akses ditolak. Hanya tenant atau admin yang dapat membuat profil toko', 403, undefined, 'FORBIDDEN');
  }

  try {
    const body = await request.json();
    const parsedData = OnboardStoreInput.parse(body);
    const { subdomain, name, categoryId, waNumber, googleMapsUrl, address, regionData, templateId, tenantId } = parsedData;

    const targetUserId = (isAdminOrSuper && tenantId) ? tenantId : user.id;
    const registeredBy = isAdminOrSuper ? user.id : null;
    const lastEditedBy = user.id;

    if (await hasExistingStore(targetUserId)) {
      return jsonError('Pengguna ini sudah memiliki toko aktif', 409, undefined, 'INVALID_STATE');
    }

    if (await isSubdomainTaken(subdomain)) {
      return jsonError('Subdomain sudah digunakan', 409, undefined, 'DUPLICATE_KEY');
    }

    let selectedTemplateId = templateId;
    if (!selectedTemplateId) {
      const [firstTpl] = await db
        .select({ id: templates.id })
        .from(templates)
        .where(eq(templates.status, 'approved'))
        .limit(1);
      selectedTemplateId = firstTpl?.id || 'tpl_1789012356261_smzf9nzf0';
    }

    const storeId = crypto.randomUUID();

    await db.insert(stores).values({
      id: storeId,
      name,
      subdomain,
      userId: targetUserId,
      templateId: selectedTemplateId,
      categoryId,
      address,
      waNumber,
      googleMapsUrl,
      status: 'active',
      customization: {
        isOnboarded: true,
        ...(regionData ? { region: regionData } : {}),
      },
      registeredBy,
      lastEditedBy,
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