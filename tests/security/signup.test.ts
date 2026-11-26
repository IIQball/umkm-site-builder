import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ consume: vi.fn(), signUp: vi.fn(), update: vi.fn(), insert: vi.fn() }));
vi.mock('@/db', () => ({
  verifications: { identifier: 'identifier', value: 'value', expiresAt: 'expiresAt', id: 'id' },
  users: { id: 'id' }, designers: {}, wallets: {},
  db: {
    delete: () => ({ where: () => ({ returning: mocks.consume }) }),
    update: mocks.update,
    insert: mocks.insert,
  },
}));
vi.mock('@/lib/auth', () => ({ auth: { api: { signUpEmail: mocks.signUp } } }));
import { POST } from '@/pages/api/auth/register';

const payload = { email: 'test@example.com', name: 'Test User', password: 'password123', role: 'tenant', proof: 'proof' };
function request(data: object) {
  return { request: new Request('https://example.test/api/auth/register', { method: 'POST', body: JSON.stringify(data), headers: { 'content-type': 'application/json' } }) } as Parameters<typeof POST>[0];
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.update.mockReturnValue({ set: () => ({ where: vi.fn().mockResolvedValue(undefined) }) });
});
describe('signup proof enforcement', () => {
  it('refuses privileged public roles before consuming a proof', async () => {
    const response = await POST(request({ ...payload, role: 'superadmin' }));
    expect(response.status).toBe(400);
    expect(mocks.consume).not.toHaveBeenCalled();
    expect(mocks.signUp).not.toHaveBeenCalled();
  });
  it('refuses signup when the email-bound proof was already consumed', async () => {
    mocks.consume.mockResolvedValue([]);
    const response = await POST(request(payload));
    expect(response.status).toBe(403);
    expect(mocks.signUp).not.toHaveBeenCalled();
  });
  it('creates a tenant only after consuming a proof', async () => {
    mocks.consume.mockResolvedValue([{ id: 'proof-id' }]);
    mocks.signUp.mockResolvedValue({ user: { id: 'user-id' } });
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(mocks.signUp).toHaveBeenCalledOnce();
  });
});
