import type { APIRoute } from 'astro';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import { deleteFromCloudinary, isOwnedMedia } from '@/lib/cloudinary';
import { z } from 'zod';

const deleteMediaSchema = z.object({
  url: z.string().url().optional(),
  publicId: z.string().optional(),
});

export const POST: APIRoute = async (context) => {
  return handleApiRoute(async () => {
    const user = context.locals.user;
    if (!user) throw new AppError('Silakan login terlebih dahulu', 401);
    const body = await context.request.json().catch(() => ({}));
    const validated = validate(deleteMediaSchema, body);

    let targetPublicId = validated.publicId;

    if (!targetPublicId && validated.url) {
      const match = validated.url.match(/\/v\d+\/(.+)\.[a-zA-Z0-9]+$/);
      if (match && match[1]) {
        targetPublicId = match[1];
      }
    }

    if (!targetPublicId) {
      throw new AppError('Public ID atau URL Cloudinary valid diperlukan', 400);
    }

    if (!isOwnedMedia(targetPublicId, user.id)) {
      throw new AppError('Media bukan milik Anda', 403);
    }

    const resourceType = validated.url && new URL(validated.url).pathname.includes('/video/upload/') ? 'video' : 'image';
    await deleteFromCloudinary(targetPublicId, resourceType);

    return jsonSuccess({ deleted: true, publicId: targetPublicId });
  });
};
