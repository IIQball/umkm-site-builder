import { db } from '@/lib/db/client';
import { stores, templates, userTemplates, users } from '@/db/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { AppError } from '@/lib/utils/api-handler';

export interface TemplateOwnershipResult {
  store: {
    id: string;
    userId: string;
    templateId: string | null;
  };
  template: {
    id: string;
    name: string;
    price: number;
    config: unknown;
    status: string;
  };
  owned: boolean;
}

export interface TenantOwnedTemplateItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  thumbnailUrl: string | null;
  designerName: string;
  acquiredAt?: Date | null;
  isFree?: boolean;
}

export async function getTenantOwnedTemplates(userId: string): Promise<TenantOwnedTemplateItem[]> {
  // 1. Get explicitly owned templates (from userTemplates table)
  const ownedRecords = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      price: templates.price,
      thumbnailUrl: templates.thumbnailUrl,
      status: templates.status,
      acquiredAt: userTemplates.acquiredAt,
      designerName: users.name,
    })
    .from(userTemplates)
    .innerJoin(templates, eq(userTemplates.templateId, templates.id))
    .leftJoin(users, eq(templates.designerId, users.id))
    .where(and(eq(userTemplates.userId, userId), isNull(templates.deletedAt)))
    .orderBy(desc(userTemplates.acquiredAt));

  // 2. Get free approved templates (price === 0)
  const freeRecords = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      price: templates.price,
      thumbnailUrl: templates.thumbnailUrl,
      status: templates.status,
      createdAt: templates.createdAt,
      designerName: users.name,
    })
    .from(templates)
    .leftJoin(users, eq(templates.designerId, users.id))
    .where(
      and(
        eq(templates.price, 0),
        eq(templates.status, 'approved'),
        isNull(templates.deletedAt)
      )
    )
    .orderBy(desc(templates.createdAt));

  // Merge unique by template id (owned purchased first, then free)
  const map = new Map<string, TenantOwnedTemplateItem>();

  for (const r of ownedRecords) {
    map.set(r.id, {
      id: r.id,
      name: r.name,
      description: r.description,
      price: r.price,
      thumbnailUrl: r.thumbnailUrl,
      designerName: r.designerName || 'Desainer Resmi',
      acquiredAt: r.acquiredAt,
      isFree: r.price === 0,
    });
  }

  for (const r of freeRecords) {
    if (!map.has(r.id)) {
      map.set(r.id, {
        id: r.id,
        name: r.name,
        description: r.description,
        price: r.price,
        thumbnailUrl: r.thumbnailUrl,
        designerName: r.designerName || 'Desainer Resmi',
        acquiredAt: r.createdAt,
        isFree: true,
      });
    }
  }

  return Array.from(map.values());
}

export async function validateTemplateOwnership(
  storeId: string,
  templateId: string,
  userId: string
): Promise<TemplateOwnershipResult> {
  const [store] = await db
    .select({
      id: stores.id,
      userId: stores.userId,
      templateId: stores.templateId,
    })
    .from(stores)
    .where(and(eq(stores.id, storeId), isNull(stores.deletedAt)));

  if (!store) {
    throw new AppError('Toko tidak ditemukan', 404, undefined, 'STORE_NOT_FOUND');
  }

  if (store.userId !== userId) {
    throw new AppError('Anda tidak memiliki akses ke toko ini', 403, undefined, 'STORE_FORBIDDEN');
  }

  const [template] = await db
    .select({
      id: templates.id,
      name: templates.name,
      price: templates.price,
      config: templates.config,
      status: templates.status,
    })
    .from(templates)
    .where(
      and(
        eq(templates.id, templateId),
        eq(templates.status, 'approved'),
        isNull(templates.deletedAt)
      )
    );

  if (!template) {
    throw new AppError(
      'Template tidak ditemukan atau belum disetujui',
      404,
      undefined,
      'TEMPLATE_NOT_FOUND'
    );
  }

  let owned = true;

  if (template.price > 0) {
    const [ownership] = await db
      .select({ id: userTemplates.id })
      .from(userTemplates)
      .where(
        and(
          eq(userTemplates.userId, userId),
          eq(userTemplates.templateId, templateId)
        )
      );

    if (!ownership) {
      owned = false;
    }
  }

  return { store, template, owned };
}

export async function applyTemplateToStore(
  storeId: string,
  templateId: string,
  templateConfig: unknown
): Promise<void> {
  await db
    .update(stores)
    .set({
      templateId,
      customization: templateConfig,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId));
}
