import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { APIContext } from 'astro';
import { POST } from '../../../../src/pages/api/stores/[storeId]/apply-template';

vi.mock('../../../../src/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

vi.mock('../../../../src/services/store-template.service', () => ({
  validateTemplateOwnership: vi.fn(),
  applyTemplateToStore: vi.fn(),
}));

import { getAuthenticatedUser } from '../../../../src/lib/auth';
import {
  validateTemplateOwnership,
  applyTemplateToStore,
} from '../../../../src/services/store-template.service';
import { AppError } from '../../../../src/lib/utils/api-handler';

function makeContext(storeId: string, body: unknown): APIContext {
  const request = new Request('http://localhost/api/stores/' + storeId + '/apply-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { request, params: { storeId } } as unknown as APIContext;
}

describe('Apply Template API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if not authenticated', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue(null);
    const ctx = makeContext('store-1', { templateId: 'tpl-1' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.ok).toBe(false);
  });

  it('returns 403 if user is not tenant', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'designer', status: 'active' });
    const ctx = makeContext('store-1', { templateId: 'tpl-1' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.ok).toBe(false);
  });

  it('returns 400 if templateId missing', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' });
    const ctx = makeContext('store-1', {});
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.ok).toBe(false);
  });

  it('returns 404 if store not found', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' });
    (validateTemplateOwnership as Mock).mockRejectedValue(
      new AppError('Toko tidak ditemukan', 404, undefined, 'STORE_NOT_FOUND')
    );

    const ctx = makeContext('store-nonexistent', { templateId: 'tpl-1' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.ok).toBe(false);
  });

  it('returns 403 if store belongs to different user', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' });
    (validateTemplateOwnership as Mock).mockRejectedValue(
      new AppError('Anda tidak memiliki akses ke toko ini', 403, undefined, 'STORE_FORBIDDEN')
    );

    const ctx = makeContext('store-1', { templateId: 'tpl-1' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.ok).toBe(false);
  });

  it('returns 404 if template not found or not approved', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' });
    (validateTemplateOwnership as Mock).mockRejectedValue(
      new AppError('Template tidak ditemukan atau belum disetujui', 404, undefined, 'TEMPLATE_NOT_FOUND')
    );

    const ctx = makeContext('store-1', { templateId: 'tpl-draft' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.ok).toBe(false);
  });

  it('returns 403 if paid template not owned', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' });
    (validateTemplateOwnership as Mock).mockResolvedValue({
      store: { id: 'store-1', userId: 'u1', templateId: 'tpl-old' },
      template: { id: 'tpl-paid', name: 'Premium', price: 50000, config: {}, status: 'approved' },
      owned: false,
    });

    const ctx = makeContext('store-1', { templateId: 'tpl-paid' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.ok).toBe(false);
  });

  it('successfully applies a free template', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' });
    (validateTemplateOwnership as Mock).mockResolvedValue({
      store: { id: 'store-1', userId: 'u1', templateId: 'tpl-old' },
      template: { id: 'tpl-free', name: 'Basic', price: 0, config: { theme: {}, sections: [] }, status: 'approved' },
      owned: true,
    });
    (applyTemplateToStore as Mock).mockResolvedValue(undefined);

    const ctx = makeContext('store-1', { templateId: 'tpl-free' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.data.templateId).toBe('tpl-free');
    expect(data.data.templateName).toBe('Basic');
  });

  it('successfully applies a paid template if owned', async () => {
    (getAuthenticatedUser as Mock).mockResolvedValue({ id: 'u1', role: 'tenant', status: 'active' });
    (validateTemplateOwnership as Mock).mockResolvedValue({
      store: { id: 'store-1', userId: 'u1', templateId: 'tpl-old' },
      template: { id: 'tpl-paid', name: 'Premium', price: 50000, config: { theme: {}, sections: [] }, status: 'approved' },
      owned: true,
    });
    (applyTemplateToStore as Mock).mockResolvedValue(undefined);

    const ctx = makeContext('store-1', { templateId: 'tpl-paid' });
    const res = (await POST(ctx)) as Response;
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.data.templateName).toBe('Premium');
  });
});
