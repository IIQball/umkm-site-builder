import type { APIRoute } from "astro";
import { db, notifications } from "@/db";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { handleApiRoute, AppError, jsonSuccess } from "@/lib/utils";

export const POST: APIRoute = async ({ request }) => {
  return handleApiRoute(async () => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      throw new AppError("Unauthorized", 401);
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, session.user.id), eq(notifications.isRead, false)));

    return jsonSuccess({ success: true });
  });
};
