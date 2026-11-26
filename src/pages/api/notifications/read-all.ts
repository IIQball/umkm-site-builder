import type { APIRoute } from "astro";
import { db, notifications } from "@/db";
import { eq, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth";
import { handleApiRoute, AppError, jsonSuccess } from "@/lib/utils";

export const POST: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, user.id), eq(notifications.isRead, false)));

    return jsonSuccess({ success: true });
  });
};
