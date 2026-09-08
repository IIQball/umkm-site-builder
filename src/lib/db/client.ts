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

export const db = getDb();
export default db;
