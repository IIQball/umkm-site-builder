/**
 * Re-exports the shared Drizzle client alongside the schema.
 *
 * This module used to build a second, independent Neon client from its own env lookup, which
 * meant two connection paths with different fallback rules and two module-scope throws when
 * DATABASE_URL was absent. It now defers to `@/lib/db/client`, whose `db` is lazy — see the
 * note there for why a throw during module evaluation takes down every route on Workers.
 */
export { db, getDb, type Database } from '@/lib/db/client';

// Export schema for use in other files
export * from './schema';
