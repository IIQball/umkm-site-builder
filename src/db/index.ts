import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Mendukung pembacaan env lewat Vite (import.meta.env) maupun Node.js (process.env)
const databaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DATABASE_URL) ||
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * Initialize Drizzle ORM with the Neon HTTP driver.
 *
 * Stateless per query, so this client is safe to share across Cloudflare Workers
 * requests. A WebSocket Pool is not: its socket belongs to the request that opened it.
 * For transactions use `withTransaction` from '@/lib/db/transaction'.
 */
export const db = drizzle(neon(databaseUrl), { schema });

// Export schema for use in other files
export * from './schema';