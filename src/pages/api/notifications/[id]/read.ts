import type { APIRoute } from "astro";
import { db, notifications } from "@/db";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { handleApiRoute, AppError, jsonSuccess } from "@/lib/utils";

export const POST: APIRoute = async ({ request, params }) => {
  return handleApiRoute(async () => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { id } = params;
    if (!id) {
      throw new AppError("Missing notification id", 400);
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, session.user.id)));

    return jsonSuccess({ success: true });
  });
};
