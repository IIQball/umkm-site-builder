import { db } from '@/lib/db/client';
import { templates, designers, users } from '@/db/schema';
import { eq, isNull, desc, and } from 'drizzle-orm';
import type { PublicTemplateItem } from '@/types';

export async function getPublicTemplates(page: number = 1, pageSize: number = 10): Promise<PublicTemplateItem[]> {
  try {
    const safePage = Math.max(1, Math.floor(page) || 1);
    const safePageSize = Math.max(1, Math.floor(pageSize) || 10);
    const offset = (safePage - 1) * safePageSize;

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
      .orderBy(desc(templates.createdAt))
      .limit(safePageSize)
      .offset(offset);

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
