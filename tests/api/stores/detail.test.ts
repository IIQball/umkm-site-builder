import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';

vi.mock('@/services/stores', () => ({
  getPublicStoreBySubdomain: vi.fn(),
  getPublicStoreById: vi.fn(),
}));

import { GET } from '@/pages/api/stores/detail';
import { getPublicStoreBySubdomain, getPublicStoreById } from '@/services/stores';

function makeContext(searchParams: string): APIContext {
  const url = new URL(`http://localhost/api/stores/detail?${searchParams}`);
  return {
    url,
    request: new Request(url),
  } as unknown as APIContext;
}

describe('GET /api/stores/detail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if neither subdomain nor storeId is provided', async () => {
    const ctx = makeContext('');
    const res = await GET(ctx);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it('returns 404 if store is not found by subdomain', async () => {
    (getPublicStoreBySubdomain as Mock).mockResolvedValueOnce(null);
    const ctx = makeContext('subdomain=ghost');
    const res = await GET(ctx);
    expect(res.status).toBe(404);
  });

  it('returns 200 with managedByAdmin info if registered by admin', async () => {
    (getPublicStoreBySubdomain as Mock).mockResolvedValueOnce({
      id: 'store-1',
      name: 'Batik Indah',
      subdomain: 'batikindah',
      waNumber: '628111111111',
      address: 'Banyuwangi',
      googleMapsUrl: 'https://maps.google.com/?q=batik',
      googleMapsEmbedUrl: null,
      latitude: null,
      longitude: null,
      status: 'active',
      customization: {},
      managedByAdmin: { name: 'Admin Pendamping Siti' },
    });

    const ctx = makeContext('subdomain=batikindah');
    const res = await GET(ctx);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.data.name).toBe('Batik Indah');
    expect(data.data.managedByAdmin).toEqual({ name: 'Admin Pendamping Siti' });
    // Safety check: sensitive admin fields must not exist
    expect(data.data.email).toBeUndefined();
    expect(data.data.role).toBeUndefined();
  });

  it('returns 200 with managedByAdmin: null for independent store', async () => {
    (getPublicStoreById as Mock).mockResolvedValueOnce({
      id: 'store-2',
      name: 'Warung Mandiri',
      subdomain: 'warungmandiri',
      waNumber: '628222222222',
      address: null,
      googleMapsUrl: 'https://maps.google.com/?q=warung',
      googleMapsEmbedUrl: null,
      latitude: null,
      longitude: null,
      status: 'active',
      customization: {},
      managedByAdmin: null,
    });

    const ctx = makeContext('storeId=store-2');
    const res = await GET(ctx);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.data.managedByAdmin).toBeNull();
  });
});
