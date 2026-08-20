import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { stores } from '@db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { CheckSubdomainInput } from '@lib/stores/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import { unauthorized, validationError, internalError, okResponse } from '@/types';
import { ZodError } from 'zod';

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

const SUBDOMAIN_BLACKLIST = new Set([
  'www', 'api', 'admin', 'app', 'mail', 'smtp', 'ftp', 'ssh',
  'login', 'register', 'dashboard', 'panel', 'support', 'help',
  'blog', 'docs', 'status', 'cdn', 'static', 'assets', 'media',
  'store', 'shop', 'test', 'staging', 'dev', 'demo',
]);

export const POST: APIRoute = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return new Response(JSON.stringify(unauthorized()), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  try {
    const body = await request.json();
    const { subdomain } = CheckSubdomainInput.parse(body);

    if (SUBDOMAIN_BLACKLIST.has(subdomain)) {
      return new Response(
        JSON.stringify(okResponse({ available: false, subdomain })),
        { status: 200, headers: JSON_HEADERS },
      );
    }

    const [existing] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(and(eq(stores.subdomain, subdomain), isNull(stores.deletedAt)))
      .limit(1);

    return new Response(
      JSON.stringify(okResponse({ available: !existing, subdomain })),
      { status: 200, headers: JSON_HEADERS },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(
        JSON.stringify(validationError(err.errors[0]?.message)),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    console.error('[STORE] check-subdomain failed:', err);
    return new Response(
      JSON.stringify(internalError()),
      { status: 500, headers: JSON_HEADERS },
    );
  }
};
