import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET as listReportsGet } from '@/pages/api/superadmin/bug-reports/index';
import { GET as getReportByIdGet, PATCH as patchReportById } from '@/pages/api/superadmin/bug-reports/[id]';
import * as authLib from '@/lib/auth';
import * as bugReportService from '@/services/bug-report.service';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));

vi.mock('@/services/bug-report.service', () => ({
  createBugReport: vi.fn(),
  listBugReports: vi.fn(),
  getBugReportById: vi.fn(),
  updateBugReportStatus: vi.fn(),
}));

type ListContext = Parameters<typeof listReportsGet>[0];
type DetailContext = Parameters<typeof getReportByIdGet>[0];
type PatchContext = Parameters<typeof patchReportById>[0];

describe('Superadmin Bug Report Management API (/api/superadmin/bug-reports)', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockListBugReports = bugReportService.listBugReports as unknown as Mock;
  const mockGetBugReportById = bugReportService.getBugReportById as unknown as Mock;
  const mockUpdateBugReportStatus = bugReportService.updateBugReportStatus as unknown as Mock;

  const superadminUser = {
    id: 'usr_superadmin_1',
    name: 'Super Admin',
    email: 'superadmin@pinoka.id',
    role: 'superadmin' as const,
    status: 'active' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Strict RBAC Authorization', () => {
    it('returns 401 UNAUTHORIZED when unauthenticated', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const url = new URL('http://localhost:4321/api/superadmin/bug-reports');
      const res = await listReportsGet({
        request: new Request(url),
        url,
        params: {},
      } as unknown as ListContext);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.meta?.code).toBe('UNAUTHORIZED');
    });

    it.each(['tenant', 'designer', 'admin'] as const)(
      'returns 403 FORBIDDEN for role %s on list and detail update',
      async (role) => {
        mockGetAuthUser.mockResolvedValue({
          id: `usr_${role}_1`,
          name: `User ${role}`,
          email: `${role}@pinoka.id`,
          role,
          status: 'active',
        });

        const url = new URL('http://localhost:4321/api/superadmin/bug-reports');
        const listRes = await listReportsGet({
          request: new Request(url),
          url,
          params: {},
        } as unknown as ListContext);
        expect(listRes.status).toBe(403);
        const listBody = await listRes.json();
        expect(listBody.success).toBe(false);
        expect(listBody.meta?.code).toBe('FORBIDDEN');

        const patchReq = new Request('http://localhost:4321/api/superadmin/bug-reports/bug_1', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'resolved' }),
        });
        const patchRes = await patchReportById({
          request: patchReq,
          params: { id: 'bug_1' },
        } as unknown as PatchContext);
        expect(patchRes.status).toBe(403);
      }
    );
  });

  describe('GET /api/superadmin/bug-reports', () => {
    it('returns paginated list, counts, and forwards filter params for superadmin', async () => {
      mockGetAuthUser.mockResolvedValue(superadminUser);
      mockListBugReports.mockResolvedValue({
        items: [
          {
            id: 'bug_1',
            sourceApp: 'site_builder',
            status: 'in_progress',
            title: 'Layout overflow',
            description: 'Tabel meluber di mobile',
            stepsToReproduce: null,
            routeUrl: '/admin/merchants',
            userAgent: 'Chrome Mobile',
            reporterEmail: 'admin@pinoka.id',
            reporterUserId: 'usr_1',
            reporterRole: 'admin',
            reporterName: 'Admin Dampingan',
            attachmentMeta: null,
            adminNotes: 'Sedang dicek',
            resolvedBy: null,
            resolverName: null,
            resolvedAt: null,
            createdAt: new Date('2026-11-10T10:00:00Z'),
            updatedAt: new Date('2026-11-10T11:00:00Z'),
          },
        ],
        pagination: { page: 2, limit: 10, total: 11, totalPages: 2 },
        counts: { all: 15, unresolved: 8, in_progress: 4, resolved: 3 },
      });

      const url = new URL(
        'http://localhost:4321/api/superadmin/bug-reports?status=in_progress&sourceApp=site_builder&search=overflow&page=2&limit=10'
      );
      const res = await listReportsGet({
        request: new Request(url),
        url,
        params: {},
      } as unknown as ListContext);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(1);
      expect(body.meta?.pagination?.totalPages).toBe(2);
      expect(body.meta?.counts?.in_progress).toBe(4);
      expect(mockListBugReports).toHaveBeenCalledWith({
        status: 'in_progress',
        sourceApp: 'site_builder',
        search: 'overflow',
        page: 2,
        limit: 10,
      });
    });
  });

  describe('GET & PATCH /api/superadmin/bug-reports/[id]', () => {
    it('returns full bug report details for authorized superadmin', async () => {
      mockGetAuthUser.mockResolvedValue(superadminUser);
      mockGetBugReportById.mockResolvedValue({
        id: 'bug_detail_1',
        sourceApp: 'landing_page',
        status: 'unresolved',
        title: 'Header flicker',
        description: 'Navbar berkedip saat scroll cepat.',
        stepsToReproduce: 'Scroll halaman beranda',
        routeUrl: 'https://pinoka.id/',
        userAgent: 'Safari/17',
        reporterEmail: 'user@umkm.id',
        reporterUserId: null,
        reporterRole: 'public',
        reporterName: null,
        attachmentMeta: { name: 'shot.png', size: 2048, mimeType: 'image/png' },
        adminNotes: null,
        resolvedBy: null,
        resolverName: null,
        resolvedAt: null,
        createdAt: new Date('2026-11-10T10:00:00Z'),
        updatedAt: new Date('2026-11-10T10:00:00Z'),
      });

      const res = await getReportByIdGet({
        request: new Request('http://localhost:4321/api/superadmin/bug-reports/bug_detail_1'),
        params: { id: 'bug_detail_1' },
      } as unknown as DetailContext);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.id).toBe('bug_detail_1');
      expect(body.data.attachmentMeta.name).toBe('shot.png');
    });

    it('rejects invalid status value with 400 VALIDATION_ERROR', async () => {
      mockGetAuthUser.mockResolvedValue(superadminUser);

      const req = new Request('http://localhost:4321/api/superadmin/bug-reports/bug_1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived_invalid' }),
      });

      const res = await patchReportById({
        request: req,
        params: { id: 'bug_1' },
      } as unknown as PatchContext);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.meta?.code).toBe('VALIDATION_ERROR');
      expect(mockUpdateBugReportStatus).not.toHaveBeenCalled();
    });

    it('updates status to resolved and saves admin notes for superadmin', async () => {
      mockGetAuthUser.mockResolvedValue(superadminUser);
      mockUpdateBugReportStatus.mockResolvedValue({
        id: 'bug_1',
        status: 'resolved',
        adminNotes: 'Sudah diperbaiki di rilis v1.2',
        resolvedBy: 'usr_superadmin_1',
      });

      const req = new Request('http://localhost:4321/api/superadmin/bug-reports/bug_1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          adminNotes: 'Sudah diperbaiki di rilis v1.2',
        }),
      });

      const res = await patchReportById({
        request: req,
        params: { id: 'bug_1' },
      } as unknown as PatchContext);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('resolved');
      expect(mockUpdateBugReportStatus).toHaveBeenCalledWith(
        'bug_1',
        { status: 'resolved', adminNotes: 'Sudah diperbaiki di rilis v1.2' },
        'usr_superadmin_1'
      );
    });
  });
});

