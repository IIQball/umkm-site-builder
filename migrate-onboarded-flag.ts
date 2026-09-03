import { db } from './src/lib/db/client';
import { stores } from './src/db/schema';
import { isNull } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Update all existing stores to set isOnboarded flag
const result = await db
  .update(stores)
  .set({
    customization: sql`jsonb_set(customization, '{isOnboarded}', 'true')`,
  })
  .where(isNull(stores.deletedAt))
  .returning({ id: stores.id, subdomain: stores.subdomain });

console.log(`Updated ${result.length} stores with isOnboarded flag:`);
result.forEach(store => {
  console.log(`  - ${store.subdomain}`);
});
