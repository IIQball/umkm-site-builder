import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { stores, subdomainBlacklist } from '@db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { CheckSubdomainInput } from '@lib/stores/schemas';
import { ZodError } from 'zod';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { subdomain } = CheckSubdomainInput.parse(body);

    const [blacklisted] = await db
      .select({ keyword: subdomainBlacklist.keyword })
      .from(subdomainBlacklist)
      .where(eq(subdomainBlacklist.keyword, subdomain))
      .limit(1);

    if (blacklisted) {
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
