import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { APIContext } from 'astro';
import { GET, PUT } from '../../../src/pages/api/products/[id]/variants';
import { db } from '../../../src/lib/db/client';

// Mock DB client
vi.mock('../../../src/lib/db/client', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

const mockProduct = {
  id: 'prod-1',
  storeId: 'store-1',
  isAvailable: true,
  variants: [
    {
      groupName: 'Ukuran',
      options: [
        { name: 'S', priceAdjustment: 0, isAvailable: true },
        { name: 'L', priceAdjustment: 5000, isAvailable: true },
      ],
    },
  ],
  deletedAt: null,
};


const mockStore = { userId: 'user-1' };

describe('Variants API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/products/[id]/variants', () => {
    it('returns variants for a product', async () => {
      // First call: product lookup, second call: store lookup
      let callCount = 0;
      (db.select as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([mockProduct]),
            }),
          };
        }
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockStore]),
          }),
        };
      });

      const request = new Request('http://localhost/api/products/prod-1/variants');
      const context = {
        request,
        params: { id: 'prod-1' },
        locals: { user: { id: 'user-1', role: 'tenant' } },
      } as unknown as APIContext;

      const response = (await GET(context)) as Response;
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.data.productId).toBe('prod-1');
      expect(data.data.variants).toHaveLength(1);
      expect(data.data.variants[0].groupName).toBe('Ukuran');
    });

    it('returns 404 for nonexistent product', async () => {
      (db.select as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const request = new Request('http://localhost/api/products/missing/variants');
      const context = {
        request,
        params: { id: 'missing' },
        locals: { user: { id: 'user-1', role: 'tenant' } },
      } as unknown as APIContext;

      const response = (await GET(context)) as Response;
      expect(response.status).toBe(404);
    });

    it('returns 400 when product ID is missing', async () => {
      const request = new Request('http://localhost/api/products//variants');
      const context = {
        request,
        params: {},
        locals: {},
      } as unknown as APIContext;

      const response = (await GET(context)) as Response;
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/products/[id]/variants', () => {
    it('returns 401 without auth', async () => {
      const request = new Request('http://localhost/api/products/prod-1/variants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants: [] }),
      });

      const context = {
        request,
        params: { id: 'prod-1' },
        locals: {},
      } as unknown as APIContext;

      const response = (await PUT(context)) as Response;
      expect(response.status).toBe(401);
    });

    it('returns 403 for non-tenant role', async () => {
      const request = new Request('http://localhost/api/products/prod-1/variants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants: [] }),
      });

      const context = {
        request,
        params: { id: 'prod-1' },
        locals: { user: { id: 'user-1', role: 'designer' } },
      } as unknown as APIContext;

      const response = (await PUT(context)) as Response;
      expect(response.status).toBe(403);
    });

    it('returns 400 for invalid variant data', async () => {
      let callCount = 0;
      (db.select as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([mockProduct]),
            }),
          };
        }
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockStore]),
          }),
        };
      });

      const request = new Request('http://localhost/api/products/prod-1/variants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variants: [{ groupName: '', options: [] }],
        }),
      });

      const context = {
        request,
        params: { id: 'prod-1' },
        locals: { user: { id: 'user-1', role: 'tenant' } },
      } as unknown as APIContext;

      const response = (await PUT(context)) as Response;
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.ok).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    it('updates variants successfully', async () => {
      const newVariants = [
        {
          groupName: 'Warna',
          options: [
            { name: 'Merah', priceAdjustment: 0, isAvailable: true },
            { name: 'Biru', priceAdjustment: 2000, isAvailable: true },
          ],
        },
      ];

      let callCount = 0;
      (db.select as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([mockProduct]),
            }),
          };
        }
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockStore]),
          }),
        };
      });

      (db.update as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([
              { ...mockProduct, variants: newVariants },
            ]),
          }),
        }),
      });

      const request = new Request('http://localhost/api/products/prod-1/variants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants: newVariants }),
      });

      const context = {
        request,
        params: { id: 'prod-1' },
        locals: { user: { id: 'user-1', role: 'tenant' } },
      } as unknown as APIContext;

      const response = (await PUT(context)) as Response;
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.data.variants[0].groupName).toBe('Warna');
    });

    it('returns 403 for non-owner', async () => {
      let callCount = 0;
      (db.select as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return {
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockResolvedValue([mockProduct]),
            }),
          };
        }
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ userId: 'other-user' }]),
          }),
        };
      });

      const request = new Request('http://localhost/api/products/prod-1/variants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants: [] }),
      });

      const context = {
        request,
        params: { id: 'prod-1' },
        locals: { user: { id: 'user-1', role: 'tenant' } },
      } as unknown as APIContext;

      const response = (await PUT(context)) as Response;
      expect(response.status).toBe(403);
    });
  });
});
