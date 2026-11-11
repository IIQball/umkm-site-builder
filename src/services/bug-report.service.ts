import { and, count, desc, eq, gte, ilike, or } from 'drizzle-orm';
import { db, bugReports, users, type BugReportAttachmentMeta } from '@/db';
import { withDbTimeout } from '@/lib/db/timeout';
import { AppError } from '@/lib/utils/api-handler';
import { logActivity } from '@/services/audit.service';
import type {
  CreateBugReportInput,
  ListBugReportsQuery,
  UpdateBugReportInput,
  BugReportStatus,
  BugReportSource,
} from '@/schemas/bug-report.schema';

export interface BugReportReporterContext {
  userId?: string | null;
  email?: string | null;
  role?: string | null;
}

export interface BugReportRecordView {
  id: string;
  sourceApp: BugReportSource;
  status: BugReportStatus;
  title: string | null;
  description: string;
  stepsToReproduce: string | null;
  routeUrl: string;
  userAgent: string;
  reporterEmail: string | null;
  reporterUserId: string | null;
  reporterRole: string | null;
  reporterName: string | null;
  attachmentMeta: BugReportAttachmentMeta | null;
  adminNotes: string | null;
  resolvedBy: string | null;
  resolverName: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BugReportCounts {
  all: number;
  unresolved: number;
  in_progress: number;
  resolved: number;
}

const BUG_REPORT_SELECT_FIELDS = {
  id: bugReports.id,
  sourceApp: bugReports.sourceApp,
  status: bugReports.status,
  title: bugReports.title,
  description: bugReports.description,
  stepsToReproduce: bugReports.stepsToReproduce,
  routeUrl: bugReports.routeUrl,
  userAgent: bugReports.userAgent,
  reporterEmail: bugReports.reporterEmail,
  reporterUserId: bugReports.reporterUserId,
  reporterRole: bugReports.reporterRole,
  attachmentMeta: bugReports.attachmentMeta,
  adminNotes: bugReports.adminNotes,
  resolvedBy: bugReports.resolvedBy,
  resolvedAt: bugReports.resolvedAt,
  createdAt: bugReports.createdAt,
  updatedAt: bugReports.updatedAt,
  reporterName: users.name,
} as const;

async function assertUserBugReportQuota(userId: string, now: Date): Promise<void> {
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const cooldownAgo = new Date(now.getTime() - 2 * 60 * 1000);

  const recentRows = await withDbTimeout('bugReports.userQuota', async () =>
    db
      .select({ createdAt: bugReports.createdAt })
      .from(bugReports)
      .where(and(eq(bugReports.reporterUserId, userId), gte(bugReports.createdAt, dayAgo)))
      .orderBy(desc(bugReports.createdAt))
      .limit(5)
  );

  if (recentRows.some((row) => row.createdAt >= cooldownAgo)) {
    throw new AppError('Mohon tunggu minimal 2 menit sebelum mengirim laporan bug berikutnya.', 429, undefined, 'RATE_LIMITED');
  }
  if (recentRows.length >= 5) {
    throw new AppError('Batas harian 5 laporan bug per 24 jam telah tercapai.', 429, undefined, 'RATE_LIMITED');
  }
}

/**
 * Inserts a new bug report submitted from either site_builder or landing_page.
 */
export async function createBugReport(
  input: CreateBugReportInput,
  reporter: BugReportReporterContext = {},
  fallbackUserAgent = 'unknown'
) {
  const id = `bug_${crypto.randomUUID()}`;
  const now = new Date();
  if (reporter.userId) {
    await assertUserBugReportQuota(reporter.userId, now);
  }
  const normalizedUserAgent = (input.userAgent || fallbackUserAgent || 'unknown').slice(0, 600);
  const normalizedEmail = (input.reporterEmail || reporter.email || '').trim() || null;

  const [created] = await withDbTimeout('bugReports.create', async () =>
    db
      .insert(bugReports)
      .values({
        id,
        sourceApp: input.sourceApp,
        status: 'unresolved',
        title: input.title?.trim() || null,
        description: input.description.trim(),
        stepsToReproduce: input.stepsToReproduce?.trim() || null,
        routeUrl: input.routeUrl.trim(),
        userAgent: normalizedUserAgent,
        reporterEmail: normalizedEmail,
        reporterUserId: reporter.userId || null,
        reporterRole: reporter.role || 'public',
        attachmentMeta: input.attachmentMeta ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning({
        id: bugReports.id,
        sourceApp: bugReports.sourceApp,
        status: bugReports.status,
        createdAt: bugReports.createdAt,
      })
  );

  return created;
}

async function fetchStatusCounts(): Promise<BugReportCounts> {
  const rows = await withDbTimeout('bugReports.counts', async () =>
    db
      .select({
        status: bugReports.status,
        total: count(),
      })
      .from(bugReports)
      .groupBy(bugReports.status)
  );

  const counts: BugReportCounts = { all: 0, unresolved: 0, in_progress: 0, resolved: 0 };
  for (const row of rows) {
    const qty = Number(row.total) || 0;
    counts.all += qty;
    if (row.status === 'unresolved' || row.status === 'in_progress' || row.status === 'resolved') {
      counts[row.status] = qty;
    }
  }
  return counts;
}

/**
 * Lists bug reports with status, sourceApp, search filter, pagination, and status counts.
 */
export async function listBugReports(query: ListBugReportsQuery) {
  const conditions = [];

  if (query.status !== 'all') {
    conditions.push(eq(bugReports.status, query.status));
  }
  if (query.sourceApp !== 'all') {
    conditions.push(eq(bugReports.sourceApp, query.sourceApp));
  }
  if (query.search && query.search.trim().length > 0) {
    const q = `%${query.search.trim()}%`;
    conditions.push(
      or(
        ilike(bugReports.description, q),
        ilike(bugReports.title, q),
        ilike(bugReports.routeUrl, q),
        ilike(bugReports.reporterEmail, q),
        ilike(bugReports.adminNotes, q)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const offset = (query.page - 1) * query.limit;

  const [[totalRow], rawItems, counts] = await Promise.all([
    withDbTimeout('bugReports.totalCount', async () =>
      db.select({ total: count() }).from(bugReports).where(whereClause)
    ),
    withDbTimeout('bugReports.list', async () =>
      db
        .select(BUG_REPORT_SELECT_FIELDS)
        .from(bugReports)
        .leftJoin(users, eq(bugReports.reporterUserId, users.id))
        .where(whereClause)
        .orderBy(desc(bugReports.createdAt))
        .limit(query.limit)
        .offset(offset)
    ),
    fetchStatusCounts(),
  ]);

  const total = Number(totalRow?.total) || 0;
  const items: BugReportRecordView[] = rawItems.map((row) => ({
    ...row,
    reporterName: row.reporterName ?? null,
    resolverName: null,
  }));

  return {
    items,
    counts,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

/**
 * Fetches full details for a single bug report by ID.
 */
export async function getBugReportById(id: string): Promise<BugReportRecordView> {
  const [row] = await withDbTimeout('bugReports.getById', async () =>
    db
      .select(BUG_REPORT_SELECT_FIELDS)
      .from(bugReports)
      .leftJoin(users, eq(bugReports.reporterUserId, users.id))
      .where(eq(bugReports.id, id))
      .limit(1)
  );

  if (!row) {
    throw new AppError('Laporan bug tidak ditemukan', 404, undefined, 'NOT_FOUND');
  }

  let resolverName: string | null = null;
  if (row.resolvedBy) {
    const [resolver] = await withDbTimeout('bugReports.resolver', async () =>
      db.select({ name: users.name }).from(users).where(eq(users.id, row.resolvedBy!)).limit(1)
    );
    resolverName = resolver?.name ?? null;
  }

  return {
    ...row,
    reporterName: row.reporterName ?? null,
    resolverName,
  };
}

/**
 * Updates a bug report status and optional admin notes, recording audit activity.
 */
export async function updateBugReportStatus(
  id: string,
  input: UpdateBugReportInput,
  actorUserId: string
): Promise<BugReportRecordView> {
  const existing = await getBugReportById(id);
  const now = new Date();
  const nextResolvedBy = input.status === 'resolved' ? actorUserId : null;
  const nextResolvedAt = input.status === 'resolved' ? existing.resolvedAt || now : null;
  const nextAdminNotes =
    input.adminNotes !== undefined ? (input.adminNotes?.trim() || null) : existing.adminNotes;

  await withDbTimeout('bugReports.updateStatus', async () =>
    db
      .update(bugReports)
      .set({
        status: input.status,
        adminNotes: nextAdminNotes,
        resolvedBy: nextResolvedBy,
        resolvedAt: nextResolvedAt,
        updatedAt: now,
      })
      .where(eq(bugReports.id, id))
  );

  await logActivity({
    userId: actorUserId,
    action: 'Update Bug Report Status',
    details: { bugReportId: id, previousStatus: existing.status, newStatus: input.status },
  });

  return getBugReportById(id);
}

