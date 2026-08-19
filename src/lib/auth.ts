import { db } from '@/lib/db/client';
import { eq } from 'drizzle-orm';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'designer' | 'tenant';
  status: 'active' | 'suspended';
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const devUserId = request.headers.get('x-user-id');

    if (devUserId) {
      const user = await db.query.users.findFirst({
        where: (users) => eq(users.id, devUserId),
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as AuthenticatedUser['role'],
        status: user.status as AuthenticatedUser['status'],
      };
    }

     return null;
   } catch {
     return null;
   }
}

export function isDesigner(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.role === 'designer' || user.role === 'superadmin';
}

export function isActive(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.status === 'active';
}

export function isAuthorizedDesigner(user: AuthenticatedUser | null): boolean {
  return isActive(user) && isDesigner(user);
}
