import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { config } from '@/lib/config/app';
import * as schema from '@/db/schema';
import ws from 'ws';

// Setup WebSocket untuk runtime Node/Bun lokal jika diperlukan
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

export type Database = NeonDatabase<typeof schema>;

let dbInstance: Database | null = null;

export function getDb(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  if (!config.database.url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString: config.database.url });
  dbInstance = drizzle(pool, { schema });
  return dbInstance;
}

export const db = getDb();
export default db;

