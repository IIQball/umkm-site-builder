import { db } from '@/lib/db/client';
import { templates, designers, users, notifications } from '@/db/schema';
import { eq, ne, isNull, desc, and } from 'drizzle-orm';
import { AppError } from '@/lib/utils';

export async function getTemplatesForAdmin(statusFilter?: string | null) {
  // Hanya data yang statusnya pending, approved, dan rejected yang masuk kurasi admin.
  // Draft hanya milik desainer dan tidak boleh tampil di antrean kurasi admin.
  let conditions = and(
    isNull(templates.deletedAt),
    ne(templates.status, 'draft')
  )!;

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
      revisionCount: templates.revisionCount,
      revisionNotes: templates.revisionNotes,
      createdAt: templates.createdAt,
      updatedAt: templates.updatedAt,
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

  const notificationMessage = action === 'approve' 
    ? `Template "${existingTemplate.name}" telah disetujui dan sekarang tersedia di katalog publik.` 
    : `Template "${existingTemplate.name}" ditolak. Alasan: ${rejectionReason || 'Tidak memenuhi standar'}`;

  await db.insert(notifications).values({
    id: `notif_${crypto.randomUUID()}`,
    userId: existingTemplate.designerId,
    type: 'template_reviewed',
    title: `Review Template: ${action === 'approve' ? 'Disetujui' : 'Ditolak'}`,
    message: notificationMessage,
    metadata: { templateId: existingTemplate.id, action }
  });

  return updatedData;
}