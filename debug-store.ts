import { db } from './src/lib/db/client';
import { stores } from './src/db/schema';
import { eq } from 'drizzle-orm';

// Find toko-berkah store
const store = await db.query.stores.findFirst({
  where: eq(stores.subdomain, 'toko-berkah')
});

if (store) {
  console.log('Store found:', store.subdomain);
  console.log('Customization:', JSON.stringify(store.customization, null, 2));
  console.log('isOnboarded:', (store.customization as any)?.isOnboarded);
} else {
  console.log('Store not found');
}
