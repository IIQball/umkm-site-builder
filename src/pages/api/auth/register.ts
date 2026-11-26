import type { APIRoute } from 'astro';
import { z } from 'zod';
import { and, eq, gt } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db, users, verifications, designers, wallets } from '@/db';
import { handleApiRoute, jsonError, jsonSuccess, parseJsonBody } from '@/lib/utils/api-handler';

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(3),
  password: z.string().min(8).max(128),
  role: z.enum(['tenant', 'designer']),
  proof: z.string().min(1),
});

export const POST: APIRoute = async ({ request }) => handleApiRoute(async () => {
  const input = schema.safeParse(await parseJsonBody(request));
  if (!input.success) return jsonError('Data pendaftaran tidak valid', 400, undefined, 'VALIDATION_ERROR');
  const { email, name, password, role, proof } = input.data;
  const consumed = await db.delete(verifications).where(and(
    eq(verifications.identifier, `signup:${email}`), eq(verifications.value, proof), gt(verifications.expiresAt, new Date())
  )).returning({ id: verifications.id });
  if (!consumed.length) return jsonError('Verifikasi email diperlukan', 403, undefined, 'FORBIDDEN');
  const result = await auth.api.signUpEmail({ body: { email, name, password }, headers: new Headers() });
  await db.update(users).set({ emailVerified: true, role }).where(eq(users.id, result.user.id));
  if (role === 'designer') {
    await db.insert(designers).values({ userId: result.user.id, isVerified: true }).onConflictDoNothing();
    await db.insert(wallets).values({ id: `wal_${crypto.randomUUID()}`, userId: result.user.id, balance: 0 }).onConflictDoNothing();
  }
  return jsonSuccess(null, 200, 'Akun berhasil dibuat');
});
