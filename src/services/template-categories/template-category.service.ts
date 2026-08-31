import { db } from '@/lib/db/client';
import { templateCategories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { AppError } from '@/lib/utils';
import type {
  TemplateCategoryCreateInput,
  TemplateCategoryUpdateInput,
} from '@/schemas';

export async function getTemplateCategories() {
  try {
    return await db
      .select({
        id: templateCategories.id,
        name: templateCategories.name,
        slug: templateCategories.slug,
        description: templateCategories.description,
        icon: templateCategories.icon,
        createdAt: templateCategories.createdAt,
        updatedAt: templateCategories.updatedAt,
      })
      .from(templateCategories)
      .orderBy(asc(templateCategories.name));
  } catch {
    return [];
  }
}

export async function getTemplateCategoryById(id: string) {
  const category = await db.query.templateCategories.findFirst({
    where: eq(templateCategories.id, id),
  });

  if (!category) {
    throw new AppError('Template category not found', 404, undefined, 'NOT_FOUND');
  }

  return category;
}

export async function createTemplateCategory(data: TemplateCategoryCreateInput) {
  // Check if slug already exists
  const existing = await db.query.templateCategories.findFirst({
    where: eq(templateCategories.slug, data.slug),
  });

  if (existing) {
    throw new AppError('Category with this slug already exists', 400, undefined, 'SLUG_EXISTS');
  }

  const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const now = new Date();

  const [newCategory] = await db
    .insert(templateCategories)
    .values({
      id: categoryId,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      icon: data.icon ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return newCategory;
}

export async function updateTemplateCategory(id: string, data: TemplateCategoryUpdateInput) {
  const category = await db.query.templateCategories.findFirst({
    where: eq(templateCategories.id, id),
  });

  if (!category) {
    throw new AppError('Template category not found', 404, undefined, 'NOT_FOUND');
  }

  if (data.slug && data.slug !== category.slug) {
    const existingSlug = await db.query.templateCategories.findFirst({
      where: eq(templateCategories.slug, data.slug),
    });
    if (existingSlug) {
      throw new AppError('Category with this slug already exists', 400, undefined, 'SLUG_EXISTS');
    }
  }

  const updateData: Partial<typeof templateCategories.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.icon !== undefined) updateData.icon = data.icon;

  const [updated] = await db
    .update(templateCategories)
    .set(updateData)
    .where(eq(templateCategories.id, id))
    .returning();

  return updated;
}

export async function deleteTemplateCategory(id: string) {
  const category = await db.query.templateCategories.findFirst({
    where: eq(templateCategories.id, id),
  });

  if (!category) {
    throw new AppError('Template category not found', 404, undefined, 'NOT_FOUND');
  }

  await db.delete(templateCategories).where(eq(templateCategories.id, id));

  return { success: true };
}
