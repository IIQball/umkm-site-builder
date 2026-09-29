import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { PUT } from '../../../src/pages/api/stores/whatsapp-template';
import { db } from '../../../src/db';
import { getAuthenticatedUser, canManageStore } from '../../../src/lib/auth';

vi.mock('../../../src/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../../../src/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  canManageStore: vi.fn(),
}));

function makeContext(body: Record<string, unknown>, searchParams: string = ''): APIContext {
  const url = new URL(`http://localhost/api/stores/whatsapp-template?${searchParams}`);
  return {
    url,
    request: new Request(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  } as unknown as APIContext;
}

describe('PUT /api/stores/whatsapp-template', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if unauthenticated', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValueOnce(null);
    const ctx = makeContext({ template: 'hello' });
    const res = await PUT(ctx);
    expect(res.status).toBe(401);
  });

  it('returns 404 if store is not found', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValueOnce({ id: 'u1' });
    const selectMock = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]), // No store found
        }),
      }),
    });
    (db.select as unknown as Mock) = selectMock;

    const ctx = makeContext({ template: 'hello' });
    const res = await PUT(ctx);
    expect(res.status).toBe(404);
  });

  it('returns 403 if user cannot manage store', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValueOnce({ id: 'u1' });
    const selectMock = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 's1', userId: 'u2' }]),
        }),
      }),
    });
    (db.select as unknown as Mock) = selectMock;
    (canManageStore as Mock).mockReturnValueOnce(false);

    const ctx = makeContext({ template: 'hello', storeId: 's1' });
    const res = await PUT(ctx);
    expect(res.status).toBe(403);
  });

  it('returns 200 and updates template if successful', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValueOnce({ id: 'u1' });
    const selectMock = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 's1', userId: 'u1', customization: {} }]),
        }),
      }),
    });
    (db.select as unknown as Mock) = selectMock;
    (canManageStore as Mock).mockReturnValueOnce(true);

    const updateMock = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: 's1' }]),
      }),
    });
    (db.update as unknown as Mock) = updateMock;

    const ctx = makeContext({ template: 'Halo, saya mau tanya', storeId: 's1' });
    const res = await PUT(ctx);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.success).toBe(true);
    
    // Verify db.update was called with correct customization
    expect(updateMock).toHaveBeenCalled();
    const setCall = updateMock().set.mock.calls[0][0];
    expect(setCall.customization.waCheckoutTemplate).toBe('Halo, saya mau tanya');
  });
});
