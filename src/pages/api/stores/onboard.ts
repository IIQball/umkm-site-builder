import type { APIRoute } from 'astro';
import { db } from '@db/index';
import { stores } from '@db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { OnboardStoreInput } from '@lib/stores/schemas';
import { getAuthenticatedUser } from '@/lib/auth';
import {
  unauthorized,
  forbidden,
  validationError,
  duplicateKeyError,
  invalidStateError,
  internalError,
  okResponse,
} from '@/types/api';
import { ZodError } from 'zod';

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

const SUBDOMAIN_BLACKLIST = new Set([
  'www', 'api', 'admin', 'app', 'mail', 'smtp', 'ftp', 'ssh',
  'login', 'register', 'dashboard', 'panel', 'support', 'help',
  'blog', 'docs', 'status', 'cdn', 'static', 'assets', 'media',
  'store', 'shop', 'test', 'staging', 'dev', 'demo',
]);

async function hasExistingStore(userId: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(and(eq(stores.userId, userId), isNull(stores.deletedAt)))
    .limit(1);
  return !!existing;
}

async function isSubdomainTaken(subdomain: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: stores.id })
    .from(stores)
    .where(and(eq(stores.subdomain, subdomain), isNull(stores.deletedAt)))
    .limit(1);
  return !!existing;
}

export const POST: APIRoute = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return new Response(JSON.stringify(unauthorized()), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  if (user.status !== 'active') {
    return new Response(JSON.stringify(forbidden('Akun Anda ditangguhkan')), {
      status: 403,
      headers: JSON_HEADERS,
    });
  }

  if (user.role !== 'tenant') {
    return new Response(JSON.stringify(forbidden('Hanya tenant yang dapat membuat profil toko')), {
      status: 403,
      headers: JSON_HEADERS,
    });
  }

  try {
    const body = await request.json();
    const parsedData = OnboardStoreInput.parse(body);
    const { subdomain, name, waNumber, googleMapsUrl } = parsedData;

    if (SUBDOMAIN_BLACKLIST.has(subdomain)) {
      return new Response(
        JSON.stringify(validationError('Subdomain tidak tersedia')),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    if (await hasExistingStore(user.id)) {
      return new Response(
        JSON.stringify(invalidStateError('Anda sudah memiliki toko aktif')),
        { status: 409, headers: JSON_HEADERS },
      );
    }

    if (await isSubdomainTaken(subdomain)) {
      return new Response(
        JSON.stringify(duplicateKeyError('Subdomain sudah digunakan')),
        { status: 409, headers: JSON_HEADERS },
      );
    }

    const storeId = crypto.randomUUID();

    await db.insert(stores).values({
      id: storeId,
      name,
      subdomain,
      userId: user.id,
      templateId: 'system-default-template', // From db seed logic
      waNumber,
      googleMapsUrl: googleMapsUrl || null,
      status: 'pending', // Awaiting payment setup? Or active right away if MVP? Let's use active since it's just onboarding, or pending based on docs? Wait, docs say "status (pending|active|inactive|suspended)".
    });

    return new Response(
      JSON.stringify(okResponse({ storeId, subdomain, name })),
      { status: 201, headers: JSON_HEADERS },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(
        JSON.stringify(validationError(err.errors[0]?.message)),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    console.error('[STORE] onboard failed:', err);
    return new Response(
      JSON.stringify(internalError()),
      { status: 500, headers: JSON_HEADERS },
    );
  }
};