import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';
import { db } from '@/lib/db/client';
import {
  getAiMonitoringSummary,
  getAiRecentLogs,
  getAiDepositHistory,
  getAiMonitoringDashboardData,
} from '@/services/ai/monitoring.service';

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

      const result = await getAiMonitoringDashboardData();

      expect(result.summary.totalExecutions).toBe(5);
      expect(result.summary.successRate).toBe(100);
      expect(result.summary.remainingTokens).toBeGreaterThan(0);
      expect(result.recentLogs).toEqual([]);
      expect(result.depositHistory).toEqual([]);
    });
  });
});
