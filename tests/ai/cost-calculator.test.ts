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

    it('falls back to default 16200 when deposit history is empty', async () => {
      setupExchangeRateMock([]);

      const rate = await getActiveExchangeRate();

      expect(rate).toBe(DEFAULT_FALLBACK_EXCHANGE_RATE);
      expect(rate).toBe(16200);
    });

    it('falls back to default 16200 when exchangeRate in DB is non-positive (<= 0)', async () => {
      setupExchangeRateMock([{ exchangeRate: 0 }]);
      expect(await getActiveExchangeRate()).toBe(16200);

      setupExchangeRateMock([{ exchangeRate: -15000 }]);
      expect(await getActiveExchangeRate()).toBe(16200);
    });

    it('falls back to default 16200 when exchangeRate is non-numeric (null, string, NaN)', async () => {
      setupExchangeRateMock([{ exchangeRate: null }]);
      expect(await getActiveExchangeRate()).toBe(16200);

      setupExchangeRateMock([{ exchangeRate: 'invalid_number' }]);
      expect(await getActiveExchangeRate()).toBe(16200);

      setupExchangeRateMock([{ exchangeRate: Number.NaN }]);
      expect(await getActiveExchangeRate()).toBe(16200);
    });

    it('falls back to default 16200 when database throws an error', async () => {
      setupExchangeRateMock(new Error('DB connection failed'));

      const rate = await getActiveExchangeRate();

      expect(rate).toBe(16200);
    });
  });

  describe('calculateCost - Extreme Exchange Rates & Token Precision', () => {
    it('calculates USD and IDR costs accurately for gpt-image-2.5-sunburst with active rate', async () => {
      setupExchangeRateMock([{ exchangeRate: 16500 }]);

      const result = await calculateCost(1000, 1000, SUNBURST_AI_MODEL);

      expect(result.costUsd).toBe(0.02);
      expect(result.exchangeRateUsed).toBe(16500);
      expect(result.costIdr).toBe(330);
    });

    it('calculates USD and IDR costs accurately for gpt-image-2.5-flare with active rate', async () => {
      setupExchangeRateMock([{ exchangeRate: 16500 }]);

      const result = await calculateCost(1000, 1000, FLARE_AI_MODEL);

      expect(result.costUsd).toBe(0.01);
      expect(result.exchangeRateUsed).toBe(16500);
      expect(result.costIdr).toBe(165);
    });

    it('handles recraft-v3 model token pricing accurately', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const result = await calculateCost(2000, 1000, 'recraft-v3');

      // 2000 * 0.000005 + 1000 * 0.000015 = 0.01 + 0.015 = 0.025 USD
      expect(result.costUsd).toBe(0.025);
      expect(result.exchangeRateUsed).toBe(16000);
      expect(result.costIdr).toBe(400); // 0.025 * 16000 = 400
    });

    it('falls back to DEFAULT_AI_MODEL pricing when unknown model is supplied', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const result = await calculateCost(1000, 1000, 'unsupported-model-v99');

      // Uses sunburst pricing: 1000 * 0.000005 + 1000 * 0.000015 = 0.02 USD
      expect(result.costUsd).toBe(0.02);
      expect(result.costIdr).toBe(320);
    });

    it('handles extreme low exchange rate (Rp10.000)', async () => {
      setupExchangeRateMock([{ exchangeRate: 10000 }]);

      const result = await calculateCost(1500, 800, SUNBURST_AI_MODEL);
      // 1500 * 0.000005 + 800 * 0.000015 = 0.0075 + 0.012 = 0.0195 USD
      expect(result.costUsd).toBe(0.0195);
      expect(result.exchangeRateUsed).toBe(10000);
      expect(result.costIdr).toBe(195); // 0.0195 * 10000 = 195
    });

    it('handles extreme high exchange rate (Rp25.000)', async () => {
      setupExchangeRateMock([{ exchangeRate: 25000 }]);

      const result = await calculateCost(1500, 800, SUNBURST_AI_MODEL);
      // 0.0195 USD * 25000 = 487.5 -> Math.round = 488 IDR
      expect(result.costUsd).toBe(0.0195);
      expect(result.exchangeRateUsed).toBe(25000);
      expect(result.costIdr).toBe(488);
    });

    it('handles extreme boundary exchange rate (Rp20.000)', async () => {
      setupExchangeRateMock([{ exchangeRate: 20000 }]);

      const result = await calculateCost(1000, 1000, FLARE_AI_MODEL);
      // 0.01 USD * 20000 = 200 IDR
      expect(result.costUsd).toBe(0.01);
      expect(result.exchangeRateUsed).toBe(20000);
      expect(result.costIdr).toBe(200);
    });

    it('handles micro-token rounding edge cases (1 token prompt)', async () => {
      setupExchangeRateMock([{ exchangeRate: 16500 }]);

      // 1 input token on flare = 0.0000025 USD -> toFixed(6) = 0.000003 USD
      const result = await calculateCost(1, 0, FLARE_AI_MODEL);

      expect(result.costUsd).toBe(0.000003);
      expect(result.exchangeRateUsed).toBe(16500);
      // 0.000003 * 16500 = 0.0495 -> Math.round = 0
      expect(result.costIdr).toBe(0);
    });

    it('handles very small decimal tokens under high exchange rate without precision loss', async () => {
      setupExchangeRateMock([{ exchangeRate: 25000 }]);

      // 5 input tokens on sunburst: 5 * 0.000005 = 0.000025 USD
      const result = await calculateCost(5, 0, SUNBURST_AI_MODEL);

      expect(result.costUsd).toBe(0.000025);
      // 0.000025 * 25000 = 0.625 -> Math.round = 1 IDR
      expect(result.costIdr).toBe(1);
    });

    it('uses fallback 16200 when deposit table is empty and handles zero tokens', async () => {
      setupExchangeRateMock([]);

      const result = await calculateCost(0, 0);

      expect(result.costUsd).toBe(0);
      expect(result.costIdr).toBe(0);
      expect(result.exchangeRateUsed).toBe(16200);
    });

    it('handles negative or invalid token inputs by clamping to zero', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const result = await calculateCost(-500, Number.NaN);

      expect(result.costUsd).toBe(0);
      expect(result.costIdr).toBe(0);
      expect(result.exchangeRateUsed).toBe(16000);
    });

    it('handles undefined or null token inputs safely', async () => {
      setupExchangeRateMock([{ exchangeRate: 16000 }]);

      const result = await calculateCost(undefined as unknown as number, null as unknown as number);

      expect(result.costUsd).toBe(0);
      expect(result.costIdr).toBe(0);
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

      const recraft = MODEL_TOKEN_PRICING['recraft-v3'];
      expect(recraft).toBeDefined();
      expect(recraft.inputCostPerToken).toBeGreaterThan(0);
      expect(recraft.outputCostPerToken).toBeGreaterThan(0);

      expect(DEFAULT_AI_MODEL).toBe('gpt-image-2.5-sunburst');
    });
  });
});
