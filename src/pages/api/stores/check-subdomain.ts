import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { stores } from '@db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { CheckSubdomainInput } from '@lib/stores/schemas';
import { ZodError } from 'zod';

const SUBDOMAIN_BLACKLIST = new Set([
  'www', 'api', 'admin', 'app', 'mail', 'smtp', 'ftp', 'ssh',
  'login', 'register', 'dashboard', 'panel', 'support', 'help',
  'blog', 'docs', 'status', 'cdn', 'static', 'assets', 'media',
  'store', 'shop', 'test', 'staging', 'dev', 'demo',
]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { subdomain } = CheckSubdomainInput.parse(body);

    if (SUBDOMAIN_BLACKLIST.has(subdomain)) {
      return new Response(
        JSON.stringify({ ok: true, data: { available: false, subdomain } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const [existing] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(and(eq(stores.subdomain, subdomain), isNull(stores.deletedAt)))
      .limit(1);

    return new Response(
      JSON.stringify({ ok: true, data: { available: !existing, subdomain } }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: 'VALIDATION_ERROR', message: err.errors[0]?.message ?? 'Validation failed' },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    console.error('[STORE] check-subdomain failed:', err);
    return new Response(
      JSON.stringify({ ok: false, error: { code: 'INTERNAL', message: 'Something went wrong' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
