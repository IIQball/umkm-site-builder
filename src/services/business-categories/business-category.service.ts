import { db } from '@/lib/db/client';
import { businessCategories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { AppError } from '@/lib/utils';
import type {
  BusinessCategoryCreateInput,
  BusinessCategoryUpdateInput,
} from '@/schemas';

export async function getBusinessCategories() {
  try {
    return await db
      .select({
        id: businessCategories.id,
        name: businessCategories.name,
        slug: businessCategories.slug,
        description: businessCategories.description,
        icon: businessCategories.icon,
        createdBy: businessCategories.createdBy,
        createdAt: businessCategories.createdAt,
        updatedAt: businessCategories.updatedAt,
      })
      .from(businessCategories)
      .orderBy(asc(businessCategories.name));
  } catch {
    return [];
  }
}

export async function getBusinessCategoryById(id: string) {
  const category = await db.query.businessCategories.findFirst({
    where: eq(businessCategories.id, id),
  });

  if (!category) {
    throw new AppError('Business category not found', 404, undefined, 'NOT_FOUND');
  }

  return category;
}

export async function createBusinessCategory(
  data: BusinessCategoryCreateInput,
  createdBy?: string
) {
  const existing = await db.query.businessCategories.findFirst({
    where: eq(businessCategories.slug, data.slug),
  });

  if (existing) {
    throw new AppError('Category with this slug already exists', 400, undefined, 'SLUG_EXISTS');
  }

  const categoryId = `biz_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const now = new Date();

  const [newCategory] = await db
    .insert(businessCategories)
    .values({
      id: categoryId,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      icon: data.icon ?? null,
      createdBy: createdBy ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return newCategory;
}

export async function updateBusinessCategory(id: string, data: BusinessCategoryUpdateInput) {
  const category = await db.query.businessCategories.findFirst({
    where: eq(businessCategories.id, id),
  });

  if (!category) {
    throw new AppError('Business category not found', 404, undefined, 'NOT_FOUND');
  }

  if (data.slug && data.slug !== category.slug) {
    const existingSlug = await db.query.businessCategories.findFirst({
      where: eq(businessCategories.slug, data.slug),
    });
    if (existingSlug) {
      throw new AppError('Category with this slug already exists', 400, undefined, 'SLUG_EXISTS');
    }
  }

  const updateData: Partial<typeof businessCategories.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.icon !== undefined) updateData.icon = data.icon;

  const [updated] = await db
    .update(businessCategories)
    .set(updateData)
    .where(eq(businessCategories.id, id))
    .returning();

  return updated;
}

export async function deleteBusinessCategory(id: string) {
  const category = await db.query.businessCategories.findFirst({
    where: eq(businessCategories.id, id),
  });

  if (!category) {
    throw new AppError('Business category not found', 404, undefined, 'NOT_FOUND');
  }

  await db.delete(businessCategories).where(eq(businessCategories.id, id));

  return { success: true };
}
