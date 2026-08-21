import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { platformSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { commissionSettingsSchema } from '@/schemas';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';

const DEFAULT_SETTINGS = {
  platformFeePercentage: 30,
  payoutMinimumBalance: 50000,
};

export const GET: APIRoute = async (context): Promise<Response> => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, ok: false, error: { code: 'UNAUTHORIZED', message: 'Autentikasi diperlukan' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isAuthorizedAdmin(user)) {
      return new Response(
        JSON.stringify({ success: false, ok: false, error: { code: 'FORBIDDEN', message: 'Akses khusus admin diperlukan' } }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const settingsList = await db.select().from(platformSettings).limit(1);

    if (settingsList.length === 0) {
      return new Response(
        JSON.stringify({ success: true, ok: true, data: DEFAULT_SETTINGS }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        ok: true,
        data: {
          platformFeePercentage: settingsList[0].platformFeePercentage,
          payoutMinimumBalance: settingsList[0].payoutMinimumBalance,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        ok: false,
        error: { code: 'INTERNAL', message: error instanceof Error ? error.message : 'Gagal mengambil pengaturan' },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const saveSettings = async (context: Parameters<APIRoute>[0]): Promise<Response> => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, ok: false, error: { code: 'UNAUTHORIZED', message: 'Autentikasi diperlukan' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isAuthorizedAdmin(user)) {
      return new Response(
        JSON.stringify({ success: false, ok: false, error: { code: 'FORBIDDEN', message: 'Akses khusus admin diperlukan' } }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json().catch(() => ({}));
    const validated = commissionSettingsSchema.parse(body);

    const existingList = await db.select().from(platformSettings).limit(1);

    let updatedRecord;
    if (existingList.length === 0) {
      const [newRecord] = await db
        .insert(platformSettings)
        .values({
          id: `ps_${Date.now()}`,
          platformFeePercentage: validated.platformFeePercentage,
          payoutMinimumBalance: DEFAULT_SETTINGS.payoutMinimumBalance,
          updatedBy: user.id,
          updatedAt: new Date(),
        })
        .returning();
      updatedRecord = newRecord;
    } else {
      const [record] = await db
        .update(platformSettings)
        .set({
          platformFeePercentage: validated.platformFeePercentage,
          updatedBy: user.id,
          updatedAt: new Date(),
        })
        .where(eq(platformSettings.id, existingList[0].id))
        .returning();
      updatedRecord = record;
    }

    return new Response(
      JSON.stringify({
        success: true,
        ok: true,
        message: 'Pengaturan komisi berhasil diperbarui',
        data: updatedRecord,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: { code: 'VALIDATION_ERROR', message: error.errors[0]?.message || 'Input tidak valid' },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        ok: false,
        error: { code: 'INTERNAL', message: error instanceof Error ? error.message : 'Gagal menyimpan pengaturan' },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = saveSettings;
export const POST: APIRoute = saveSettings;
