import { db } from '@/lib/db/client';
import { activityLogs, users, stores } from '@/db/schema';
import { desc, eq, sql, or, and } from 'drizzle-orm';
import { AppError } from '@/lib/utils';

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  callerRole?: string;
  callerId?: string;
  actionFilter?: string;
  roleFilter?: string;
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
