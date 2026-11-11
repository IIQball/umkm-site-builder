import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import {
  db,
  users,
  sessions,
  accounts,
  verifications,
  designers,
  wallets,
  notifications,
} from '@/db';
import { eq } from 'drizzle-orm';
import { sendEmail, getEmailLogoUrl } from '@/lib/utils/email';
import { readRuntimeEnv } from '@/lib/config/env-validator';
import {
  buildResetOrActivationEmail,
  buildVerificationOtpEmail,
} from '@/lib/auth/email-templates';
import {
  resolveAuthBaseAndOrigins,
  resolveResetCallbackUrl,
} from '@/lib/auth/url-helpers';
import type { AuthenticatedUser } from '@/types';

export type { AuthenticatedUser };

const { authBaseUrl, trustedOrigins } = resolveAuthBaseAndOrigins();

const googleClientId = readRuntimeEnv('GOOGLE_CLIENT_ID');
const googleClientSecret = readRuntimeEnv('GOOGLE_CLIENT_SECRET');

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  secret: readRuntimeEnv('BETTER_AUTH_SECRET') || 'dev-fallback-secret-override-in-prod',
  baseURL: authBaseUrl,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 60 * 24,
    sendResetPassword: async ({ user, url }) => {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });
      const isActivation = (dbUser?.status || 'active') === 'pending';
      const finalUrl = resolveResetCallbackUrl(url, isActivation);
      const userRole = (user as unknown as { role?: string }).role || 'tenant';
      const { subject, html } = buildResetOrActivationEmail({
        userName: user.name,
        userRole,
        finalUrl,
        safeLogoUrl: getEmailLogoUrl(authBaseUrl),
        isActivation,
      });
      await sendEmail({ to: user.email, subject, html });
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const status = (user as unknown as { status?: string }).status;
      const isInvited = (user as unknown as { registeredBy?: string }).registeredBy;
      if (status === 'pending' || isInvited) return;

      const { subject, html } = buildVerificationOtpEmail({
        userName: user.name,
        token,
        safeLogoUrl: getEmailLogoUrl(authBaseUrl),
      });
      await sendEmail({ to: user.email, subject, html });
    },
  },
  socialProviders: {
    ...(googleClientId
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      requireLocalEmailVerified: false,
    },
    fields: {
      accessTokenExpiresAt: 'expiresAt',
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
      role: { type: 'string', required: false, defaultValue: 'tenant', input: true },
      status: { type: 'string', required: false, defaultValue: 'active', input: false },
      registeredBy: { type: 'string', required: false, input: true },
    },
  },
  onAPIError: {
    onError: () => {
      // Allow BetterAuth to handle API errors naturally without 302 redirects on fetch calls.
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const isOAuthFlow =
            !ctx?.path ||
            ctx.path.includes('/callback') ||
            ctx.path.includes('google') ||
            ctx.path.includes('oauth');

          if (isOAuthFlow) {
            const existingUser = await db.query.users.findFirst({
              where: (u) => eq(u.email, user.email),
            });
            if (!existingUser) {
              throw new APIError('UNAUTHORIZED', { message: 'UNAUTHORIZED_EMAIL' });
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
          if (user.role === 'designer') {
            await db.insert(designers).values({ userId: user.id, isVerified: true }).onConflictDoNothing();
            await db
              .insert(wallets)
              .values({ id: `wal_${crypto.randomUUID()}`, userId: user.id, balance: 0 })
              .onConflictDoNothing();
          }

          const superAdmins = await db.query.users.findMany({
            where: eq(users.role, 'superadmin'),
          });
          if (superAdmins.length > 0) {
            await db.insert(notifications).values(
              superAdmins.map(
                (admin) =>
                  ({
                    id: `notif_${crypto.randomUUID()}`,
                    userId: admin.id,
                    type: 'user_registered',
                    title: 'Pengguna Baru Terdaftar',
                    message: `Pengguna baru dengan nama ${user.name} (${user.role}) telah mendaftar.`,
                    metadata: { userId: user.id, role: user.role },
                  }) as typeof notifications.$inferInsert
              )
            );
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
            throw new APIError('UNAUTHORIZED', { message: 'ACCOUNT_SUSPENDED' });
          }
          if (user?.status === 'pending') {
            throw new APIError('UNAUTHORIZED', { message: 'ACCOUNT_PENDING_ACTIVATION' });
          }
          return { data: session };
        },
      },
    },
  },
});

export type Auth = typeof auth;

async function findAuthenticatedUserById(userId: string): Promise<AuthenticatedUser | null> {
  const user = await db.query.users.findFirst({
    where: (u, { eq: eqFn }) => eqFn(u.id, userId),
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AuthenticatedUser['role'],
    status: user.status as AuthenticatedUser['status'],
    createdAt: user.createdAt,
  };
}

import { isDevHeaderOverrideAllowed as checkDevHeaderOverride } from '@/lib/auth/guards';

function isDevHeaderOverrideAllowed(): boolean {
  return checkDevHeaderOverride({
    nodeEnv: typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined,
    isDev: Boolean(import.meta.env?.DEV),
    allowDevHeader: readRuntimeEnv('ALLOW_DEV_AUTH_HEADER'),
  });
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (session?.user) {
      return await findAuthenticatedUserById(session.user.id);
    }

    if (isDevHeaderOverrideAllowed()) {
      const devUserId = request.headers.get('x-user-id');
      if (devUserId) {
        return await findAuthenticatedUserById(devUserId);
      }
    }

    return null;
  } catch {
    return null;
  }
}

export {
  isDesigner,
  isActive,
  isAuthorizedDesigner,
  isAdmin,
  isAuthorizedAdmin,
  isSuperAdmin,
  isAuthorizedSuperAdmin,
  assertSuperAdminAction,
  canManageStore,
  getRedirectUrlForRole,
} from './auth/guards';
