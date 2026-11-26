import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { getAuthenticatedUser, canManageStore } from '@/lib/auth';
import { logActivity } from '@/services/audit.service';
import { handleApiRoute, jsonError, jsonSuccess, parseJsonBody } from '@/lib/utils/api-handler';

const whatsAppTemplateSchema = z.object({
  storeId: z.string().trim().min(1).optional(),
  template: z.string().max(4000, 'Template pesan maksimal 4000 karakter').optional(),
});

export const PUT: APIRoute = async ({ request, url }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const rawBody = await parseJsonBody(request);
    const parsed = whatsAppTemplateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || 'Input template tidak valid',
        400,
        parsed.error.issues,
        'VALIDATION_ERROR'
      );
    }

    const id = url.searchParams.get('storeId') || parsed.data.storeId;

    const [store] = id
      ? await db.select().from(stores).where(and(eq(stores.id, id), isNull(stores.deletedAt))).limit(1)
      : await db.select().from(stores).where(and(eq(stores.userId, user.id), isNull(stores.deletedAt))).limit(1);

    if (!store) {
      return jsonError('Toko tidak ditemukan', 404, undefined, 'NOT_FOUND');
    }
    if (!canManageStore(user, store)) {
      return jsonError('Anda tidak memiliki izin mengelola toko ini', 403, undefined, 'FORBIDDEN');
    }

    const customization = (store.customization as Record<string, unknown>) || {};
    customization.waCheckoutTemplate = parsed.data.template;

    await db
      .update(stores)
      .set({ customization, updatedAt: new Date(), lastEditedBy: user.id })
      .where(eq(stores.id, store.id));

    await logActivity({
      userId: user.id,
      storeId: store.id,
      action: 'Update WhatsApp Template',
      details: { storeId: store.id },
    });

    return jsonSuccess({ updated: true }, 200, 'Template WhatsApp berhasil diperbarui');
  });
};
