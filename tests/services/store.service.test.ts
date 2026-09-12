import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('@/lib/db/client', () => ({
  db: {
    query: {
      stores: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn(),
  },
}));

import { db } from '@/lib/db/client';
import {
  getPublicStoreBySubdomain,
  getPublicStoreById,
  touchStoreLastEdited,
} from '@/services/stores';

describe('store.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPublicStoreBySubdomain', () => {
    it('returns null if store not found or not active', async () => {
      (db.query.stores.findFirst as Mock).mockResolvedValueOnce(undefined);
      const result = await getPublicStoreBySubdomain('non-existent');
      expect(result).toBeNull();
    });

    it('returns public store detail with managedByAdmin when registeredBy is set', async () => {
      (db.query.stores.findFirst as Mock).mockResolvedValueOnce({
        id: 'store-1',
        name: 'Toko Berkah',
        subdomain: 'berkah',
        waNumber: '628123456789',
        address: 'Jl. Melati No. 1',
        googleMapsUrl: 'https://maps.google.com/?q=berkah',
        googleMapsEmbedUrl: null,
        latitude: -8.1,
        longitude: 114.2,
        status: 'active',
        customization: {},
        registeredBy: 'admin-1',
        registrar: { name: 'Pendamping Mas Budi' },
      });

      const result = await getPublicStoreBySubdomain('berkah');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Toko Berkah');
      expect(result?.managedByAdmin).toEqual({ name: 'Pendamping Mas Budi' });
      // Ensure no sensitive fields leak
      const record = result as unknown as Record<string, unknown>;
      expect(record.email).toBeUndefined();
      expect(record.role).toBeUndefined();
    });

    it('returns managedByAdmin: null when registeredBy is not set', async () => {
      (db.query.stores.findFirst as Mock).mockResolvedValueOnce({
        id: 'store-2',
        name: 'Toko Mandiri',
        subdomain: 'mandiri',
        waNumber: '628123456789',
        address: null,
        googleMapsUrl: 'https://maps.google.com/?q=mandiri',
        googleMapsEmbedUrl: null,
        latitude: null,
        longitude: null,
        status: 'active',
        customization: {},
        registeredBy: null,
        registrar: null,
      });

      const result = await getPublicStoreBySubdomain('mandiri');
      expect(result).not.toBeNull();
      expect(result?.managedByAdmin).toBeNull();
    });
  });

  describe('getPublicStoreById', () => {
    it('retrieves store detail by ID with attribution', async () => {
      (db.query.stores.findFirst as Mock).mockResolvedValueOnce({
        id: 'store-1',
        name: 'Toko Berkah',
        subdomain: 'berkah',
        waNumber: '628123456789',
        address: null,
        googleMapsUrl: 'https://maps.google.com/?q=berkah',
        googleMapsEmbedUrl: null,
        latitude: null,
        longitude: null,
        status: 'active',
        customization: {},
        registeredBy: 'admin-1',
        registrar: { name: 'Admin Dian' },
      });

      const result = await getPublicStoreById('store-1');
      expect(result?.id).toBe('store-1');
      expect(result?.managedByAdmin).toEqual({ name: 'Admin Dian' });
    });
  });

  describe('touchStoreLastEdited', () => {
    it('updates store lastEditedBy and updatedAt', async () => {
      const mockWhere = vi.fn().mockResolvedValueOnce(undefined);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      (db.update as Mock).mockReturnValue({ set: mockSet } as unknown as ReturnType<typeof db.update>);

      await touchStoreLastEdited('store-123', 'admin-xyz');

      expect(db.update).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          lastEditedBy: 'admin-xyz',
          updatedAt: expect.any(Date),
        })
      );
    });
  });
});
