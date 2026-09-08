import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { config } from '@/lib/config/app';
import * as schema from '@/db/schema';
import type { DbExecutor } from '@/types';

// Setup WebSocket untuk runtime Node/Bun lokal jika diperlukan
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

/**
 * Run `fn` inside a real Postgres transaction.
 *
 * The default `db` client uses the Neon HTTP driver, which cannot do interactive
 * transactions. This opens a WebSocket pool for the duration of the callback and closes it
 * before returning, so no socket is ever reused across Cloudflare Workers requests — the
 * pool is created and destroyed entirely inside one request.
 *
 * Use this only where atomicity is required (money paths). Everything else should use `db`.
 */
export async function withTransaction<T>(fn: (tx: DbExecutor) => Promise<T>): Promise<T> {
  if (!config.database.url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString: config.database.url });
  try {
    const txDb = drizzle(pool, { schema });
    return await txDb.transaction(async (tx) => fn(tx as DbExecutor));
  } finally {
    await pool.end();
  }
}
