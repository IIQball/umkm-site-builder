import type { APIRoute } from 'astro';
import { getAuthenticatedUser } from '@/lib/auth';
import { assertSuperAdminAction } from '@/lib/auth/guards';
import { handleApiRoute, jsonSuccess, validate } from '@/lib/utils';
import { ListBugReportsQuerySchema } from '@/schemas/bug-report.schema';
import { listBugReports } from '@/services/bug-report.service';

export const GET: APIRoute = async ({ request, url }) => {
  return handleApiRoute(async () => {
    assertSuperAdminAction(
      await getAuthenticatedUser(request),
      'bug_reports',
      'read',
      'Hanya superadmin yang diizinkan mengakses laporan bug'
    );

    const rawQuery = {
      status: url.searchParams.get('status') || undefined,
      sourceApp: url.searchParams.get('sourceApp') || undefined,
      search: url.searchParams.get('search') || undefined,
      page: url.searchParams.get('page') || undefined,
      limit: url.searchParams.get('limit') || undefined,
    };

    const query = validate(ListBugReportsQuerySchema, rawQuery);
    const result = await listBugReports(query);

    return jsonSuccess(result.items, 200, 'Daftar laporan bug berhasil dimuat', {
      pagination: result.pagination,
      counts: result.counts,
    });
  });
};

