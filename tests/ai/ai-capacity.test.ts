import { describe, it, expect, mock, beforeEach, type Mock } from 'bun:test';
import { db } from '@/db';
import { getPlatformAiCapacity, notifySuperadminsAiDepleted } from '@/services/ai/ai-capacity.service';

mock.module('@/db', () => ({
  db: {
    select: mock(),
    insert: mock(),
  },
}));

describe('AI Platform Capacity & Depletion Protection (bun:test)', () => {
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;

  beforeEach(() => {
    mockSelect.mockReset();
    mockInsert.mockReset();
  });

  describe('getPlatformAiCapacity', () => {
    it('calculates available credits and remaining USD deposit correctly', async () => {
      // 1. Deposit sum ($10.00 USD)
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([{ totalDepositUsd: 10 }]),
      });

      // 2. Logs cost sum ($2.00 USD)
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([{ totalCostUsd: 2 }]),
      });

      // 3. Exchange rate from cost-calculator
      mockSelect.mockReturnValueOnce({
        from: () => ({
          orderBy: () => ({
            limit: () => Promise.resolve([{ exchangeRate: 16000 }]),
          }),
        }),
      });

      const capacity = await getPlatformAiCapacity();

      expect(capacity.remainingDepositUsd).toBe(8); // $10 - $2 = $8
      expect(capacity.remainingDepositIdr).toBe(128000); // 8 * 16000
      expect(capacity.availableCredits).toBe(200); // $8 / 0.04 = 200 credits
      expect(capacity.isDepleted).toBe(false);
    });

    it('identifies depleted state when cost exceeds deposit', async () => {
      // Deposit $5.00
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([{ totalDepositUsd: 5 }]),
      });

      // Cost $5.50
      mockSelect.mockReturnValueOnce({
        from: mock().mockResolvedValue([{ totalCostUsd: 5.5 }]),
      });

      // Exchange rate
      mockSelect.mockReturnValueOnce({
        from: () => ({
          orderBy: () => ({
            limit: () => Promise.resolve([{ exchangeRate: 16000 }]),
          }),
        }),
      });

      const capacity = await getPlatformAiCapacity();

      expect(capacity.remainingDepositUsd).toBe(0);
      expect(capacity.availableCredits).toBe(0);
      expect(capacity.isDepleted).toBe(true);
    });
  });

  describe('notifySuperadminsAiDepleted', () => {
    it('sends critical notification to all superadmins when pool is depleted', async () => {
      // 1. Select superadmins
      mockSelect.mockReturnValueOnce({
        from: () => ({
          where: () => Promise.resolve([{ id: 'sa_01' }, { id: 'sa_02' }]),
        }),
      });

      // 2. Existing notification check for sa_01 (none)
      mockSelect.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([]),
          }),
        }),
      });

      const mockValues1 = mock().mockResolvedValue({});
      mockInsert.mockReturnValueOnce({ values: mockValues1 });

      // 3. Existing notification check for sa_02 (none)
      mockSelect.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([]),
          }),
        }),
      });

      const mockValues2 = mock().mockResolvedValue({});
      mockInsert.mockReturnValueOnce({ values: mockValues2 });

      await notifySuperadminsAiDepleted({
        remainingDepositUsd: 0,
        packageId: 'pkg-hemat',
        packageName: 'Paket Hemat',
      });

      expect(mockValues1).toHaveBeenCalled();
      expect(mockValues2).toHaveBeenCalled();
    });
  });
});

