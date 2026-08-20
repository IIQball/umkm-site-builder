import { db } from '@/lib/db/client';
import { templates, designers, users } from '@/db/schema';
import { eq, isNull, desc } from 'drizzle-orm';

export interface PublicTemplateItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  thumbnailUrl: string | null;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  designerName: string;
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
      .where(isNull(templates.deletedAt))
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
