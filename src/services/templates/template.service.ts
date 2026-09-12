import { db } from '@/lib/db/client';
import { templates, designers, users } from '@/db/schema';
import { eq, isNull, desc, and, inArray } from 'drizzle-orm';
import { AppError, validate, generateSlug, slugify } from '@/lib/utils';
import {
  TemplateConfigSchema,
  DEFAULT_TEMPLATE_SECTIONS,
  DEFAULT_TEMPLATE_THEME,
  CURRENT_SCHEMA_VERSION,
  type TemplateConfig,
} from '@/schemas';
import { migrateTemplateConfig } from '@/lib/templates';
import type { PublicTemplateItem } from '@/types';

export type { PublicTemplateItem };

export { getTemplatesForAdmin, reviewTemplate } from './template.admin.service';

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
          eq(templates.status, 'approved')
        )
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

export async function getTemplateById(templateId: string, userId: string, userRole: string) {
  const template = await db.query.templates.findFirst({
    where: eq(templates.id, templateId),
  });

  if (!template) {
    throw new AppError('Template not found', 404, undefined, 'NOT_FOUND');
  }

  // Permission/Ownership check: must be owner, admin, or superadmin
  const isOwner = template.designerId === userId;
  const isPrivileged = userRole === 'admin' || userRole === 'superadmin';
  if (!isOwner && !isPrivileged && template.status !== 'approved') {
    throw new AppError('Access denied: You do not have permission', 403, undefined, 'FORBIDDEN');
  }

  return {
    ...template,
    config: migrateTemplateConfig(template.config),
  };
}

export async function createTemplateDraft(
  data: {
    name: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    price?: number;
    categoryId?: string | null;
    slug?: string;
  },
  designerId: string
) {
  const templateId = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const baseSlug = data.slug ? slugify(data.slug) : slugify(data.name);
  const existing = await db.query.templates.findFirst({
    where: eq(templates.slug, baseSlug),
  });
  const slug = existing ? generateSlug(baseSlug, true) : (baseSlug || generateSlug('template', true));

  const [newTemplate] = await db
    .insert(templates)
    .values({
      id: templateId,
      name: data.name,
      slug,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      price: data.price ?? 0,
      categoryId: data.categoryId ?? null,
      designerId,
      status: 'draft',
      config: {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        theme: DEFAULT_TEMPLATE_THEME,
        sections: DEFAULT_TEMPLATE_SECTIONS,
      },
    })
    .returning();

  return newTemplate;
}

export async function updateTemplateDraft(
  templateId: string,
  data: {
    name?: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    price?: number;
    categoryId?: string | null;
    config?: TemplateConfig;
  },
  userId: string,
  userRole: string
) {
  const template = await db.query.templates.findFirst({
    where: eq(templates.id, templateId),
  });

  if (!template) {
    throw new AppError('Template not found', 404, undefined, 'NOT_FOUND');
  }

  // Ownership check: must be owner, admin, or superadmin
  const isOwner = template.designerId === userId;
  const isPrivileged = userRole === 'admin' || userRole === 'superadmin';
  if (!isOwner && !isPrivileged) {
    throw new AppError('Access denied: You do not have permission', 403, undefined, 'FORBIDDEN');
  }

  const updateData: Partial<typeof templates.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.config !== undefined) updateData.config = migrateTemplateConfig(data.config);

  const [updated] = await db
    .update(templates)
    .set(updateData)
    .where(eq(templates.id, templateId))
    .returning();

  return updated;
}

export async function submitTemplateForReview(
  templateId: string,
  userId: string,
  userRole: string,
  patchData?: {
    name: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    price: number;
    config: TemplateConfig;
  }
) {
  const template = await db.query.templates.findFirst({
    where: eq(templates.id, templateId),
  });

  if (!template) {
    throw new AppError('Template not found', 404, undefined, 'NOT_FOUND');
  }

  const isOwner = template.designerId === userId;
  const isPrivileged = userRole === 'admin' || userRole === 'superadmin';
  if (!isOwner && !isPrivileged) {
    throw new AppError('Access denied: You do not have permission', 403, undefined, 'FORBIDDEN');
  }

  if (template.status !== 'draft' && !isPrivileged) {
    throw new AppError('Template must be in draft status to submit', 400);
  }

  const configToValidate = migrateTemplateConfig(patchData ? patchData.config : template.config);
  validate(TemplateConfigSchema, configToValidate);

  const updatePayload: Partial<typeof templates.$inferInsert> = {
    status: 'pending',
    updatedAt: new Date(),
  };

  if (patchData) {
    updatePayload.name = patchData.name;
    updatePayload.description = patchData.description;
    updatePayload.thumbnailUrl = patchData.thumbnailUrl;
    updatePayload.price = patchData.price;
    updatePayload.config = configToValidate;
  }

  const [updated] = await db
    .update(templates)
    .set(updatePayload)
    .where(eq(templates.id, templateId))
    .returning();

  return updated;
}

export async function deleteTemplateDraft(
  templateId: string,
  userId: string,
  userRole: string
) {
  const template = await db.query.templates.findFirst({
    where: eq(templates.id, templateId),
  });

  if (!template) {
    throw new AppError('Template not found', 404, undefined, 'NOT_FOUND');
  }

  const isOwner = template.designerId === userId;
  const isPrivileged = userRole === 'admin' || userRole === 'superadmin';
  if (!isOwner && !isPrivileged) {
    throw new AppError('Access denied: You do not have permission', 403, undefined, 'FORBIDDEN');
  }

  if (template.status !== 'draft' && template.status !== 'rejected' && !isPrivileged) {
    throw new AppError('Only draft or rejected templates can be deleted', 400);
  }

  // Hard delete draft/rejected template as requested
  await db.delete(templates).where(eq(templates.id, templateId));
}

export async function deleteBatchTemplateDrafts(
  templateIds: string[],
  userId: string,
  userRole: string
) {
  if (!Array.isArray(templateIds) || templateIds.length === 0) {
    throw new AppError('Daftar ID template tidak boleh kosong', 400);
  }

  const isPrivileged = userRole === 'admin' || userRole === 'superadmin';

  // Only query templates belonging to the designer (or admin) with status 'draft'
  const targetTemplates = await db.query.templates.findMany({
    where: and(
      inArray(templates.id, templateIds),
      isPrivileged ? undefined : eq(templates.designerId, userId),
      eq(templates.status, 'draft')
    ),
  });

  if (targetTemplates.length === 0) {
    throw new AppError('Tidak ada template draft yang valid untuk dihapus', 404);
  }

  const eligibleIds = targetTemplates.map((t) => t.id);

  // Execute hard delete
  await db.delete(templates).where(inArray(templates.id, eligibleIds));

  return { deletedCount: eligibleIds.length, deletedIds: eligibleIds };
}
