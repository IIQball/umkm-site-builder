import { defineMiddleware } from "astro:middleware";
import { auth } from "@/lib/auth";
import { InMemoryRateLimiter } from "@/lib/utils/rate-limiter";

// Inisialisasi Rate Limiter untuk API:
// 1. Read (GET): Longgar untuk memuat data (30 request / menit)
const apiReadLimiter = new InMemoryRateLimiter(30, 60 * 1000);
// 2. Write (POST/PUT/DELETE): Ketat untuk mencegah spam klik (5 request / menit)
const apiWriteLimiter = new InMemoryRateLimiter(5, 60 * 1000);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // --- RATE LIMITING LOGIC ---
  if (pathname.startsWith('/api/')) {
    // Gunakan clientAddress dari Astro atau fallback ke header x-forwarded-for
    let clientIp = 'unknown';
    try {
      clientIp = context.clientAddress || context.request.headers.get('x-forwarded-for') || 'unknown';
    } catch {
      clientIp = context.request.headers.get('x-forwarded-for') || 'unknown';
    }

    // Gunakan limiter yang sesuai berdasarkan HTTP Method
    const method = context.request.method;
    const isAllowed = method === 'GET' 
      ? apiReadLimiter.check(clientIp) 
      : apiWriteLimiter.check(clientIp);
    
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      });
    }
  }

  // --- AUTHENTICATION LOGIC ---
  try {
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (session) {
      context.locals.user = session.user;
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
  
  // Redirect designer from general entry point /dashboard to designer templates
  if ((pathname === '/dashboard' || pathname === '/dashboard/') && user?.role === 'designer') {
    return context.redirect('/designer/wallet');
  }

  // 1. Definisikan rute yang wajib diproteksi beserta role yang diizinkan
  const roleMap = [
    // Superadmin-only: platform settings, master categories, kurasi template, whitelist, user management
    { prefix: '/admin/settings', roles: ['superadmin'] },
    { prefix: '/admin/template-categories', roles: ['superadmin'] },
    { prefix: '/admin/templates', roles: ['superadmin'] },
    { prefix: '/admin/whitelist', roles: ['superadmin'] },
    { prefix: '/admin/users', roles: ['superadmin', 'admin'] },
    { prefix: '/api/admin/settings', roles: ['superadmin'] },
    { prefix: '/api/admin/template-categories', roles: ['superadmin'] },
    { prefix: '/api/admin/templates', roles: ['superadmin'] },
    { prefix: '/api/admin/whitelist', roles: ['superadmin'] },
    { prefix: '/api/admin/users', roles: ['superadmin', 'admin'] },

    // Admin & Superadmin general access
    { prefix: '/admin', roles: ['admin', 'superadmin'] },
    { prefix: '/api/admin', roles: ['admin', 'superadmin'] },

    // Role-specific protected routes
    { prefix: '/dashboard', roles: ['tenant', 'admin', 'superadmin'] },
    { prefix: '/onboarding', roles: ['tenant', 'admin', 'superadmin'] },
    { prefix: '/builder', roles: ['designer', 'tenant', 'admin', 'superadmin'] },
    { prefix: '/designer', roles: ['designer', 'admin', 'superadmin'] },
    { prefix: '/checkout', roles: ['tenant'] } // Hanya tenant yang bisa checkout
  ];

  // 2. Cek apakah rute saat ini termasuk dalam daftar proteksi
  const protectedRoute = roleMap.find(route => pathname.startsWith(route.prefix));

  if (protectedRoute) {
    // Jika rute diproteksi tapi tidak ada user (belum login)
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return context.redirect('/401');
    }
    
    // Jika akun ditangguhkan
    if ((user as { status?: string }).status === 'suspended') {
      if (pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Akun Anda ditangguhkan' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return context.redirect('/auth/login?error=account_suspended');
    }

    // Jika sudah login tapi role tidak sesuai
    if (!protectedRoute.roles.includes(user.role as string)) {
      if (pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return context.redirect('/403');
    }
  }

  // Jika bukan rute yang diproteksi, biarkan Astro yang menangani (termasuk 404)
  return next();
});