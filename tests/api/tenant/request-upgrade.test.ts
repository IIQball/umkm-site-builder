import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { POST } from '../../../src/pages/api/tenant/quota/request-upgrade';
import { db } from '../../../src/db';
import * as auth from '../../../src/lib/auth';

vi.mock('../../../src/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    query: {
      users: {
        findMany: vi.fn(),
      },
      notifications: {
        findFirst: vi.fn(),
      }
    }
  },
  notifications: {},
  users: {}
}));

vi.mock('../../../src/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

describe('Request Upgrade API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST returns 401 if user is not authenticated', async () => {
    (auth.getAuthenticatedUser as Mock).mockResolvedValue(null);

    const request = new Request('http://localhost/api/tenant/quota/request-upgrade', {
      method: 'POST',
      body: JSON.stringify({ categorySlots: 2, productSlots: 5 })
    });
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    
    const response = (await POST(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error.message).toBe('Tenant access required to request quota upgrade');
  });

  it('POST returns 400 if request body is invalid', async () => {
    (auth.getAuthenticatedUser as Mock).mockResolvedValue({ id: 'tenant_1', role: 'tenant', name: 'Test Tenant' });

    const request = new Request('http://localhost/api/tenant/quota/request-upgrade', {
      method: 'POST',
      body: JSON.stringify({ categorySlots: -1 }) // Invalid body, missing productSlots
    });
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    
    const response = (await POST(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.message).toBe('Data permintaan tidak valid');
  });

  it('POST creates notification and returns 200 on success', async () => {
    (auth.getAuthenticatedUser as Mock).mockResolvedValue({ id: 'tenant_1', role: 'tenant', name: 'Test Tenant' });

    const mockSuperAdmins = [{ id: 'super_1' }, { id: 'super_2' }];

    // Mock db.query.users.findMany for finding superadmins
    (db.query.users.findMany as Mock).mockResolvedValue(mockSuperAdmins);
    (db.query.notifications.findFirst as Mock).mockResolvedValue(null);

    // Mock db.insert for creating notifications
    const insertMock = vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue({}),
    });
    (db.insert as unknown as Mock) = insertMock;

    const request = new Request('http://localhost/api/tenant/quota/request-upgrade', {
      method: 'POST',
      body: JSON.stringify({ categorySlots: 2, productSlots: 5 })
    });
    const context = { request, url: new URL(request.url), params: {} } as unknown as APIContext;
    
    const response = (await POST(context)) as Response;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Permintaan berhasil dikirim ke Admin');

    // Ensure insert was called
    expect(db.insert).toHaveBeenCalled();
  });
});
