import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db, users, sessions, accounts, verifications, designers, wallets, notifications } from "@/db";
import { eq } from "drizzle-orm";
import { sendEmail, getEmailLogoUrl } from "@/lib/utils/email";

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
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id)
      });
      
      const status = dbUser?.status || 'active';
      const isActivation = status === 'pending';

      let finalUrl = url;
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.pathname.includes('/api/auth/reset-password/')) {
          const token = parsedUrl.pathname.split('/').pop();
          const callbackURL = parsedUrl.searchParams.get('callbackURL');
          if (callbackURL && token) {
            const cleanUrl = new URL(callbackURL, parsedUrl.origin);
            cleanUrl.searchParams.set('token', token);
            finalUrl = cleanUrl.toString();
          } else if (token) {
            const cleanUrl = new URL(isActivation ? '/activation' : '/auth/reset-password', parsedUrl.origin);
            cleanUrl.searchParams.set('token', token);
            finalUrl = cleanUrl.toString();
          }
        } else if (parsedUrl.pathname === '/reset-password') {
          parsedUrl.pathname = isActivation ? '/activation' : '/auth/reset-password';
          finalUrl = parsedUrl.toString();
        }
      } catch {
        // ignore parsing error
      }

      // URL Logo Publik WebP Pinoka untuk email (/assets/logo/logo.webp)
      const safeLogoUrl = getEmailLogoUrl(authBaseUrl);

      const roleMap: Record<string, string> = {
        'admin': 'Administrator',
        'tenant': 'Pemilik Toko (Merchant)',
        'designer': 'Desainer Template',
        'superadmin': 'Super Administrator'
      };
      const userRole = (user as unknown as { role?: string }).role || 'tenant';
      const roleDisplay = roleMap[userRole] || userRole;
      const isAdminOrSuper = userRole === 'admin' || userRole === 'superadmin';
      const isDesigner = userRole === 'designer';

      const subject = isActivation 
        ? 'Undangan Aktivasi Akun Pinoka'
        : 'Pemulihan Akses Akun Pinoka Anda';

      // Portal name & role label formatting
      const portalDisplay = isAdminOrSuper 
        ? 'Manajemen Pinoka' 
        : isDesigner 
          ? 'Desainer Template Pinoka' 
          : 'Operasional Toko Digital Pinoka';

      // Paragraph copywriting with role and portal woven seamlessly
      let paragraphContent = '';
      if (isAdminOrSuper) {
        paragraphContent = `Akun Anda sebagai <strong style="color: #1E293B; font-weight: 600;">${roleDisplay}</strong> di portal <strong style="color: #1E293B; font-weight: 600;">${portalDisplay}</strong> telah berhasil disiapkan oleh tim kami. Untuk mulai memantau operasional dan mendampingi rekan-rekan UMKM, silakan selesaikan pengaturan akun Anda sekarang.`;
      } else if (isDesigner) {
        paragraphContent = `Akun Anda sebagai <strong style="color: #1E293B; font-weight: 600;">Desainer Template</strong> di portal <strong style="color: #1E293B; font-weight: 600;">${portalDisplay}</strong> telah berhasil disiapkan oleh tim kami. Untuk mulai merancang preset tampilan toko dan mendampingi rekan-rekan UMKM, silakan selesaikan pengaturan akun Anda sekarang.`;
      } else {
        paragraphContent = `Akun Anda sebagai <strong style="color: #1E293B; font-weight: 600;">Pemilik Toko (Merchant)</strong> di portal <strong style="color: #1E293B; font-weight: 600;">${portalDisplay}</strong> telah berhasil disiapkan oleh tim kami. Untuk mulai mengelola toko digital dan transaksi usaha Anda, silakan selesaikan pengaturan akun Anda sekarang.`;
      }

      const titleText = 'Selamat datang di Pinoka!';
      const buttonText = isActivation ? 'Aktifkan Akun Saya' : 'Atur Ulang Kata Sandi Saya';

      const cardBodyHtml = isActivation 
        ? `
        <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0 0 20px; letter-spacing: -0.5px; text-align: left;">${titleText}</h1>
        
        <p style="color: #475569; font-size: 15px; line-height: 1.625; margin: 0 0 24px;">
          Halo <strong style="color: #1E293B; font-weight: 600;">${user.name}</strong>,<br><br>
          ${paragraphContent}
        </p>

        <div style="text-align: center; margin-top: 24px; margin-bottom: 32px;">
          <a href="${finalUrl}" style="display: inline-block; background-color: #00A3EF; color: #ffffff; font-weight: 700; font-size: 15px; border-radius: 12px; padding: 14px 28px; text-decoration: none; box-shadow: 0 2px 4px rgba(0, 163, 239, 0.2);">${buttonText}</a>
        </div>
        
        <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; border-top-right-radius: 8px; border-bottom-right-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
            <strong>Catatan Keamanan:</strong> Tautan aktivasi ini bersifat rahasia dan berlaku selama 24 jam. Jangan bagikan email ini kepada siapa pun.
          </p>
        </div>

        <p style="margin: 0 0 8px; font-size: 12px; color: #64748B;">Tombol tidak berfungsi? Salin dan tempel tautan ini ke peramban Anda:</p>
        <a href="${finalUrl}" style="font-size: 12px; color: #00A3EF; word-break: break-all; text-decoration: underline;">${finalUrl}</a>
        `
        : `
        <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin: 0 0 20px; letter-spacing: -0.5px; text-align: left;">Pemulihan Kata Sandi</h1>
        
        <p style="color: #475569; font-size: 15px; line-height: 1.625; margin: 0 0 24px;">
          Halo <strong style="color: #1E293B; font-weight: 600;">${user.name}</strong>,<br><br>
          Kami menerima permintaan untuk mengatur ulang kata sandi pada akun <strong style="color: #1E293B; font-weight: 600;">${roleDisplay}</strong> Anda. Jika permohonan ini berasal dari Anda, silakan selesaikan pengaturan kata sandi baru melalui tombol di bawah ini.
        </p>

        <div style="text-align: center; margin-top: 24px; margin-bottom: 32px;">
          <a href="${finalUrl}" style="display: inline-block; background-color: #00A3EF; color: #ffffff; font-weight: 700; font-size: 15px; border-radius: 12px; padding: 14px 28px; text-decoration: none; box-shadow: 0 2px 4px rgba(0, 163, 239, 0.2);">${buttonText}</a>
        </div>
        
        <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; border-top-right-radius: 8px; border-bottom-right-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
            ⚠️ <strong>Catatan Keamanan:</strong> Tautan pemulihan ini dienkripsi dan berlaku selama 24 jam. Jangan bagikan email ini kepada siapa pun.
          </p>
        </div>

        <p style="margin: 0 0 8px; font-size: 12px; color: #64748B;">Tombol tidak berfungsi? Salin dan tempel tautan ini ke peramban Anda:</p>
        <a href="${finalUrl}" style="font-size: 12px; color: #00A3EF; word-break: break-all; text-decoration: underline;">${finalUrl}</a>
        `;

      await sendEmail({
        to: user.email,
        subject,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #F8FAFC; margin: 0; padding: 48px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <!-- CARD CONTAINER -->
  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
    
    <!-- HEADER BAR (Dark #090D16 background merges logo.webp seamlessly with NO black border box) -->
    <div style="background-color: #090D16; padding: 36px 24px; text-align: center; border-bottom: 1px solid #1E293B;">
      <img src="${safeLogoUrl}" alt="Pinoka" style="height: 42px; max-width: 180px; object-fit: contain; display: inline-block; margin-bottom: 8px;" />
      <div style="color: #38BDF8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">Platform Digital UMKM Indonesia</div>
    </div>

    <!-- MAIN CARD CONTENT -->
    <div style="padding: 40px 36px;">
      ${cardBodyHtml}
    </div>

    <!-- FOOTER -->
    <div style="background-color: #FAFAFA; border-top: 1px solid #F1F5F9; padding: 24px 36px; text-align: center;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #64748B;">Tim Support Pinoka siap membantu Anda. Hubungi kami di <a href="mailto:support@pinoka.id" style="color: #00A3EF; font-weight: 600; text-decoration: none;">support@pinoka.id</a></p>
      <p style="margin: 0; font-size: 12px; color: #94A3B8;">&copy; ${new Date().getFullYear()} Pinoka. Pesan ini dikirim otomatis oleh sistem, mohon tidak membalas.</p>
    </div>

  </div>

</body>
</html>`
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const status = (user as unknown as { status?: string }).status;
      if (status === 'pending') {
        return;
      }
      
      const safeLogoUrl = getEmailLogoUrl(authBaseUrl);

      const subject = 'Kode Verifikasi Akun Pinoka Anda';
      
      const bodyHtml = `
        <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">Konfirmasi Pendaftaran Akun</h2>
        
        <p style="margin: 0 0 16px; font-size: 14px; color: #334155; line-height: 1.6;">Halo Kak <strong>${user.name}</strong>,</p>
        
        <p style="margin: 0 0 16px; font-size: 14px; color: #334155; line-height: 1.6;">
          Terima kasih sudah mendaftar di Pinoka! Untuk memastikan ini benar-benar Kakak dan melanjutkan pendaftaran toko, silakan masukkan kode verifikasi berikut:
        </p>
        
        <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 28px 0; margin: 28px 0; text-align: center;">
          <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 38px; font-weight: 800; letter-spacing: 0.25em; color: #0284c7;">${token}</span>
        </div>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #b45309;">Perhatian Keamanan:</p>
          <p style="margin: 0; font-size: 13px; color: #b45309; line-height: 1.5;">Kode verifikasi ini berlaku selama <strong>5 menit</strong> dan bersifat rahasia. Tim Pinoka tidak akan pernah meminta kode ini.</p>
        </div>
        
        <p style="margin: 0; font-size: 12px; color: #64748b;">Jika Kakak tidak merasa melakukan pendaftaran di Pinoka, abaikan saja email ini.</p>
      `;

      await sendEmail({
        to: user.email,
        subject,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #f8fafc; margin: 0; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- HEADER (Warna Dark #090d16 menyatu sempurna dengan background logo.webp tanpa kotak hitam) -->
    <div style="background-color: #090d16; padding: 36px 24px; text-align: center; border-bottom: 1px solid #1e293b;">
      <img src="${safeLogoUrl}" alt="PINOKA" style="height: 38px; max-width: 170px; object-fit: contain; display: inline-block; margin-bottom: 10px;" />
      <div style="color: #38bdf8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">Platform Digital UMKM Indonesia</div>
    </div>

    <!-- CONTENT -->
    <div style="padding: 40px 32px;">
      ${bodyHtml}
    </div>
    
    <!-- FOOTER -->
    <div style="background-color: #fafafa; border-top: 1px solid #f1f5f9; padding: 24px 32px; text-align: center;">
      <p style="margin: 0 0 6px; font-size: 13px; color: #64748b;">Tim Support Pinoka siap membantu Anda. Hubungi kami di <a href="mailto:support@pinoka.id" style="color: #0284c7; font-weight: 500; text-decoration: none;">support@pinoka.id</a></p>
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Pinoka Indonesia. Seluruh hak dilindungi.</p>
    </div>
    
  </div>
</body>
</html>`
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