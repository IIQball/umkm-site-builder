import type { APIRoute } from 'astro';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { StoreSettingsInput } from '@/lib/stores/schemas';
import { getAuthenticatedUser, canManageStore } from '@/lib/auth';
import { getMaxStoreBranches } from '@/services/finance';
import { resolveStoreCoordinates } from '@/lib/stores/coordinates';
import { logActivity } from '@/services/audit.service';
import { handleApiRoute, jsonSuccess, jsonError, parseJsonBody } from '@/lib/utils/api-handler';
import { ZodError } from 'zod';

export const PUT: APIRoute = async (context) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    try {
      const body = await parseJsonBody<{ storeId?: string }>(context.request);
      const data = StoreSettingsInput.parse(body);

      const storeId = context.url.searchParams.get('storeId') || body.storeId;
      const [existingStore] = storeId
        ? await db.select().from(stores).where(eq(stores.id, storeId)).limit(1)
        : await db.select().from(stores).where(eq(stores.userId, user.id)).limit(1);

      if (!existingStore) {
        return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
      }

      if (!canManageStore(user, existingStore)) {
        return jsonError('Anda tidak memiliki izin mengelola toko ini', 403, undefined, 'FORBIDDEN');
      }

      const currentCustomization = (existingStore.customization as Record<string, unknown>) || {};
      const updatedCustomization: Record<string, unknown> = {
        ...currentCustomization,
      };
      if (data.customization && typeof data.customization === 'object') {
        Object.assign(updatedCustomization, data.customization);
      }
      if (data.regionData !== undefined) {
        updatedCustomization.region = data.regionData;
      }
      if (data.isOpen !== undefined) {
        updatedCustomization.isOpen = data.isOpen;
      }
      if (data.waCheckoutTemplate !== undefined) {
        updatedCustomization.waCheckoutTemplate = data.waCheckoutTemplate;
      }

      const maxBranches = await getMaxStoreBranches();
      const mapsCustomization = updatedCustomization.maps as { branches?: unknown[] } | undefined;
      if (Array.isArray(mapsCustomization?.branches) && mapsCustomization.branches.length > maxBranches) {
        return jsonError(
          `Jumlah cabang toko melebihi batas maksimal (${maxBranches} cabang)`,
          400,
          undefined,
          'VALIDATION_ERROR'
        );
      }

      let coords: { lat: number; lng: number } | undefined;
      if (data.googleMapsUrl || data.address || data.regionData?.district || existingStore.latitude === null) {
        const currentRegion = (existingStore.customization as Record<string, unknown>)?.region as
          | Record<string, unknown>
          | undefined;
        coords = await resolveStoreCoordinates({
          googleMapsUrl: data.googleMapsUrl || existingStore.googleMapsUrl,
          address: data.address ?? existingStore.address,
          district: (data.regionData?.district || currentRegion?.district) as string | undefined,
        });
      }

      await db
        .update(stores)
        .set({
          name: data.name,
          waNumber: data.waNumber,
          googleMapsUrl: data.googleMapsUrl || undefined,
          ...(coords ? { latitude: coords.lat, longitude: coords.lng } : {}),
          ...(data.address !== undefined ? { address: data.address } : {}),
          ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
          ...(data.templateId !== undefined ? { templateId: data.templateId } : {}),
          customization: updatedCustomization,
          lastEditedBy: user.id,
          updatedAt: new Date(),
        })
        .where(eq(stores.id, existingStore.id));

      if (user.id !== existingStore.userId) {
        const { notifications } = await import('@/db/schema');
        await db.insert(notifications).values({
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: existingStore.userId,
          type: 'store_managed_by_admin',
          title: 'Toko Diperbarui',
          message: 'Admin telah memperbarui pengaturan toko Anda.',
          metadata: { storeId: existingStore.id },
        });
      }

      await logActivity({
        userId: user.id,
        storeId: existingStore.id,
        action: 'Update Store Settings',
        details: {
          storeName: data.name,
          waNumber: data.waNumber,
          address: data.address,
        },
      });

      return jsonSuccess({ updated: true }, 200, 'Pengaturan toko berhasil diperbarui');
    } catch (error) {
      if (error instanceof ZodError) {
        return jsonError(error.errors[0]?.message || 'Validasi gagal', 400, error.errors, 'VALIDATION_ERROR');
      }
      throw error;
    }
  });
};