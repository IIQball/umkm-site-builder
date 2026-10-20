import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { db } from '@/db';
import { stores, tenantAiCredits, aiGenerationLogs } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { generateLogoImage, generateProductMockup, calculateCost } from '@/services/ai';
import { uploadBase64Image } from '@/services/media';

export const prerender = false;

interface GenerateRequestBody {
  featureType?: 'logo' | 'packaging_mockup' | 'product_poster';
  prompt?: string;
  image?: string;
  options?: {
    quality?: 'medium' | 'high';
    size?: '1024x1024' | '1024x1536';
  };
}

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    // 1. Validasi sesi login merchant
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Silakan login terlebih dahulu', 401);
    }

    // Ambil toko milik merchant
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.userId, user.id))
      .limit(1);

    if (!store) {
      throw new AppError('Toko merchant tidak ditemukan', 404);
    }

    // 2. Validasi kecukupan saldo di tenant_ai_credits sebelum pemanggilan AI
    const [creditRecord] = await db
      .select()
      .from(tenantAiCredits)
      .where(eq(tenantAiCredits.tenantId, store.id))
      .limit(1);

    if (!creditRecord || creditRecord.balance < 1) {
      throw new AppError('Kredit AI tidak mencukupi', 402);
    }

    // Parse payload JSON atau FormData
    let featureType: 'logo' | 'packaging_mockup' | 'product_poster' = 'logo';
    let prompt = '';
    let imageBuffer: Buffer | null = null;
    let qualityTier: 'medium' | 'high' = 'high';
    let sizeRatio: '1024x1024' | '1024x1536' = '1024x1024';

    const contentType = context.request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      const rawFeature = formData.get('featureType') as string;
      if (rawFeature === 'packaging_mockup' || rawFeature === 'product_poster' || rawFeature === 'logo') {
        featureType = rawFeature;
      }
      prompt = (formData.get('prompt') as string) || '';
      const rawQuality = formData.get('quality') as string;
      if (rawQuality === 'medium' || rawQuality === 'high') {
        qualityTier = rawQuality;
      }
      const rawSize = formData.get('size') as string;
      if (rawSize === '1024x1024' || rawSize === '1024x1536') {
        sizeRatio = rawSize;
      }

      const file = formData.get('image');
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const arrayBuf = await (file as Blob).arrayBuffer();
        imageBuffer = Buffer.from(arrayBuf);
      }
    } else {
      const body = (await context.request.json().catch(() => ({}))) as GenerateRequestBody;
      if (body.featureType) {
        featureType = body.featureType;
      }
      prompt = body.prompt || '';
      if (body.options?.quality) {
        qualityTier = body.options.quality;
      }
      if (body.options?.size) {
        sizeRatio = body.options.size;
      }
      if (body.image) {
        const cleanB64 = body.image.replace(/^data:image\/\w+;base64,/, '');
        imageBuffer = Buffer.from(cleanB64, 'base64');
      }
    }

    const sanitizedPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    if (!sanitizedPrompt) {
      throw new AppError('Prompt wajib diisi', 400);
    }

    if (featureType !== 'logo' && (!imageBuffer || imageBuffer.length === 0)) {
      throw new AppError('Gambar produk wajib disertakan untuk fitur mockup', 400);
    }

    // 3. Eksekusi transaksi atomik Drizzle (db.transaction)
    // Pemotongan saldo dan pencatatan log dilakukan dalam transaksi.
    // Jika proses generasi atau upload Cloudinary gagal, transaksi di-rollback otomatis
    // sehingga kredit toko tidak berkurang.
    const result = await db.transaction(async (tx) => {
      // Potong saldo kredit toko
      const [updatedCredit] = await tx
        .update(tenantAiCredits)
        .set({
          balance: sql`${tenantAiCredits.balance} - 1`,
          totalUsed: sql`${tenantAiCredits.totalUsed} + 1`,
          updatedAt: new Date(),
        })
        .where(and(eq(tenantAiCredits.id, creditRecord.id), gte(tenantAiCredits.balance, 1)))
        .returning();

      if (!updatedCredit) {
        throw new AppError('Kredit AI tidak mencukupi saat pemotongan', 402);
      }

      // Arahkan ke service yang sesuai
      let imageUrl = '';
      let inputTokens = 0;
      let outputTokens = 0;

      if (featureType === 'logo') {
        const logoResult = await generateLogoImage(sanitizedPrompt, {
          quality: qualityTier,
        });
        inputTokens = logoResult.inputTokens;
        outputTokens = logoResult.outputTokens;

        const uploadResult = await uploadBase64Image(logoResult.base64, 'pinoka/logos');
        imageUrl = uploadResult.secureUrl;
      } else {
        const mockupResult = await generateProductMockup(imageBuffer!, sanitizedPrompt, {
          size: sizeRatio,
        });
        imageUrl = mockupResult.imageUrl;
        inputTokens = mockupResult.inputTokens;
        outputTokens = mockupResult.outputTokens;
      }

      // Hitung biaya riil dengan kurs aktif (tanpa external live rate call)
      const costResult = await calculateCost(inputTokens, outputTokens, 'gpt-image-2.5-sunburst');

      // Catat entri baru pada tabel ai_generation_logs
      const logId = `log_${crypto.randomUUID()}`;
      const [logEntry] = await tx
        .insert(aiGenerationLogs)
        .values({
          id: logId,
          tenantId: store.id,
          userId: user.id,
          isTesting: false,
          featureType,
          modelUsed: 'gpt-image-2.5-sunburst',
          sizeRatio,
          qualityTier,
          promptFinal: sanitizedPrompt,
          inputTokens,
          outputTokens,
          creditsDeducted: 1,
          costUsd: costResult.costUsd,
          costIdr: costResult.costIdr,
          cloudinaryUrl: imageUrl,
          status: 'success',
          errorMessage: null,
        })
        .returning();

      return {
        imageUrl,
        inputTokens,
        outputTokens,
        costUsd: costResult.costUsd,
        costIdr: costResult.costIdr,
        remainingCredits: updatedCredit.balance,
        logId: logEntry.id,
      };
    });

    return jsonSuccess(result, 201);
  });
};
