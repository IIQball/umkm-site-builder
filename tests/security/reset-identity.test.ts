import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ verification: vi.fn(), user: vi.fn(), invitation: vi.fn(), reset: vi.fn(), update: vi.fn(), audit: vi.fn() }));
vi.mock('@/db/index', () => ({
  db: { query: { verifications: { findFirst: mocks.verification }, users: { findFirst: mocks.user }, tenantInvitations: { findFirst: mocks.invitation } }, update: mocks.update },
  users: { id: 'id', status: 'status' }, sessions: {}, tenantInvitations: { email: 'email', expiresAt: 'expires' },
  verifications: { identifier: 'identifier', expiresAt: 'expires' },
}));
vi.mock('@/lib/auth', () => ({ auth: { api: { resetPassword: mocks.reset } } }));
vi.mock('@/services/audit.service', () => ({ logActivity: mocks.audit }));
import { POST } from '@/pages/api/auth/reset-password';

describe('password reset identity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verification.mockResolvedValue({ value: 'token-owner' });
    mocks.user.mockResolvedValue({ id: 'token-owner', email: 'owner@example.test', role: 'tenant', status: 'suspended' });
    mocks.reset.mockResolvedValue({});
  });
  it('ignores the supplied uid and does not activate a suspended user', async () => {
    const request = new Request('https://example.test/api/auth/reset-password', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: 'token', password: 'password123', uid: 'other-user' }) });
    const response = await POST({ request } as Parameters<typeof POST>[0]);
    expect(response.status).toBe(200);
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.audit).toHaveBeenCalledWith(expect.objectContaining({ userId: 'token-owner' }));
  });
  it('rejects pending accounts without a valid invitation before changing the password', async () => {
    mocks.user.mockResolvedValue({ id: 'token-owner', email: 'owner@example.test', status: 'pending', registeredBy: 'admin' });
    mocks.invitation.mockResolvedValue(undefined);
    const request = new Request('https://example.test/api/auth/reset-password', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: 'token', password: 'password123' }) });
    const response = await POST({ request } as Parameters<typeof POST>[0]);
    expect(response.status).toBe(400);
    expect(mocks.reset).not.toHaveBeenCalled();
  });
});
