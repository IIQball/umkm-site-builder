import { auth, getAuthenticatedUser } from "@/lib/auth";
import type { APIRoute } from "astro";
import { logger } from '@/lib/utils/logger';
import { jsonError } from '@/lib/utils/api-handler';

export const ALL: APIRoute = async (ctx) => {
  try {
    if (ctx.url.pathname.replace(/\/$/, "") === "/api/auth/sign-up/email") {
      return jsonError("Gunakan formulir pendaftaran terverifikasi.", 403, undefined, "FORBIDDEN");
    }
    const path = ctx.url.pathname.replace(/\/$/, "");
    const publicAuthFlow = ["sign-out", "reset-password", "request-password-reset", "forget-password", "verify-email", "send-verification-email"]
      .some(route => path === `/api/auth/${route}`) || (ctx.request.method === 'GET' && /^\/api\/auth\/reset-password\/[^/]+$/.test(path)) || path.startsWith('/api/auth/sign-in/') || path.startsWith('/api/auth/callback/');
    if (!publicAuthFlow) {
      const session = await auth.api.getSession({ headers: ctx.request.headers });
      if (session?.user && !await getAuthenticatedUser(ctx.request)) {
        return jsonError("Akun tidak aktif.", 403, undefined, "FORBIDDEN");
      }
    }
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
    return jsonError('Terjadi kesalahan layanan autentikasi.', 500, undefined, 'INTERNAL_ERROR');
  }
};

