import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { validate } from '@/lib/utils/validation';
import { validateTemplateOwnership, applyTemplateToStore } from '@/services/store-template.service';
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

    if (user.role !== 'tenant' && user.role !== 'admin' && user.role !== 'superadmin') {
      return jsonError('Hanya tenant atau admin pendamping yang dapat menerapkan template', 403);
    }

    const storeId = params.storeId;
    if (!storeId) {
      return jsonError('storeId wajib diisi', 400);
    }

    const body = await request.json();
    const { templateId } = validate(ApplyTemplateSchema, body);

    const result = await validateTemplateOwnership(storeId, templateId, user.id);

    if (!result.owned) {
      return jsonError(
        'Anda belum memiliki template ini. Silakan beli terlebih dahulu.',
        403
      );
    }

    // Terapkan template ke store menggunakan service layer dengan config yang termigrasi
    const migratedConfig = migrateTemplateConfig(result.template.config);
    await applyTemplateToStore(storeId, templateId, migratedConfig, user.id);

    return jsonSuccess({
      storeId,
      templateId,
      templateName: result.template.name,
    });
  });
};