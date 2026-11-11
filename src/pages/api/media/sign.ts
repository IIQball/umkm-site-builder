import type { APIRoute } from 'astro';
import { generateSignedUploadParams } from '@/lib/cloudinary';
import { MediaSignInput } from '@/schemas/media.schema';
import { jsonSuccess, jsonError, handleApiRoute, parseJsonBody } from '@/lib/utils/api-handler';

/**
 * POST /api/media/sign
 *
 * Generate Cloudinary signed upload params for client-side direct upload.
 * Auth: required (admin, designer, tenant).
 * No DB write — returns signature params only.
 */
export const POST: APIRoute = async ({ locals, request }) => {
  return handleApiRoute(async () => {
    if (!locals.user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    const allowedRoles = ['superadmin', 'admin', 'designer', 'tenant'];
    if (!locals.user.role || !allowedRoles.includes(locals.user.role)) {
      return jsonError('Role Anda tidak dapat mengupload media', 403, undefined, 'FORBIDDEN');
    }

    const body = await parseJsonBody(request);
    const result = MediaSignInput.safeParse(body);

    if (!result.success) {
      return jsonError(
        result.error.issues[0]?.message || 'Validasi gagal',
        400,
        result.error.flatten().fieldErrors,
        'VALIDATION_ERROR'
      );
    }

    const params = await generateSignedUploadParams(result.data.folder, result.data.resourceType);

    return jsonSuccess(params, 200, 'Signature upload berhasil dibuat');
  });
};
