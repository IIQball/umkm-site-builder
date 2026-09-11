import { auth } from '@/lib/auth';
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db, users, sessions } from '@/db/index';
import { eq } from 'drizzle-orm';

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token verifikasi tidak valid atau kedaluwarsa"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  uid: z.string().optional(),
  name: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.errors[0].message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { token, password, uid, name } = result.data;

    // Call BetterAuth internal API securely
    await auth.api.resetPassword({
      body: { newPassword: password, token },
      headers: request.headers
    });

    // If uid and name are provided, securely update the name
    if (uid && name) {
      const targetUser = await db.select().from(users).where(eq(users.id, uid)).limit(1);
      if (targetUser.length === 1) {
        try {
          // Verify that this uid actually belongs to the person who just reset their password
          // by attempting a sign in with their email and the newly set password
          const signinRes = await auth.api.signInEmail({
            body: { email: targetUser[0].email, password },
            headers: new Headers()
          }) as unknown as { user?: any };
          
          if (signinRes && signinRes.user) {
            // Verification succeeded! Update the name
            await db.update(users).set({ name }).where(eq(users.id, uid));
            // Automatically clean up the temporary session created for verification
            await db.delete(sessions).where(eq(sessions.userId, uid));
          }
        } catch (e) {
          console.error("Name update failed due to unauthorized uid mismatch or sign in error", e);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: "Kata sandi berhasil diatur ulang" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengatur ulang sandi';
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
