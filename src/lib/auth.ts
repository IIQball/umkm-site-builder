import { betterAuth } from "better-auth";
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
      // sementara dimatikan karena fitur verifikasi email belum dibuat di Phase 1.2
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
        required: false, // Wajib false agar Google OAuth tidak menolak login
        defaultValue: "tenant",
        input: true, // Wajib true agar form Register bisa mengirim role pilihan user
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
        input: false, // Status tidak boleh dimanipulasi dari form registrasi
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Jika mendaftar sebagai designer, otomatis buat record designer & wallet
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
  },
});

export type Auth = typeof auth;

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'designer' | 'tenant';
  status: 'active' | 'suspended';
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session?.user) {
      const user = await db.query.users.findFirst({
        where: (users) => eq(users.id, session.user.id),
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
        where: (users) => eq(users.id, devUserId),
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
  return isActive(user) && isDesigner(user);
}