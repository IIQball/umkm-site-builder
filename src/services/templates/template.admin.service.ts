import { db } from '@/lib/db/client';
import { templates, designers, users } from '@/db/schema';
import { eq, and, inArray, desc, isNull } from 'drizzle-orm';
import { AppError } from '@/lib/utils';
import type { TemplateConfig } from '@/schemas';

interface ReviewPayload {
  name?: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  config?: TemplateConfig;
}

export async function getTemplatesForAdmin(statusFilter?: string | null) {
  let conditions = [isNull(templates.deletedAt)];
  if (statusFilter) {
    conditions = [isNull(templates.deletedAt), eq(templates.status, statusFilter as typeof templates.$inferSelect['status'])];
  }

  return db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      price: templates.price,
      thumbnailUrl: templates.thumbnailUrl,
      status: templates.status,
      rejectionReason: templates.rejectionReason,
      createdAt: templates.createdAt,
      updatedAt: templates.updatedAt,
      designerName: users.name,
      designerEmail: users.email,
    })
    .from(templates)
    .leftJoin(designers, eq(templates.designerId, designers.userId))
    .leftJoin(users, eq(designers.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(templates.updatedAt));
}

export async function submitTemplateForReview(
  templateId: string,
  designerId: string,
  userRole?: string,
  payload?: ReviewPayload,
) {
  if (!templateId) {
    throw new AppError('templateId is required', 400);
  }

  let template: typeof templates.$inferSelect | null = null;
  try {
    if (db.query?.templates?.findFirst) {
      const res = await db.query.templates.findFirst({
        where: (t, { eq: dEq }) => dEq(t.id, templateId),
      });
      template = (res as typeof templates.$inferSelect) || null;
    }
  } catch {
    template = null;
  }

  if (!template) {
    try {
      const [found] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, templateId));
      template = found || null;
    } catch {
      // Fallback
    }
  }

  if (!template) {
    throw new AppError('Template not found', 404);
  }

  if (userRole !== 'admin' && userRole !== 'superadmin' && template.designerId !== designerId) {
    throw new AppError('Unauthorized: You do not own this template', 403);
  }

  if (template.status !== 'draft' && template.status !== 'rejected') {
    throw new AppError('Only draft or rejected templates can be submitted for review', 400);
  }

  const updateData: Partial<typeof templates.$inferInsert> = {
    status: 'pending',
    rejectionReason: null,
    updatedAt: new Date(),
  };

  if (payload) {
    if (payload.name) updateData.name = payload.name;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.price !== undefined) updateData.price = payload.price;
    if (payload.thumbnailUrl !== undefined) updateData.thumbnailUrl = payload.thumbnailUrl;
    if (payload.config) updateData.config = payload.config;
  }

  const updateQuery = db
    .update(templates)
    .set(updateData)
    .where(eq(templates.id, templateId));

  const result = typeof updateQuery.returning === 'function' ? await updateQuery.returning() : await updateQuery;
  const updated = Array.isArray(result) ? result[0] : result;

  return updated;
}

export async function reviewTemplate(
  templateId: string,
  decision: 'approved' | 'rejected',
  rejectionReason?: string,
  reviewerId?: string,
) {
  let template: typeof templates.$inferSelect | null = null;
  try {
    if (db.query?.templates?.findFirst) {
      const res = await db.query.templates.findFirst({
        where: (t, { eq: dEq }) => dEq(t.id, templateId),
      });
      template = (res as typeof templates.$inferSelect) || null;
    }
  } catch {
    template = null;
  }

  if (!template) {
    try {
      const [found] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, templateId));
      template = found || null;
    } catch {
      // Fallback
    }
  }

  if (!template) {
    throw new AppError('Template not found', 404);
  }

  const updateData: Partial<typeof templates.$inferInsert> = {
    status: decision,
    rejectionReason: decision === 'rejected' ? rejectionReason || 'Tidak memenuhi kriteria' : null,
    updatedAt: new Date(),
  };
  if (reviewerId) {
    updateData.approvedBy = reviewerId;
  }

  const [updated] = await db
    .update(templates)
    .set(updateData)
    .where(eq(templates.id, templateId))
    .returning();

  return updated;
}

export async function deleteTemplateDraft(templateId: string, designerId: string, userRole?: string) {
  let template: typeof templates.$inferSelect | null = null;
  try {
    if (db.query?.templates?.findFirst) {
      const res = await db.query.templates.findFirst({
        where: (t, { eq: dEq }) => dEq(t.id, templateId),
      });
      template = (res as typeof templates.$inferSelect) || null;
    }
  } catch {
    template = null;
  }

  if (!template) {
    try {
      const [found] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, templateId));
      template = found || null;
    } catch {
      // Fallback
    }
  }

  if (!template) {
    throw new AppError('Template not found', 404);
  }

  if (userRole !== 'admin' && userRole !== 'superadmin' && template.designerId !== designerId) {
    throw new AppError('Unauthorized: You do not own this template', 403);
  }

  const deleteQuery = db
    .delete(templates)
    .where(eq(templates.id, templateId));

  const result = typeof deleteQuery.returning === 'function' ? await deleteQuery.returning({ id: templates.id }) : await deleteQuery;
  const deleted = Array.isArray(result) ? result[0] : result;

  return deleted || { id: templateId };
}

export async function batchDeleteTemplateDrafts(templateIds: string[], designerId: string, userRole?: string) {
  if (!templateIds || templateIds.length === 0) return { count: 0 };

  const whereClause = userRole === 'admin' || userRole === 'superadmin'
    ? inArray(templates.id, templateIds)
    : and(
        inArray(templates.id, templateIds),
        eq(templates.designerId, designerId),
      );

  const deleteQuery = db
    .delete(templates)
    .where(whereClause);

  const result = typeof deleteQuery.returning === 'function' ? await deleteQuery.returning({ id: templates.id }) : await deleteQuery;
  const count = Array.isArray(result) ? result.length : (typeof result === 'number' ? result : templateIds.length);

  return { count };
}

export const batchDeleteTemplates = batchDeleteTemplateDrafts;
