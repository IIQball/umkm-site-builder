/**
 * Database client
 * Singleton instance of Drizzle ORM connected to Neon PostgreSQL
 */

import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from '@/lib/config/app';
import * as schema from '@/db/schema';

type Database = NeonHttpDatabase<typeof schema>;

let dbInstance: Database | null = null;

export function getDb(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  if (!config.database.url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Create Neon SQL client
  const sql = neon(config.database.url);

  // Create Drizzle ORM instance
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
}

export const db = getDb();

export default db;

