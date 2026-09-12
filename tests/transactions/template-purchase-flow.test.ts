import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { POST } from '@/pages/api/tenant/transactions/template-purchase';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';
import { xenditClient } from '@/lib/finance/xendit';

vi.mock('@/lib/db/client', () => {
  const limitFn = vi.fn().mockResolvedValue([{ id: 'user_1', email: 'user@example.com', adminServiceFee: 5000 }]);
  const mockDb = {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: limitFn,
        }),
        limit: limitFn,
      }),
    }),
    query: {
      templates: {
        findFirst: vi.fn(),
      },
      userTemplates: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
  };
  return { db: mockDb, getDb: () => mockDb };
});

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

vi.mock('@/lib/finance/xendit', () => ({
  xenditClient: {
    createInvoice: vi.fn(),
  },
}));

describe('POST /api/transactions/template-purchase', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockFindTemplate = db.query.templates.findFirst as unknown as Mock;
  const mockFindUserTemplate = db.query.userTemplates.findFirst as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockCreateInvoice = xenditClient.createInvoice as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    mockGetAuthUser.mockResolvedValue(null);

    const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 403 when user account is suspended', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'user_1',
      name: 'User 1',
      email: 'user@example.com',
      role: 'tenant',
      status: 'suspended',
    });

    const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('should return 400 when validation fails', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'user_1',
      name: 'User 1',
      email: 'user@example.com',
      role: 'tenant',
      status: 'active',
    });

    const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 404 when template is not found or not approved', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'user_1',
      name: 'User 1',
      email: 'user@example.com',
      role: 'tenant',
      status: 'active',
    });
    mockFindTemplate.mockResolvedValue(null);

    const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('should return 400 when template is already owned', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'user_1',
      name: 'User 1',
      email: 'user@example.com',
      role: 'tenant',
      status: 'active',
    });
    mockFindTemplate.mockResolvedValue({
      id: 'tpl_123',
      name: 'Template Test',
      price: 150000,
      status: 'approved',
    });
    mockFindUserTemplate.mockResolvedValue({
      id: 'utpl_123',
      userId: 'user_1',
      templateId: 'tpl_123',
    });

    const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_123' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('TEMPLATE_ALREADY_OWNED');
  });

  it('should claim free template directly', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'user_1',
      name: 'User 1',
      email: 'user@example.com',
      role: 'tenant',
      status: 'active',
    });
    mockFindTemplate.mockResolvedValue({
      id: 'tpl_free',
      name: 'Free Template',
      price: 0,
      status: 'approved',
    });
    mockFindUserTemplate.mockResolvedValue(null);

    const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_free' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.isFree).toBe(true);
    expect(mockInsert).toHaveBeenCalled();
  });

  it('should initiate paid template purchase via Xendit', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'user_1',
      name: 'User 1',
      email: 'user@example.com',
      role: 'tenant',
      status: 'active',
    });
    mockFindTemplate.mockResolvedValue({
      id: 'tpl_paid',
      name: 'Paid Template',
      price: 150000,
      status: 'approved',
    });
    mockFindUserTemplate.mockResolvedValue(null);

    mockCreateInvoice.mockResolvedValue({
      id: 'invoice_xendit_123',
      invoiceNum: 'INV-user_1-12345678',
      invoiceUrl: 'https://checkout.xendit.co/web/invoice_xendit_123',
    });

    const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: 'tpl_paid' }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.invoiceId).toBe('invoice_xendit_123');
    expect(body.data.invoiceUrl).toBe('https://checkout.xendit.co/web/invoice_xendit_123');
    expect(mockCreateInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 150000,
        payerEmail: 'user@example.com',
      })
    );
    expect(mockInsert).toHaveBeenCalled();
  });

  it('should include adminServiceFee and assistedBy when initiated by admin for tenant', async () => {
    mockGetAuthUser.mockResolvedValue({
      id: 'admin_1',
      name: 'Admin Pendamping',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
    });
    mockFindTemplate.mockResolvedValue({
      id: 'tpl_paid',
      name: 'Paid Template',
      price: 50000,
      status: 'approved',
    });
    mockFindUserTemplate.mockResolvedValue(null);

    mockCreateInvoice.mockResolvedValue({
      id: 'invoice_xendit_assisted',
      invoiceNum: 'INV-tenant_1-12345678',
      invoiceUrl: 'https://checkout.xendit.co/web/invoice_xendit_assisted',
    });

    let insertedTransaction: Record<string, unknown> = {};
    mockInsert.mockReturnValue({
      values: vi.fn().mockImplementation((val) => {
        insertedTransaction = val;
        return Promise.resolve(undefined);
      }),
    });

    const request = new Request('http://localhost:4321/api/transactions/template-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: 'tpl_paid',
        tenantId: 'tenant_1',
      }),
    });

    const res = (await POST({
      request,
      params: {},
    } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);

    // Total amount should be template.price (50000) + adminServiceFee (5000) = 55000
    expect(mockCreateInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 55000,
        metadata: expect.objectContaining({
          assistedBy: 'admin_1',
          adminFee: 5000,
        }),
      })
    );

    // Transaction inserted should have total amount 55000, adminFee 5000, assistedBy 'admin_1'
    expect(insertedTransaction.amount).toBe(55000);
    expect(insertedTransaction.adminFee).toBe(5000);
    expect(insertedTransaction.assistedBy).toBe('admin_1');
    expect(insertedTransaction.userId).toBe('tenant_1');
  });
});
