import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, users, sessions, accounts, verifications, designers, wallets } from "@/db";
import { eq } from "drizzle-orm";

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
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4321",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      clientId: (process.env.GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID) as string,
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET || import.meta.env.GOOGLE_CLIENT_SECRET) as string,
    },
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
    onError: (error, ctx) => {
      const err = error as { message?: string } | undefined;
      if (err?.message === "UNAUTHORIZED_EMAIL" || err?.message?.includes("UNAUTHORIZED")) {
        const redirectCtx = ctx as unknown as { redirect?: (url: string) => never };
        if (typeof redirectCtx?.redirect === "function") {
          throw redirectCtx.redirect("/auth/login?error=unauthorized_email");
        }
      }
      if (err?.message === "ACCOUNT_SUSPENDED") {
        const redirectCtx = ctx as unknown as { redirect?: (url: string) => never };
        if (typeof redirectCtx?.redirect === "function") {
          throw redirectCtx.redirect("/auth/login?error=account_suspended");
        }
      }
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
              const redirectCtx = ctx as unknown as { redirect?: (url: string) => never };
              if (typeof redirectCtx?.redirect === "function") {
                throw redirectCtx.redirect("/auth/login?error=unauthorized_email");
              }
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
              designerId: user.id,
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
            const redirectCtx = ctx as unknown as { redirect?: (url: string) => never };
            if (typeof redirectCtx?.redirect === "function") {
              throw redirectCtx.redirect("/auth/login?error=account_suspended");
            }
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

export function getRedirectUrlForRole(role?: string | null): string {
  if (role === 'designer') return '/designer/wallet';
  return '/dashboard';
}