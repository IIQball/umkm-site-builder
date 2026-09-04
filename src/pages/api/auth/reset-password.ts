import { auth } from '@/lib/auth';
import type { APIRoute } from 'astro';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token verifikasi tidak valid atau kedaluwarsa"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
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

    const { token, password } = result.data;

    // Call BetterAuth internal API securely
    await auth.api.resetPassword({
      body: { newPassword: password, token },
      headers: request.headers
    });

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
