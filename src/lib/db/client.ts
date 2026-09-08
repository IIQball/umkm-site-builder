import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from '@/lib/config/app';
import * as schema from '@/db/schema';

// Neon HTTP driver: stateless, one request per query, no socket held open.
//
// A WebSocket `Pool` cannot be cached at module scope on Cloudflare Workers — a socket
// belongs to the request that opened it, so reusing it on the next request hangs and the
// runtime cancels that request. HTTP has no such per-request state, so this client is safe
// to share across requests. Interactive transactions are not available over HTTP; use
// `withTransaction` from '@/lib/db/transaction' for those.
export type Database = NeonHttpDatabase<typeof schema>;

let dbInstance: Database | null = null;

export function getDb(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  if (!config.database.url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  dbInstance = drizzle(neon(config.database.url), { schema });
  return dbInstance;
}

// Deferred so a missing DATABASE_URL fails the request that needs the database, not the
// module import. `getDb()` at module scope throws while the Worker is evaluating its entry
// module, which Cloudflare answers as an empty 500 on *every* route including 404s, with the
// real error visible only in the Worker logs.
export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop);
    // Bind methods to the real client: called as `db.select()`, `this` would otherwise be
    // the proxy, and Drizzle reads its own internals off `this`.
    return typeof value === 'function' ? value.bind(instance) : value;
  },
  has(_target, prop) {
    return Reflect.has(getDb(), prop);
  },
}) as Database;

export default db;
