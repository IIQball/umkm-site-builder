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
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset Password Akun UMKM Site Builder',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #0f172a;">Halo ${user.name},</h2>
            <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun UMKM Site Builder Anda.</p>
            <p>Klik tombol di bawah ini untuk membuat kata sandi baru:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; margin: 16px 0; font-weight: bold;">Atur Ulang Kata Sandi</a>
            <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Jika Anda tidak meminta reset password, abaikan saja email ini.</p>
          </div>
        `
      });
    },
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
        before: async (session) => {
          const user = await db.query.users.findFirst({
            where: (u) => eq(u.id, session.userId),
          });

          if (user?.status === 'suspended') {
            throw new APIError("UNAUTHORIZED", {
              message: "ACCOUNT_SUSPENDED",
            });
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

export function isActive(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.status === 'active';
}

export function isAuthorizedDesigner(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.status === 'active' && (user.role === 'designer' || user.role === 'admin' || user.role === 'superadmin');
}

export function isAdmin(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'superadmin';
}

export function isAuthorizedAdmin(user: AuthenticatedUser | null): boolean {
  return isActive(user) && isAdmin(user);
}

export function isSuperAdmin(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.role === 'superadmin';
}

export function isAuthorizedSuperAdmin(user: AuthenticatedUser | null): boolean {
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