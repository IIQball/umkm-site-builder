import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, AppError } from '@/lib/utils';
import { db, notifications, users } from '@/db';
import { and, eq, gte, sql } from 'drizzle-orm';
import { z } from 'zod';

const RequestUpgradeSchema = z.object({
  categorySlots: z.number().min(0),
  productSlots: z.number().min(0),
});

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || user.role !== 'tenant') {
      throw new AppError('Tenant access required to request quota upgrade', 401);
    }

    const body = await context.request.json().catch(() => ({}));
    const parsed = RequestUpgradeSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Data permintaan tidak valid', 400);
    }

    const { categorySlots, productSlots } = parsed.data;
    
    if (categorySlots === 0 && productSlots === 0) {
      throw new AppError('Silakan isi jumlah slot tambahan yang dibutuhkan', 400);
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentRequest = await db.query.notifications.findFirst({
      where: and(
        eq(notifications.type, 'quota_upgrade_request'),
        sql`${notifications.metadata}->>'tenantId' = ${user.id}`,
        gte(notifications.createdAt, oneWeekAgo)
      )
    });

    if (recentRequest) {
      throw new AppError('Anda hanya dapat mengajukan penambahan kuota 1 kali per minggu.', 429);
    }

    // Create notification for superadmins
    const superAdmins = await db.query.users.findMany({
      where: eq(users.role, 'superadmin')
    });
    
    if (superAdmins.length > 0) {
      await db.insert(notifications).values(
        superAdmins.map((admin) => ({
          id: `notif_${crypto.randomUUID()}`,
          userId: admin.id,
          type: 'quota_upgrade_request',
          title: 'Permintaan Peningkatan Kuota',
          message: `Tenant ${user.name} meminta tambahan kuota: ${categorySlots} Kategori, ${productSlots} Produk.`,
          metadata: { tenantId: user.id, requested: { categorySlots, productSlots } }
        }) as typeof notifications.$inferInsert)
      );
    }

    return Response.json({
      success: true,
      ok: true,
      message: 'Permintaan berhasil dikirim ke Admin',
    });
  });
};
