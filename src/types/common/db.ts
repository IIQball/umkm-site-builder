/**
 * Database executor types
 */

import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import type * as schema from '@/db/schema';

/**
 * Anything that can run a query against the app schema.
 *
 * `PgTransaction` extends `PgDatabase`, so this accepts both the top-level `db`
 * client and the `tx` handle passed into `withTransaction`, without casting.
 */
export type DbExecutor = PgDatabase<PgQueryResultHKT, typeof schema>;
