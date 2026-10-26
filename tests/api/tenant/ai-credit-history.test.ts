import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { GET } from '../../../src/pages/api/tenant/ai/credit-history';
import { db } from '../../../src/db';
import { getAuthenticatedUser } from '../../../src/lib/auth';
import { getOrInitializeAiCredit } from '../../../src/services/ai-credit.service';

vi.mock('../../../src/db', () => ({
  db: {
    select: vi.fn(),
  },
  stores: {
    id: 'stores.id',
    userId: 'stores.user_id',
    deletedAt: 'stores.deleted_at',
    createdAt: 'stores.created_at',
  },
  transactions: {
    id: 'transactions.id',
    storeId: 'transactions.store_id',
    userId: 'transactions.user_id',
    type: 'transactions.type',
    status: 'transactions.status',
    amount: 'transactions.amount',
    externalId: 'transactions.external_id',
    createdAt: 'transactions.created_at',
  },
  aiGenerationLogs: {
    id: 'ai_generation_logs.id',
    tenantId: 'ai_generation_logs.tenant_id',
    userId: 'ai_generation_logs.user_id',
    featureType: 'ai_generation_logs.feature_type',
    creditsDeducted: 'ai_generation_logs.credits_deducted',
    isTesting: 'ai_generation_logs.is_testing',
    status: 'ai_generation_logs.status',
    createdAt: 'ai_generation_logs.created_at',
  },
}));

vi.mock('../../../src/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

vi.mock('../../../src/services/ai-credit.service', () => ({
  getOrInitializeAiCredit: vi.fn(),
}));

describe('Tenant AI Credit History API - GET /api/tenant/ai/credit-history', () => {
  const mockUser = { id: 'user_tenant_01', role: 'tenant', status: 'active' };
  const mockStore = [{ id: 'store_tenant_01', createdAt: new Date('2026-10-01T00:00:00Z') }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when request is unauthenticated', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(null);

    const request = new Request('http://localhost/api/tenant/ai/credit-history');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.error.message).toContain('login');
  });

  it('returns empty quota and empty mutations when tenant has no store yet', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const selectMock = vi.fn().mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/credit-history');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.quota.balance).toBe(0);
    expect(body.data.quota.status).toBe('empty');
    expect(body.data.mutations).toHaveLength(0);
  });

  it('returns quota breakdown and combined credit mutations', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const mockCredit = {
      tenantId: 'store_tenant_01',
      balance: 13,
      totalPurchased: 12,
      totalUsed: 1,
    };
    (getOrInitializeAiCredit as unknown as Mock).mockResolvedValueOnce(mockCredit);

    const mockTransactions = [
      {
        id: 'tx_01',
        externalId: 'INV-AI-001',
        amount: 25000,
        createdAt: new Date('2026-10-15T10:00:00Z'),
      },
    ];

    const mockLogs = [
      {
        id: 'log_01',
        featureType: 'logo',
        creditsDeducted: 1,
        createdAt: new Date('2026-10-18T14:00:00Z'),
      },
    ];

    const selectMock = vi
      .fn()
      // 1. Store query
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockStore),
          }),
        }),
      })
      // 2. transactions query
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockTransactions),
          }),
        }),
      })
      // 3. aiGenerationLogs query
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue(mockLogs),
            }),
          }),
        }),
      });

    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/credit-history');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.quota.balance).toBe(13);
    expect(body.data.quota.totalPurchased).toBe(12);
    expect(body.data.quota.totalUsed).toBe(1);
    expect(body.data.quota.totalQuota).toBe(14); // 13 + 1
    expect(body.data.quota.percentage).toBe(93); // Math.round((13 / 14) * 100)
    expect(body.data.quota.status).toBe('plenty');

    // 3 mutations: log_01 (DEBIT - 18 Oct), tx_01 (CREDIT - 15 Oct), bonus (CREDIT - 1 Oct)
    expect(body.data.mutations).toHaveLength(3);
    expect(body.data.mutations[0].id).toBe('gen_log_01');
    expect(body.data.mutations[0].type).toBe('DEBIT');
    expect(body.data.mutations[0].amount).toBe(1);

    expect(body.data.mutations[1].id).toBe('tx_tx_01');
    expect(body.data.mutations[1].type).toBe('CREDIT');
    expect(body.data.mutations[1].amount).toBe(12); // from 25000 pkg
    expect(body.data.mutations[1].description).toContain('Rp 25.000');

    expect(body.data.mutations[2].id).toBe('bonus_store_tenant_01');
    expect(body.data.mutations[2].category).toBe('BONUS');
    expect(body.data.mutations[2].amount).toBe(2);
  });

  it('filters mutations by type CREDIT', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const mockCredit = { tenantId: 'store_tenant_01', balance: 10, totalPurchased: 12, totalUsed: 4 };
    (getOrInitializeAiCredit as unknown as Mock).mockResolvedValueOnce(mockCredit);

    const mockTransactions = [{ id: 'tx_01', externalId: 'INV-1', amount: 25000, createdAt: new Date() }];
    const mockLogs = [{ id: 'log_01', featureType: 'logo', creditsDeducted: 1, createdAt: new Date() }];

    const selectMock = vi
      .fn()
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue(mockStore) }),
        }),
      })
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockResolvedValue(mockTransactions) }),
        }),
      })
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue(mockLogs) }),
          }),
        }),
      });

    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/credit-history?type=CREDIT');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    // Only CREDIT (bonus and top-up) should remain, DEBIT filtered out
    expect(body.data.mutations.every((m: { type: string }) => m.type === 'CREDIT')).toBe(true);
    expect(body.data.mutations).toHaveLength(2);
  });
});
