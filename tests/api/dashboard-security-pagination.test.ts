import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paginate, getPaginationParams, PAGE_SIZE, type PaginateDb } from '@/lib/pagination/server';
import { getPublicTemplates } from '@/services/templates/template.service';
import { getDesignerWalletSummary } from '@/services/finance/wallet.service';
import { GET as getPublicTemplatesApi } from '@/pages/api/public/templates/index';
import { db } from '@/lib/db/client';
import { templates } from '@/db/schema';

const SENSITIVE_FORBIDDEN_KEYS = [
  'password', 'passwordHash', 'hash', 'token', 'sessionToken',
  'twoFactorSecret', 'secret', 'stripeSecretKey', 'xenditApiKey',
  'deletedAt', 'internalNotes',
];

interface MockDatabase {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  query: {
    templates: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
    transactions: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
    wallets: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
    users: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
    stores: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
  };
}

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    query: {
      templates: { findMany: vi.fn(), findFirst: vi.fn() },
      transactions: { findMany: vi.fn(), findFirst: vi.fn() },
      wallets: { findMany: vi.fn(), findFirst: vi.fn() },
      users: { findMany: vi.fn(), findFirst: vi.fn() },
      stores: { findMany: vi.fn(), findFirst: vi.fn() },
    },
  };
  return { db: mockDb, getDb: () => mockDb };
});

describe('Dashboard Security & Server-Side Pagination Test Suite', () => {
  const mockDb = db as unknown as MockDatabase;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Audit Proyeksi Data & Pencegahan Kebocoran Data (DTO / Projection)', () => {
    it('getPublicTemplates: hanya mengembalikan atribut publik dan bebas kolom sensitif', async () => {
      const mockDbRow = {
        id: 'tpl_pub_1',
        name: 'Warung Kopi Aesthetic',
        description: 'Template minimalis',
        price: 75000,
        thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        status: 'approved',
        createdAt: new Date('2026-01-01'),
        userName: 'Designer Pro',
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    offset: vi.fn().mockResolvedValue([mockDbRow]),
                  }),
                }),
              }),
            }),
          }),
        }),
      });

      const results = await getPublicTemplates(1, 10);
      expect(results.length).toBe(1);

      const item = results[0] as unknown as Record<string, unknown>;
      const allowedKeys = ['id', 'name', 'description', 'price', 'thumbnailUrl', 'status', 'createdAt', 'designerName'];
      Object.keys(item).forEach((k) => expect(allowedKeys).toContain(k));
      for (const forbiddenKey of SENSITIVE_FORBIDDEN_KEYS) {
        expect(item[forbiddenKey]).toBeUndefined();
      }
      expect(item.config).toBeUndefined();
      expect(item.rejectionReason).toBeUndefined();
    });

    it('getDesignerWalletSummary: hanya mengembalikan data dompet dan mutasi yang terproyeksi', async () => {
      mockDb.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([
                { id: 'wallet_101', userId: 'usr_designer_1', balance: 500000, availableBalance: 450000 },
              ]),
            }),
          }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockResolvedValue([
                    {
                      id: 'mut_101',
                      walletId: 'wallet_101',
                      amount: 100000,
                      balanceAfter: 500000,
                      type: 'CREDIT',
                      description: 'Komisi Penjualan',
                      referenceId: 'ref_tx_99',
                      createdAt: new Date('2026-03-01'),
                    },
                  ]),
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
        });

      const summary = await getDesignerWalletSummary('usr_designer_1', mockDb as unknown as typeof db, 10, 0);
      expect(summary.designerId).toBe('usr_designer_1');
      expect(summary.balance).toBe(500000);
      expect(summary.availableBalance).toBe(450000);
      expect(summary.mutations.length).toBe(1);

      const mutation = summary.mutations[0] as unknown as Record<string, unknown>;
      const allowedMutationKeys = ['id', 'type', 'amount', 'balanceAfter', 'description', 'referenceId', 'createdAt'];
      Object.keys(mutation).forEach((k) => expect(allowedMutationKeys).toContain(k));
      for (const forbiddenKey of SENSITIVE_FORBIDDEN_KEYS) {
        expect((summary as unknown as Record<string, unknown>)[forbiddenKey]).toBeUndefined();
        expect(mutation[forbiddenKey]).toBeUndefined();
      }
    });

    it('GET /api/public/templates: respon JSON endpoint hanya menyajikan field DTO publik', async () => {
      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            leftJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    offset: vi.fn().mockResolvedValue([
                      {
                        id: 'tpl_api_1',
                        name: 'Modern Barber',
                        description: 'Template pangkas rambut',
                        price: 50000,
                        thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                        status: 'approved',
                        createdAt: new Date('2026-02-15'),
                        userName: 'Barber Master',
                      },
                    ]),
                  }),
                }),
              }),
            }),
          }),
        }),
      });

      const response = await getPublicTemplatesApi({
        request: new Request('http://localhost:4321/api/public/templates?page=1'),
      } as unknown as Parameters<typeof getPublicTemplatesApi>[0]);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.ok).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      const record = json.data[0] as Record<string, unknown>;
      for (const forbiddenKey of SENSITIVE_FORBIDDEN_KEYS) {
        expect(record[forbiddenKey]).toBeUndefined();
      }
      expect(record.config).toBeUndefined();
    });
  });

  describe('2. Penegakan Batas Paginasi Server-Side (25 Mock Data -> Limit 10)', () => {
    interface MockItem {
      id: string;
      name: string;
      createdAt: Date;
    }

    const mock25Items: MockItem[] = Array.from({ length: 25 }, (_, i) => ({
      id: `item_${i + 1}`,
      name: `Katalog Item #${i + 1}`,
      createdAt: new Date(2026, 0, i + 1),
    }));

    const createMockPaginationDb = (items: MockItem[]): PaginateDb => ({
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ total: items.length }]),
          then: (resolve: (val: unknown) => void) => resolve([{ total: items.length }]),
        }),
      }),
    });

    it('Halaman 1: mengembalikan tepat 10 data dengan offset 0', async () => {
      const mockDbInstance = createMockPaginationDb(mock25Items);
      const queryBuilder = vi.fn().mockImplementation((limit: number, offset: number) => {
        return Promise.resolve(mock25Items.slice(offset, offset + limit));
      });

      const result = await paginate<MockItem>(
        mockDbInstance,
        templates,
        queryBuilder,
        undefined,
        1,
        PAGE_SIZE
      );

      expect(queryBuilder).toHaveBeenCalledWith(10, 0);
      expect(result.data.length).toBe(10);
      expect(result.data[0].id).toBe('item_1');
      expect(result.data[9].id).toBe('item_10');
      expect(result.currentPage).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalItems).toBe(25);
      expect(result.totalPages).toBe(3);
    });

    it('Halaman 2: mengembalikan tepat 10 data dengan offset 10', async () => {
      const mockDbInstance = createMockPaginationDb(mock25Items);
      const queryBuilder = vi.fn().mockImplementation((limit: number, offset: number) => {
        return Promise.resolve(mock25Items.slice(offset, offset + limit));
      });

      const result = await paginate<MockItem>(
        mockDbInstance,
        templates,
        queryBuilder,
        undefined,
        2,
        PAGE_SIZE
      );

      expect(queryBuilder).toHaveBeenCalledWith(10, 10);
      expect(result.data.length).toBe(10);
      expect(result.data[0].id).toBe('item_11');
      expect(result.data[9].id).toBe('item_20');
      expect(result.currentPage).toBe(2);
      expect(result.totalPages).toBe(3);
    });

    it('Halaman 3: mengembalikan sisa tepat 5 data dengan offset 20', async () => {
      const mockDbInstance = createMockPaginationDb(mock25Items);
      const queryBuilder = vi.fn().mockImplementation((limit: number, offset: number) => {
        return Promise.resolve(mock25Items.slice(offset, offset + limit));
      });

      const result = await paginate<MockItem>(
        mockDbInstance,
        templates,
        queryBuilder,
        undefined,
        3,
        PAGE_SIZE
      );

      expect(queryBuilder).toHaveBeenCalledWith(10, 20);
      expect(result.data.length).toBe(5);
      expect(result.data[0].id).toBe('item_21');
      expect(result.data[4].id).toBe('item_25');
      expect(result.currentPage).toBe(3);
    });

    it('Verifikasi ketat: panjang array data peramban tidak pernah melebihi 10 objek per halaman', async () => {
      const mockDbInstance = createMockPaginationDb(mock25Items);

      for (let page = 1; page <= 3; page++) {
        const queryBuilder = vi.fn().mockImplementation((limit: number, offset: number) => {
          return Promise.resolve(mock25Items.slice(offset, offset + limit));
        });

        const res = await paginate<MockItem>(
          mockDbInstance,
          templates,
          queryBuilder,
          undefined,
          page,
          PAGE_SIZE
        );

        expect(res.data.length).toBeLessThanOrEqual(10);
      }
    });

    it('getPaginationParams: mengekstrak page dari query parameter secara akurat', () => {
      const p1 = getPaginationParams('http://localhost:4321/admin/transactions');
      expect(p1.page).toBe(1);
      expect(p1.offset).toBe(0);
      expect(p1.pageSize).toBe(10);

      const p2 = getPaginationParams('http://localhost:4321/admin/transactions?page=2');
      expect(p2.page).toBe(2);
      expect(p2.offset).toBe(10);

      const pInvalid = getPaginationParams('http://localhost:4321/admin/transactions?page=-5');
      expect(pInvalid.page).toBe(1);
      expect(pInvalid.offset).toBe(0);
    });
  });
});
