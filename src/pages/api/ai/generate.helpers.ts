import { AppError } from '@/lib/utils';
import { db } from '@/db';
import { tenantAiCredits } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { LogoLockupType, LogoFontFamily } from '@/lib/validators/ai-logo';
import type { MockupPresentationStyle } from '@/lib/validators/ai-packaging';
import type { PosterStyle } from '@/lib/validators/ai-poster';

export interface GenerateRequestBody {
  featureType?: 'logo' | 'packaging_mockup' | 'product_poster';
  prompt?: string;
  image?: string;
  isTesting?: boolean;
  storeId?: string;
  storeName?: string;
  category?: string;
  businessCategory?: string;
  conceptType?: string;
  logoText?: string;
  lockupType?: LogoLockupType;
  fontFamily?: LogoFontFamily;
  packagingType?: string;
  productLabel?: string;
  presentationStyle?: MockupPresentationStyle;
  posterStyle?: PosterStyle;
  productName?: string;
  titleText?: string;
  subText?: string;
  visualStyle?: string;
  colorPalette?: string | string[];
  focalSubject?: string;
  qualityTier?: 'standard' | 'high';
  options?: {
    quality?: 'medium' | 'high';
    qualityTier?: 'standard' | 'high';
    size?: '1024x1024' | '1024x1536';
  };
}

export type AiPhase =
  | 'STORE_AUTH'
  | 'PROMPT_BUILDER'
  | 'MODEL_ROUTER'
  | 'IMAGE_GENERATOR'
  | 'CLOUDINARY_UPLOADER'
  | 'LEDGER_RECORDING';

export interface ParsedGeneratePayload {
  featureType: 'logo' | 'packaging_mockup' | 'product_poster';
  prompt: string;
  imageBuffer: Buffer | null;
  requestedQualityTier?: 'standard' | 'high';
  sizeRatio: '1024x1024' | '1024x1536';
  isTesting: boolean;
  explicitStoreId?: string;
  storeNameInput?: string;
  categoryInput?: string;
  businessCategoryInput?: string;
  conceptTypeInput?: string;
  logoTextInput?: string;
  lockupTypeInput?: LogoLockupType;
  fontFamilyInput?: LogoFontFamily;
  packagingTypeInput?: string;
  productLabelInput?: string;
  presentationStyleInput?: MockupPresentationStyle;
  posterStyleInput?: PosterStyle;
  productNameInput?: string;
  titleTextInput?: string;
  subTextInput?: string;
  visualStyleInput?: string;
  colorPaletteInput?: string;
  focalSubjectInput?: string;
}

export async function parseGeneratePayload(request: Request): Promise<ParsedGeneratePayload> {
  let featureType: 'logo' | 'packaging_mockup' | 'product_poster' = 'logo';
  let prompt = '';
  let imageBuffer: Buffer | null = null;
  let requestedQualityTier: 'standard' | 'high' | undefined = undefined;
  let sizeRatio: '1024x1024' | '1024x1536' = '1024x1024';
  let isTesting = false;
  let explicitStoreId: string | undefined;
  let storeNameInput: string | undefined;
  let categoryInput: string | undefined;
  let businessCategoryInput: string | undefined;
  let conceptTypeInput: string | undefined;
  let logoTextInput: string | undefined;
  let lockupTypeInput: LogoLockupType | undefined;
  let fontFamilyInput: LogoFontFamily | undefined;
  let packagingTypeInput: string | undefined;
  let productLabelInput: string | undefined;
  let presentationStyleInput: MockupPresentationStyle | undefined;
  let posterStyleInput: PosterStyle | undefined;
  let productNameInput: string | undefined;
  let titleTextInput: string | undefined;
  let subTextInput: string | undefined;
  let visualStyleInput: string | undefined;
  let colorPaletteInput: string | undefined;
  let focalSubjectInput: string | undefined;

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const rawFeature = formData.get('featureType') as string;
    if (rawFeature === 'packaging_mockup' || rawFeature === 'product_poster' || rawFeature === 'logo') {
      featureType = rawFeature;
    }
    prompt = (formData.get('prompt') as string) || '';
    const rawQuality = formData.get('qualityTier') as string;
    if (rawQuality === 'standard' || rawQuality === 'high') requestedQualityTier = rawQuality;
    const rawSize = formData.get('size') as string;
    if (rawSize === '1024x1024' || rawSize === '1024x1536') sizeRatio = rawSize;
    const rawTesting = formData.get('isTesting');
    isTesting = rawTesting === 'true' || rawTesting === '1';
    explicitStoreId = (formData.get('storeId') as string) || undefined;
    storeNameInput = (formData.get('storeName') as string) || undefined;
    categoryInput = (formData.get('category') as string) || undefined;
    businessCategoryInput = (formData.get('businessCategory') as string) || undefined;
    conceptTypeInput = (formData.get('conceptType') as string) || undefined;
    logoTextInput = (formData.get('logoText') as string) || undefined;
    const rawLockup = formData.get('lockupType') as string;
    if (rawLockup === 'icon_only' || rawLockup === 'vertical' || rawLockup === 'horizontal') {
      lockupTypeInput = rawLockup;
    }
    fontFamilyInput = (formData.get('fontFamily') as LogoFontFamily) || undefined;
    packagingTypeInput = (formData.get('packagingType') as string) || undefined;
    productLabelInput = (formData.get('productLabel') as string) || undefined;
    presentationStyleInput = (formData.get('presentationStyle') as MockupPresentationStyle) || undefined;
    posterStyleInput = (formData.get('posterStyle') as PosterStyle) || undefined;
    productNameInput = (formData.get('productName') as string) || undefined;
    titleTextInput = (formData.get('titleText') as string) || undefined;
    subTextInput = (formData.get('subText') as string) || undefined;
    visualStyleInput = (formData.get('visualStyle') as string) || undefined;
    colorPaletteInput = (formData.get('colorPalette') as string) || undefined;
    focalSubjectInput = (formData.get('focalSubject') as string) || undefined;

    const file = formData.get('image');
    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const arrayBuf = await (file as Blob).arrayBuffer();
      imageBuffer = Buffer.from(arrayBuf);
    }
  } else {
    const body = (await request.json().catch(() => ({}))) as GenerateRequestBody;
    if (body.featureType) featureType = body.featureType;
    prompt = body.prompt || '';
    if (body.qualityTier === 'standard' || body.qualityTier === 'high') {
      requestedQualityTier = body.qualityTier;
    } else if (body.options?.qualityTier === 'standard' || body.options?.qualityTier === 'high') {
      requestedQualityTier = body.options.qualityTier;
    }
    if (body.options?.size) sizeRatio = body.options.size;
    if (body.image) {
      const cleanB64 = body.image.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(cleanB64, 'base64');
    }
    isTesting = Boolean(body.isTesting);
    explicitStoreId = body.storeId;
    storeNameInput = body.storeName;
    categoryInput = body.category;
    businessCategoryInput = body.businessCategory;
    conceptTypeInput = body.conceptType;
    logoTextInput = body.logoText;
    lockupTypeInput = body.lockupType;
    fontFamilyInput = body.fontFamily;
    packagingTypeInput = body.packagingType;
    productLabelInput = body.productLabel;
    presentationStyleInput = body.presentationStyle;
    posterStyleInput = body.posterStyle;
    productNameInput = body.productName;
    titleTextInput = body.titleText;
    subTextInput = body.subText;
    visualStyleInput = body.visualStyle;
    colorPaletteInput = Array.isArray(body.colorPalette) ? body.colorPalette.join(', ') : body.colorPalette;
    focalSubjectInput = body.focalSubject;
  }

  return {
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
  };
}

export async function rollbackAiCredits(tenantId: string, credits: number): Promise<void> {
  try {
    await db
      .update(tenantAiCredits)
      .set({
        balance: sql`${tenantAiCredits.balance} + ${credits}`,
        totalUsed: sql`${tenantAiCredits.totalUsed} - ${credits}`,
        updatedAt: new Date(),
      })
      .where(eq(tenantAiCredits.tenantId, tenantId));
    // eslint-disable-next-line no-console
    console.info(`[AI_CREDIT_COMPENSATION] Restored ${credits} credits for store ${tenantId}`);
  } catch (rollbackError: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[AI_CREDIT_COMPENSATION_FAILED] Failed to restore credits:`, rollbackError);
  }
}

export function handleGenerateError(error: unknown, currentPhase: AiPhase): never {
  const errObj = error as Record<string, unknown>;
  const rawMessage = error instanceof Error ? error.message : String(error);
  const isTimeout =
    (error instanceof Error && error.name === 'APIConnectionTimeoutError') ||
    (typeof error === 'object' && error !== null && errObj.name === 'APIConnectionTimeoutError') ||
    rawMessage.toLowerCase().includes('request timed out') ||
    rawMessage.toLowerCase().includes('apiconnectiontimeouterror');

  const respStatus = (errObj?.response as Record<string, unknown>)?.status as number | undefined;
  const status =
    typeof errObj?.status === 'number'
      ? errObj.status
      : typeof errObj?.statusCode === 'number'
        ? errObj.statusCode
        : respStatus || (error instanceof AppError ? error.status : isTimeout ? 504 : 500);

  // eslint-disable-next-line no-console
  console.error(`[AI_GENERATE_ERROR][Phase: ${currentPhase}]`, {
    phase: currentPhase,
    message: rawMessage,
    status,
    stack: error instanceof Error ? error.stack : undefined,
  });

  if (error instanceof AppError) throw error;
  throw new AppError(
    isTimeout
      ? 'Gagal memproses generasi AI: Batas waktu pembuatan visual terlampaui. Saldo kredit toko telah dikembalikan.'
      : `Gagal memproses generasi AI: ${rawMessage}`,
    status >= 400 && status < 600 ? status : 500
  );
}
