import type { APIRoute } from 'astro';
import { db } from '@/lib/db/client';
import { templates, designers, users } from '@/db/schema';
import { eq, isNull, desc, and } from 'drizzle-orm';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';

export const GET: APIRoute = async (context): Promise<Response> => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedAdmin(user)) {
      return new Response(
        JSON.stringify({ success: false, ok: false, error: { code: 'FORBIDDEN', message: 'Akses khusus admin' } }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(context.request.url);
    const statusFilter = url.searchParams.get('status');

    let conditions = isNull(templates.deletedAt);
    if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
      conditions = and(conditions, eq(templates.status, statusFilter as 'pending' | 'approved' | 'rejected'))!;
    }

    const records = await db
      .select({
        id: templates.id,
        name: templates.name,
        description: templates.description,
        thumbnailUrl: templates.thumbnailUrl,
        price: templates.price,
        status: templates.status,
        rejectionReason: templates.rejectionReason,
        createdAt: templates.createdAt,
        designerId: templates.designerId,
        designerName: users.name,
        designerEmail: users.email,
      })
      .from(templates)
      .leftJoin(designers, eq(templates.designerId, designers.userId))
      .leftJoin(users, eq(designers.userId, users.id))
      .where(conditions)
      .orderBy(desc(templates.createdAt));

    return new Response(
      JSON.stringify({ success: true, ok: true, data: records }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        ok: false,
        error: { code: 'INTERNAL', message: error instanceof Error ? error.message : 'Gagal mengambil daftar template' },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
