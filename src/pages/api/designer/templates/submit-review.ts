import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { handleApiRoute, validate, AppError } from '@/lib/utils';
import { submitTemplateForReview } from '@/services/templates';
import { db, notifications, users } from '@/db';
import { eq } from 'drizzle-orm';
import { SubmitReviewSchema } from '@/schemas';

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required to submit review', 401);
    }

    const body = await context.request.json().catch(() => ({}));
    const { templateId } = validate(SubmitReviewSchema, body);

    const updated = await submitTemplateForReview(templateId, user.id, user.role);

    // Create notification for superadmins
    const superAdmins = await db.query.users.findMany({
      where: eq(users.role, 'superadmin')
    });
    
    if (superAdmins.length > 0) {
      await db.insert(notifications).values(
        superAdmins.map((admin) => ({
          id: `notif_${crypto.randomUUID()}`,
          userId: admin.id,
          type: 'template_submitted',
          title: 'Template Baru Membutuhkan Review',
          message: `Desainer ${user.name} telah mengirimkan template "${updated.name || 'Baru'}" untuk dikurasi.`,
          metadata: { templateId, designerId: user.id }
        }) as typeof notifications.$inferInsert)
      );
    }

    return Response.json({
      success: true,
      ok: true,
      data: updated,
      status: 'pending',
      redirectUrl: `/builder/preview/${templateId}`,
    });
  });
};
