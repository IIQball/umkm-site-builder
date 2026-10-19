import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { db } from '@/lib/db/client';
import {
  getAiMonitoringSummary,
  getAiRecentLogs,
  getAiMonitoringDashboardData,
} from '@/services/ai/monitoring.service';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
  };
  return { db: mockDb };
});

describe('AI Monitoring Service', () => {
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAiMonitoringSummary', () => {
    it('aggregates AI generation logs correctly with numbers and success rate', async () => {
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([
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

      const result = await getAiMonitoringSummary();

      expect(result).toEqual({
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
      });
    });

    it('handles empty database gracefully with zero defaults', async () => {
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([
          {
            totalExecutions: 0,
            totalCostIdr: 0,
            totalCostUsd: 0,
            totalInputTokens: 0,
            totalOutputTokens: 0,
            successCount: 0,
            failedCount: 0,
            pendingCount: 0,
            processingCount: 0,
          },
        ]),
      });

      const result = await getAiMonitoringSummary();

      expect(result).toEqual({
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
      });
    });
  });

  describe('getAiRecentLogs', () => {
    it('retrieves and formats latest execution logs with joined store and user', async () => {
      const mockCreatedAt = new Date('2026-10-18T10:00:00.000Z');

      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([
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

  describe('getAiMonitoringDashboardData', () => {
    it('combines summary and recent logs into unified dashboard data', async () => {
      // Mock summary query
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockResolvedValue([
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

      // Mock recent logs query
      mockSelect.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        }),
      });

      const result = await getAiMonitoringDashboardData();

      expect(result.summary.totalExecutions).toBe(5);
      expect(result.summary.successRate).toBe(100);
      expect(result.recentLogs).toEqual([]);
    });
  });
});
