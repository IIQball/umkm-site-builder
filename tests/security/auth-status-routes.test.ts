import { describe, expect, it, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), getUser: vi.fn(), handler: vi.fn(), db: { select: vi.fn(), update: vi.fn(), delete: vi.fn() } }));
vi.mock('@/lib/auth', () => ({ auth: { api: { getSession: mocks.getSession }, handler: mocks.handler }, getAuthenticatedUser: mocks.getUser }));
vi.mock('@/db', () => ({ db: mocks.db, notifications: {} }));
import { ALL } from '@/pages/api/auth/[...all]';
import { GET } from '@/pages/api/notifications/index';
import { POST as readAll } from '@/pages/api/notifications/read-all';
import { POST as readOne } from '@/pages/api/notifications/[id]/read';
import { DELETE } from '@/pages/api/notifications/[id]/index';

beforeEach(() => { vi.clearAllMocks(); mocks.getUser.mockResolvedValue(null); mocks.getSession.mockResolvedValue({ user: { id: 'suspended' } }); mocks.handler.mockResolvedValue(new Response('auth')); });
describe('stale suspended sessions', () => {
  it('rejects each notification handler', async () => {
    const context = { request: new Request('https://example.test/api/notifications'), params: { id: '1' } } as never;
    for (const handler of [GET, readAll, readOne, DELETE]) expect((await handler(context)).status).toBe(401);
    expect(mocks.db.select).not.toHaveBeenCalled();
    expect(mocks.db.update).not.toHaveBeenCalled();
    expect(mocks.db.delete).not.toHaveBeenCalled();
  });
  it('blocks authenticated auth routes but keeps sign-out available', async () => {
    const context = (path: string) => ({ url: new URL(`https://example.test/api/auth/${path}`), request: new Request(`https://example.test/api/auth/${path}`) }) as never;
    expect((await ALL(context('update-user'))).status).toBe(403);
    expect((await ALL(context('sign-out'))).status).toBe(200);
    expect(mocks.handler).toHaveBeenCalledTimes(1);
  });
  it('permits only the GET reset callback with a token for inactive cookies', async () => {
    const context = (path: string, method = 'GET') => ({ url: new URL(`https://example.test/api/auth/${path}`), request: new Request(`https://example.test/api/auth/${path}`, { method }) }) as never;
    expect((await ALL(context('reset-password/token'))).status).toBe(200);
    expect((await ALL(context('reset-password/token', 'POST'))).status).toBe(403);
    expect((await ALL(context('reset-password/token/extra'))).status).toBe(403);
  });
});
