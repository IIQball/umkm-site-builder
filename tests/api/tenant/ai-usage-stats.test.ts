import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { GET } from '../../../src/pages/api/tenant/ai/usage-stats';
import { db } from '../../../src/db';
import { getAuthenticatedUser } from '../../../src/lib/auth';

vi.mock('../../../src/db', () => ({
  db: {
    select: vi.fn(),
  },
  stores: {
    id: 'stores.id',
    userId: 'stores.user_id',
    deletedAt: 'stores.deleted_at',
  },
  tenantAiCredits: {
    balance: 'tenant_ai_credits.balance',
    totalPurchased: 'tenant_ai_credits.total_purchased',
    totalUsed: 'tenant_ai_credits.total_used',
    tenantId: 'tenant_ai_credits.tenant_id',
  },
  aiGenerationLogs: {
    creditsDeducted: 'ai_generation_logs.credits_deducted',
    createdAt: 'ai_generation_logs.created_at',
    tenantId: 'ai_generation_logs.tenant_id',
    isTesting: 'ai_generation_logs.is_testing',
    status: 'ai_generation_logs.status',
  },
}));

vi.mock('../../../src/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

describe('Tenant AI Usage Stats API - GET /api/tenant/ai/usage-stats', () => {
  const mockUser = { id: 'user_tenant_01', role: 'tenant', status: 'active' };
  const mockStore = [{ id: 'store_tenant_01' }];
  const mockCredit = [{ balance: 14, totalPurchased: 20, totalUsed: 6 }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when request is unauthenticated', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(null);

    const request = new Request('http://localhost/api/tenant/ai/usage-stats');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.error.message).toContain('login');
  });

  it('returns 7 empty days with zero summary when tenant has no store yet', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const selectMock = vi.fn().mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/usage-stats');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.points).toHaveLength(7);
    expect(body.data.summary.totalCreditsUsed7d).toBe(0);
    expect(body.data.summary.currentBalance).toBe(0);
  });

  it('returns aggregated 7-day usage stats strictly for the tenant store', async () => {
    (getAuthenticatedUser as unknown as Mock).mockResolvedValueOnce(mockUser);

    const now = new Date();
    const mockLogs = [
      {
        creditsDeducted: 2,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        creditsDeducted: 1,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        creditsDeducted: 3,
        createdAt: now, // today
      },
    ];

    const selectMock = vi.fn()
      // 1. stores
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockStore),
          }),
        }),
      })
      // 2. tenantAiCredits
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockCredit),
          }),
        }),
      })
      // 3. aiGenerationLogs
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockLogs),
        }),
      });

    (db.select as unknown as Mock) = selectMock;

    const request = new Request('http://localhost/api/tenant/ai/usage-stats');
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;

    const response = (await GET(context)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.points).toHaveLength(7);
    expect(body.data.summary.totalCreditsUsed7d).toBe(6);
    expect(body.data.summary.totalGenerations7d).toBe(3);
    expect(body.data.summary.currentBalance).toBe(14);
    expect(body.data.summary.totalPurchased).toBe(20);
    expect(body.data.summary.totalUsedLifetime).toBe(6);
    expect(body.data.summary.highestUsageDay).not.toBeNull();
  });
});
