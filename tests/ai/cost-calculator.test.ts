import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { db } from '@/db';
import {
  calculateCost,
  getActiveExchangeRate,
  DEFAULT_FALLBACK_EXCHANGE_RATE,
  MODEL_TOKEN_PRICING,
} from '@/services/ai/cost-calculator.service';

vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

describe('AI Cost Calculator Service', () => {
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getActiveExchangeRate', () => {
    it('returns the exchange rate from the latest deposit history row', async () => {
      const mockLimit = vi.fn().mockResolvedValue([{ exchangeRate: 16550 }]);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      mockSelect.mockReturnValue({ from: mockFrom });

      const rate = await getActiveExchangeRate();

      expect(rate).toBe(16550);
      expect(db.select).toHaveBeenCalled();
    });

    it('falls back to default 16200 when deposit history is empty', async () => {
      const mockLimit = vi.fn().mockResolvedValue([]);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      mockSelect.mockReturnValue({ from: mockFrom });

      const rate = await getActiveExchangeRate();

      expect(rate).toBe(DEFAULT_FALLBACK_EXCHANGE_RATE);
      expect(rate).toBe(16200);
    });

    it('falls back to default 16200 when database throws an error', async () => {
      const mockLimit = vi.fn().mockRejectedValue(new Error('DB connection failed'));
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      mockSelect.mockReturnValue({ from: mockFrom });

      const rate = await getActiveExchangeRate();

      expect(rate).toBe(16200);
    });
  });

  describe('calculateCost', () => {
    it('calculates USD and IDR costs accurately for gpt-image-2.5-sunburst with active rate', async () => {
      const mockLimit = vi.fn().mockResolvedValue([{ exchangeRate: 16500 }]);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      mockSelect.mockReturnValue({ from: mockFrom });

      const result = await calculateCost(1000, 1000, 'gpt-image-2.5-sunburst');

      expect(result.costUsd).toBe(0.02);
      expect(result.exchangeRateUsed).toBe(16500);
      expect(result.costIdr).toBe(330);
    });

    it('uses fallback 16200 when deposit table is empty and handles zero tokens', async () => {
      const mockLimit = vi.fn().mockResolvedValue([]);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      mockSelect.mockReturnValue({ from: mockFrom });

      const result = await calculateCost(0, 0);

      expect(result.costUsd).toBe(0);
      expect(result.costIdr).toBe(0);
      expect(result.exchangeRateUsed).toBe(16200);
    });

    it('handles negative or invalid token inputs by clamping to zero', async () => {
      const mockLimit = vi.fn().mockResolvedValue([{ exchangeRate: 16000 }]);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      mockSelect.mockReturnValue({ from: mockFrom });

      const result = await calculateCost(-500, Number.NaN);

      expect(result.costUsd).toBe(0);
      expect(result.costIdr).toBe(0);
      expect(result.exchangeRateUsed).toBe(16000);
    });

    it('calculates USD and IDR costs accurately for gpt-image-2.5-flare with active rate', async () => {
      const mockLimit = vi.fn().mockResolvedValue([{ exchangeRate: 16500 }]);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      mockSelect.mockReturnValue({ from: mockFrom });

      const result = await calculateCost(1000, 1000, 'gpt-image-2.5-flare');

      expect(result.costUsd).toBe(0.01);
      expect(result.exchangeRateUsed).toBe(16500);
      expect(result.costIdr).toBe(165);
    });

    it('ensures token pricing constants are defined with positive values for all supported models', () => {
      const sunburst = MODEL_TOKEN_PRICING['gpt-image-2.5-sunburst'];
      expect(sunburst).toBeDefined();
      expect(sunburst.inputCostPerToken).toBeGreaterThan(0);
      expect(sunburst.outputCostPerToken).toBeGreaterThan(0);

      const flare = MODEL_TOKEN_PRICING['gpt-image-2.5-flare'];
      expect(flare).toBeDefined();
      expect(flare.inputCostPerToken).toBeGreaterThan(0);
      expect(flare.outputCostPerToken).toBeGreaterThan(0);
    });
  });
});
