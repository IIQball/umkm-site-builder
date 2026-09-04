import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import ws from 'ws';

// Setup WebSocket untuk runtime Node/Bun lokal jika diperlukan
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

// Mendukung pembacaan env lewat Vite (import.meta.env) maupun Node.js (process.env)
const databaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DATABASE_URL) || 
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * Initialize Drizzle ORM with Neon Serverless driver and Pool
 * Supports transaction capabilities via WebSockets/Pool
 */
const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });

// Export schema for use in other files
export * from './schema';