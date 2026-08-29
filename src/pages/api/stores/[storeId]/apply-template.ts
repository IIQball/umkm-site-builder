import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { stores, templates, userTemplates } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { validate } from '@/lib/utils/validation';
import { migrateTemplateConfig } from '@/lib/templates';
import { z } from 'zod';

const ApplyTemplateSchema = z.object({
  templateId: z.string().min(1, 'templateId wajib diisi'),
});

export const POST: APIRoute = async ({ params, request }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401);
    }

    if (user.role !== 'tenant') {
      return jsonError('Hanya tenant yang dapat menerapkan template', 403);
    }

    const storeId = params.storeId;
    if (!storeId) {
      return jsonError('storeId wajib diisi', 400);
    }

    const body = await request.json();
    const { templateId } = validate(ApplyTemplateSchema, body);

    const [store] = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, storeId), isNull(stores.deletedAt)));

    if (!store) {
      return jsonError('Toko tidak ditemukan', 404);
    }

    if (store.userId !== user.id) {
      return jsonError('Anda tidak memiliki akses ke toko ini', 403);
    }

    const [template] = await db
      .select()
      .from(templates)
      .where(
        and(
          eq(templates.id, templateId),
          eq(templates.status, 'approved'),
          isNull(templates.deletedAt)
        )
      );

    if (!template) {
      return jsonError('Template tidak ditemukan atau belum disetujui', 404);
    }

    const [owned] = await db
      .select()
      .from(userTemplates)
      .where(
        and(
          eq(userTemplates.userId, user.id),
          eq(userTemplates.templateId, templateId)
        )
      );

    if (template.price > 0 && !owned) {
      return jsonError('Anda belum memiliki template ini. Silakan beli terlebih dahulu.', 403);
    }

    await db
      .update(stores)
      .set({
        templateId,
        customization: migrateTemplateConfig(template.config),
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId));

    return jsonSuccess(
      {
        storeId,
        templateId,
        templateName: template.name,
      },
      'Template berhasil diterapkan ke toko'
    );
  });
};
