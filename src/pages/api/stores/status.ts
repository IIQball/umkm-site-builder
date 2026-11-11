import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { StoreStatusInput } from '@/lib/stores/schemas';
import { getAuthenticatedUser, canManageStore } from '@/lib/auth';
import { ZodError } from 'zod';
import { handleApiRoute, jsonSuccess, jsonError, parseJsonBody } from '@/lib/utils/api-handler';

export const POST: APIRoute = async (context) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    try {
      const body = await parseJsonBody<{ storeId?: string }>(context.request);
      const data = StoreStatusInput.parse(body);

      const storeId = context.url.searchParams.get('storeId') || body.storeId;
      const [store] = storeId
        ? await db.select().from(stores).where(eq(stores.id, storeId)).limit(1)
        : await db.select().from(stores).where(eq(stores.userId, user.id)).limit(1);

      if (!store) {
        return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
      }

      if (!canManageStore(user, store)) {
        return jsonError('Anda tidak memiliki izin mengelola toko ini', 403, undefined, 'FORBIDDEN');
      }

      const customization = (store.customization as Record<string, unknown>) || {};
      customization.isOpen = data.isOpen;

      await db
        .update(stores)
        .set({
          customization,
          lastEditedBy: user.id,
          updatedAt: new Date(),
        })
        .where(eq(stores.id, store.id));

      return jsonSuccess({ storeId: store.id, isOpen: data.isOpen }, 200, 'Status toko berhasil diperbarui');
    } catch (error) {
      if (error instanceof ZodError) {
        return jsonError(error.errors[0]?.message || 'Validasi gagal', 400, error.errors, 'VALIDATION_ERROR');
      }
      throw error;
    }
  });
};

export const GET: APIRoute = async (context) => {
  return handleApiRoute(async () => {
    const subdomain = context.params.subdomain || context.url.searchParams.get('subdomain');

    if (!subdomain) {
      return jsonError('Subdomain wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const store = await db.query.stores.findFirst({
      where: eq(stores.subdomain, subdomain),
      with: {
        registrar: {
          columns: { name: true },
        },
      },
    });

    if (!store) {
      return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }

    const customization = (store.customization as Record<string, unknown>) || {};
    const isOpen = customization.isOpen !== false;
    const managedByAdmin =
      store.registeredBy && store.registrar?.name ? { name: store.registrar.name } : null;

    return jsonSuccess(
      {
        storeId: store.id,
        name: store.name,
        subdomain: store.subdomain,
        isOpen,
        managedByAdmin,
      },
      200
    );
  });
};
