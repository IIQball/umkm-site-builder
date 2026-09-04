import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db/client';

import {
  extractCloudinaryPublicId,
  extractStringsFromUnknown,
  identifyOrphanAssets,
  collectActivePublicIds,
  fetchCloudinaryAssets,
  deleteCloudinaryAssets,
  runMediaCleanup,
} from '@/services/media/cleanup.service';
import type { CloudinaryAsset } from '@/types';

type DbExecutor = typeof db;


describe('Media Cleanup Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.CLOUDINARY_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_SECRET = 'test-secret';
  });

  describe('extractCloudinaryPublicId', () => {
    it('should extract public ID from full Cloudinary URL with version and extension', () => {
      const url = 'https://res.cloudinary.com/test-cloud/image/upload/v1724889600/umkm-builder/templates/hero-bg.webp';
      expect(extractCloudinaryPublicId(url)).toBe('umkm-builder/templates/hero-bg');
    });

    it('should extract public ID from Cloudinary URL with transformations and query params', () => {
      const url = 'https://res.cloudinary.com/test-cloud/image/upload/c_limit,h_1080,w_1920/v1724889600/umkm-builder/products/shoes_1.png?auto=format';
      expect(extractCloudinaryPublicId(url)).toBe('umkm-builder/products/shoes_1');
    });

    it('should normalize public ID if provided directly with extension', () => {
      const id = 'umkm-builder/stores/logo.svg';
      expect(extractCloudinaryPublicId(id)).toBe('umkm-builder/stores/logo');
    });

    it('should keep public ID if already clean', () => {
      const id = 'umkm-builder/users/avatar_123';
      expect(extractCloudinaryPublicId(id)).toBe('umkm-builder/users/avatar_123');
    });

    it('should return null for non-Cloudinary or non-umkm-builder URLs', () => {
      expect(extractCloudinaryPublicId('https://images.unsplash.com/photo-123456')).toBeNull();
      expect(extractCloudinaryPublicId('https://res.cloudinary.com/other-cloud/image/upload/v1/other-folder/img.jpg')).toBeNull();
      expect(extractCloudinaryPublicId('')).toBeNull();
    });
  });

  describe('extractStringsFromUnknown', () => {
    it('should recursively find all strings in nested objects and arrays', () => {
      const complexConfig = {
        theme: {
          background: '#ffffff',
          bannerUrl: 'https://res.cloudinary.com/test/image/upload/umkm-builder/stores/banner.jpg',
        },
        sections: [
          {
            type: 'hero',
            props: {
              title: 'Selamat Datang',
              images: [
                'https://res.cloudinary.com/test/image/upload/umkm-builder/templates/hero1.jpg',
                'https://res.cloudinary.com/test/image/upload/umkm-builder/templates/hero2.jpg',
              ],
            },
          },
        ],
      };

      const results = new Set<string>();
      extractStringsFromUnknown(complexConfig, results);

      expect(results.has('#ffffff')).toBe(true);
      expect(results.has('Selamat Datang')).toBe(true);
      expect(results.has('https://res.cloudinary.com/test/image/upload/umkm-builder/stores/banner.jpg')).toBe(true);
      expect(results.has('https://res.cloudinary.com/test/image/upload/umkm-builder/templates/hero1.jpg')).toBe(true);
      expect(results.has('https://res.cloudinary.com/test/image/upload/umkm-builder/templates/hero2.jpg')).toBe(true);
    });
  });

  describe('identifyOrphanAssets', () => {
    it('should correctly classify active, orphan, and recent grace-period assets', () => {
      const now = Date.now();
      const twoDaysAgo = new Date(now - 48 * 60 * 60 * 1000).toISOString();
      const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();

      const assets: CloudinaryAsset[] = [
        {
          public_id: 'umkm-builder/templates/active_hero',
          created_at: twoDaysAgo,
        },
        {
          public_id: 'umkm-builder/templates/orphan_old',
          created_at: twoDaysAgo,
        },
        {
          public_id: 'umkm-builder/templates/orphan_recent',
          created_at: twoHoursAgo,
        },
      ];

      const activePublicIds = new Set<string>(['umkm-builder/templates/active_hero']);

      const { orphanAssets, skippedRecentAssets } = identifyOrphanAssets(assets, activePublicIds, 24);

      expect(orphanAssets).toHaveLength(1);
      expect(orphanAssets[0].public_id).toBe('umkm-builder/templates/orphan_old');

      expect(skippedRecentAssets).toHaveLength(1);
      expect(skippedRecentAssets[0].public_id).toBe('umkm-builder/templates/orphan_recent');
    });
  });

  describe('collectActivePublicIds', () => {
    it('should query users, templates, stores, and products tables', async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockImplementation(() => {
              // Return different rows depending on call
              return Promise.resolve([
                { image: 'https://res.cloudinary.com/test/image/upload/umkm-builder/users/avatar.jpg' },
                { thumbnailUrl: 'https://res.cloudinary.com/test/image/upload/umkm-builder/templates/thumb.png', config: { heroImage: 'https://res.cloudinary.com/test/image/upload/umkm-builder/templates/hero.webp' } },
                { customization: { logoUrl: 'https://res.cloudinary.com/test/image/upload/umkm-builder/stores/logo.png' } },
                { imageUrls: ['https://res.cloudinary.com/test/image/upload/umkm-builder/products/p1.jpg'] },
              ]);
            }),
          }),
        }),
      } as unknown as DbExecutor;

      const activeIds = await collectActivePublicIds(mockDb);

      expect(activeIds.has('umkm-builder/users/avatar')).toBe(true);
      expect(activeIds.has('umkm-builder/templates/thumb')).toBe(true);
      expect(activeIds.has('umkm-builder/templates/hero')).toBe(true);
      expect(activeIds.has('umkm-builder/stores/logo')).toBe(true);
      expect(activeIds.has('umkm-builder/products/p1')).toBe(true);
    });
  });

  describe('fetchCloudinaryAssets', () => {
    it('should make an authorized GET request to Cloudinary resources endpoint', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          resources: [
            { public_id: 'umkm-builder/img1', created_at: '2026-08-01T00:00:00Z' },
          ],
        }),
      });

      const assets = await fetchCloudinaryAssets({ fetchFn: mockFetch as typeof fetch });
      expect(assets).toHaveLength(1);
      expect(assets[0].public_id).toBe('umkm-builder/img1');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.cloudinary.com/v1_1/test-cloud/resources/image/upload'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringMatching(/^Basic /),
          }),
        })
      );
    });
  });

  describe('deleteCloudinaryAssets', () => {
    it('should call Cloudinary Admin API DELETE with public_ids', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          deleted: {
            'umkm-builder/orphan1': 'deleted',
            'umkm-builder/orphan2': 'deleted',
          },
        }),
      });

      const result = await deleteCloudinaryAssets(
        ['umkm-builder/orphan1', 'umkm-builder/orphan2'],
        { fetchFn: mockFetch as typeof fetch }
      );

      expect(result.deleted).toEqual(['umkm-builder/orphan1', 'umkm-builder/orphan2']);
      expect(result.failed).toHaveLength(0);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('public_ids[]=umkm-builder%2Forphan1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('runMediaCleanup', () => {
    it('should perform dry run without invoking delete endpoint', async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as unknown as DbExecutor;

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          resources: [
            { public_id: 'umkm-builder/orphan_old', created_at: '2020-01-01T00:00:00Z' },
          ],
        }),
      });

      const report = await runMediaCleanup({
        dryRun: true,
        dbClient: mockDb,
        fetchFn: mockFetch as typeof fetch,
      });

      expect(report.dryRun).toBe(true);
      expect(report.orphanAssetsCount).toBe(1);
      expect(report.deletedAssetsCount).toBe(0);
      expect(mockFetch).toHaveBeenCalledTimes(1); // only GET, no DELETE
    });

    it('should delete orphan assets when dryRun is false', async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as unknown as DbExecutor;

      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            resources: [
              { public_id: 'umkm-builder/orphan_old', created_at: '2020-01-01T00:00:00Z' },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            deleted: {
              'umkm-builder/orphan_old': 'deleted',
            },
          }),
        });

      const report = await runMediaCleanup({
        dryRun: false,
        dbClient: mockDb,
        fetchFn: mockFetch as typeof fetch,
      });

      expect(report.dryRun).toBe(false);
      expect(report.orphanAssetsCount).toBe(1);
      expect(report.deletedAssetsCount).toBe(1);
      expect(report.deletedPublicIds).toContain('umkm-builder/orphan_old');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
