/**
 * AI Asset Generator Client API
 * Menghubungkan antarmuka merchant langsung ke endpoint POST /api/ai/generate
 */

import { formatAiErrorMessage } from '@/lib/errors/ai-error';
import { apiFetch } from '@/lib/api/parse-response';
import type { AiFeatureType, AiSizeRatio, AiQualityTier } from '@/types/ai';

export interface GenerateAiAssetRequest {
  featureType: AiFeatureType;
  prompt?: string;
  image?: string;
  storeId?: string;
  isTesting?: boolean;
  qualityTier?: AiQualityTier | 'standard' | 'high';
  sizeRatio?: AiSizeRatio | '1:1' | '2:3' | '1024x1024' | '1024x1536' | string;
  size?: '1024x1024' | '1024x1536';
  storeName?: string;
  category?: string;
  businessCategory?: string;
  conceptType?: string;
  logoText?: string;
  lockupType?: string;
  fontFamily?: string;
  packagingType?: string;
  productLabel?: string;
  presentationStyle?: string;
  posterStyle?: string;
  productName?: string;
  titleText?: string;
  subText?: string;
  visualStyle?: string;
  colorPalette?: string | string[];
  focalSubject?: string;
  options?: {
    quality?: 'medium' | 'high';
    qualityTier?: 'standard' | 'high';
    size?: '1024x1024' | '1024x1536';
  };
}

export interface GenerateAiAssetResponse {
  success: boolean;
  imageUrl: string;
  logId: string;
  modelUsed: string;
  remainingCredits: number;
  creditsDeducted: number;
  costUsd?: number;
  costIdr?: number;
  inputTokens?: number;
  outputTokens?: number;
  isTesting?: boolean;
  errorMessage?: string;
}

/**
 * Memanggil endpoint POST /api/ai/generate dan mengembalikan respon terformat.
 *
 * @param payload - Parameter konfigurasi pembuatan aset AI
 * @returns Respon hasil render gambar, URL Cloudinary, dan kuota tersisa
 * @throws Error dengan pesan ramah pengguna jika proses generate gagal
 */
export async function generateAiAssetClient(
  payload: GenerateAiAssetRequest
): Promise<GenerateAiAssetResponse> {
  const isVertical = payload.sizeRatio === '2:3' || payload.sizeRatio === '9:16';
  const resolvedSize = payload.size || (isVertical ? '1024x1536' : '1024x1024');

  const requestBody = {
    ...payload,
    qualityTier: payload.qualityTier || 'high',
    options: {
      size: resolvedSize,
      qualityTier: payload.qualityTier || 'high',
      ...(payload.options || {}),
    },
  };

  const parsed = await apiFetch<Record<string, unknown>>('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    timeoutMs: 0,
  });

  if (!parsed.success) {
    throw new Error(formatAiErrorMessage({ status: parsed.status, message: parsed.message }));
  }

  const data = (parsed.data || {}) as Partial<GenerateAiAssetResponse>;

  return {
    success: true,
    imageUrl: data.imageUrl || '',
    logId: data.logId || '',
    modelUsed: data.modelUsed || '',
    remainingCredits: data.remainingCredits ?? 0,
    creditsDeducted: data.creditsDeducted ?? 1,
    costUsd: data.costUsd,
    costIdr: data.costIdr,
    inputTokens: data.inputTokens,
    outputTokens: data.outputTokens,
    isTesting: data.isTesting,
  };
}
