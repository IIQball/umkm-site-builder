import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, users, sessions, accounts, verifications, designers, wallets } from "@/db";
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

      let subject = 'Reset Password Akun UMKM Site Builder';
      let bodyText = 'Kami menerima permintaan untuk mengatur ulang kata sandi akun UMKM Site Builder Anda.';

      if (isActivation) {
        subject = isAdmin ? 'Aktivasi Akun Admin UMKM Site Builder' : 'Aktivasi Akun Merchant UMKM Site Builder';
        bodyText = isAdmin 
          ? 'Akun Admin Anda telah berhasil didaftarkan. Silakan klik tautan di bawah ini untuk mengaktifkan akun Anda dan mulai mengelola platform.'
          : 'Selamat bergabung! Akun Merchant Anda telah berhasil didaftarkan. Silakan klik tautan di bawah ini untuk mengaktifkan akun Anda dan mulai menggunakan layanan kami.';
      } else {
        subject = isAdmin ? 'Reset Password Akun Admin UMKM Site Builder' : 'Reset Password Akun UMKM Site Builder';
        bodyText = isAdmin 
          ? 'Kami menerima permintaan untuk mengatur ulang kata sandi akun Admin Anda.'
          : 'Kami menerima permintaan untuk mengatur ulang kata sandi akun UMKM Site Builder Anda.';
      }
      
      let finalUrl = url;
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.pathname === '/reset-password') {
          parsedUrl.pathname = '/activation';
        }
        finalUrl = parsedUrl.toString();
      } catch {
        // ignore parsing error
      }

      const calloutText = isActivation
        ? 'Tautan aktivasi ini bersifat rahasia dan hanya berlaku selama 24 jam sejak email ini dikirimkan.'
        : 'Tautan reset kata sandi ini bersifat rahasia dan hanya berlaku selama 24 jam sejak email ini dikirimkan.';

      const btnText = isActivation ? 'Aktifkan Akun Sekarang' : 'Atur Ulang Kata Sandi';

      await sendEmail({
        to: user.email,
        subject,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 0; color: #334155; line-height: 1.6;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 24px;">${subject}</h1>
            
            <p style="margin-bottom: 16px;">Halo <strong>${user.name}</strong>,</p>
            
            <p style="margin-bottom: 24px;">${bodyText}</p>
            
            <div style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 16px; border-radius: 4px; margin-bottom: 32px;">
              <p style="margin: 0; color: #0f766e; font-size: 14px;">
                <strong style="display: flex; align-items: center; gap: 8px;">
                  ⚠️ Informasi Penting:
                </strong>
                <br>
                ${calloutText}
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${finalUrl}" style="display: inline-block; padding: 14px 28px; background-color: #36C6FD; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(54, 198, 253, 0.2);">
                ${btnText}
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
              <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempelkan tautan berikut ke browser Anda:</p>
              <p style="font-size: 13px; color: #3b82f6; word-break: break-all; margin-top: 0;">${finalUrl}</p>
              <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">Jika Anda tidak merasa melakukan tindakan ini, abaikan saja email ini.</p>
            </div>
          </div>
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
        subject: 'Verifikasi Email UMKM Site Builder',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 0; color: #334155; line-height: 1.6;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 24px;">Verifikasi Email Anda</h1>
            
            <p style="margin-bottom: 16px;">Halo <strong>${user.name}</strong>,</p>
            
            <p style="margin-bottom: 24px;">Terima kasih telah mendaftar di UMKM Site Builder. Silakan verifikasi alamat email Anda untuk melanjutkan dan mulai menggunakan layanan kami.</p>
            
            <div style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; padding: 16px; border-radius: 4px; margin-bottom: 32px;">
              <p style="margin: 0; color: #0f766e; font-size: 14px;">
                <strong style="display: flex; align-items: center; gap: 8px;">
                  🔐 Kode OTP Anda:
                </strong>
                <br>
                Gunakan kode berikut jika aplikasi memintanya: <strong style="font-size: 18px; color: #0f172a;">${token}</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${url}" style="display: inline-block; padding: 14px 28px; background-color: #36C6FD; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(54, 198, 253, 0.2);">
                Verifikasi Email Sekarang
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
              <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempelkan tautan berikut ke browser Anda:</p>
              <p style="font-size: 13px; color: #3b82f6; word-break: break-all; margin-top: 0;">${url}</p>
              <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">Tautan ini hanya berlaku untuk 1 kali penggunaan. Jika Anda tidak merasa mendaftar, abaikan saja email ini.</p>
            </div>
          </div>
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
  if (role === 'designer') return '/designer/wallet';
  return '/dashboard';
}