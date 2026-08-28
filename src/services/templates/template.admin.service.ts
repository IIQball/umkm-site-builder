import { db } from '@/lib/db/client';
import { templates, designers, users } from '@/db/schema';
import { eq, isNull, desc, and } from 'drizzle-orm';
import { AppError } from '@/lib/utils';

export async function getTemplatesForAdmin(statusFilter?: string | null) {
  let conditions = isNull(templates.deletedAt);
  if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
    conditions = and(conditions, eq(templates.status, statusFilter as 'pending' | 'approved' | 'rejected'))!;
  }

  const records = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      thumbnailUrl: templates.thumbnailUrl,
      price: templates.price,
      status: templates.status,
      rejectionReason: templates.rejectionReason,
      createdAt: templates.createdAt,
      designerId: templates.designerId,
      designerName: users.name,
      designerEmail: users.email,
    })
    .from(templates)
    .leftJoin(designers, eq(templates.designerId, designers.userId))
    .leftJoin(users, eq(designers.userId, users.id))
    .where(conditions)
    .orderBy(desc(templates.createdAt));

  return records;
}

export async function reviewTemplate(
  templateId: string,
  action: 'approve' | 'reject',
  rejectionReason: string | null | undefined,
  adminUserId: string
) {
  const existingTemplate = await db.query.templates.findFirst({
    where: (t) => and(eq(t.id, templateId), isNull(t.deletedAt)),
  });

  if (!existingTemplate) {
    throw new AppError('Template not found', 404, undefined, 'NOT_FOUND');
  }

  if (existingTemplate.status !== 'pending') {
    throw new AppError('Only pending templates can be reviewed', 400);
  }

  const updatePayload =
    action === 'approve'
      ? {
          status: 'approved' as const,
          approvedBy: adminUserId,
          rejectionReason: null,
          updatedAt: new Date(),
        }
      : {
          status: 'rejected' as const,
          rejectionReason: rejectionReason || null,
          updatedAt: new Date(),
        };

  const [updatedData] = await db
    .update(templates)
    .set(updatePayload)
    .where(eq(templates.id, templateId))
    .returning();

  return updatedData;
}
