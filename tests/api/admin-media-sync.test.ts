import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { mediaSyncService } from '@/services/media/sync.service';

describe('Admin Media Sync API & Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('mediaSyncService.runMediaSync', () => {
    it('should successfully sync and remove broken urls in dryRun mode without modifying DB', async () => {
      // Mock dbClient
      const mockDbClient = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          {
            id: 'product-1',
            imageUrls: ['umkm-builder/valid-image.jpg', 'umkm-builder/broken-image.jpg', 'https://external.com/image.jpg']
          }
        ]),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      };

      // Mock fetchFn for Cloudinary
      const mockFetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          resources: [
            { public_id: 'umkm-builder/valid-image', created_at: new Date().toISOString() }
          ]
        })
      });

      const report = await mediaSyncService.runMediaSync({
        dryRun: true,
        dbClient: mockDbClient as never,
        fetchFn: mockFetchFn as never
      });

      expect(report.success).toBe(true);
      expect(report.dryRun).toBe(true);
      expect(report.productsChecked).toBe(1);
      expect(report.productsUpdated).toBe(1);
      expect(report.brokenUrlsRemoved).toBe(1);
      
      // Since it's dryRun, update should NOT be called
      expect(mockDbClient.update).not.toHaveBeenCalled();
    });

    it('should successfully sync and update DB when not in dryRun mode', async () => {
      // Mock dbClient
      const mockDbClient = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([
          {
            id: 'product-2',
            imageUrls: ['umkm-builder/broken-image2.jpg']
          }
        ]),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis()
      };

      // Mock fetchFn for Cloudinary (empty, no valid assets)
      const mockFetchFn = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          resources: []
        })
      });

      const report = await mediaSyncService.runMediaSync({
        dryRun: false,
        dbClient: mockDbClient as never,
        fetchFn: mockFetchFn as never
      });

      expect(report.success).toBe(true);
      expect(report.dryRun).toBe(false);
      expect(report.productsUpdated).toBe(1);
      
      // Update SHOULD be called
      expect(mockDbClient.update).toHaveBeenCalled();
      expect(mockDbClient.set).toHaveBeenCalledWith(expect.objectContaining({ imageUrls: [] }));
    });
  });
});
