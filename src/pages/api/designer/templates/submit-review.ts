import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { handleApiRoute, validate, AppError } from '@/lib/utils';
import { submitTemplateForReview } from '@/services/templates';
import { db, notifications, users } from '@/db';
import { eq } from 'drizzle-orm';
import { SubmitReviewSchema } from '@/schemas';
import { InMemoryRateLimiter } from '@/lib/utils/rate-limiter';

// Rate Limiter: Maksimal 10 pengajuan template / revisi per desainer dalam 1 jam
export const templateSubmitLimiter = new InMemoryRateLimiter(10, 60 * 60 * 1000);

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required to submit review', 401);
    }

    // Rate limiting per designer
    const rateLimitKey = `submit-review:${user.id}`;
    if (!templateSubmitLimiter.check(rateLimitKey)) {
      throw new AppError(
        'Batas pengajuan kurasi tercapai (maksimal 10 kali per jam). Silakan coba lagi beberapa saat lagi.',
        429,
        undefined,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    const body = await context.request.json().catch(() => ({}));
    const { templateId, revisionNotes } = validate(SubmitReviewSchema, body);

    const updated = await submitTemplateForReview(templateId, user.id, user.role, undefined, revisionNotes);

    // Create notification for superadmins
    const superAdmins = await db.query.users.findMany({
      where: eq(users.role, 'superadmin'),
    });

    if (superAdmins.length > 0) {
      const isRevision = Boolean(revisionNotes || (updated.revisionCount && updated.revisionCount > 0));
      const notifTitle = isRevision ? 'Revisi Template Membutuhkan Review' : 'Template Baru Membutuhkan Review';
      const notifMsg = isRevision
        ? `Desainer ${user.name} telah mengirimkan revisi ke-${updated.revisionCount || 1} untuk template "${updated.name || 'Template'}".`
        : `Desainer ${user.name} telah mengirimkan template "${updated.name || 'Baru'}" untuk dikurasi.`;

      await db.insert(notifications).values(
        superAdmins.map((admin) => ({
          id: `notif_${crypto.randomUUID()}`,
          userId: admin.id,
          type: 'template_submitted',
          title: notifTitle,
          message: notifMsg,
          metadata: { templateId, designerId: user.id, isRevision, revisionCount: updated.revisionCount }
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
