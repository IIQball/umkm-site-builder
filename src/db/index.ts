import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const databaseUrl = import.meta.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * Initialize Drizzle ORM with Neon HTTP client
 * Uses serverless HTTP driver for Cloudflare Workers compatibility
 */
const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });

// Export schema for use in other files
export * from './schema';
