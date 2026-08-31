import { db, users, sessions } from './src/db';
import { eq } from 'drizzle-orm';

async function test() {
  try {
    // Just find any tenant to test
    const targetUser = await db.query.users.findFirst({
      where: eq(users.role, 'tenant')
    });

    if (!targetUser) {
      console.log('No tenant found');
      return;
    }

    console.log(`Found tenant ${targetUser.id}`);
    
    await db.update(users)
      .set({ status: 'suspended', suspendReason: '123456' })
      .where(eq(users.id, targetUser.id));

    console.log('Update success');
    
    await db.delete(sessions).where(eq(sessions.userId, targetUser.id));
    console.log('Delete sessions success');
    
    // restore
    await db.update(users).set({ status: 'active', suspendReason: null }).where(eq(users.id, targetUser.id));
    console.log('Restore success');
    
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
