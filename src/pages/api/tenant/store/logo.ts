import type { APIRoute } from 'astro';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { getAuthenticatedUser, canManageStore } from '@/lib/auth';
import { logActivity } from '@/services/audit.service';
import { handleApiRoute, jsonSuccess, jsonError, parseJsonBody } from '@/lib/utils/api-handler';
import { z, ZodError } from 'zod';

const SetLogoSchema = z.object({
  logoUrl: z.string().url('URL logo tidak valid'),
  storeId: z.string().optional(),
});

export const POST: APIRoute = async (context) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    try {
      const body = await parseJsonBody<{ logoUrl: string; storeId?: string }>(context.request);
      const data = SetLogoSchema.parse(body);

      const targetStoreId = context.url.searchParams.get('storeId') || data.storeId;
      const [existingStore] = targetStoreId
        ? await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, targetStoreId), isNull(stores.deletedAt)))
            .limit(1)
        : await db
            .select()
            .from(stores)
            .where(and(eq(stores.userId, user.id), isNull(stores.deletedAt)))
            .limit(1);

      if (!existingStore) {
        return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
      }

      if (!canManageStore(user, existingStore)) {
        return jsonError('Anda tidak memiliki izin mengelola toko ini', 403, undefined, 'FORBIDDEN');
      }

      const currentCustomization = (existingStore.customization as Record<string, unknown>) || {};
      const currentHeader = (currentCustomization.header as Record<string, unknown>) || {};
      const updatedHeader = {
        ...currentHeader,
        logoType: 'image',
        logoImageUrl: data.logoUrl,
      };

      let updatedSections = currentCustomization.sections;
      if (Array.isArray(updatedSections)) {
        updatedSections = updatedSections.map((sec) => {
          if (!sec || typeof sec !== 'object') return sec;
          const s = sec as Record<string, unknown>;
          if (s.type === 'header_announcement') {
            return {
              ...s,
              props: {
                ...((s.props as Record<string, unknown>) || {}),
                logoType: 'image',
                logoImageUrl: data.logoUrl,
              },
            };
          }
          if (s.type === 'footer') {
            return {
              ...s,
              props: {
                ...((s.props as Record<string, unknown>) || {}),
                logoImageUrl: data.logoUrl,
              },
            };
          }
          return s;
        });
      }

      const updatedCustomization: Record<string, unknown> = {
        ...currentCustomization,
        logoUrl: data.logoUrl,
        header: updatedHeader,
        ...(Array.isArray(updatedSections) ? { sections: updatedSections } : {}),
      };

      await db
        .update(stores)
        .set({
          customization: updatedCustomization,
          lastEditedBy: user.id,
          updatedAt: new Date(),
        })
        .where(eq(stores.id, existingStore.id));

      await logActivity({
        userId: user.id,
        storeId: existingStore.id,
        action: 'Update Store Settings',
        details: {
          actionType: 'set_store_logo',
          logoUrl: data.logoUrl,
        },
      });

      return jsonSuccess({ logoUrl: data.logoUrl }, 200, 'Logo toko berhasil diperbarui');
    } catch (error) {
      if (error instanceof ZodError) {
        return jsonError(error.errors[0]?.message || 'Data tidak valid', 400, error.errors, 'VALIDATION_ERROR');
      }
      throw error;
    }
  });
};
