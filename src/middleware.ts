import { defineMiddleware } from "astro:middleware";
import { auth } from "@/lib/auth";
import { db, users, stores } from "@/db";
import { eq, and, isNull } from "drizzle-orm";
import { InMemoryRateLimiter } from "@/lib/utils/rate-limiter";
import { extractSubdomain } from "@/lib/domain";
import { jsonError } from "@/lib/utils/api-handler";
import { isStoreFullyOnboarded } from "@/services/stores";

// Inisialisasi Rate Limiter untuk API:
// 1. Read (GET): Longgar untuk memuat data (30 request / menit)
const apiReadLimiter = new InMemoryRateLimiter(30, 60 * 1000);
// 2. Write (POST/PUT/DELETE): Ketat untuk mencegah spam klik (5 request / menit)
const apiWriteLimiter = new InMemoryRateLimiter(5, 60 * 1000);
// 3. Subdomain Check: Live availability check saat mengetik (60 request / menit)
const apiCheckSubdomainLimiter = new InMemoryRateLimiter(60, 60 * 1000);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
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
  if (pathname.startsWith('/api/')) {
    // Gunakan clientAddress dari Astro atau fallback ke header x-forwarded-for
    let clientIp = 'unknown';
    try {
      clientIp = context.clientAddress || context.request.headers.get('x-forwarded-for') || 'unknown';
    } catch {
      clientIp = context.request.headers.get('x-forwarded-for') || 'unknown';
    }

    // Gunakan limiter yang sesuai berdasarkan endpoint dan HTTP Method
    const method = context.request.method;
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
  } catch {
    context.locals.user = null;
    context.locals.session = null;
  }

  const user = context.locals.user;
  
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
    // Jika rute diproteksi tapi tidak ada user (belum login)
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return jsonError('Unauthorized', 401, undefined, 'UNAUTHORIZED');
      }
      return context.redirect('/401');
    }
    
    // Jika akun ditangguhkan
    if ((user as { status?: string }).status === 'suspended') {
      if (pathname.startsWith('/api/')) {
        return jsonError('Akun Anda ditangguhkan', 403, undefined, 'FORBIDDEN');
      }
      return context.redirect('/auth/login?error=account_suspended');
    }

    // Jika sudah login tapi role tidak sesuai
    if (!protectedRoute.roles.includes(user.role as string)) {
      if (pathname.startsWith('/api/')) {
        return jsonError('Forbidden', 403, undefined, 'FORBIDDEN');
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
});