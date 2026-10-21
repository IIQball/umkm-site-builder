import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';
import { db } from '@/lib/db/client';
import {
  getAiMonitoringSummary,
  getAiRecentLogs,
  getAiDepositHistory,
  getAiMonitoringDashboardData,
  getAiFeatureDistribution,
  getAiLogs,
} from '@/services/ai/monitoring.service';

const vi = { fn: mock };

mock.module('@/lib/db/client', () => ({
  db: {
    select: mock(),
  },
}));

describe('AI Monitoring Service (bun:test)', () => {
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    mockSelect.mockReset();
  });

  describe('getAiMonitoringSummary', () => {
    it('aggregates AI generation logs correctly with numbers and success rate', async () => {
      // 1. Logs aggregation
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([
          {
            totalExecutions: 10,
            totalCostIdr: 6500,
            totalCostUsd: 0.4,
            totalInputTokens: 1200,
            totalOutputTokens: 4500,
            successCount: 8,
            failedCount: 2,
            pendingCount: 0,
            processingCount: 0,
          },
        ]),
      });

      // 2. Deposit sum aggregation
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([
          {
            totalDepositUsd: 10,
            totalDepositIdr: 165000,
          },
        ]),
      });

      // 3. Latest exchange rate
      mockSelect.mockReturnValueOnce({
        from: () => ({
          orderBy: () => ({
            limit: () => Promise.resolve([{ exchangeRate: 16500 }]),
          }),
        }),
      });

      const result = await getAiMonitoringSummary();

      expect(result).toMatchObject({
        totalExecutions: 10,
        totalCostIdr: 6500,
        totalCostUsd: 0.4,
        totalInputTokens: 1200,
        totalOutputTokens: 4500,
        totalTokens: 5700,
        statusCounts: {
          success: 8,
          failed: 2,
          pending: 0,
          processing: 0,
        },
        successRate: 80,
        totalDepositUsd: 10,
        totalDepositIdr: 165000,
        remainingDepositUsd: 9.6,
        remainingDepositIdr: 158400,
        remainingTokens: 960000,
        activeExchangeRate: 16500,
      });
    });

    it('handles empty database gracefully with zero defaults', async () => {
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([{
          totalExecutions: 0, totalCostIdr: 0, totalCostUsd: 0, totalInputTokens: 0, totalOutputTokens: 0,
          successCount: 0, failedCount: 0, pendingCount: 0, processingCount: 0,
        }]),
      });

      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([{ totalDepositUsd: 0, totalDepositIdr: 0 }]),
      });

      mockSelect.mockReturnValueOnce({
        from: () => ({ orderBy: () => ({ limit: () => Promise.resolve([]) }) }),
      });

      const result = await getAiMonitoringSummary();

      expect(result).toMatchObject({
        totalExecutions: 0,
        totalCostIdr: 0,
        totalCostUsd: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalTokens: 0,
        statusCounts: {
          success: 0,
          failed: 0,
          pending: 0,
          processing: 0,
        },
        successRate: 0,
        totalDepositUsd: 0,
        totalDepositIdr: 0,
        remainingDepositUsd: 0,
        remainingDepositIdr: 0,
        remainingTokens: 0,
        activeExchangeRate: 16000,
      });
    });
  });

  describe('getAiRecentLogs', () => {
    it('retrieves and formats latest execution logs with joined store and user', async () => {
      const mockCreatedAt = new Date('2026-10-18T10:00:00.000Z');

      mockSelect.mockReturnValueOnce({
        from: () => ({
          leftJoin: () => ({
            leftJoin: () => ({
              orderBy: () => ({
                limit: () =>
                  Promise.resolve([
                    {
                      id: 'log_001',
                      featureType: 'logo',
                      modelUsed: 'gpt-image-2.5-sunburst',
                      status: 'success',
                      costIdr: 650,
                      costUsd: 0.04,
                      inputTokens: 120,
                      outputTokens: 450,
                      creditsDeducted: 1,
                      errorMessage: null,
                      createdAt: mockCreatedAt,
                      storeName: 'Kopi Kenangan',
                      userName: 'John Doe',
                    },
                  ]),
              }),
            }),
          }),
        }),
      });

      const result = await getAiRecentLogs(5);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'log_001',
        featureType: 'logo',
        modelUsed: 'gpt-image-2.5-sunburst',
        status: 'success',
        costIdr: 650,
        costUsd: 0.04,
        inputTokens: 120,
        outputTokens: 450,
        creditsDeducted: 1,
        errorMessage: null,
        createdAt: mockCreatedAt.toISOString(),
        storeName: 'Kopi Kenangan',
        userName: 'John Doe',
        isTesting: false,
        sizeRatio: undefined,
        qualityTier: undefined,
      });
    });
  });

  describe('getAiDepositHistory', () => {
    it('retrieves and formats deposit history with user creator info', async () => {
      const mockCreatedAt = new Date('2026-10-19T08:00:00.000Z');

      mockSelect.mockReturnValueOnce({
        from: () => ({
          leftJoin: () => ({
            orderBy: () => ({
              limit: () =>
                Promise.resolve([
                  {
                    id: 'dep_001',
                    amountUsd: 10,
                    amountIdr: 165000,
                    exchangeRate: 16500,
                    description: 'Top up AI',
                    createdAt: mockCreatedAt,
                    createdByName: 'Super Admin',
                    createdByEmail: 'admin@platform.com',
                  },
                ]),
            }),
          }),
        }),
      });

      const result = await getAiDepositHistory(10);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'dep_001',
        amountUsd: 10,
        amountIdr: 165000,
        exchangeRate: 16500,
        description: 'Top up AI',
        createdAt: mockCreatedAt.toISOString(),
        createdByName: 'Super Admin',
        createdByEmail: 'admin@platform.com',
      });
    });
  });

  describe('getAiMonitoringDashboardData', () => {
    it('combines summary, recent logs, and deposit history into unified dashboard data', async () => {
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([
          {
            totalExecutions: 5,
            totalCostIdr: 3250,
            totalCostUsd: 0.2,
            totalInputTokens: 600,
            totalOutputTokens: 2250,
            successCount: 5,
            failedCount: 0,
            pendingCount: 0,
            processingCount: 0,
          },
        ]),
      });
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([
          {
            totalDepositUsd: 10,
            totalDepositIdr: 165000,
          },
        ]),
      });
      mockSelect.mockReturnValueOnce({
        from: () => ({
          orderBy: () => ({
            limit: () => Promise.resolve([{ exchangeRate: 16500 }]),
          }),
        }),
      });

      mockSelect.mockReturnValueOnce({
        from: () => ({
          leftJoin: () => ({
            leftJoin: () => ({
              orderBy: () => ({
                limit: () => Promise.resolve([]),
              }),
            }),
          }),
        }),
      });

      mockSelect.mockReturnValueOnce({
        from: () => ({
          leftJoin: () => ({
            orderBy: () => ({
              limit: () => Promise.resolve([]),
            }),
          }),
        }),
      });

      mockSelect.mockReturnValueOnce({
        from: () => ({
          groupBy: () => Promise.resolve([]),
        }),
      });

      const result = await getAiMonitoringDashboardData();

      expect(result.summary.totalExecutions).toBe(5);
      expect(result.summary.successRate).toBe(100);
      expect(result.summary.remainingTokens).toBeGreaterThan(0);
      expect(result.recentLogs).toEqual([]);
      expect(result.depositHistory).toEqual([]);
      expect(result.featureDistribution).toBeDefined();
      expect(result.featureDistribution?.distribution).toHaveLength(3);
    });
  });

  describe('getAiFeatureDistribution', () => {
    it('aggregates total requests, nominal rupiah, and percentages correctly', async () => {
      mockSelect.mockReturnValueOnce({
        from: () => ({
          groupBy: () =>
            Promise.resolve([
              {
                featureType: 'logo',
                totalRequests: 50,
                totalCostIdr: 50000,
                totalCostUsd: 3.0,
                successRequests: 48,
              },
              {
                featureType: 'packaging_mockup',
                totalRequests: 30,
                totalCostIdr: 60000,
                totalCostUsd: 3.6,
                successRequests: 28,
              },
              {
                featureType: 'product_poster',
                totalRequests: 20,
                totalCostIdr: 40000,
                totalCostUsd: 2.4,
                successRequests: 20,
              },
            ]),
        }),
      });

      const res = await getAiFeatureDistribution();

      expect(res.totalRequests).toBe(100);
      expect(res.totalCostIdr).toBe(150000);
      expect(res.totalCostUsd).toBe(9.0);
      expect(res.distribution).toHaveLength(3);

      const [logo, packaging, poster] = res.distribution;
      expect(logo.featureType).toBe('logo');
      expect(logo.label).toBe('Logo UMKM');
      expect(logo.totalRequests).toBe(50);
      expect(logo.requestPercentage).toBe(50.0);
      expect(logo.totalCostIdr).toBe(50000);
      expect(logo.costPercentage).toBe(33.3);

      expect(packaging.featureType).toBe('packaging_mockup');
      expect(packaging.label).toBe('Kemasan Produk');
      expect(packaging.totalRequests).toBe(30);
      expect(packaging.requestPercentage).toBe(30.0);
      expect(packaging.totalCostIdr).toBe(60000);
      expect(packaging.costPercentage).toBe(40.0);

      expect(poster.featureType).toBe('product_poster');
      expect(poster.label).toBe('Poster Produk');
      expect(poster.totalRequests).toBe(20);
      expect(poster.requestPercentage).toBe(20.0);
      expect(poster.totalCostIdr).toBe(40000);
      expect(poster.costPercentage).toBe(26.7);
    });

    it('handles empty database with 0 values for all 3 features', async () => {
      mockSelect.mockReturnValueOnce({
        from: () => ({
          groupBy: () => Promise.resolve([]),
        }),
      });

      const res = await getAiFeatureDistribution();

      expect(res.totalRequests).toBe(0);
      expect(res.totalCostIdr).toBe(0);
      expect(res.distribution).toHaveLength(3);
      for (const item of res.distribution) {
        expect(item.totalRequests).toBe(0);
        expect(item.requestPercentage).toBe(0);
        expect(item.totalCostIdr).toBe(0);
        expect(item.costPercentage).toBe(0);
      }
    });

    it('applies period filtering conditions when year and month are supplied', async () => {
      let whereCalled = false;
      mockSelect.mockReturnValueOnce({
        from: () => ({
          where: () => {
            whereCalled = true;
            return {
              groupBy: () => Promise.resolve([]),
            };
          },
        }),
      });

      const res = await getAiFeatureDistribution({ year: 2026, month: 10 });

      expect(whereCalled).toBe(true);
      expect(res.totalRequests).toBe(0);
    });
  });

  describe('getAiLogs', () => {
    it('retrieves paginated AI logs with isTesting filter and computes pagination', async () => {
      const mockDate = new Date('2026-10-20T10:00:00.000Z');

      // Count query mock
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([{ total: 15 }]),
            }),
          }),
        }),
      });

      // Data query mock
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([
                      {
                        id: 'log_test_01',
                        isTesting: true,
                        featureType: 'logo',
                        modelUsed: 'gpt-image-2.5-sunburst',
                        sizeRatio: '1:1',
                        qualityTier: 'standard',
                        promptFinal: 'Logo Kopi Kenangan',
                        inputTokens: 100,
                        outputTokens: 400,
                        creditsDeducted: 1,
                        costUsd: 0.04,
                        costIdr: 650,
                        cloudinaryUrl: 'https://cloudinary.com/test.png',
                        status: 'success',
                        errorMessage: null,
                        createdAt: mockDate,
                        storeName: 'Kopi Kenangan',
                        userName: 'Tester Admin',
                      },
                    ]),
                  }),
                }),
              }),
            }),
          }),
        }),
      });

      const result = await getAiLogs({
        isTesting: true,
        page: 1,
        limit: 10,
      });

      expect(result.pagination).toEqual({
        total: 15,
        page: 1,
        limit: 10,
        totalPages: 2,
      });
      expect(result.logs).toHaveLength(1);
      expect(result.logs[0].id).toBe('log_test_01');
      expect(result.logs[0].isTesting).toBe(true);
      expect(result.logs[0].sizeRatio).toBe('1:1');
      expect(result.logs[0].qualityTier).toBe('standard');
      expect(result.logs[0].costIdr).toBe(650);
    });
  });
});

