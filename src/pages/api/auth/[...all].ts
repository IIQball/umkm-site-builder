import { auth } from "@/lib/auth";
import type { APIRoute } from "astro";
import { logger } from '@/lib/utils/logger';

export const ALL: APIRoute = async (ctx) => {
  try {
    const response = await auth.handler(ctx.request);

    // If OAuth callback returns an error response instead of redirecting
    if (ctx.url.pathname.includes("/callback") && !response.ok && response.status !== 302 && response.status !== 307) {
      return ctx.redirect("/auth/login?error=unauthorized_email");
    }

    return response;
  } catch (error) {
    logger.error('auth-handler', error);
    if (ctx.url.pathname.includes("/callback")) {
      return ctx.redirect("/auth/login?error=unauthorized_email");
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

