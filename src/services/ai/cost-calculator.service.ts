import { db } from '@/db';
import { aiDepositHistory } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const DEFAULT_FALLBACK_EXCHANGE_RATE = 16000;
export const DEFAULT_AI_MODEL = 'gpt-image-2.5-sunburst';
export const FLARE_AI_MODEL = 'gpt-image-2.5-flare';
export const SUNBURST_AI_MODEL = 'gpt-image-2.5-sunburst';

/**
 * Official OpenAI DALL-E 3 image generation flat rates:
 * Standard Quality ('standard' / 'gpt-image-2.5-flare'): flat $0.040 USD
 * HD Studio Quality ('high' / 'gpt-image-2.5-sunburst'): flat $0.080 USD
 */
export const DALLE3_STANDARD_IMAGE_COST_USD = 0.04;
export const DALLE3_HD_IMAGE_COST_USD = 0.08;

export const QUALITY_TIER_IMAGE_COSTS: Record<'standard' | 'high', number> = {
  standard: DALLE3_STANDARD_IMAGE_COST_USD,
  high: DALLE3_HD_IMAGE_COST_USD,
};

export const MODEL_IMAGE_COSTS: Record<string, number> = {
  'gpt-image-2.5-flare': DALLE3_STANDARD_IMAGE_COST_USD,
  'gpt-image-2.5-sunburst': DALLE3_HD_IMAGE_COST_USD,
  'dall-e-3': DALLE3_HD_IMAGE_COST_USD,
  'recraft-v3': DALLE3_HD_IMAGE_COST_USD,
};

export interface ModelPricing {
  inputCostPerToken: number;
  outputCostPerToken: number;
}

/**
 * Token pricing in USD per token.
 * gpt-image-2.5-sunburst: $0.005/1K input ($0.000005/token), $0.015/1K output ($0.000015/token).
 * gpt-image-2.5-flare: $0.0025/1K input ($0.0000025/token), $0.0075/1K output ($0.0000075/token).
 */
export const MODEL_TOKEN_PRICING: Record<string, ModelPricing> = {
  'gpt-image-2.5-sunburst': {
    inputCostPerToken: 0.000005,
    outputCostPerToken: 0.000015,
  },
  'gpt-image-2.5-flare': {
    inputCostPerToken: 0.0000025,
    outputCostPerToken: 0.0000075,
  },
  'recraft-v3': {
    inputCostPerToken: 0.000005,
    outputCostPerToken: 0.000015,
  },
};

export interface CostCalculationResult {
  costUsd: number;
  costIdr: number;
  exchangeRateUsed: number;
  promptTokenCostUsd: number;
  flatImageCostUsd: number;
}

/**
 * Retrieves the latest active USD to IDR exchange rate from ai_deposit_history.
 * Falls back to 16000 if the deposit table is empty.
 * Never calls external APIs live during generation.
 */
export async function getActiveExchangeRate(): Promise<number> {
  try {
    const [latest] = await db
      .select({ exchangeRate: aiDepositHistory.exchangeRate })
      .from(aiDepositHistory)
      .orderBy(desc(aiDepositHistory.createdAt))
      .limit(1);

    if (latest && typeof latest.exchangeRate === 'number' && latest.exchangeRate > 0) {
      return latest.exchangeRate;
    }
  } catch {
    // In case of query or connection error, return fallback rate
  }

  return DEFAULT_FALLBACK_EXCHANGE_RATE;
}

/**
 * Calculates real USD and IDR execution cost from token consumption PLUS flat DALL-E 3 image generation cost.
 *
 * Formula:
 * totalCostUsd = promptTokenCost + flatImageCost
 * totalCostIdr = Math.round(totalCostUsd * exchangeRate)
 *
 * @param inputTokens - Count of prompt tokens
 * @param outputTokens - Count of completion / image tokens
 * @param modelOrQuality - AI model name or quality tier ('standard' | 'high')
 * @param explicitQualityTier - Optional explicit quality tier when modelOrQuality is a model name
 * @returns Object with costUsd, costIdr, exchangeRateUsed, promptTokenCostUsd, and flatImageCostUsd
 */
export async function calculateCost(
  inputTokens: number,
  outputTokens: number,
  modelOrQuality: string = DEFAULT_AI_MODEL,
  explicitQualityTier?: 'standard' | 'high'
): Promise<CostCalculationResult> {
  const safeInputTokens = Math.max(0, Number(inputTokens) || 0);
  const safeOutputTokens = Math.max(0, Number(outputTokens) || 0);

  let model = DEFAULT_AI_MODEL;
  let qualityTier: 'standard' | 'high' = 'high';

  if (modelOrQuality === 'standard' || modelOrQuality === 'high') {
    qualityTier = modelOrQuality;
    model = qualityTier === 'standard' ? FLARE_AI_MODEL : SUNBURST_AI_MODEL;
  } else {
    model = modelOrQuality || DEFAULT_AI_MODEL;
    if (explicitQualityTier) {
      qualityTier = explicitQualityTier;
    } else {
      qualityTier = model === FLARE_AI_MODEL ? 'standard' : 'high';
    }
  }

  const rates = MODEL_TOKEN_PRICING[model] ?? MODEL_TOKEN_PRICING[DEFAULT_AI_MODEL];
  const promptTokenCost =
    safeInputTokens * rates.inputCostPerToken + safeOutputTokens * rates.outputCostPerToken;

  const flatImageCost = QUALITY_TIER_IMAGE_COSTS[qualityTier] ?? DALLE3_HD_IMAGE_COST_USD;

  const rawCostUsd = promptTokenCost + flatImageCost;
  const costUsd = Number(rawCostUsd.toFixed(6));
  const exchangeRateUsed = await getActiveExchangeRate();
  const costIdr = Math.round(costUsd * exchangeRateUsed);

  return {
    costUsd,
    costIdr,
    exchangeRateUsed,
    promptTokenCostUsd: Number(promptTokenCost.toFixed(6)),
    flatImageCostUsd: flatImageCost,
  };
}
