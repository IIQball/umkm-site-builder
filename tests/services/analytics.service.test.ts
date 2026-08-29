import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../src/lib/db/client', () => ({
  db: {
    query: {
      stores: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(),
  },
}));

import { db } from '../../src/lib/db/client';
import { trackEvent, type EventType } from '../../src/services/analytics.service';
import { AppError } from '../../src/lib/utils/api-handler';

describe('analytics.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('throws STORE_NOT_FOUND if store does not exist', async () => {
      (db.query.stores.findFirst as Mock).mockResolvedValue(null);

      try {
        await trackEvent('store-nonexistent', 'store_view');
        expect.fail('should have thrown');
      } catch (e) {
        expect((e as AppError).code).toBe('STORE_NOT_FOUND');
        expect((e as AppError).status).toBe(404);
      }
    });

    it('throws INVALID_EVENT_TYPE if eventType is invalid', async () => {
      (db.query.stores.findFirst as Mock).mockResolvedValue({
        id: 'store-1',
        totalViews: 10,
        totalWaClicks: 5,
      });

      try {
        await trackEvent('store-1', 'invalid_event' as EventType);
        expect.fail('should have thrown');
      } catch (e) {
        expect((e as AppError).code).toBe('INVALID_EVENT_TYPE');
        expect((e as AppError).status).toBe(400);
      }
    });

    it('increments totalViews for store_view event', async () => {
      (db.query.stores.findFirst as Mock).mockResolvedValue({
        id: 'store-1',
        totalViews: 10,
        totalWaClicks: 5,
      });

      const whereChain = {
        returning: vi.fn().mockResolvedValue([
          {
            totalViews: 11,
            totalWaClicks: 5,
          },
        ]),
      };

      const setChain = {
        where: vi.fn().mockReturnValue(whereChain),
      };

      const updateChain = {
        set: vi.fn().mockReturnValue(setChain),
      };

      (db.update as Mock).mockReturnValue(updateChain);

      const result = await trackEvent('store-1', 'store_view');

      expect(result.eventType).toBe('store_view');
      expect(result.totalViews).toBe(11);
      expect(result.totalWaClicks).toBe(5);
      expect(result.storeId).toBe('store-1');
    });

    it('increments totalWaClicks for wa_click event', async () => {
      (db.query.stores.findFirst as Mock).mockResolvedValue({
        id: 'store-1',
        totalViews: 10,
        totalWaClicks: 5,
      });

      const whereChain = {
        returning: vi.fn().mockResolvedValue([
          {
            totalViews: 10,
            totalWaClicks: 6,
          },
        ]),
      };

      const setChain = {
        where: vi.fn().mockReturnValue(whereChain),
      };

      const updateChain = {
        set: vi.fn().mockReturnValue(setChain),
      };

      (db.update as Mock).mockReturnValue(updateChain);

      const result = await trackEvent('store-1', 'wa_click');

      expect(result.eventType).toBe('wa_click');
      expect(result.totalViews).toBe(10);
      expect(result.totalWaClicks).toBe(6);
      expect(result.storeId).toBe('store-1');
    });
  });
});
