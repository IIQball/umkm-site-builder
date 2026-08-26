import { db } from '@/lib/db/client';
import { templates, designers, users } from '@/db/schema';
import { eq, isNull, desc, and } from 'drizzle-orm';
import { AppError, validate } from '@/lib/utils';
import {
  TemplateConfigSchema,
  DEFAULT_TEMPLATE_SECTIONS,
  DEFAULT_TEMPLATE_THEME,
  type TemplateConfig,
} from '@/schemas';
import type { PublicTemplateItem } from '@/types';

export {
  getTemplatesForAdmin,
  submitTemplateForReview,
  reviewTemplate,
  batchDeleteTemplateDrafts,
  batchDeleteTemplates,
  deleteTemplateDraft,
} from './template.admin.service';

export type { PublicTemplateItem };

interface DraftInputData {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  config?: TemplateConfig;
}

interface UpdateDraftInputData {
  name?: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  config?: TemplateConfig;
}

export async function getPublicTemplates(): Promise<PublicTemplateItem[]> {
  try {
    const records = await db
      .select({
        id: templates.id,
        name: templates.name,
        description: templates.description,
        price: templates.price,
        thumbnailUrl: templates.thumbnailUrl,
        status: templates.status,
        createdAt: templates.createdAt,
        userName: users.name,
      })
      .from(templates)
      .leftJoin(designers, eq(templates.designerId, designers.userId))
      .leftJoin(users, eq(designers.userId, users.id))
      .where(
        and(
          isNull(templates.deletedAt),
          eq(templates.status, 'approved'),
        ),
      )
      .orderBy(desc(templates.createdAt));

    return records.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      price: r.price,
      thumbnailUrl: r.thumbnailUrl,
      status: r.status,
      createdAt: r.createdAt,
      designerName: r.userName || 'Desainer Komunitas',
    }));
  } catch {
    return [];
  }
}

export async function getTemplateById(id: string, userId?: string, userRole?: string) {
  const [template] = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      price: templates.price,
      config: templates.config,
      thumbnailUrl: templates.thumbnailUrl,
      status: templates.status,
      designerId: templates.designerId,
      createdAt: templates.createdAt,
      updatedAt: templates.updatedAt,
      authorName: users.name,
      authorAvatar: users.image,
    })
    .from(templates)
    .leftJoin(designers, eq(templates.designerId, designers.userId))
    .leftJoin(users, eq(designers.userId, users.id))
    .where(and(eq(templates.id, id), isNull(templates.deletedAt)));

  if (!template) {
    throw new AppError('Template not found', 404);
  }

  if (userId && userRole !== 'admin' && userRole !== 'superadmin' && template.designerId !== userId && template.status !== 'approved') {
    throw new AppError('Template unauthorized', 403);
  }

  return template;
}

export async function getTemplatesByDesigner(designerId: string) {
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
    })
    .from(templates)
    .where(and(eq(templates.designerId, designerId), isNull(templates.deletedAt)))
    .orderBy(desc(templates.updatedAt));
}

export async function createTemplateDraft(
  param1: string | DraftInputData,
  param2?: string | DraftInputData,
) {
  const designerId = (typeof param1 === 'string' ? param1 : param2) as string;
  const data = (typeof param1 === 'object' ? param1 : param2) as DraftInputData;

  const initialConfig: TemplateConfig = data.config || {
    theme: DEFAULT_TEMPLATE_THEME,
    sections: DEFAULT_TEMPLATE_SECTIONS,
  };

  const validatedConfig = validate(TemplateConfigSchema, initialConfig);
  const templateId = data.id || `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const [created] = await db
    .insert(templates)
    .values({
      id: templateId,
      designerId,
      name: data.name,
      description: data.description || null,
      price: data.price ?? 0,
      thumbnailUrl: data.thumbnailUrl || null,
      config: validatedConfig,
      status: 'draft',
      updatedAt: new Date(),
    })
    .returning();

  return created;
}

export async function updateTemplateDraft(
  templateId: string,
  param2: string | UpdateDraftInputData,
  param3?: string | UpdateDraftInputData,
  userRole?: string,
) {
  const designerId = (typeof param2 === 'string' ? param2 : param3) as string;
  const data = (typeof param2 === 'object' ? param2 : param3) as UpdateDraftInputData;

  const whereClause = userRole === 'admin' || userRole === 'superadmin'
    ? eq(templates.id, templateId)
    : and(eq(templates.id, templateId), eq(templates.designerId, designerId));

  const [existing] = await db
    .select()
    .from(templates)
    .where(whereClause);

  if (!existing) {
    throw new AppError('Template not found or unauthorized', 404);
  }

  const updateData: Partial<typeof templates.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
  if (data.config !== undefined) {
    updateData.config = validate(TemplateConfigSchema, data.config);
  }

  const [updated] = await db
    .update(templates)
    .set(updateData)
    .where(eq(templates.id, templateId))
    .returning();

  return updated;
}
