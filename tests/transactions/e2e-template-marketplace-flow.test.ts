import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { POST as reviewTemplateApi } from '@/pages/api/admin/templates/[id]/review';
import { saveSettings as saveCommissionApi } from '@/pages/api/admin/settings/commission';
import { POST as purchaseTemplateApi } from '@/pages/api/tenant/transactions/template-purchase';
import { POST as xenditWebhookApi } from '@/pages/api/webhooks/xendit';
import { db } from '@/lib/db/client';
import * as authLib from '@/lib/auth';
import { xenditClient } from '@/lib/finance/xendit';
import type { AuthenticatedUser } from '@/types';

type CommissionPayload = { totalAmount?: number; platformFee?: number; designerAmount?: number };
type WalletUpdatePayload = { balance?: number };
type MutationPayload = { amount?: number; balanceAfter?: number; type?: string };

vi.mock('@/lib/db/client', () => {
  const mockDb = {
    query: {
      templates: { findFirst: vi.fn() },
      userTemplates: { findFirst: vi.fn() },
      users: { findFirst: vi.fn() },
    },
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  };
  return { db: mockDb, getDb: () => mockDb };
});

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAdmin: (u: AuthenticatedUser | null) => !!u && (u.role === 'admin' || u.role === 'superadmin'),
  isAuthorizedAdmin: (u: AuthenticatedUser | null) => !!u && u.status === 'active' && (u.role === 'admin' || u.role === 'superadmin'),
  isDesigner: (u: AuthenticatedUser | null) => !!u && (u.role === 'designer' || u.role === 'admin' || u.role === 'superadmin'),
  isAuthorizedDesigner: (u: AuthenticatedUser | null) => !!u && u.status === 'active' && (u.role === 'designer' || u.role === 'admin' || u.role === 'superadmin'),
}));

vi.mock('@/lib/finance/xendit', () => ({
  xenditClient: {
    createInvoice: vi.fn(),
    verifyWebhookSignature: vi.fn().mockReturnValue(true),
  },
}));

describe('E2E Template Marketplace Flow', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockFindTemplate = db.query.templates.findFirst as unknown as Mock;
  const mockFindUserTemplate = db.query.userTemplates.findFirst as unknown as Mock;
  const mockSelect = db.select as unknown as Mock;
  const mockInsert = db.insert as unknown as Mock;
  const mockUpdate = db.update as unknown as Mock;
  const mockCreateInvoice = xenditClient.createInvoice as unknown as Mock;

  const adminUser: AuthenticatedUser = { id: 'admin_1', name: 'Super Admin', email: 'admin@example.com', role: 'superadmin', status: 'active' };
  const tenantUser: AuthenticatedUser = { id: 'tenant_1', name: 'UMKM Bakso', email: 'tenant@example.com', role: 'tenant', status: 'active' };
  const sampleTemplate = {
    id: 'tpl_kuliner_1',
    name: 'Template Kuliner Premium',
    description: 'Template untuk warung makan & cafe',
    price: 200000,
    config: { pages: [], theme: {} },
    status: 'pending' as const,
    designerId: 'designer_1',
    approvedBy: null,
    rejectionReason: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.XENDIT_WEBHOOK_SECRET = 'test_token';
  });

  it('should execute full template review, commission setting, purchase, and wallet fulfillment flow', async () => {
    // Step 1: Admin reviews and approves pending template
    mockGetAuthUser.mockResolvedValueOnce(adminUser);
    mockFindTemplate.mockResolvedValueOnce(sampleTemplate);
    const approvedTemplate = { ...sampleTemplate, status: 'approved' as const, approvedBy: adminUser.id, rejectionReason: null };
    mockUpdate.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValueOnce([approvedTemplate]) }) }) });

    const reviewRes = (await reviewTemplateApi({
      request: new Request('http://localhost:4321/api/admin/templates/tpl_kuliner_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      }),
      params: { id: 'tpl_kuliner_1' },
    } as unknown as Parameters<typeof reviewTemplateApi>[0])) as Response;

    expect(reviewRes.status).toBe(200);
    const reviewData = await reviewRes.json();
    expect(reviewData.success).toBe(true);
    expect(reviewData.template.status).toBe('approved');

    // Step 2: Admin sets dynamic platform fee percentage to 20%
    mockGetAuthUser.mockResolvedValueOnce(adminUser);
    mockSelect.mockReturnValueOnce({ from: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValueOnce([{ id: 'ps_1', platformFeePercentage: 30 }]) }) });
    mockUpdate.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValueOnce([{ id: 'ps_1', platformFeePercentage: 20, updatedBy: adminUser.id, updatedAt: new Date() }]) }) }) });

    const settingRes = (await saveCommissionApi({
      request: new Request('http://localhost:4321/api/admin/settings/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformFeePercentage: 20 }),
      }),
      params: {},
    } as unknown as Parameters<typeof saveCommissionApi>[0])) as Response;

    expect(settingRes.status).toBe(200);
    const settingData = await settingRes.json();
    expect(settingData.success).toBe(true);
    expect(settingData.data.platformFeePercentage).toBe(20);

    // Step 3: Tenant purchases the approved template
    mockGetAuthUser.mockResolvedValueOnce(tenantUser);
    mockSelect.mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValueOnce([tenantUser]),
        }),
      }),
    });
    mockFindTemplate.mockResolvedValueOnce(approvedTemplate);
    mockFindUserTemplate.mockResolvedValueOnce(null);
    mockCreateInvoice.mockResolvedValueOnce({ id: 'inv_xendit_e2e_123', invoiceNum: 'INV-tenant_1-12345', invoiceUrl: 'https://checkout.xendit.co/web/inv_xendit_e2e_123' });
    mockInsert.mockReturnValueOnce({ values: vi.fn().mockResolvedValueOnce(undefined) });

    const purchaseRes = (await purchaseTemplateApi({
      request: new Request('http://localhost:4321/api/transactions/template-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: 'tpl_kuliner_1' }),
      }),
      params: {},
    } as unknown as Parameters<typeof purchaseTemplateApi>[0])) as Response;

    expect(purchaseRes.status).toBe(200);
    const purchaseData = await purchaseRes.json();
    expect(purchaseData.ok).toBe(true);
    expect(purchaseData.data.invoiceId).toBe('inv_xendit_e2e_123');

    // Step 4: Simulate Xendit webhook callback for paid invoice
    mockSelect.mockReturnValueOnce({ from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValueOnce([{ id: 'txn_e2e_1', userId: tenantUser.id, type: 'template_purchase', templateId: 'tpl_kuliner_1', amount: 200000, status: 'pending' }]) }) });
    mockUpdate.mockReturnValueOnce({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValueOnce(undefined) }) });
    mockInsert.mockReturnValueOnce({ values: vi.fn().mockResolvedValueOnce(undefined) });
    mockSelect.mockReturnValueOnce({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValueOnce([approvedTemplate]) }) }) });
    mockSelect.mockReturnValueOnce({ from: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValueOnce([{ platformFeePercentage: 20 }]) }) });

    let recordedCommissionPayload: CommissionPayload = {};
    mockInsert.mockReturnValueOnce({ values: vi.fn().mockImplementation((payload: CommissionPayload) => { recordedCommissionPayload = payload; return Promise.resolve(undefined); }) });
    mockSelect.mockReturnValueOnce({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValueOnce([{ id: 'w_virda', designerId: 'designer_1', balance: 50000 }]) }) }) });

    let recordedWalletUpdate: WalletUpdatePayload = {};
    mockUpdate.mockReturnValueOnce({ set: vi.fn().mockImplementation((payload: WalletUpdatePayload) => { recordedWalletUpdate = payload; return { where: vi.fn().mockResolvedValueOnce(undefined) }; }) });

    let recordedMutationPayload: MutationPayload = {};
    mockInsert.mockReturnValueOnce({ values: vi.fn().mockImplementation((payload: MutationPayload) => { recordedMutationPayload = payload; return { returning: vi.fn().mockResolvedValueOnce([{ id: 'wm_e2e_1', walletId: 'w_virda', type: 'CREDIT', amount: 160000, balanceAfter: 210000 }]) }; }) });

    const webhookRes = (await xenditWebhookApi({
      request: new Request('http://localhost:4321/api/webhooks/xendit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-callback-token': 'test_token' },
        body: JSON.stringify({ id: 'xendit_webhook_e2e_1', external_id: 'INV-tenant_1-12345', amount: 200000, status: 'PAID', paid: true }),
      }),
      params: {},
    } as unknown as Parameters<typeof xenditWebhookApi>[0])) as Response;

    expect(webhookRes.status).toBe(200);
    expect((await webhookRes.json()).ok).toBe(true);

    // Verification step: Verify calculations & record assertions
    expect(recordedCommissionPayload.totalAmount).toBe(200000);
    expect(recordedCommissionPayload.platformFee).toBe(40000);
    expect(recordedCommissionPayload.designerAmount).toBe(160000);
    expect(recordedWalletUpdate.balance).toBe(210000);
    expect(recordedMutationPayload.amount).toBe(160000);
    expect(recordedMutationPayload.balanceAfter).toBe(210000);
    expect(recordedMutationPayload.type).toBe('CREDIT');
  });
});
