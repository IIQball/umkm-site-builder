import type { APIRoute } from 'astro';
import { generateSignedUploadParams } from '../../../lib/cloudinary';
import { MediaSignInput } from '../../../schemas/media.schema';
import { okResponse, errorResponse } from '../../../types';

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
      return new Response(
        JSON.stringify(errorResponse('UNAUTHORIZED', 'Silakan login terlebih dahulu')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Authorize — admin, designer, tenant can upload
    const allowedRoles = ['superadmin', 'admin', 'designer', 'tenant'];
    if (!locals.user.role || !allowedRoles.includes(locals.user.role)) {
      return new Response(
        JSON.stringify(errorResponse('FORBIDDEN', 'Role Anda tidak dapat mengupload media')),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse and validate input
    const body = await request.json();
    const result = MediaSignInput.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify(errorResponse('VALIDATION_ERROR', result.error.issues[0]?.message || 'Validasi gagal')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Generate signed params
    const params = await generateSignedUploadParams(result.data.folder);

    return new Response(
      JSON.stringify(okResponse(params)),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('[MEDIA] sign error:', error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify(errorResponse('INTERNAL', 'Gagal membuat signature upload')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
