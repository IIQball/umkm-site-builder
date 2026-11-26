import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ find: vi.fn() }));
vi.mock('@/db', () => ({
  db: { query: { users: { findFirst: mocks.find } } },
  users: {}, sessions: {}, accounts: {}, verifications: {}, designers: {}, wallets: {}, notifications: {},
}));
import { auth, getAuth, getAuthenticatedUser } from '@/lib/auth';

describe('current account status', () => {
  it('disables Better Auth session cookie caching globally', async () => {
    expect((await getAuth()).options.session?.cookieCache?.enabled).toBe(false);
  });
  it('rejects a suspended account even if its cached session exists', async () => {
    vi.spyOn(auth.api, 'getSession').mockResolvedValue({ user: { id: 'user-1' } } as never);
    mocks.find.mockResolvedValue({ id: 'user-1', status: 'suspended' });
    expect(await getAuthenticatedUser(new Request('https://example.test'))).toBeNull();
    vi.restoreAllMocks();
  });
});
