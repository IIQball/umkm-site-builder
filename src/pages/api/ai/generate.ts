import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { db } from '@/db';
import { stores, tenantAiCredits, aiGenerationLogs } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import {
  buildLogoPrompt,
  generateLogoImage,
  buildProductPosterPrompt,
  generateProductPoster,
  buildProductMockupPrompt,
  generateProductMockup,
  calculateCost,
  resolveStoreAiModel,
} from '@/services/ai';
import { uploadBase64Image } from '@/services/media/cloudinary-uploader';
import {
  type AiPhase,
  parseGeneratePayload,
  rollbackAiCredits,
  handleGenerateError,
} from './generate.helpers';

export const prerender = false;

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    let currentPhase: AiPhase = 'STORE_AUTH';
    let creditDeducted = false;
    let requiredCredits = 0;
    let targetStoreId: string | undefined;
    let logId: string | undefined;
    let userId: string | undefined;

    try {
      // 1. Validasi sesi login user
      const user = await getAuthenticatedUser(context.request);
      if (!user) {
        throw new AppError('Silakan login terlebih dahulu', 401);
      }
      userId = user.id;

      // 2. Parse payload request
      currentPhase = 'PROMPT_BUILDER';
      const {
        featureType,
        prompt,
        imageBuffer,
        requestedQualityTier,
        sizeRatio,
        isTesting,
        explicitStoreId,
        storeNameInput,
        categoryInput,
        businessCategoryInput,
        conceptTypeInput,
        logoTextInput,
        lockupTypeInput,
        fontFamilyInput,
        packagingTypeInput,
        productLabelInput,
        presentationStyleInput,
        posterStyleInput,
        productNameInput,
        titleTextInput,
        subTextInput,
        visualStyleInput,
        colorPaletteInput,
        focalSubjectInput,
      } = await parseGeneratePayload(context.request);

      const sanitizedPrompt = typeof prompt === 'string' ? prompt.trim() : '';
      if (!sanitizedPrompt) {
        throw new AppError('Prompt wajib diisi', 400);
      }

      if (featureType === 'packaging_mockup' && (!imageBuffer || imageBuffer.length === 0)) {
        throw new AppError('Gambar produk wajib disertakan untuk fitur mockup', 400);
      }

      if (imageBuffer && imageBuffer.length > 4 * 1024 * 1024) {
        throw new AppError('Ukuran gambar referensi melebihi batas 4 MB', 400);
      }

      const isTestingExecution = Boolean(isTesting) && user.role === 'superadmin';

      // 3. Ambil toko milik user / store target
      currentPhase = 'STORE_AUTH';
      let [store] = await db.select().from(stores).where(eq(stores.userId, user.id)).limit(1);

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
      targetStoreId = store.id;

      // 4. Resolusi model & kuota dinamis berdasarkan tiering toko
      currentPhase = 'MODEL_ROUTER';
      const resolvedModel = await resolveStoreAiModel(store.id, requestedQualityTier);
      const selectedModel = resolvedModel.model;
      requiredCredits = resolvedModel.requiredCredits;
      const effectiveQualityTier =
        requestedQualityTier || (resolvedModel.model === 'gpt-image-2.5-flare' ? 'standard' : 'high');

      // 5. Validasi kecukupan saldo
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

      // 6. Eksekusi pemotongan kredit atomik
      creditDeducted = false;
      let remainingCredits = creditRecord?.balance ?? 0;

      if (!isTestingExecution && creditRecord) {
        const [updatedCredit] = await db
          .update(tenantAiCredits)
          .set({
            balance: sql`${tenantAiCredits.balance} - ${requiredCredits}`,
            totalUsed: sql`${tenantAiCredits.totalUsed} + ${requiredCredits}`,
            updatedAt: new Date(),
          })
          .where(and(eq(tenantAiCredits.tenantId, store.id), gte(tenantAiCredits.balance, requiredCredits)))
          .returning();

        if (!updatedCredit) {
          throw new AppError('Kredit AI tidak mencukupi saat pemotongan', 402);
        }
        creditDeducted = true;
        remainingCredits = updatedCredit.balance;
      }

      // 7. Eksekusi generasi visual sesuai jenis fitur
      let imageUrl = '';
      let inputTokens = 0;
      let outputTokens = 0;
      let promptFinal = sanitizedPrompt;

      if (featureType === 'logo') {
        currentPhase = 'PROMPT_BUILDER';
        const effectiveStoreName =
          storeNameInput || (sanitizedPrompt.match(/for "([^"]+)"/i)?.[1]) || store.name || 'Store';
        const effectiveCategory = businessCategoryInput || categoryInput || 'General Store';
        const effectiveVisualStyle =
          visualStyleInput || (sanitizedPrompt.match(/visual style:\s*([^,.]+)/i)?.[1]?.trim());
        const effectiveColorPalette =
          colorPaletteInput || (sanitizedPrompt.match(/color discipline:\s*([^,.]+)/i)?.[1]?.trim());

        const compiledLogoPrompt = await buildLogoPrompt({
          storeName: effectiveStoreName,
          category: effectiveCategory,
          businessCategory: businessCategoryInput,
          conceptType: conceptTypeInput,
          logoText: logoTextInput,
          lockupType: lockupTypeInput,
          fontFamily: fontFamilyInput,
          visualStyle: effectiveVisualStyle,
          colorPalette: effectiveColorPalette,
          focalSubject: focalSubjectInput,
        });
        promptFinal = compiledLogoPrompt;

        currentPhase = 'IMAGE_GENERATOR';
        const logoResult = await generateLogoImage(compiledLogoPrompt, {
          quality: effectiveQualityTier === 'standard' ? 'medium' : 'high',
          model: selectedModel,
        });
        inputTokens = logoResult.inputTokens;
        outputTokens = logoResult.outputTokens;

        currentPhase = 'CLOUDINARY_UPLOADER';
        const uploadResult = await uploadBase64Image(logoResult.base64, 'pinoka/logos');
        imageUrl = uploadResult.secureUrl;
      } else if (featureType === 'product_poster') {
        currentPhase = 'IMAGE_GENERATOR';
        const effectiveHeadline = titleTextInput || productNameInput || sanitizedPrompt;
        const compiledPosterPrompt = buildProductPosterPrompt({
          productName: productNameInput,
          titleText: effectiveHeadline,
          subText: subTextInput,
          posterStyle: posterStyleInput,
        });
        promptFinal = compiledPosterPrompt;

        const posterResult = await generateProductPoster(compiledPosterPrompt, {
          size: sizeRatio,
          quality: effectiveQualityTier === 'standard' ? 'medium' : 'high',
          model: selectedModel,
          imageBuffer,
        });
        imageUrl = posterResult.imageUrl;
        inputTokens = posterResult.inputTokens;
        outputTokens = posterResult.outputTokens;
      } else {
        currentPhase = 'IMAGE_GENERATOR';
        const compiledMockupPrompt = buildProductMockupPrompt({
          packagingType: packagingTypeInput,
          productLabel: productLabelInput,
          presentationStyle: presentationStyleInput,
          basePrompt: sanitizedPrompt,
        });
        promptFinal = compiledMockupPrompt;

        const mockupResult = await generateProductMockup(imageBuffer!, compiledMockupPrompt, {
          size: sizeRatio,
          model: selectedModel,
        });
        imageUrl = mockupResult.imageUrl;
        inputTokens = mockupResult.inputTokens;
        outputTokens = mockupResult.outputTokens;
      }

      currentPhase = 'LEDGER_RECORDING';
      const costResult = await calculateCost(inputTokens, outputTokens, selectedModel, effectiveQualityTier);
      logId = `log_${crypto.randomUUID()}`;
      const creditsDeducted = isTestingExecution ? 0 : requiredCredits;

      const [logEntry] = await db
        .insert(aiGenerationLogs)
        .values({
          id: logId,
          tenantId: store.id,
          userId: user.id,
          isTesting: isTestingExecution,
          featureType,
          modelUsed: selectedModel,
          sizeRatio,
          qualityTier: effectiveQualityTier,
          promptFinal,
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

      return jsonSuccess(
        {
          imageUrl,
          inputTokens,
          outputTokens,
          costUsd: costResult.costUsd,
          costIdr: costResult.costIdr,
          remainingCredits,
          logId: logEntry?.id || logId,
          isTesting: isTestingExecution,
          modelUsed: selectedModel,
          creditsDeducted,
        },
        201
      );
    } catch (error: unknown) {
      if (creditDeducted && targetStoreId && requiredCredits > 0) {
        await rollbackAiCredits(targetStoreId, requiredCredits, userId, logId);
      }
      return handleGenerateError(error, currentPhase);
    }
  });
};
