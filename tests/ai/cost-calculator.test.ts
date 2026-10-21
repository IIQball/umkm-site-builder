import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';
import { db } from '@/db';
import {
  calculateCost,
  getActiveExchangeRate,
  DEFAULT_FALLBACK_EXCHANGE_RATE,
  DEFAULT_AI_MODEL,
  FLARE_AI_MODEL,
  SUNBURST_AI_MODEL,
  MODEL_TOKEN_PRICING,
  DALLE3_STANDARD_IMAGE_COST_USD,
  DALLE3_HD_IMAGE_COST_USD,
} from '@/services/ai/cost-calculator.service';

mock.module('@/db', () => ({
  db: {
    select: mock(),
  },
}));

describe('AI Cost Calculator Service (bun:test)', () => {
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    mockSelect.mockReset();
  });

  const setupExchangeRateMock = (records: Array<{ exchangeRate: unknown }> | Error) => {
    if (records instanceof Error) {
      mockSelect.mockReturnValue({
        from: () => ({
          orderBy: () => ({
            limit: () => Promise.reject(records),
          }),
        }),
      });
      return;
    }

    mockSelect.mockReturnValue({
      from: () => ({
        orderBy: () => ({
          limit: () => Promise.resolve(records),
        }),
      }),
    });
  };

  describe('getActiveExchangeRate', () => {
    it('returns the exchange rate from the latest deposit history row', async () => {
      setupExchangeRateMock([{ exchangeRate: 16550 }]);

      const rate = await getActiveExchangeRate();

      expect(rate).toBe(16550);
      expect(mockSelect).toHaveBeenCalled();
    });

    it('falls back to default 16000 when deposit history is empty', async () => {
      setupExchangeRateMock([]);

      const rate = await getActiveExchangeRate();

      expect(rate).toBe(DEFAULT_FALLBACK_EXCHANGE_RATE);
      expect(rate).toBe(16000);
    });

    it('falls back to default 16000 when exchangeRate in DB is non-positive (<= 0)', async () => {
      setupExchangeRateMock([{ exchangeRate: 0 }]);
      expect(await getActiveExchangeRate()).toBe(16000);

      setupExchangeRateMock([{ exchangeRate: -15000 }]);
      expect(await getActiveExchangeRate()).toBe(16000);
    });

    it('falls back to default 16000 when exchangeRate is non-numeric (null, string, NaN)', async () => {
      setupExchangeRateMock([{ exchangeRate: null }]);
      expect(await getActiveExchangeRate()).toBe(16000);

      setupExchangeRateMock([{ exchangeRate: 'invalid_number' }]);
      expect(await getActiveExchangeRate()).toBe(16000);

      setupExchangeRateMock([{ exchangeRate: Number.NaN }]);
      expect(await getActiveExchangeRate()).toBe(16000);
    });

    it('falls back to default 16000 when database throws an error', async () => {
      setupExchangeRateMock(new Error('DB connection failed'));

      const rate = await getActiveExchangeRate();

      expect(rate).toBe(16000);
    });
  });

  describe('calculateCost - Prompt Tokens + Flat DALL-E 3 Rates', () => {
    it('calculates USD and IDR costs accurately for gpt-image-2.5-sunburst ($0.080 flat + tokens)', async () => {
      setupExchangeRateMock([{ exchangeRate: 16500 }]);

      // Prompt token cost: 1000 * 0.000005 + 1000 * 0.000015 = 0.02 USD
      // Flat HD image cost: 0.08 USD
      // Total: 0.10 USD
      const result = await calculateCost(1000, 1000, SUNBURST_AI_MODEL);

      expect(result.promptTokenCostUsd).toBe(0.02);
      expect(result.flatImageCostUsd).toBe(DALLE3_HD_IMAGE_COST_USD);
      expect(result.costUsd).toBe(0.1);
      expect(result.exchangeRateUsed).toBe(16500);
      expect(result.costIdr).toBe(1650);
    });

    it('calculates USD and IDR costs accurately for gpt-image-2.5-flare ($0.040 flat + tokens)', async () => {
      setupExchangeRateMock([{ exchangeRate: 16500 }]);

      // Prompt token cost: 1000 * 0.0000025 + 1000 * 0.0000075 = 0.01 USD
      // Flat Standard image cost: 0.04 USD
      // Total: 0.05 USD
      const result = await calculateCost(1000, 1000, FLARE_AI_MODEL);

      expect(result.promptTokenCostUsd).toBe(0.01);
      expect(result.flatImageCostUsd).toBe(DALLE3_STANDARD_IMAGE_COST_USD);
      expect(result.costUsd).toBe(0.05);
      expect(result.exchangeRateUsed).toBe(16500);
      expect(result.costIdr).toBe(825);
    });

    it('accepts qualityTier directly as third parameter or fourth parameter', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const standardDirect = await calculateCost(0, 0, 'standard');
      expect(standardDirect.costUsd).toBe(0.04);
      expect(standardDirect.costIdr).toBe(640);

      const highDirect = await calculateCost(0, 0, 'high');
      expect(highDirect.costUsd).toBe(0.08);
      expect(highDirect.costIdr).toBe(1280);

      const combined = await calculateCost(1000, 1000, SUNBURST_AI_MODEL, 'standard');
      // 0.02 token + 0.04 standard flat = 0.06 USD
      expect(combined.costUsd).toBe(0.06);
      expect(combined.costIdr).toBe(960);
    });

    it('handles recraft-v3 model token pricing accurately with flat HD rate', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const result = await calculateCost(2000, 1000, 'recraft-v3');

      // 2000 * 0.000005 + 1000 * 0.000015 = 0.025 USD token + 0.08 flat = 0.105 USD
      expect(result.costUsd).toBe(0.105);
      expect(result.exchangeRateUsed).toBe(16000);
      expect(result.costIdr).toBe(1680);
    });

    it('falls back to DEFAULT_AI_MODEL pricing when unknown model is supplied', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const result = await calculateCost(1000, 1000, 'unsupported-model-v99');

      // 0.02 USD token + 0.08 flat = 0.10 USD
      expect(result.costUsd).toBe(0.1);
      expect(result.costIdr).toBe(1600);
    });

    it('handles extreme low exchange rate (Rp10.000)', async () => {
      setupExchangeRateMock([{ exchangeRate: 10000 }]);

      const result = await calculateCost(1500, 800, SUNBURST_AI_MODEL);
      // 0.0195 USD token + 0.08 flat = 0.0995 USD
      expect(result.costUsd).toBe(0.0995);
      expect(result.exchangeRateUsed).toBe(10000);
      expect(result.costIdr).toBe(995);
    });

    it('handles extreme high exchange rate (Rp25.000)', async () => {
      setupExchangeRateMock([{ exchangeRate: 25000 }]);

      const result = await calculateCost(1500, 800, SUNBURST_AI_MODEL);
      // 0.0995 USD * 25000 = 2487.5 -> Math.round = 2488 IDR
      expect(result.costUsd).toBe(0.0995);
      expect(result.exchangeRateUsed).toBe(25000);
      expect(result.costIdr).toBe(2488);
    });

    it('handles extreme boundary exchange rate (Rp20.000)', async () => {
      setupExchangeRateMock([{ exchangeRate: 20000 }]);

      const result = await calculateCost(1000, 1000, FLARE_AI_MODEL);
      // 0.05 USD * 20000 = 1000 IDR
      expect(result.costUsd).toBe(0.05);
      expect(result.exchangeRateUsed).toBe(20000);
      expect(result.costIdr).toBe(1000);
    });

    it('handles micro-token rounding edge cases (1 token prompt)', async () => {
      setupExchangeRateMock([{ exchangeRate: 16500 }]);

      const result = await calculateCost(1, 0, FLARE_AI_MODEL);

      // 0.0000025 + 0.04 = 0.040003 USD
      expect(result.costUsd).toBe(0.040003);
      expect(result.exchangeRateUsed).toBe(16500);
      // 0.040003 * 16500 = 660.0495 -> Math.round = 660 IDR
      expect(result.costIdr).toBe(660);
    });

    it('handles very small decimal tokens under high exchange rate without precision loss', async () => {
      setupExchangeRateMock([{ exchangeRate: 25000 }]);

      const result = await calculateCost(5, 0, SUNBURST_AI_MODEL);

      // 0.000025 + 0.08 = 0.080025 USD
      expect(result.costUsd).toBe(0.080025);
      // 0.080025 * 25000 = 2000.625 -> Math.round = 2001 IDR
      expect(result.costIdr).toBe(2001);
    });

    it('uses fallback 16000 when deposit table is empty and handles zero tokens', async () => {
      setupExchangeRateMock([]);

      const result = await calculateCost(0, 0);

      expect(result.costUsd).toBe(0.08);
      expect(result.costIdr).toBe(1280);
      expect(result.exchangeRateUsed).toBe(16000);
    });

    it('handles negative or invalid token inputs by clamping to zero', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const result = await calculateCost(-500, Number.NaN);

      expect(result.costUsd).toBe(0.08);
      expect(result.costIdr).toBe(1280);
      expect(result.exchangeRateUsed).toBe(16000);
    });

    it('handles undefined or null token inputs safely', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const result = await calculateCost(undefined as unknown as number, null as unknown as number);

      expect(result.costUsd).toBe(0.08);
      expect(result.costIdr).toBe(1280);
      expect(result.exchangeRateUsed).toBe(16000);
    });

    it('ensures token pricing constants are defined with positive values for all supported models', () => {
      const sunburst = MODEL_TOKEN_PRICING[SUNBURST_AI_MODEL];
      expect(sunburst).toBeDefined();
      expect(sunburst.inputCostPerToken).toBeGreaterThan(0);
      expect(sunburst.outputCostPerToken).toBeGreaterThan(0);

      const flare = MODEL_TOKEN_PRICING[FLARE_AI_MODEL];
      expect(flare).toBeDefined();
      expect(flare.inputCostPerToken).toBeGreaterThan(0);
      expect(flare.outputCostPerToken).toBeGreaterThan(0);

      expect(DALLE3_STANDARD_IMAGE_COST_USD).toBe(0.04);
      expect(DALLE3_HD_IMAGE_COST_USD).toBe(0.08);
      expect(DEFAULT_AI_MODEL).toBe('gpt-image-2.5-sunburst');
    });
  });
});
