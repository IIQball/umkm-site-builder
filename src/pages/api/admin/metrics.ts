import type { APIRoute } from 'astro';
import { db, transactions, activityLogs, templates, payoutRequests, users } from '@/db/index';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';
import { handleApiRoute, jsonSuccess, AppError } from '@/lib/utils';
import { eq, sql, desc } from 'drizzle-orm';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    
    if (!user) {
      throw new AppError('Unauthorized', 401);
    }
    if (!isAuthorizedAdmin(user)) {
      throw new AppError('Admin access required', 403);
    }

    // 1. Total Transactions
    const [transactionsResult] = await db
      .select({ count: sql<number>`count(${transactions.id})`.mapWith(Number) })
      .from(transactions);
      
    // 2. Total Revenue (status = 'success')
    const [revenueResult] = await db
      .select({ total: sql<number>`sum(${transactions.amount})`.mapWith(Number) })
      .from(transactions)
      .where(eq(transactions.status, 'success'));

    // 3. Total Activity Logs
    const [activityResult] = await db
      .select({ count: sql<number>`count(${activityLogs.id})`.mapWith(Number) })
      .from(activityLogs);

    // 4. Unique Active Users from Activity Logs
    const [usersResult] = await db
      .select({ count: sql<number>`count(distinct ${activityLogs.userId})`.mapWith(Number) })
      .from(activityLogs);

    // 5. Pending Templates
    const [pendingTemplatesResult] = await db
      .select({ count: sql<number>`count(${templates.id})`.mapWith(Number) })
      .from(templates)
      .where(eq(templates.status, 'pending'));

    // 6. Pending Payouts
    const [pendingPayoutsResult] = await db
      .select({ count: sql<number>`count(${payoutRequests.id})`.mapWith(Number) })
      .from(payoutRequests)
      .where(eq(payoutRequests.status, 'pending'));

    // 7. Recent Transactions (last 5)
    const recentTransactions = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        status: transactions.status,
        type: transactions.type,
        createdAt: transactions.createdAt,
        userName: users.name,
      })
      .from(transactions)
      .leftJoin(users, eq(transactions.userId, users.id))
      .orderBy(desc(transactions.createdAt))
      .limit(5);

    // 8. Recent Activities (last 5)
    const recentActivities = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        createdAt: activityLogs.createdAt,
        userName: users.name,
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .orderBy(desc(activityLogs.createdAt))
      .limit(5);

    const metrics = {
      totalTransactions: transactionsResult?.count || 0,
      totalRevenue: revenueResult?.total || 0,
      totalActivityLogs: activityResult?.count || 0,
      uniqueActiveUsers: usersResult?.count || 0,
      
      pendingTemplates: pendingTemplatesResult?.count || 0,
      pendingPayouts: pendingPayoutsResult?.count || 0,
      
      recentTransactions,
      recentActivities,
    };

    return jsonSuccess(metrics);
  });
};
