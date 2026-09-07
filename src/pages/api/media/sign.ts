import type { APIRoute } from 'astro';
import { generateSignedUploadParams } from '../../../lib/cloudinary';
import { MediaSignInput } from '../../../schemas/media.schema';
import { jsonSuccess, jsonError } from '../../../lib/utils/api-handler';

/**
 * POST /api/media/sign
 *
 * Generate Cloudinary signed upload params for client-side direct upload.
 * Auth: required (admin, designer, tenant).
 * No DB write — returns signature params only.
 */
export const POST: APIRoute = async ({ locals, request }) => {
  try {
    // 1. Authenticate
    if (!locals.user) {
      return jsonError('Silakan login terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
    }

    // 2. Authorize — admin, designer, tenant can upload
    const allowedRoles = ['superadmin', 'admin', 'designer', 'tenant'];
    if (!locals.user.role || !allowedRoles.includes(locals.user.role)) {
      return jsonError('Role Anda tidak dapat mengupload media', 403, undefined, 'FORBIDDEN');
    }

    // 3. Parse and validate input
    const body = await request.json();
    const result = MediaSignInput.safeParse(body);

    if (!result.success) {
      return jsonError(result.error.issues[0]?.message || 'Validasi gagal', 400, undefined, 'VALIDATION_ERROR');
    }

    // 4. Generate signed params
    const params = await generateSignedUploadParams(result.data.folder);

    return jsonSuccess(params, 200);
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('[MEDIA] sign error:', error instanceof Error ? error.message : error);
    return jsonError('Gagal membuat signature upload', 500, undefined);
  }
};
