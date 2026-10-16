import { db } from '@/lib/db/client';
import { templateCategories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { AppError, slugify } from '@/lib/utils';
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
  const slug = (data.slug?.trim() || slugify(data.name)).trim();
  if (!slug) {
    throw new AppError('Slug is required', 400, undefined, 'SLUG_REQUIRED');
  }

  // Check if slug already exists
  const existing = await db.query.templateCategories.findFirst({
    where: eq(templateCategories.slug, slug),
  });

  if (existing) {
    throw new AppError('Category with this slug already exists', 400, undefined, 'SLUG_EXISTS');
  }

  const categoryId = `cat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date();

  const [newCategory] = await db
    .insert(templateCategories)
    .values({
      id: categoryId,
      name: data.name,
      slug,
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

  let slug: string | undefined = undefined;
  if (data.slug !== undefined && data.slug !== null) {
    const trimmed = data.slug.trim();
    slug = trimmed || (data.name ? slugify(data.name) : category.slug);
  }

  if (slug && slug !== category.slug) {
    const existingSlug = await db.query.templateCategories.findFirst({
      where: eq(templateCategories.slug, slug),
    });
    if (existingSlug) {
      throw new AppError('Category with this slug already exists', 400, undefined, 'SLUG_EXISTS');
    }
  }

  const updateData: Partial<typeof templateCategories.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (slug !== undefined) updateData.slug = slug;
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
