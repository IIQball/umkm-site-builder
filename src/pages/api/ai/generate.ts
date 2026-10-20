import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { db } from '@/db';
import { stores, tenantAiCredits, aiGenerationLogs } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { generateLogoImage, generateProductMockup, calculateCost, resolveStoreAiModel } from '@/services/ai';
import { uploadBase64Image } from '@/services/media';

export const prerender = false;

interface GenerateRequestBody {
  featureType?: 'logo' | 'packaging_mockup' | 'product_poster';
  prompt?: string;
  image?: string;
  isTesting?: boolean;
  storeId?: string;
  options?: {
    quality?: 'medium' | 'high';
    size?: '1024x1024' | '1024x1536';
  };
}

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    // 1. Validasi sesi login user
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      throw new AppError('Silakan login terlebih dahulu', 401);
    }

    // 2. Parse payload JSON atau FormData
    let featureType: 'logo' | 'packaging_mockup' | 'product_poster' = 'logo';
    let prompt = '';
    let imageBuffer: Buffer | null = null;
    let qualityTier: 'medium' | 'high' = 'high';
    let sizeRatio: '1024x1024' | '1024x1536' = '1024x1024';
    let isTesting = false;
    let explicitStoreId: string | undefined;

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
      const rawTesting = formData.get('isTesting');
      isTesting = rawTesting === 'true' || rawTesting === '1';
      explicitStoreId = (formData.get('storeId') as string) || undefined;

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
      isTesting = Boolean(body.isTesting);
      explicitStoreId = body.storeId;
    }

    const sanitizedPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    if (!sanitizedPrompt) {
      throw new AppError('Prompt wajib diisi', 400);
    }

    if (featureType !== 'logo' && (!imageBuffer || imageBuffer.length === 0)) {
      throw new AppError('Gambar produk wajib disertakan untuk fitur mockup', 400);
    }

    if (imageBuffer && imageBuffer.length > 4 * 1024 * 1024) {
      throw new AppError('Ukuran gambar referensi melebihi batas 4 MB', 400);
    }

    const isTestingExecution = Boolean(isTesting) && user.role === 'superadmin';

    // 3. Ambil toko milik user / store target
    let [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.userId, user.id))
      .limit(1);

    if (!store && isTestingExecution) {
      if (explicitStoreId) {
        const [foundStore] = await db.select().from(stores).where(eq(stores.id, explicitStoreId)).limit(1);
        store = foundStore || ({ id: explicitStoreId, userId: user.id } as typeof store);
      } else {
        store = { id: 'store_superadmin_test', userId: user.id } as typeof store;
      }
    } else if (!store) {
      throw new AppError('Toko merchant tidak ditemukan', 404);
    }

    // 4. Resolusi model & kuota dinamis berdasarkan tiering toko
    const resolvedModel = await resolveStoreAiModel(store.id);
    const selectedModel = resolvedModel.model;
    const requiredCredits = resolvedModel.requiredCredits;

    // 5. Validasi kecukupan saldo (dilewati jika mode testing superadmin)
    let creditRecord: typeof tenantAiCredits.$inferSelect | undefined;

    if (!isTestingExecution) {
      const [foundCredits] = await db
        .select()
        .from(tenantAiCredits)
        .where(eq(tenantAiCredits.tenantId, store.id))
        .limit(1);

      if (!foundCredits || foundCredits.balance < requiredCredits) {
        throw new AppError('Kredit AI tidak mencukupi', 402);
      }
      creditRecord = foundCredits;
    }

    // 6. Eksekusi transaksi atomik Drizzle (db.transaction)
    let result;
    try {
      result = await db.transaction(async (tx) => {
        let remainingCredits = creditRecord?.balance ?? 0;

        // Pemotongan saldo kredit hanya untuk alur normal non-testing
        if (!isTestingExecution && creditRecord) {
          const [updatedCredit] = await tx
            .update(tenantAiCredits)
            .set({
              balance: sql`${tenantAiCredits.balance} - ${requiredCredits}`,
              totalUsed: sql`${tenantAiCredits.totalUsed} + ${requiredCredits}`,
              updatedAt: new Date(),
            })
            .where(and(eq(tenantAiCredits.id, creditRecord.id), gte(tenantAiCredits.balance, requiredCredits)))
            .returning();

          if (!updatedCredit) {
            throw new AppError('Kredit AI tidak mencukupi saat pemotongan', 402);
          }
          remainingCredits = updatedCredit.balance;
        }

        // Arahkan ke service yang sesuai dengan model terpilih
        let imageUrl = '';
        let inputTokens = 0;
        let outputTokens = 0;

        if (featureType === 'logo') {
          const logoResult = await generateLogoImage(sanitizedPrompt, {
            quality: qualityTier,
            model: selectedModel,
          });
          inputTokens = logoResult.inputTokens;
          outputTokens = logoResult.outputTokens;

          const uploadResult = await uploadBase64Image(logoResult.base64, 'pinoka/logos');
          imageUrl = uploadResult.secureUrl;
        } else {
          const mockupResult = await generateProductMockup(imageBuffer!, sanitizedPrompt, {
            size: sizeRatio,
            model: selectedModel,
          });
          imageUrl = mockupResult.imageUrl;
          inputTokens = mockupResult.inputTokens;
          outputTokens = mockupResult.outputTokens;
        }

        // Hitung biaya riil dengan kurs aktif (tanpa external live rate call)
        const costResult = await calculateCost(inputTokens, outputTokens, selectedModel);

        // Catat entri baru pada tabel ai_generation_logs
        const logId = `log_${crypto.randomUUID()}`;
        const creditsDeducted = isTestingExecution ? 0 : requiredCredits;

        const [logEntry] = await tx
          .insert(aiGenerationLogs)
          .values({
            id: logId,
            tenantId: store.id,
            userId: user.id,
            isTesting: isTestingExecution,
            featureType,
            modelUsed: selectedModel,
            sizeRatio,
            qualityTier,
            promptFinal: sanitizedPrompt,
            inputTokens,
            outputTokens,
            creditsDeducted,
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
          remainingCredits,
          logId: logEntry.id,
          isTesting: isTestingExecution,
          modelUsed: selectedModel,
          creditsDeducted,
        };
      });
    } catch (transactionError: unknown) {
      if (transactionError instanceof AppError) {
        throw transactionError;
      }
      const rawMessage =
        transactionError instanceof Error ? transactionError.message : String(transactionError);
      throw new AppError(`Gagal memproses generasi AI: ${rawMessage}`, 500);
    }

    return jsonSuccess(result, 201);
  });
};
