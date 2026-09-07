import { describe, it, expect, vi, beforeEach, afterEach, type Mock, type MockInstance } from 'vitest';
import { POST } from '@/pages/api/admin/media/cleanup';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import * as mediaCleanupModule from '@/services/media/cleanup.service';
import type { MediaCleanupReport } from '@/types';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  isAuthorizedAdmin: vi.fn(),
}));

describe('POST /api/admin/media/cleanup', () => {
  const mockGetAuthUser = getAuthenticatedUser as unknown as Mock;
  const mockIsAuthorizedAdmin = isAuthorizedAdmin as unknown as Mock;
  let mockRunMediaCleanup: MockInstance<typeof mediaCleanupModule.runMediaCleanup>;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'secret123';
    mockRunMediaCleanup = vi.spyOn(mediaCleanupModule, 'runMediaCleanup');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects unauthenticated request without valid CRON secret or admin session', async () => {
    mockGetAuthUser.mockResolvedValue(null);
    mockIsAuthorizedAdmin.mockReturnValue(false);

    const request = new Request('http://localhost/api/admin/media/cleanup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.message).toContain('Admin access or valid CRON secret required');
  });

  it('allows access with x-cron-secret header', async () => {
    mockRunMediaCleanup.mockResolvedValue({
      success: true,
      dryRun: true,
      orphanAssetsCount: 0,
    } as unknown as MediaCleanupReport);

    const request = new Request('http://localhost/api/admin/media/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': 'secret123',
      },
      body: JSON.stringify({ dryRun: true }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockRunMediaCleanup).toHaveBeenCalledWith({
      olderThanHours: 24,
      dryRun: true,
    });
  });

  it('allows access with Bearer CRON_SECRET authorization header', async () => {
    mockRunMediaCleanup.mockResolvedValue({
      success: true,
      dryRun: false,
      orphanAssetsCount: 2,
      deletedAssetsCount: 2,
    } as unknown as MediaCleanupReport);

    const request = new Request('http://localhost/api/admin/media/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer secret123',
      },
      body: JSON.stringify({ dryRun: false, olderThanHours: 48 }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockRunMediaCleanup).toHaveBeenCalledWith({
      olderThanHours: 48,
      dryRun: false,
    });
  });

  it('allows access for authenticated admin session', async () => {
    mockGetAuthUser.mockResolvedValue({ id: 'admin_1', role: 'superadmin' });
    mockIsAuthorizedAdmin.mockReturnValue(true);

    mockRunMediaCleanup.mockResolvedValue({
      success: true,
      dryRun: true,
      orphanAssetsCount: 0,
    } as unknown as MediaCleanupReport);

    const request = new Request('http://localhost/api/admin/media/cleanup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dryRun: true }),
    });

    const res = (await POST({ request, params: {} } as unknown as Parameters<typeof POST>[0])) as Response;

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
