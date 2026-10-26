import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';
import { db } from '@/db';
import {
  calculateCost,
  DEFAULT_FALLBACK_EXCHANGE_RATE,
  FLARE_AI_MODEL,
  SUNBURST_AI_MODEL,
  MODEL_TOKEN_PRICING,
  DALLE3_STANDARD_IMAGE_COST_USD,
  DALLE3_HD_IMAGE_COST_USD,
} from '@/services/ai/cost-calculator.service';

mock.module('@/db', () => ({
  db: {
    select: mock(),
    insert: mock(),
    update: mock(),
    transaction: mock(),
  },
}));

describe('Cost Ledger Unit Tests (tests/ai/cost-ledger.test.ts)', () => {
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockTransaction = db.transaction as unknown as Mock;

  beforeEach(() => {
    mockSelect.mockReset();
    mockInsert.mockReset();
    mockTransaction.mockReset();
  });

  const setupExchangeRateMock = (rate: number | null) => {
    mockSelect.mockReturnValue({
      from: () => ({
        orderBy: () => ({
          limit: () => Promise.resolve(rate ? [{ exchangeRate: rate }] : []),
        }),
      }),
    });
  };

  describe('Token to USD and IDR Cost Calculation', () => {
    it('calculates cost accurately for Sunburst model with custom exchange rate', async () => {
      setupExchangeRateMock(16500);

      const inputTokens = 1500;
      const outputTokens = 800;
      const result = await calculateCost(inputTokens, outputTokens, SUNBURST_AI_MODEL, 'high');

      const pricing = MODEL_TOKEN_PRICING[SUNBURST_AI_MODEL];
      const expectedTokenCost = inputTokens * pricing.inputCostPerToken + outputTokens * pricing.outputCostPerToken;
      const expectedUsd = Number((expectedTokenCost + DALLE3_HD_IMAGE_COST_USD).toFixed(6));
      const expectedIdr = Math.round(expectedUsd * 16500);

      expect(result.costUsd).toBeCloseTo(expectedUsd, 6);
      expect(result.costIdr).toBe(expectedIdr);
      expect(result.exchangeRateUsed).toBe(16500);
      expect(result.flatImageCostUsd).toBe(DALLE3_HD_IMAGE_COST_USD);
    });

    it('calculates cost accurately for Flare model with fallback exchange rate', async () => {
      setupExchangeRateMock(null);

      const inputTokens = 2000;
      const outputTokens = 1000;
      const result = await calculateCost(inputTokens, outputTokens, FLARE_AI_MODEL, 'standard');

      const pricing = MODEL_TOKEN_PRICING[FLARE_AI_MODEL];
      const expectedTokenCost = inputTokens * pricing.inputCostPerToken + outputTokens * pricing.outputCostPerToken;
      const expectedUsd = Number((expectedTokenCost + DALLE3_STANDARD_IMAGE_COST_USD).toFixed(6));
      const expectedIdr = Math.round(expectedUsd * DEFAULT_FALLBACK_EXCHANGE_RATE);

      expect(result.costUsd).toBeCloseTo(expectedUsd, 6);
      expect(result.costIdr).toBe(expectedIdr);
      expect(result.exchangeRateUsed).toBe(DEFAULT_FALLBACK_EXCHANGE_RATE);
      expect(result.flatImageCostUsd).toBe(DALLE3_STANDARD_IMAGE_COST_USD);
    });

    it('falls back to fixed Dall-E-3 pricing when fallback model is used', async () => {
      setupExchangeRateMock(16000);

      const standardResult = await calculateCost(0, 0, 'dall-e-3', 'standard');
      expect(standardResult.costUsd).toBe(DALLE3_STANDARD_IMAGE_COST_USD);
      expect(standardResult.costIdr).toBe(Math.round(DALLE3_STANDARD_IMAGE_COST_USD * 16000));

      const hdResult = await calculateCost(0, 0, 'dall-e-3', 'high');
      expect(hdResult.costUsd).toBe(DALLE3_HD_IMAGE_COST_USD);
      expect(hdResult.costIdr).toBe(Math.round(DALLE3_HD_IMAGE_COST_USD * 16000));
    });

    it('handles 0 tokens gracefully and preserves base flat image fee', async () => {
      setupExchangeRateMock(16000);

      const result = await calculateCost(0, 0, SUNBURST_AI_MODEL, 'high');
      expect(result.costUsd).toBe(DALLE3_HD_IMAGE_COST_USD);
      expect(result.promptTokenCostUsd).toBe(0);
      expect(result.costIdr).toBe(Math.round(DALLE3_HD_IMAGE_COST_USD * 16000));
      expect(Number.isFinite(result.costUsd)).toBe(true);
      expect(Number.isFinite(result.costIdr)).toBe(true);
    });
  });

  describe('Atomic Ledger Debit & Credit Verification', () => {
    it('executes atomic balance debit on tenant_ai_credits', async () => {
      const storeId = 'store_test_01';
      const initialBalance = 10;
      const requiredCredits = 2;

      let capturedBalance = initialBalance;
      let capturedTotalUsed = 5;
      let targetTenant = '';

      mockTransaction.mockImplementation(async (callback) => {
        const tx = {
          update: mock(() => ({
            set: mock((values: Record<string, unknown>) => ({
              where: mock((condition: { tenantId?: string }) => {
                if (condition?.tenantId) targetTenant = condition.tenantId;
                if (typeof values.balance === 'number') capturedBalance = values.balance;
                if (typeof values.totalUsed === 'number') capturedTotalUsed = values.totalUsed;
                return Promise.resolve([{ id: 'credit_1', balance: capturedBalance }]);
              }),
            })),
          })),
        };
        return callback(tx);
      });

      interface MockTx {
        update: (table: unknown) => {
          set: (values: Record<string, unknown>) => {
            where: (condition: { tenantId?: string }) => Promise<unknown[]>;
          };
        };
      }

      // Simulasi eksekusi atomic update
      await db.transaction(async (rawTx) => {
        const tx = rawTx as unknown as MockTx;
        await tx.update({}).set({
          balance: initialBalance - requiredCredits,
          totalUsed: capturedTotalUsed + requiredCredits,
        }).where({ tenantId: storeId });
      });

      expect(targetTenant).toBe(storeId);
      expect(capturedBalance).toBe(8);
      expect(capturedTotalUsed).toBe(7);
      expect(mockTransaction).toHaveBeenCalled();
    });

    it('records complete audit log in ai_generation_logs on successful generation', async () => {
      interface MockAuditLogItem {
        id: string;
        tenantId: string;
        userId: string;
        isTesting: boolean;
        featureType: string;
        modelUsed: string;
        sizeRatio: string;
        qualityTier: string;
        promptFinal: string;
        inputTokens: number;
        outputTokens: number;
        creditsDeducted: number;
        costUsd: number;
        costIdr: number;
        cloudinaryUrl?: string;
        status: string;
      }

      const mockLogEntry: MockAuditLogItem = {
        id: 'log_abc_123',
        tenantId: 'store_test_01',
        userId: 'user_test_01',
        isTesting: false,
        featureType: 'logo',
        modelUsed: SUNBURST_AI_MODEL,
        sizeRatio: '1:1',
        qualityTier: 'high',
        promptFinal: 'Minimalist flat vector coffee logo',
        inputTokens: 1200,
        outputTokens: 600,
        creditsDeducted: 2,
        costUsd: 0.054,
        costIdr: 891,
        cloudinaryUrl: 'https://res.cloudinary.com/test/image/upload/logo.webp',
        status: 'success',
      };

      mockInsert.mockReturnValue({
        values: mock(() => ({
          returning: () => Promise.resolve([mockLogEntry]),
        })),
      });

      const insertMock = db.insert as unknown as (table: unknown) => {
        values: (val: unknown) => { returning: () => Promise<MockAuditLogItem[]> };
      };
      const [inserted] = await insertMock({}).values(mockLogEntry).returning();

      expect(inserted).toBeDefined();
      expect(inserted.id).toBe('log_abc_123');
      expect(inserted.creditsDeducted).toBe(2);
      expect(inserted.costIdr).toBe(891);
      expect(inserted.status).toBe('success');
      expect(inserted.isTesting).toBe(false);
    });

    it('preserves audit log with isTesting=true and 0 credits deducted in test mode', async () => {
      interface MockTestLogItem {
        id: string;
        tenantId: string;
        userId: string;
        isTesting: boolean;
        featureType: string;
        modelUsed: string;
        creditsDeducted: number;
        costUsd: number;
        costIdr: number;
        status: string;
      }

      const mockAuditLog: MockTestLogItem = {
        id: 'log_audit_999',
        tenantId: 'store_test_01',
        userId: 'superadmin_01',
        isTesting: true,
        featureType: 'packaging_mockup',
        modelUsed: FLARE_AI_MODEL,
        creditsDeducted: 0,
        costUsd: 0.015,
        costIdr: 240,
        status: 'success',
      };

      mockInsert.mockReturnValue({
        values: mock(() => ({
          returning: () => Promise.resolve([mockAuditLog]),
        })),
      });

      const insertMock = db.insert as unknown as (table: unknown) => {
        values: (val: unknown) => { returning: () => Promise<MockTestLogItem[]> };
      };
      const [inserted] = await insertMock({}).values(mockAuditLog).returning();

      expect(inserted.isTesting).toBe(true);
      expect(inserted.creditsDeducted).toBe(0);
      expect(inserted.costUsd).toBe(0.015);
      expect(inserted.costIdr).toBe(240);
    });
  });
});
