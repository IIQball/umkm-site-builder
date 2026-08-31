import { defineMiddleware } from "astro:middleware";
import { auth } from "@/lib/auth";
import { extractSubdomain } from "@/lib/routing/subdomain";

// Domain utama aplikasi, sesuaikan dengan environment
const MAIN_DOMAIN = import.meta.env.PUBLIC_MAIN_DOMAIN || 'localhost:4321';

export const onRequest = defineMiddleware(async (context, next) => {
  // --- SUBDOMAIN DETECTION LOGIC ---
  const host = context.request.headers.get('host') || context.request.headers.get('x-forwarded-host') || '';
  const url = new URL(context.request.url);
  
  const subdomain = extractSubdomain(host, MAIN_DOMAIN);

  // Simpan subdomain di locals agar bisa diakses di route handlers
  context.locals.subdomain = subdomain;

  // Rewrite URL ke route internal jika ada subdomain (misalnya render dari /storefront)
  // Kecuali untuk aset statis dan API
  if (subdomain && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/_astro/')) {
    // Kita bisa melakukan render internal ke suatu route, misal `/storefront/[subdomain]`
    // Untuk saat ini, kita hanya menyimpan subdomain di context.
    // Jika menggunakan `next('/storefront' + url.pathname)`, Anda perlu memastikan handler-nya siap
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

  const { pathname } = context.url;
  const user = context.locals.user;
  
  // Redirect designer from general entry point /dashboard to designer templates
  if ((pathname === '/dashboard' || pathname === '/dashboard/') && user?.role === 'designer') {
    return context.redirect('/designer/wallet');
  }

  // 1. Definisikan rute yang wajib diproteksi beserta role yang diizinkan
  const roleMap = [
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
      return context.redirect('/401');
    }
    
    // Jika akun ditangguhkan
    if ((user as { status?: string }).status === 'suspended') {
      return context.redirect('/auth/login?error=account_suspended');
    }

    // Jika sudah login tapi role tidak sesuai
    if (!protectedRoute.roles.includes(user.role as string)) {
      return context.redirect('/403');
    }
  }

  // Jika bukan rute yang diproteksi, biarkan Astro yang menangani (termasuk 404)
  return next();
});