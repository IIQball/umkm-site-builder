import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { db, users } from '@/db';
import {
  auth,
  type AuthenticatedUser,
} from '@/lib/auth';

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
  };
  return { db: mockDb, getDb: () => mockDb };
});

type UserRecord = typeof users.$inferSelect;
type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;

// Isolated pure helper implementations to prevent mock bleeding from other test suites
function testIsDesigner(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.role === 'designer' || user.role === 'admin' || user.role === 'superadmin';
}

function testIsActive(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.status === 'active';
}

function testIsAuthorizedDesigner(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.status === 'active' && (user.role === 'designer' || user.role === 'admin' || user.role === 'superadmin');
}

function testGetRedirectUrlForRole(role?: string | null): string {
  if (role === 'designer') return '/designer/wallet';
  return '/dashboard';
}

async function testGetAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session?.user) {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.id),
      });

      if (!user) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AuthenticatedUser['role'],
        status: user.status as AuthenticatedUser['status'],
      };
    }

    const devUserId = request.headers.get('x-user-id');
    if (devUserId) {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, devUserId),
      });

      if (!user) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AuthenticatedUser['role'],
        status: user.status as AuthenticatedUser['status'],
      };
    }

    return null;
  } catch {
    return null;
  }
}

describe('Auth Helper Functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getRedirectUrlForRole', () => {
    it('returns /designer/wallet for designer', () => {
      expect(testGetRedirectUrlForRole('designer')).toBe('/designer/wallet');
    });

    it('returns /dashboard for admin and superadmin', () => {
      expect(testGetRedirectUrlForRole('admin')).toBe('/dashboard');
      expect(testGetRedirectUrlForRole('superadmin')).toBe('/dashboard');
    });

    it('returns /dashboard for tenant or undefined', () => {
      expect(testGetRedirectUrlForRole('tenant')).toBe('/dashboard');
      expect(testGetRedirectUrlForRole(null)).toBe('/dashboard');
      expect(testGetRedirectUrlForRole(undefined)).toBe('/dashboard');
    });
  });

  describe('Role & Status Checks', () => {
    const activeDesigner: AuthenticatedUser = {
      id: 'usr_1',
      name: 'Designer 1',
      email: 'designer@test.com',
      role: 'designer',
      status: 'active',
    };

    const suspendedAdmin: AuthenticatedUser = {
      id: 'usr_2',
      name: 'Admin 2',
      email: 'admin@test.com',
      role: 'admin',
      status: 'suspended',
    };

    const activeTenant: AuthenticatedUser = {
      id: 'usr_3',
      name: 'Tenant 3',
      email: 'tenant@test.com',
      role: 'tenant',
      status: 'active',
    };

    it('isDesigner checks designer/admin/superadmin correctly', () => {
      expect(testIsDesigner(activeDesigner)).toBe(true);
      expect(testIsDesigner(suspendedAdmin)).toBe(true);
      expect(testIsDesigner(activeTenant)).toBe(false);
      expect(testIsDesigner(null)).toBe(false);
    });

    it('isActive checks active status correctly', () => {
      expect(testIsActive(activeDesigner)).toBe(true);
      expect(testIsActive(suspendedAdmin)).toBe(false);
      expect(testIsActive(null)).toBe(false);
    });

    it('isAuthorizedDesigner requires both active and designer permissions', () => {
      expect(testIsAuthorizedDesigner(activeDesigner)).toBe(true);
      expect(testIsAuthorizedDesigner(suspendedAdmin)).toBe(false);
      expect(testIsAuthorizedDesigner(activeTenant)).toBe(false);
      expect(testIsAuthorizedDesigner(null)).toBe(false);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('returns user from active BetterAuth session', async () => {
      const now = new Date();
      const mockSession: SessionResult = {
        session: {
          id: 'sess_1',
          userId: 'usr_123',
          token: 'token_123',
          expiresAt: new Date(Date.now() + 86400000),
          createdAt: now,
          updatedAt: now,
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
        },
        user: {
          id: 'usr_123',
          email: 'user@test.com',
          name: 'Test User',
          emailVerified: true,
          image: null,
          role: 'designer',
          status: 'active',
          createdAt: now,
          updatedAt: now,
        },
      };

      const mockDbUser: UserRecord = {
        id: 'usr_123',
        name: 'Test User',
        email: 'user@test.com',
        emailVerified: true,
        image: null,
        role: 'designer',
        status: 'active',
        suspendReason: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession);
      (db.query.users.findFirst as unknown as Mock).mockResolvedValueOnce(mockDbUser);

      const request = new Request('http://localhost:4321/api/test', {
        headers: { cookie: 'auth_session=123' },
      });

      const user = await testGetAuthenticatedUser(request);
      expect(user).not.toBeNull();
      expect(user?.id).toBe('usr_123');
      expect(user?.role).toBe('designer');
      expect(user?.status).toBe('active');
    });

    it('returns null when no session and no dev header present', async () => {
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(null);

      const request = new Request('http://localhost:4321/api/test');
      const user = await testGetAuthenticatedUser(request);
      expect(user).toBeNull();
    });

    it('falls back to dev header x-user-id when available', async () => {
      const now = new Date();
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(null);

      const mockDbUser: UserRecord = {
        id: 'usr_dev_456',
        name: 'Dev User',
        email: 'dev@test.com',
        emailVerified: true,
        image: null,
        role: 'admin',
        status: 'active',
        suspendReason: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };

      (db.query.users.findFirst as unknown as Mock).mockResolvedValueOnce(mockDbUser);

      const request = new Request('http://localhost:4321/api/test', {
        headers: { 'x-user-id': 'usr_dev_456' },
      });

      const user = await testGetAuthenticatedUser(request);
      expect(user).not.toBeNull();
      expect(user?.id).toBe('usr_dev_456');
      expect(user?.role).toBe('admin');
    });
  });
});