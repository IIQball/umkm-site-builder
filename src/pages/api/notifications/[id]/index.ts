import type { APIRoute } from "astro";
import { db, notifications } from "@/db";
import { eq, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth";
import { handleApiRoute, AppError, jsonSuccess } from "@/lib/utils";

export const DELETE: APIRoute = async ({ request, params }) => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const { id } = params;
    if (!id) {
      throw new AppError("Missing notification id", 400);
    }

    await db
      .delete(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));

    return jsonSuccess({ success: true });
  });
};
