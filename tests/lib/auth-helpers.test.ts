import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAuthenticatedUser,
  isDesigner,
  isActive,
  isAuthorizedDesigner,
  getRedirectUrlForRole,
  auth,
  type AuthenticatedUser,
} from '@/lib/auth';
import { db } from '@/db';

describe('Auth Helper Functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getRedirectUrlForRole', () => {
    it('returns /designer/templates for designer', () => {
      expect(getRedirectUrlForRole('designer')).toBe('/designer/templates');
    });

    it('returns /admin for admin and superadmin', () => {
      expect(getRedirectUrlForRole('admin')).toBe('/admin');
      expect(getRedirectUrlForRole('superadmin')).toBe('/admin');
    });

    it('returns /dashboard for tenant or undefined', () => {
      expect(getRedirectUrlForRole('tenant')).toBe('/dashboard');
      expect(getRedirectUrlForRole(null)).toBe('/dashboard');
      expect(getRedirectUrlForRole(undefined)).toBe('/dashboard');
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
      expect(isDesigner(activeDesigner)).toBe(true);
      expect(isDesigner(suspendedAdmin)).toBe(true);
      expect(isDesigner(activeTenant)).toBe(false);
      expect(isDesigner(null)).toBe(false);
    });

    it('isActive checks active status correctly', () => {
      expect(isActive(activeDesigner)).toBe(true);
      expect(isActive(suspendedAdmin)).toBe(false);
      expect(isActive(null)).toBe(false);
    });

    it('isAuthorizedDesigner requires both active and designer permissions', () => {
      expect(isAuthorizedDesigner(activeDesigner)).toBe(true);
      expect(isAuthorizedDesigner(suspendedAdmin)).toBe(false);
      expect(isAuthorizedDesigner(activeTenant)).toBe(false);
      expect(isAuthorizedDesigner(null)).toBe(false);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('returns user from active BetterAuth session', async () => {
      const mockSession = {
        session: { id: 'sess_1', userId: 'usr_123' },
        user: { id: 'usr_123', email: 'user@test.com', name: 'Test User' },
      };

      const mockDbUser = {
        id: 'usr_123',
        name: 'Test User',
        email: 'user@test.com',
        role: 'designer' as const,
        status: 'active' as const,
      };

      vi.spyOn(auth.api, 'getSession').mockResolvedValueOnce(mockSession as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
      vi.spyOn(db.query.users, 'findFirst').mockResolvedValueOnce(mockDbUser as unknown as Awaited<ReturnType<typeof db.query.users.findFirst>>);

      const request = new Request('http://localhost:4321/api/test', {
        headers: { cookie: 'auth_session=123' },
      });

      const user = await getAuthenticatedUser(request);
      expect(user).not.toBeNull();
      expect(user?.id).toBe('usr_123');
      expect(user?.role).toBe('designer');
      expect(user?.status).toBe('active');
    });

    it('returns null when no session and no dev header present', async () => {
      vi.spyOn(auth.api, 'getSession').mockResolvedValueOnce(null);

      const request = new Request('http://localhost:4321/api/test');
      const user = await getAuthenticatedUser(request);
      expect(user).toBeNull();
    });

    it('falls back to dev header x-user-id when available', async () => {
      vi.spyOn(auth.api, 'getSession').mockResolvedValueOnce(null);

      const mockDbUser = {
        id: 'usr_dev_456',
        name: 'Dev User',
        email: 'dev@test.com',
        role: 'admin' as const,
        status: 'active' as const,
      };

      vi.spyOn(db.query.users, 'findFirst').mockResolvedValueOnce(mockDbUser as unknown as Awaited<ReturnType<typeof db.query.users.findFirst>>);

      const request = new Request('http://localhost:4321/api/test', {
        headers: { 'x-user-id': 'usr_dev_456' },
      });

      const user = await getAuthenticatedUser(request);
      expect(user).not.toBeNull();
      expect(user?.id).toBe('usr_dev_456');
      expect(user?.role).toBe('admin');
    });
  });
});
