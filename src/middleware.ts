import { defineMiddleware } from "astro:middleware";
import { auth } from "@/lib/auth";
import { db, users, stores } from "@/db";
import { eq, and, isNull } from "drizzle-orm";
import { InMemoryRateLimiter, extractClientIp } from "@/lib/utils/rate-limiter";
import { extractSubdomain } from "@/lib/domain";
import { jsonError } from "@/lib/utils/api-handler";
import { classifyServerError, registerGlobalRejectionHandler } from "@/lib/utils/error-sanitizer";
import { errorLog } from "@/lib/utils/logger";
import { isStoreFullyOnboarded } from "@/services/stores";

registerGlobalRejectionHandler();

// Inisialisasi Rate Limiter untuk API:
// 1. Read (GET): Longgar untuk memuat data (30 request / menit)
const apiReadLimiter = new InMemoryRateLimiter(30, 60 * 1000);
// 2. Write (POST/PUT/DELETE): Ketat untuk mencegah spam klik (5 request / menit)
const apiWriteLimiter = new InMemoryRateLimiter(5, 60 * 1000);
// 3. Subdomain Check: Live availability check saat mengetik (60 request / menit)
const apiCheckSubdomainLimiter = new InMemoryRateLimiter(60, 60 * 1000);

function renderServiceUnavailableHtml(status: number, message: string): Response {
  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Layanan Sementara Terganggu - Pinoka</title>
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#faf8f5;color:#1b1d1c;padding:24px}
    .card{max-width:440px;width:100%;background:#fff;border:1px solid #e7e2da;border-radius:16px;padding:28px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.05)}
    h1{font-size:1.25rem;margin:0 0 8px}
    p{font-size:.9375rem;color:#555;line-height:1.5;margin:0 0 20px}
    a{display:inline-block;padding:10px 18px;border-radius:9999px;background:#1b1d1c;color:#fff;text-decoration:none;font-size:.875rem;font-weight:600}
  </style>
</head>
<body>
  <main class="card">
    <h1>Layanan Sedang Terganggu (${status})</h1>
    <p>${message}</p>
    <a href="/">Kembali ke Beranda</a>
  </main>
</body>
</html>`;

  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  try {
    // --- SUBDOMAIN DIRECT ROUTING ---
    // Akses toko langsung sub-domain.main-domain tanpa prefix /storefront/
    const host = context.request.headers.get('host') || context.url.host;
    const subdomain = extractSubdomain(host);

    if (subdomain) {
      const isFileOrAsset = pathname.includes('.') ||
        pathname.startsWith('/_astro/') ||
        pathname.startsWith('/@') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/storefront/');

      if (!isFileOrAsset) {
        const targetPath = `/storefront/${subdomain}${pathname === '/' ? '' : pathname}`;
        return context.rewrite(targetPath);
      }
    }

    // --- RATE LIMITING LOGIC ---
    const method = context.request.method;
    if (pathname.startsWith('/api/') && method !== 'OPTIONS') {
      let socketAddress: string | undefined;
      try {
        socketAddress = context.clientAddress;
      } catch {
        socketAddress = undefined;
      }
      const clientIp = extractClientIp(context.request, socketAddress);

      let isAllowed = true;
      if (pathname === '/api/stores/check-subdomain') {
        isAllowed = apiCheckSubdomainLimiter.check(clientIp);
      } else if (method === 'GET') {
        isAllowed = apiReadLimiter.check(clientIp);
      } else {
        isAllowed = apiWriteLimiter.check(clientIp);
      }

      if (!isAllowed) {
        const res = jsonError('Terlalu banyak permintaan. Silakan tunggu beberapa saat.', 429, undefined, 'RATE_LIMITED');
        res.headers.set('Retry-After', '60');
        return res;
      }
    }

    // --- AUTHENTICATION LOGIC ---
    try {
      const session = await auth.api.getSession({
        headers: context.request.headers,
      });

      if (session?.user) {
        const sessionUser = session.user as unknown as { role?: string; status?: string };
        let userRole = sessionUser.role;
        let userStatus = sessionUser.status;

        if (!userRole) {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: { role: true, status: true },
          });
          if (dbUser) {
            userRole = dbUser.role;
            userStatus = userStatus || dbUser.status;
          }
        }

        context.locals.user = {
          ...session.user,
          role: userRole || 'tenant',
          status: userStatus || 'active',
        } as App.User;
        context.locals.session = session.session;
      } else {
        context.locals.user = null;
        context.locals.session = null;
      }
    } catch (authError) {
      context.locals.user = null;
      context.locals.session = null;
      const classifiedAuth = classifyServerError(authError);
      if (classifiedAuth.status >= 500) {
        errorLog('MIDDLEWARE_AUTH', {
          pathname,
          code: classifiedAuth.code,
          message: classifiedAuth.internalMessage,
        });
      }
    }

    const user = context.locals.user;

    // Redirect legacy /superadmin/whitelist to unified user management
    if (pathname === '/superadmin/whitelist' || pathname === '/superadmin/whitelist/') {
      return context.redirect('/superadmin/users');
    }

    // Redirect privileged or designer users from general entry point /dashboard to their respective role homes
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      if (user?.role === 'superadmin') return context.redirect('/superadmin');
      if (user?.role === 'admin') return context.redirect('/admin');
      if (user?.role === 'designer') return context.redirect('/designer');
      if (user?.role === 'tenant') {
        const tenantStore = await db.query.stores.findFirst({
          where: and(eq(stores.userId, user.id), isNull(stores.deletedAt)),
          columns: { id: true, subdomain: true, templateId: true, status: true },
        });
        if (!isStoreFullyOnboarded(tenantStore)) {
          return context.redirect('/onboarding');
        }
      }
    }

    // 1. Definisikan rute yang wajib diproteksi beserta role yang diizinkan
    const roleMap = [
      // Superadmin-only: platform settings, master categories, kurasi template, whitelist, user management
      { prefix: '/admin/settings', roles: ['superadmin'] },
      { prefix: '/admin/template-categories', roles: ['superadmin'] },
      { prefix: '/admin/business-categories', roles: ['superadmin'] },
      { prefix: '/admin/templates', roles: ['superadmin'] },
      { prefix: '/admin/whitelist', roles: ['superadmin'] },
      { prefix: '/admin/users', roles: ['superadmin', 'admin'] },
      { prefix: '/api/admin/settings', roles: ['superadmin'] },
      { prefix: '/api/admin/template-categories', roles: ['superadmin'] },
      { prefix: '/api/admin/business-categories', roles: ['superadmin'] },
      { prefix: '/api/admin/templates', roles: ['superadmin'] },
      { prefix: '/api/admin/whitelist', roles: ['superadmin'] },
      { prefix: '/api/admin/users', roles: ['superadmin', 'admin'] },

      // Admin & Superadmin general access
      { prefix: '/admin', roles: ['admin', 'superadmin'] },
      { prefix: '/api/admin', roles: ['admin', 'superadmin'] },

      // Superadmin specific prefix
      { prefix: '/superadmin', roles: ['superadmin'] },
      { prefix: '/api/superadmin', roles: ['superadmin'] },

      // Role-specific protected routes
      { prefix: '/dashboard', roles: ['tenant', 'admin', 'superadmin'] },
      { prefix: '/onboarding', roles: ['tenant', 'admin', 'superadmin'] },
      { prefix: '/builder', roles: ['designer', 'tenant', 'admin', 'superadmin'] },
      { prefix: '/designer', roles: ['designer', 'admin', 'superadmin'] },
      { prefix: '/checkout', roles: ['tenant', 'admin', 'superadmin'] },
      { prefix: '/settings', roles: ['tenant', 'designer', 'admin', 'superadmin'] }
    ];

    // 2. Cek apakah rute saat ini termasuk dalam daftar proteksi
    const protectedRoute = roleMap.find(route => pathname.startsWith(route.prefix));

    if (protectedRoute) {
      if (!user) {
        if (pathname.startsWith('/api/')) {
          return jsonError('Silakan masuk terlebih dahulu untuk melanjutkan.', 401, undefined, 'UNAUTHORIZED');
        }
        return context.redirect('/401');
      }

      if ((user as { status?: string }).status === 'suspended') {
        if (pathname.startsWith('/api/')) {
          return jsonError('Akun Anda ditangguhkan.', 403, undefined, 'FORBIDDEN');
        }
        return context.redirect('/auth/login?error=account_suspended');
      }

      if (!protectedRoute.roles.includes(user.role as string)) {
        if (pathname.startsWith('/api/')) {
          return jsonError('Anda tidak memiliki izin mengakses sumber daya ini.', 403, undefined, 'FORBIDDEN');
        }
        return context.redirect('/403');
      }
    }

    // Jika bukan rute yang diproteksi, biarkan Astro yang menangani (termasuk 404)
    const response = await next();
    if (
      pathname.startsWith('/_astro/') ||
      pathname.startsWith('/images/') ||
      pathname.startsWith('/assets/') ||
      pathname.startsWith('/fonts/')
    ) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    // Optimalisasi pengiriman aset landing page
    const contentType = response.headers.get('content-type') || '';

    if ((pathname === '/' || pathname === '') && contentType.includes('text/html')) {
      const html = await response.text();
      // Non-render-blocking stylesheet with preload and onload activation
      const optimizedHtml = html.replace(
        /<link\s+rel="stylesheet"\s+href="(\/_astro\/[^"]+\.css)"\s*\/?>/gi,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
      );

      const newHeaders = new Headers(response.headers);
      newHeaders.delete('content-length');
      return new Response(optimizedHtml, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    return response;
  } catch (error) {
    const classified = classifyServerError(error);
    errorLog('MIDDLEWARE', {
      pathname,
      method: context.request.method,
      status: classified.status,
      code: classified.code,
      message: classified.internalMessage,
      stack: classified.stack,
    });

    if (pathname.startsWith('/api/')) {
      return jsonError(classified.clientMessage, classified.status, classified.details, classified.code);
    }

    return renderServiceUnavailableHtml(classified.status, classified.clientMessage);
  }
});