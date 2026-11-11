import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { assertSuperAdminAction } from '@/lib/auth/guards';
import { AppError, handleApiRoute, jsonSuccess, parseJsonBody, validate } from '@/lib/utils';
import { UpdateBugReportSchema } from '@/schemas/bug-report.schema';
import { getBugReportById, updateBugReportStatus } from '@/services/bug-report.service';

const BUG_REPORTS_FORBIDDEN_MSG = 'Hanya superadmin yang diizinkan mengelola laporan bug';

export const GET: APIRoute = async ({ request, params }) => {
  return handleApiRoute(async () => {
    assertSuperAdminAction(
      await getAuthenticatedUser(request),
      'bug_reports',
      'read',
      BUG_REPORTS_FORBIDDEN_MSG
    );

    const reportId = params.id;
    if (!reportId) {
      throw new AppError('ID laporan bug wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const report = await getBugReportById(reportId);
    return jsonSuccess(report, 200, 'Detail laporan bug berhasil dimuat');
  });
};

export const PATCH: APIRoute = async ({ request, params }) => {
  return handleApiRoute(async () => {
    const actor = assertSuperAdminAction(
      await getAuthenticatedUser(request),
      'bug_reports',
      'update',
      BUG_REPORTS_FORBIDDEN_MSG
    );

    const reportId = params.id;
    if (!reportId) {
      throw new AppError('ID laporan bug wajib diisi', 400, undefined, 'VALIDATION_ERROR');
    }

    const body = await parseJsonBody(request);
    const input = validate(UpdateBugReportSchema, body);
    const updated = await updateBugReportStatus(reportId, input, actor.id);

    return jsonSuccess(updated, 200, 'Status laporan bug berhasil diperbarui');
  });
};

