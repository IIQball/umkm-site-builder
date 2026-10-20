import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { db } from '@/lib/db/client';
import {
  getAiMonitoringSummary,
  getAiRecentLogs,
  getAiMonitoringDashboardData,
  getAiLogs,
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
        isTesting: false,
        sizeRatio: undefined,
        qualityTier: undefined,
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

