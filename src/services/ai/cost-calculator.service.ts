import { db } from '@/db';
import { aiDepositHistory } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const DEFAULT_FALLBACK_EXCHANGE_RATE = 16200;
export const DEFAULT_AI_MODEL = 'gpt-image-2.5-sunburst';
export const FLARE_AI_MODEL = 'gpt-image-2.5-flare';
export const SUNBURST_AI_MODEL = 'gpt-image-2.5-sunburst';

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
}

/**
 * Retrieves the latest active USD to IDR exchange rate from ai_deposit_history.
 * Falls back to 16200 if the deposit table is empty.
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
 * Calculates real USD and IDR execution cost from token consumption.
 *
 * @param inputTokens - Count of prompt tokens
 * @param outputTokens - Count of completion / image tokens
 * @param model - AI model name (defaults to gpt-image-2.5-sunburst)
 * @returns Object with costUsd, costIdr, and exchangeRateUsed
 */
export async function calculateCost(
  inputTokens: number,
  outputTokens: number,
  model: string = DEFAULT_AI_MODEL
): Promise<CostCalculationResult> {
  const safeInputTokens = Math.max(0, Number(inputTokens) || 0);
  const safeOutputTokens = Math.max(0, Number(outputTokens) || 0);

  const rates = MODEL_TOKEN_PRICING[model] ?? MODEL_TOKEN_PRICING[DEFAULT_AI_MODEL];
  const rawCostUsd =
    safeInputTokens * rates.inputCostPerToken + safeOutputTokens * rates.outputCostPerToken;

  const costUsd = Number(rawCostUsd.toFixed(6));
  const exchangeRateUsed = await getActiveExchangeRate();
  const costIdr = Math.round(costUsd * exchangeRateUsed);

  return {
    costUsd,
    costIdr,
    exchangeRateUsed,
  };
}
