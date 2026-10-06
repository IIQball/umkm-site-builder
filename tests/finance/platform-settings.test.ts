import { describe, it, expect } from 'vitest';
import { commissionSettingsSchema } from '@/schemas/admin/admin.schema';
import {
  DEFAULT_MAX_STORE_BRANCHES,
  getMaxStoreBranches,
  getPlatformSettings,
  updatePlatformSettings,
} from '@/services/finance';
import { GET as getPublicPlatformSettings } from '@/pages/api/public/platform-settings';
import { GET as getPublicCommission } from '@/pages/api/public/commission';

describe('Dynamic Max Store Branches & Platform Settings', () => {
  describe('commissionSettingsSchema validation', () => {
    it('accepts valid maxStoreBranches between 1 and 50', () => {
      const validPayload = {
        platformFeePercentage: 25,
        maxStoreBranches: 10,
      };
      const result = commissionSettingsSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.maxStoreBranches).toBe(10);
      }
    });

    it('accepts maxStoreBranches boundary values 1 and 50', () => {
      expect(
        commissionSettingsSchema.safeParse({ platformFeePercentage: 20, maxStoreBranches: 1 }).success
      ).toBe(true);
      expect(
        commissionSettingsSchema.safeParse({ platformFeePercentage: 20, maxStoreBranches: 50 }).success
      ).toBe(true);
    });

    it('rejects maxStoreBranches less than 1', () => {
      const result = commissionSettingsSchema.safeParse({
        platformFeePercentage: 20,
        maxStoreBranches: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects maxStoreBranches greater than 50', () => {
      const result = commissionSettingsSchema.safeParse({
        platformFeePercentage: 20,
        maxStoreBranches: 51,
      });
      expect(result.success).toBe(false);
    });

    it('rejects decimal maxStoreBranches', () => {
      const result = commissionSettingsSchema.safeParse({
        platformFeePercentage: 20,
        maxStoreBranches: 5.5,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('getMaxStoreBranches service', () => {
    it('returns a positive number fallback (default 5)', async () => {
      const maxBranches = await getMaxStoreBranches();
      expect(typeof maxBranches).toBe('number');
      expect(maxBranches).toBeGreaterThanOrEqual(1);
      expect(maxBranches).toBeLessThanOrEqual(50);
      expect(DEFAULT_MAX_STORE_BRANCHES).toBe(5);
    });

    it('getPlatformSettings includes maxStoreBranches', async () => {
      const settings = await getPlatformSettings();
      expect(typeof settings.maxStoreBranches).toBe('number');
      expect(settings.maxStoreBranches).toBeGreaterThanOrEqual(1);
    });

    it('updatePlatformSettings throws if maxStoreBranches out of bounds', async () => {
      await expect(
        updatePlatformSettings(
          { platformFeePercentage: 30, maxStoreBranches: 0 },
          'usr_test'
        )
      ).rejects.toThrow('Maksimal cabang toko harus antara 1 dan 50');

      await expect(
        updatePlatformSettings(
          { platformFeePercentage: 30, maxStoreBranches: 60 },
          'usr_test'
        )
      ).rejects.toThrow('Maksimal cabang toko harus antara 1 dan 50');
    });
  });

  describe('Public Settings Endpoints', () => {
    it('GET /api/public/platform-settings returns 200 and maxStoreBranches', async () => {
      const mockContext = {
        request: new Request('http://localhost:4321/api/public/platform-settings'),
        params: {},
      } as unknown as Parameters<typeof getPublicPlatformSettings>[0];

      const res = await getPublicPlatformSettings(mockContext);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(typeof body.data.maxStoreBranches).toBe('number');
      expect(body.data.maxStoreBranches).toBeGreaterThanOrEqual(1);
      expect(typeof body.data.platformFeePercentage).toBe('number');
    });

    it('GET /api/public/commission returns maxStoreBranches alongside fee percentages', async () => {
      const mockContext = {
        request: new Request('http://localhost:4321/api/public/commission'),
        params: {},
      } as unknown as Parameters<typeof getPublicCommission>[0];

      const res = await getPublicCommission(mockContext);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(typeof body.data.maxStoreBranches).toBe('number');
      expect(body.data.maxStoreBranches).toBeGreaterThanOrEqual(1);
    });
  });
});
