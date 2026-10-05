import { db, sessions } from '../src/db';
import { lt } from 'drizzle-orm';

async function main() {
  console.log('Starting expired session cleanup...');
  const now = new Date();
  try {
    const deleted = await db.delete(sessions)
      .where(lt(sessions.expiresAt, now))
      .returning({ id: sessions.id });
    
    console.log(`Successfully cleaned up ${deleted.length} expired sessions.`);
  } catch (error) {
    console.error('Failed to cleanup sessions:', error);
    process.exit(1);
  }
  process.exit(0);
}

main().catch(console.error);
