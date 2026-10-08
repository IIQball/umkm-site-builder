/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getNotifications } from '@/pages/api/notifications/index';
import { POST as postReadAll } from '@/pages/api/notifications/read-all';
import { POST as postReadSingle } from '@/pages/api/notifications/[id]/read';
import { DELETE as deleteNotification } from '@/pages/api/notifications/[id]/index';
import { auth } from '@/lib/auth';

// Mock the auth module
vi.mock('@/lib/auth', () => {
  return {
    auth: {
      api: {
        getSession: vi.fn(),
      }
    }
  };
});

vi.mock('@/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ orderBy: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }) }) }) }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) }),
    delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
  },
  notifications: {},
}));

describe('Notifications API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/notifications', () => {
    it('rejects unauthenticated requests', async () => {
      // Mock no session
      (auth.api.getSession as any).mockResolvedValue(null);

      const res = (await getNotifications({
        request: new Request('http://localhost:4321/api/notifications'),
        params: {},
      } as unknown as Parameters<typeof getNotifications>[0])) as Response;

      expect(res.status).toBe(401);
    });

    it('returns notifications for authenticated user', async () => {
      // Mock authenticated session
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: 'test-user-id', role: 'designer', name: 'Test User' },
        session: { id: 'test-session', userId: 'test-user-id', expiresAt: new Date() }
      } as any);

      const res = (await getNotifications({
        request: new Request('http://localhost:4321/api/notifications'),
        params: {},
      } as unknown as Parameters<typeof getNotifications>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('POST /api/notifications/read-all', () => {
    it('rejects unauthenticated requests', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);

      const res = (await postReadAll({
        request: new Request('http://localhost:4321/api/notifications/read-all', {
          method: 'POST'
        }),
        params: {},
      } as unknown as Parameters<typeof postReadAll>[0])) as Response;

      expect(res.status).toBe(401);
    });

    it('returns 200 for authenticated user', async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: 'test-user-id', role: 'designer', name: 'Test User' },
        session: { id: 'test-session', userId: 'test-user-id', expiresAt: new Date() }
      } as any);

      const res = (await postReadAll({
        request: new Request('http://localhost:4321/api/notifications/read-all', {
          method: 'POST'
        }),
        params: {},
      } as unknown as Parameters<typeof postReadAll>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.success).toBe(true);
    });
  });

  describe('POST /api/notifications/[id]/read', () => {
    it('rejects unauthenticated requests', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);

      const res = (await postReadSingle({
        request: new Request('http://localhost:4321/api/notifications/notif-1/read', {
          method: 'POST'
        }),
        params: { id: 'notif-1' },
      } as unknown as Parameters<typeof postReadSingle>[0])) as Response;

      expect(res.status).toBe(401);
    });

    it('returns 200 for authenticated user', async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: 'test-user-id', role: 'designer', name: 'Test User' },
        session: { id: 'test-session', userId: 'test-user-id', expiresAt: new Date() }
      } as any);

      const res = (await postReadSingle({
        request: new Request('http://localhost:4321/api/notifications/notif-1/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true })
        }),
        params: { id: 'notif-1' },
      } as unknown as Parameters<typeof postReadSingle>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.success).toBe(true);
    });
  });

  describe('DELETE /api/notifications/[id]', () => {
    it('rejects unauthenticated requests', async () => {
      (auth.api.getSession as any).mockResolvedValue(null);

      const res = (await deleteNotification({
        request: new Request('http://localhost:4321/api/notifications/notif-1', {
          method: 'DELETE'
        }),
        params: { id: 'notif-1' },
      } as unknown as Parameters<typeof deleteNotification>[0])) as Response;

      expect(res.status).toBe(401);
    });

    it('returns 200 for authenticated user', async () => {
      (auth.api.getSession as any).mockResolvedValue({
        user: { id: 'test-user-id', role: 'designer', name: 'Test User' },
        session: { id: 'test-session', userId: 'test-user-id', expiresAt: new Date() }
      } as any);

      const res = (await deleteNotification({
        request: new Request('http://localhost:4321/api/notifications/notif-1', {
          method: 'DELETE'
        }),
        params: { id: 'notif-1' },
      } as unknown as Parameters<typeof deleteNotification>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.success).toBe(true);
    });
  });
});
