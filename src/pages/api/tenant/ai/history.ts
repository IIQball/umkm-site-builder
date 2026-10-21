import type { APIRoute } from 'astro';
import { db } from '@/db';
import { stores, aiGenerationLogs } from '@/db/schema';
import { eq, and, isNotNull, desc } from 'drizzle-orm';
import { jsonSuccess, jsonError } from '@/lib/utils/api-handler';
import { getAuthenticatedUser } from '@/lib/auth';
import type { AiFeatureType } from '@/types/ai';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return jsonError('Silakan login terlebih dahulu', 401);
    }

    // Ambil data toko milik tenant
    const [store] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(eq(stores.userId, user.id))
      .limit(1);

    if (!store) {
      return jsonSuccess({ items: [], total: 0 }, 200);
    }

    const url = new URL(request.url);
    const featureTypeParam = url.searchParams.get('featureType') as AiFeatureType | null;

    // Filter dasar: milik tenant, status berhasil, dan memiliki URL Cloudinary
    const conditions = [
      eq(aiGenerationLogs.tenantId, store.id),
      eq(aiGenerationLogs.status, 'success'),
      isNotNull(aiGenerationLogs.cloudinaryUrl),
    ];

    if (featureTypeParam && ['logo', 'packaging_mockup', 'product_poster'].includes(featureTypeParam)) {
      conditions.push(eq(aiGenerationLogs.featureType, featureTypeParam));
    }

    const items = await db
      .select({
        id: aiGenerationLogs.id,
        featureType: aiGenerationLogs.featureType,
        modelUsed: aiGenerationLogs.modelUsed,
        sizeRatio: aiGenerationLogs.sizeRatio,
        promptFinal: aiGenerationLogs.promptFinal,
        cloudinaryUrl: aiGenerationLogs.cloudinaryUrl,
        creditsDeducted: aiGenerationLogs.creditsDeducted,
        createdAt: aiGenerationLogs.createdAt,
      })
      .from(aiGenerationLogs)
      .where(and(...conditions))
      .orderBy(desc(aiGenerationLogs.createdAt));

    return jsonSuccess({ items, total: items.length }, 200);
  } catch (error: unknown) {
    console.error('[AI_HISTORY] fetch error:', error);
    return jsonError('Gagal mengambil riwayat generasi AI', 500);
  }
};
