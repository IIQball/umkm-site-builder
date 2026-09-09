import { db } from '@/lib/db/client';
import { stores } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export interface ManagedByAdminInfo {
  name: string;
}

export interface PublicStoreDetail {
  id: string;
  name: string;
  subdomain: string;
  waNumber: string;
  address: string | null;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  customization: unknown;
  managedByAdmin: ManagedByAdminInfo | null;
}

/**
 * Updates store's lastEditedBy and updatedAt timestamp.
 */
export async function touchStoreLastEdited(storeId: string, userId: string): Promise<void> {
  await db
    .update(stores)
    .set({
      lastEditedBy: userId,
      updatedAt: new Date(),
    })
    .where(eq(stores.id, storeId));
}

/**
 * Retrieves public store details by subdomain with strict field filtering.
 * Only retrieves admin name via registrar relation (no email, role, or sensitive data).
 */
export async function getPublicStoreBySubdomain(subdomain: string): Promise<PublicStoreDetail | null> {
  const store = await db.query.stores.findFirst({
    where: and(eq(stores.subdomain, subdomain), isNull(stores.deletedAt)),
    with: {
      registrar: {
        columns: {
          name: true,
        },
      },
    },
  });

  if (!store || store.status !== 'active') {
    return null;
  }

  const managedByAdmin: ManagedByAdminInfo | null =
    store.registeredBy && store.registrar?.name
      ? { name: store.registrar.name }
      : null;

  return {
    id: store.id,
    name: store.name,
    subdomain: store.subdomain,
    waNumber: store.waNumber,
    address: store.address,
    googleMapsUrl: store.googleMapsUrl,
    googleMapsEmbedUrl: store.googleMapsEmbedUrl,
    latitude: store.latitude,
    longitude: store.longitude,
    status: store.status,
    customization: store.customization,
    managedByAdmin,
  };
}

/**
 * Retrieves public store details by store ID with strict field filtering.
 */
export async function getPublicStoreById(storeId: string): Promise<PublicStoreDetail | null> {
  const store = await db.query.stores.findFirst({
    where: and(eq(stores.id, storeId), isNull(stores.deletedAt)),
    with: {
      registrar: {
        columns: {
          name: true,
        },
      },
    },
  });

  if (!store || store.status !== 'active') {
    return null;
  }

  const managedByAdmin: ManagedByAdminInfo | null =
    store.registeredBy && store.registrar?.name
      ? { name: store.registrar.name }
      : null;

  return {
    id: store.id,
    name: store.name,
    subdomain: store.subdomain,
    waNumber: store.waNumber,
    address: store.address,
    googleMapsUrl: store.googleMapsUrl,
    googleMapsEmbedUrl: store.googleMapsEmbedUrl,
    latitude: store.latitude,
    longitude: store.longitude,
    status: store.status,
    customization: store.customization,
    managedByAdmin,
  };
}
