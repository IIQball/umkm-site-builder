import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, users, sessions, accounts, verifications, designers, wallets, notifications } from "@/db";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/utils/email";

// Accept a bare host (e.g. "umkm-web-builder.iqdevmp.workers.dev"). `new URL()` throws on a
// missing scheme, and this runs at module load, so an unprefixed value would fail the import
// of this module and take every route down with it rather than just breaking sign-in.
const rawAuthBaseUrl = (process.env.BETTER_AUTH_URL || "http://localhost:4321").trim();
const authBaseUrl = /^https?:\/\//i.test(rawAuthBaseUrl)
  ? rawAuthBaseUrl
  : `https://${rawAuthBaseUrl}`;

// Trust the origin BETTER_AUTH_URL points at so this follows the deployment instead of a
// hardcoded list. Local dev hosts stay trusted only outside production builds.
const devOrigins = [
  "http://localhost:4321",
  "http://localhost:4322",
  "http://127.0.0.1:4321",
  "http://127.0.0.1:4322",
];
const trustedOrigins = [
  ...new Set(
    import.meta.env?.PROD
      ? [new URL(authBaseUrl).origin]
      : [new URL(authBaseUrl).origin, ...devOrigins],
  ),
];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: authBaseUrl,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 60 * 24, // 24 jam kadaluarsa
    sendResetPassword: async ({ user, url }) => {
      // Fetch full user record from database to ensure custom fields (role, status) are available
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id)
      });
      
      const role = dbUser?.role || 'tenant';
      const status = dbUser?.status || 'active';
      const isAdmin = role === 'admin' || role === 'superadmin';
      const isActivation = status === 'pending';

      let subject = 'Reset Password Akun Pinoka';
      let bodyText = 'Kami menerima permintaan untuk mengatur ulang kata sandi akun Pinoka kamu.';

      if (isActivation) {
        subject = isAdmin ? 'Akses Akun Admin Pinoka Kamu Sudah Siap' : 'Akses Akun Merchant Pinoka Kamu Sudah Siap';
        bodyText = isAdmin 
          ? 'Akun admin kamu di Pinoka sudah berhasil dibuat. Sekarang kamu sudah bisa masuk untuk mulai mendampingi UMKM dan mengelola platform.'
          : 'Akun merchant kamu di Pinoka sudah berhasil dibuat. Sekarang kamu sudah bisa masuk untuk mulai mengelola tokomu.';
      } else {
        subject = isAdmin ? 'Reset Password Akun Admin Pinoka' : 'Reset Password Akun Pinoka';
        bodyText = isAdmin 
          ? 'Kami menerima permintaan untuk mengatur ulang kata sandi akun Admin kamu.'
          : 'Kami menerima permintaan untuk mengatur ulang kata sandi akun Pinoka kamu.';
      }
      
      let finalUrl = url;
      try {
        const parsedUrl = new URL(url);
        
        // Extract token from BetterAuth API route and bypass it for a cleaner link
        if (parsedUrl.pathname.includes('/api/auth/reset-password/')) {
          const token = parsedUrl.pathname.split('/').pop();
          const callbackURL = parsedUrl.searchParams.get('callbackURL');
          
          if (callbackURL && token) {
            const cleanUrl = new URL(callbackURL, parsedUrl.origin);
            cleanUrl.searchParams.set('token', token);
            finalUrl = cleanUrl.toString();
          } else if (token) {
            // Ensure unified route is used if callbackURL is missing
            const cleanUrl = new URL(isActivation ? '/activation' : '/auth/reset-password', parsedUrl.origin);
            cleanUrl.searchParams.set('token', token);
            finalUrl = cleanUrl.toString();
          }
        } else if (parsedUrl.pathname === '/reset-password') {
          // Fallback if it generates a standard non-API URL
          parsedUrl.pathname = isActivation ? '/activation' : '/auth/reset-password';
          finalUrl = parsedUrl.toString();
        }
      } catch {
        // ignore parsing error
      }

      const calloutText = isActivation
        ? 'Demi keamanan, tautan ini hanya berlaku selama 24 jam.'
        : 'Demi keamanan, tautan reset kata sandi ini hanya berlaku selama 24 jam.';

      const btnText = isActivation ? 'Aktifkan Akun' : 'Atur Ulang Kata Sandi';

      await sendEmail({
        to: user.email,
        subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
              .wrapper { width: 100%; table-layout: fixed; background-color: #F9FAFB; padding: 48px 0; }
              .container { max-width: 520px; margin: 0 auto; width: 100%; }
              .card { background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.04); padding: 48px; margin: 0 20px; }
              .logo-container { text-align: center; margin-bottom: 32px; }
              .logo { height: 36px; width: auto; color: #0F172A; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none; }
              .heading { margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #111827; letter-spacing: -0.4px; line-height: 1.3; text-align: center; }
              .text { margin: 0 0 20px; font-size: 15px; color: #4B5563; line-height: 1.6; text-align: center; }
              .btn-wrapper { margin: 32px 0; text-align: center; }
              .btn { display: inline-block; width: 100%; text-align: center; padding: 14px 24px; background: linear-gradient(180deg, #0284C7 0%, #0369A1 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 15px; box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1); border: 1px solid #075985; box-sizing: border-box; }
              .warning-box { margin-top: 32px; padding: 16px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center; }
              .warning-text { font-size: 13.5px; color: #64748B; line-height: 1.5; margin: 0; }
              .footer { padding: 32px 20px; text-align: center; }
              .fallback-text { margin: 0 0 8px; font-size: 13px; color: #6B7280; line-height: 1.5; }
              .fallback-link { display: inline-block; font-size: 13px; color: #0284C7; word-break: break-all; text-decoration: underline; margin-bottom: 24px; }
              .footer-text { margin: 0 0 8px; font-size: 13px; color: #9CA3AF; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="card">
                  <div class="logo-container">
                    <img src="${authBaseUrl}/assets/logo/logo.webp" alt="Pinoka" class="logo" />
                  </div>
                  <h2 class="heading">${subject}</h2>
                  <p class="text" style="color: #111827;">Halo <strong>${user.name}</strong>,</p>
                  <p class="text">${bodyText}</p>
                  
                  <div class="btn-wrapper">
                    <a href="${finalUrl}" class="btn">${btnText}</a>
                  </div>

                  <div class="warning-box">
                    <p class="warning-text">⚠️ &nbsp; ${calloutText}</p>
                  </div>
                </div>
                
                <div class="footer">
                  <p class="fallback-text">Jika tombol di atas tidak bisa diklik, salin tautan berikut ke peramban (browser) kamu:</p>
                  <a href="${finalUrl}" class="fallback-link">${finalUrl}</a>
                  
                  <p class="footer-text">Butuh bantuan? Silakan hubungi tim kami di support@pinoka.id</p>
                  <p class="footer-text">&copy; 2026 Pinoka. Hak cipta dilindungi undang-undang.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      const status = (user as unknown as { status?: string }).status;
      // Jangan kirim email verifikasi untuk user yang didaftarkan admin (mereka akan menerima email reset password/aktivasi)
      if (status === 'pending') {
        return;
      }
      await sendEmail({
        to: user.email,
        subject: 'Verifikasi Email Pinoka',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
              .wrapper { width: 100%; table-layout: fixed; background-color: #F9FAFB; padding: 48px 0; }
              .container { max-width: 520px; margin: 0 auto; width: 100%; }
              .card { background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.04); padding: 48px; margin: 0 20px; }
              .logo-container { text-align: center; margin-bottom: 32px; }
              .logo { height: 36px; width: auto; color: #0F172A; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none; }
              .heading { margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #111827; letter-spacing: -0.4px; line-height: 1.3; text-align: center; }
              .text { margin: 0 0 20px; font-size: 15px; color: #4B5563; line-height: 1.6; text-align: center; }
              .btn-wrapper { margin: 32px 0; text-align: center; }
              .btn { display: inline-block; width: 100%; text-align: center; padding: 14px 24px; background: linear-gradient(180deg, #0284C7 0%, #0369A1 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 15px; box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1); border: 1px solid #075985; box-sizing: border-box; }
              .otp-box { margin-top: 32px; padding: 24px; background-color: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px; text-align: center; }
              .otp-text { margin: 0 0 12px; font-size: 14px; color: #64748B; }
              .otp-code { margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0369A1; }
              .footer { padding: 32px 20px; text-align: center; }
              .fallback-text { margin: 0 0 8px; font-size: 13px; color: #6B7280; line-height: 1.5; }
              .fallback-link { display: inline-block; font-size: 13px; color: #0284C7; word-break: break-all; text-decoration: underline; margin-bottom: 24px; }
              .footer-text { margin: 0 0 8px; font-size: 13px; color: #9CA3AF; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="card">
                  <div class="logo-container">
                    <img src="${authBaseUrl}/assets/logo/logo.webp" alt="Pinoka" class="logo" />
                  </div>
                  <h2 class="heading">Verifikasi Email Kamu</h2>
                  <p class="text" style="color: #111827;">Halo <strong>${user.name}</strong>,</p>
                  <p class="text">Terima kasih telah mendaftar di Pinoka. Silakan verifikasi alamat email kamu untuk mulai menggunakan layanan kami.</p>
                  
                  <div class="btn-wrapper">
                    <a href="${url}" class="btn">Verifikasi Email Sekarang</a>
                  </div>

                  <div class="otp-box">
                    <p class="otp-text">Atau masukkan kode OTP berikut:</p>
                    <p class="otp-code">${token}</p>
                  </div>
                </div>
                
                <div class="footer">
                  <p class="fallback-text">Jika tombol di atas tidak bisa diklik, salin tautan berikut ke peramban (browser) kamu:</p>
                  <a href="${url}" class="fallback-link">${url}</a>
                  
                  <p class="footer-text">Butuh bantuan? Silakan hubungi tim kami di support@pinoka.id</p>
                  <p class="footer-text">&copy; 2026 Pinoka. Hak cipta dilindungi undang-undang.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      });
    }
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID || import.meta.env?.GOOGLE_CLIENT_ID ? {
      google: {
        clientId: (process.env.GOOGLE_CLIENT_ID || import.meta.env?.GOOGLE_CLIENT_ID) as string,
        clientSecret: (process.env.GOOGLE_CLIENT_SECRET || import.meta.env?.GOOGLE_CLIENT_SECRET) as string,
      },
    } : {}),
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false, 
    },
    fields: {
      accessTokenExpiresAt: "expiresAt",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "tenant",
        input: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: false,
      },
      registeredBy: {
        type: "string",
        required: false,
        input: true,
      }
    },
  },
  onAPIError: {
    onError: () => {
      // Allow BetterAuth to handle API errors naturally.
      // Redirecting here forces 302 on fetch requests, which breaks the frontend client.
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // Strict Whitelist Pre-Check for OAuth / Social logins:
          // Google OAuth is only allowed if user email is already pre-registered in users table.
          const isOAuthFlow = !ctx?.path || ctx.path.includes("/callback") || ctx.path.includes("google") || ctx.path.includes("oauth");

          if (isOAuthFlow) {
            const existingUser = await db.query.users.findFirst({
              where: (u) => eq(u.email, user.email),
            });

            if (!existingUser) {
              throw new APIError("UNAUTHORIZED", {
                message: "UNAUTHORIZED_EMAIL",
              });
            }
          }

          return {
            data: {
              ...user,
              emailVerified: true,
              status: user.registeredBy ? 'pending' : 'active',
            },
          };
        },
        after: async (user) => {
          if (user.role === "designer") {
            await db.insert(designers).values({ 
              userId: user.id,
              isVerified: true 
            }).onConflictDoNothing();

            await db.insert(wallets).values({
              id: `wal_${crypto.randomUUID()}`,
              userId: user.id,
              balance: 0,
            }).onConflictDoNothing();
          }
          
          // Create notification for superadmins
          const superAdmins = await db.query.users.findMany({
            where: eq(users.role, 'superadmin')
          });
          
          if (superAdmins.length > 0) {
            await db.insert(notifications).values(
              superAdmins.map((admin) => ({
                id: `notif_${crypto.randomUUID()}`,
                userId: admin.id,
                type: 'user_registered',
                title: 'Pengguna Baru Terdaftar',
                message: `Pengguna baru dengan nama ${user.name} (${user.role}) telah mendaftar.`,
                metadata: { userId: user.id, role: user.role }
              }) as typeof notifications.$inferInsert)
            );
          }
        },
      },
    },
    session: {
      create: {
        before: async (session, ctx) => {
          const user = await db.query.users.findFirst({
            where: (u) => eq(u.id, session.userId),
          });

          if (user?.status === 'suspended') {
            throw new APIError("UNAUTHORIZED", {
              message: "ACCOUNT_SUSPENDED",
            });
          }

          // Otomatis aktifkan akun saat pengguna berhasil login pertama kali
          // Pastikan ini BUKAN dari proses signUpEmail admin (yang auto-create session)
          const isSignInRequest = ctx?.path?.includes('/sign-in') || ctx?.path?.includes('/callback');
          if (user?.status === 'pending' && isSignInRequest) {
            await db.update(users).set({ status: 'active' }).where(eq(users.id, user.id));
          }

          return {
            data: session,
          };
        },
      },
    },
  },
});

export type Auth = typeof auth;
import type { AuthenticatedUser } from '@/types';
export type { AuthenticatedUser };

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session?.user) {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.id),
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AuthenticatedUser['role'],
        status: user.status as AuthenticatedUser['status'],
        createdAt: user.createdAt,
      };
    }

    const devUserId = request.headers.get('x-user-id');
    if (devUserId) {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, devUserId),
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AuthenticatedUser['role'],
        status: user.status as AuthenticatedUser['status'],
        createdAt: user.createdAt,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function isDesigner(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.role === 'designer' || user.role === 'admin' || user.role === 'superadmin';
}

export function isActive(user: AuthenticatedUser | null): user is AuthenticatedUser {
  if (!user) return false;
  return user.status === 'active';
}

export function isAuthorizedDesigner(user: AuthenticatedUser | null): user is AuthenticatedUser {
  if (!user) return false;
  return user.status === 'active' && (user.role === 'designer' || user.role === 'admin' || user.role === 'superadmin');
}

export function isAdmin(user: AuthenticatedUser | null): user is AuthenticatedUser {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'superadmin';
}

export function isAuthorizedAdmin(user: AuthenticatedUser | null): user is AuthenticatedUser {
  return isActive(user) && isAdmin(user);
}

export function isSuperAdmin(user: AuthenticatedUser | null): user is AuthenticatedUser {
  if (!user) return false;
  return user.role === 'superadmin';
}

export function isAuthorizedSuperAdmin(user: AuthenticatedUser | null): user is AuthenticatedUser {
  return isActive(user) && isSuperAdmin(user);
}

export function canManageStore(
  user: AuthenticatedUser | null,
  store: { userId: string; registeredBy?: string | null }
): boolean {
  if (!user || !isActive(user)) return false;
  if (user.role === 'superadmin') return true;
  if (user.role === 'tenant') return store.userId === user.id;
  if (user.role === 'admin') return store.registeredBy === user.id;
  return false;
}

export function getRedirectUrlForRole(role?: string | null): string {
  if (role === 'designer') return '/designer';
  return '/dashboard';
}