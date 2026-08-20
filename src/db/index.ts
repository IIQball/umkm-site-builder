import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

<<<<<<< HEAD
const databaseUrl = import.meta.env.DATABASE_URL;
=======
// Mendukung pembacaan env lewat Vite (import.meta.env) maupun Node.js (process.env)
const databaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DATABASE_URL) || 
  process.env.DATABASE_URL;
>>>>>>> fda1e53fb3206e65823749c36b0cd924011ac112

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