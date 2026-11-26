import type { APIRoute } from "astro";
import { db, notifications } from "@/db";
import { eq, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth";
import { handleApiRoute, AppError, jsonSuccess } from "@/lib/utils";

export const GET: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return jsonSuccess(userNotifications);
  });
};
