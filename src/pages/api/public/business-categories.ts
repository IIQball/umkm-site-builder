import type { APIRoute } from 'astro';
import { handleApiRoute } from '@/lib/utils/api-handler';
import { db } from '@/db';
import { businessCategories } from '@/db/schema';
import { asc } from 'drizzle-orm';

export const GET: APIRoute = async (): Promise<Response> => {
  return handleApiRoute(async () => {
    const categories = await db
      .select({
        id: businessCategories.id,
        name: businessCategories.name,
        slug: businessCategories.slug,
        icon: businessCategories.icon,
      })
      .from(businessCategories)
      .orderBy(asc(businessCategories.name));

    return Response.json(
      {
        success: true,
        ok: true,
        data: categories,
      },
      { status: 200 }
    );
  });
};
