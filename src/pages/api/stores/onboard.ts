import type { APIRoute } from 'astro';
import { db } from '@/db';
import { stores, templates } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { OnboardStoreInput } from '@/lib/stores/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import { getMaxStoreBranches } from '@/services/finance';
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
    return jsonError('Akses ditolak. Hanya tenant atau admin yang dapat membuat profil toko', 403, undefined, 'FORBIDDEN');
  }

  try {
    const body = await request.json();
    const parsedData = OnboardStoreInput.parse(body);
    const { subdomain, name, categoryId, waNumber, googleMapsUrl, address, regionData, templateId, tenantId } = parsedData;

    const maxBranches = await getMaxStoreBranches();
    const mapsCustomization = (parsedData.customization as Record<string, unknown> | undefined)?.maps as { branches?: unknown[] } | undefined;
    if (Array.isArray(mapsCustomization?.branches) && mapsCustomization.branches.length > maxBranches) {
      return jsonError(`Jumlah cabang toko melebihi batas maksimal (${maxBranches} cabang)`, 400, undefined, 'MAX_BRANCHES_EXCEEDED');
    }

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
    if (selectedTemplateId) {
      const validTpl = await db.query.templates.findFirst({
        where: and(eq(templates.id, selectedTemplateId), isNull(templates.deletedAt)),
        columns: { id: true },
      });
      if (!validTpl) {
        selectedTemplateId = DEFAULT_TEMPLATE_ID;
      }
    } else {
      selectedTemplateId = DEFAULT_TEMPLATE_ID;
    }

    const storeId = crypto.randomUUID();

    const coords = await resolveStoreCoordinates({
      googleMapsUrl,
      address,
      district: typeof regionData?.district === 'string' ? regionData.district : undefined,
    });

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
      latitude: coords.lat,
      longitude: coords.lng,
      status: 'active',
      customization: {
        isOnboarded: true,
        ...(regionData ? { region: regionData } : {}),
        ...(parsedData.customization && typeof parsedData.customization === 'object'
          ? parsedData.customization
          : {}),
      },
      registeredBy,
      lastEditedBy,
    });

    await logActivity({
      userId: user.id,
      storeId,
      action: 'Create Store',
      details: {
        name,
        subdomain,
        categoryId,
        tenantId: targetUserId,
        registeredBy: registeredBy || null,
        assistedByAdmin: !!isAdminOrSuper,
      },
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