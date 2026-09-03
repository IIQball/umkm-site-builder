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
} from '@/types';
import { ZodError } from 'zod';

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;


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
      templateId: 'system-default-template',
      waNumber,
      googleMapsUrl: googleMapsUrl || null,
      status: 'active',
      customization: { isOnboarded: true },
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

    // eslint-disable-next-line no-console
    console.error('[STORE] onboard failed:', err);
    return new Response(
      JSON.stringify(internalError()),
      { status: 500, headers: JSON_HEADERS },
    );
  }
};