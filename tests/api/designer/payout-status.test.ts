import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET } from '@/pages/api/designer/payout/status';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import { db } from '@/lib/db/client';

// Mock auth helpers
vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedDesigner: vi.fn(),
}));

// Mock DB client
vi.mock('@/lib/db/client', () => {
  const mockDb = {
    select: vi.fn(),
    query: {
      payoutRequests: {
        findMany: vi.fn(),
      },
    },
  };
  return { db: mockDb };
});

describe('GET /api/designer/payout/status', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedDesigner = isAuthorizedDesigner as unknown as Mock;
  const mockFindManyPayoutRequests = db.query.payoutRequests.findMany as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const request = new Request('http://localhost/api/designer/payout/status');
    const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns 401 when user is not an authorized designer', async () => {
    mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'tenant' });
    mockIsAuthorizedDesigner.mockReturnValue(false);

    const request = new Request('http://localhost/api/designer/payout/status');
    const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

    expect(res.status).toBe(401);
  });

  it('returns 200 with payouts and current wallet balance', async () => {
    mockGetAuthUser.mockResolvedValue({ id: 'usr_1', role: 'designer' });
    mockIsAuthorizedDesigner.mockReturnValue(true);

    const mockPayouts = [
      {
        id: 'po_1',
        amount: 50000,
        status: 'processing',
        createdAt: new Date().toISOString(),
      },
    ];
    mockFindManyPayoutRequests.mockResolvedValue(mockPayouts);

    // Mock select for wallets table
    mockSelect.mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ balance: 200000, availableBalance: 150000 }]),
        }),
      }),
    });

    const request = new Request('http://localhost/api/designer/payout/status');
    const res = (await GET({ request, params: {} } as unknown as Parameters<typeof GET>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.payouts).toEqual(mockPayouts);
    expect(body.data.wallet).toEqual({ balance: 200000, availableBalance: 150000 });
  });
});
