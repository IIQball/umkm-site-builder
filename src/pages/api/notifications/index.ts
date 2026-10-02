import type { APIRoute } from "astro";
import { db, notifications } from "@/db";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { handleApiRoute, AppError, jsonSuccess } from "@/lib/utils";

export const GET: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      throw new AppError("Unauthorized", 401);
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return jsonSuccess(userNotifications);
  });
};
