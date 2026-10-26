import { db } from '@/lib/db/client';
import { activityLogs, users, stores } from '@/db/schema';
import { desc, eq, sql, or, and } from 'drizzle-orm';
import { AppError } from '@/lib/utils';
import { DEFAULT_AUDIT_ACTIONS } from './audit.constants';

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  callerRole?: string;
  callerId?: string;
  actionFilter?: string;
  roleFilter?: string;
}

export interface LogActivityParams {
  userId: string;
  action: string;
  storeId?: string | null;
  details?: Record<string, unknown>;
}

/**
 * Record an activity to the audit log.
 * Safe and non-blocking: never throws to avoid breaking user flows.
 * Strictly excludes login/logout events.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    if (!params.userId || !params.action) return;

    const lowerAction = params.action.toLowerCase();
    if (
      lowerAction.includes('login') ||
      lowerAction.includes('logout') ||
      lowerAction.includes('sign in') ||
      lowerAction.includes('sign out')
    ) {
      return;
    }

    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      userId: params.userId,
      storeId: params.storeId || null,
      action: params.action,
      details: params.details || {},
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('[AuditService] Failed to record activity log:', error);
  }
}

export async function getAuditLogs(params: GetAuditLogsParams = {}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const offset = (page - 1) * limit;

  try {
    const conditions = [];
    
    if (params.callerRole === 'admin' && params.callerId) {
      conditions.push(or(
        eq(activityLogs.userId, params.callerId),
        eq(users.registeredBy, params.callerId)
      ));
    }

    if (params.actionFilter && params.actionFilter !== 'all') {
      conditions.push(eq(activityLogs.action, params.actionFilter));
    }

    if (params.roleFilter && params.roleFilter !== 'all') {
      conditions.push(eq(users.role, params.roleFilter as typeof users.$inferSelect.role));
    }

    const finalWhere = conditions.length > 0 ? and(...conditions) : undefined;

    const baseQuery = db
      .select({ count: sql<number>`count(${activityLogs.id})`.mapWith(Number) })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id));

    if (finalWhere) {
      baseQuery.where(finalWhere);
    }

    const [countResult] = await baseQuery;

    const total = countResult?.count || 0;
    const totalPages = Math.ceil(total / limit);

    const logsQuery = db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        details: activityLogs.details,
        createdAt: activityLogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        store: {
          id: stores.id,
          name: stores.name,
        }
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .leftJoin(stores, eq(activityLogs.storeId, stores.id))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit)
      .offset(offset);

    if (finalWhere) {
      logsQuery.where(finalWhere);
    }

    const logs = await logsQuery;

    return {
      data: logs,
      meta: {
        page,
        limit,
        total,
        totalPages,
      }
    };
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    throw new AppError('Failed to retrieve audit logs', 500, undefined, 'INTERNAL_ERROR');
  }
}

/**
 * Retrieve all unique activity log actions recorded in the database.
 * Merged with predefined default system actions to ensure comprehensive coverage.
 */
export async function getDistinctAuditActions(): Promise<string[]> {
  try {
    const records = await db
      .selectDistinct({ action: activityLogs.action })
      .from(activityLogs);

    const dbActions = records.map((r) => r.action).filter(Boolean);
    const unique = Array.from(new Set([...DEFAULT_AUDIT_ACTIONS, ...dbActions])).sort();
    return unique;
  } catch (error) {
    console.error('[AuditService] Failed to get distinct audit actions:', error);
    return [...DEFAULT_AUDIT_ACTIONS].sort();
  }
}
