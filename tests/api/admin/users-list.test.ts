import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/pages/api/admin/users/index';
import { getAuthenticatedUser } from '@/lib/auth';
import type { APIContext } from 'astro';

vi.mock('@/db/index', () => {
  const dynamicMock = {
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([
      {
        id: 'u1',
        name: 'Active Merchant',
        email: 'active@merchant.com',
        role: 'tenant',
        status: 'active',
        suspendReason: null,
        createdAt: new Date(),
      },
    ]),
  };

  return {
    db: {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          $dynamic: vi.fn(() => dynamicMock),
          where: vi.fn().mockReturnValue(dynamicMock),
        })),
      })),
    },
    users: {
      id: 'mock_id',
      name: 'mock_name',
      email: 'mock_email',
      role: 'mock_role',
      status: 'mock_status',
      suspendReason: 'mock_suspendReason',
      createdAt: 'mock_createdAt',
      registeredBy: 'mock_registeredBy',
    },
    tenantInvitations: {
      email: 'mock_inv_email',
      acceptedAt: 'mock_inv_acceptedAt',
    },
  };
});

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn((u) => u && (u.role === 'admin' || u.role === 'superadmin')),
}));

describe('GET /api/admin/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockContext = () =>
    ({
      request: new Request('http://localhost:4321/api/admin/users'),
    }) as unknown as APIContext;

  it('should reject unauthenticated or non-admin access with 403', async () => {
    (getAuthenticatedUser as unknown as { mockResolvedValueOnce: (val: unknown) => void }).mockResolvedValueOnce(null);

    const res = await GET(mockContext());
    expect(res.status).toBe(403);
  });

  it('should return active users for admin', async () => {
    (getAuthenticatedUser as unknown as { mockResolvedValueOnce: (val: unknown) => void }).mockResolvedValueOnce({
      id: 'admin_1',
      role: 'admin',
      name: 'Admin One',
      email: 'admin@test.com',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await GET(mockContext());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].status).toBe('active');
  });
});
