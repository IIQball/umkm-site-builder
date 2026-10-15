import { auth } from '@/lib/auth';
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db, users, sessions, tenantInvitations, verifications } from '@/db/index';
import { eq, or } from 'drizzle-orm';

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

    let targetUid = uid;
    if (!targetUid && token) {
      const verRecord = await db.query.verifications.findFirst({
        where: eq(verifications.identifier, `reset-password:${token}`),
      });
      if (verRecord?.value) {
        const matched = await db.query.users.findFirst({
          where: or(eq(users.email, verRecord.value), eq(users.id, verRecord.value)),
        });
        if (matched) {
          targetUid = matched.id;
        }
      }
    }

    // Call BetterAuth internal API securely
    await auth.api.resetPassword({
      body: { newPassword: password, token },
      headers: request.headers
    });

    let userEmail = "";
    let userRole = "";

    // If targetUid is identified, securely update user and activate status
    if (targetUid) {
      const targetUser = await db.select().from(users).where(eq(users.id, targetUid)).limit(1);
      if (targetUser.length === 1) {
        userEmail = targetUser[0].email;
        userRole = targetUser[0].role;
        
        // Ensure user status is activated upon setting password
        await db.update(users).set({ status: 'active' }).where(eq(users.id, targetUid));

        if (name) {
          try {
            // Verify that this uid actually belongs to the person who just reset their password
            // by attempting a sign in with their email and the newly set password
            const signinRes = await auth.api.signInEmail({
              body: { email: userEmail, password },
              headers: new Headers()
            }) as unknown as { user?: { id: string } }
            
            if (signinRes && signinRes.user) {
              // Verification succeeded! Update the name
              await db.update(users).set({ name, status: 'active' }).where(eq(users.id, targetUid));
              
              // Automatically clean up the temporary session created for verification
              await db.delete(sessions).where(eq(sessions.userId, targetUid));
            }
          } catch (e) {
            console.error("Name update failed due to unauthorized uid mismatch or sign in error", e);
          }
        }
        
        // Hapus undangan yang telah diaktivasi agar otomatis hilang dan tidak menumpuk di database
        await db
          .delete(tenantInvitations)
          .where(eq(tenantInvitations.email, userEmail));
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Kata sandi berhasil diatur ulang",
      email: userEmail,
      role: userRole
    }), {
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
