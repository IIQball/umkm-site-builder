import type { AuthenticatedUser } from '@/types';
import type { Action, Resource } from '@/types/auth';
import { canUserAction } from '@/lib/auth/permissions';
import { AppError } from '@/lib/utils/api-handler';

export function isDesigner(user: AuthenticatedUser | null): boolean {
  if (!user) return false;
  return user.role === 'designer' || user.role === 'admin' || user.role === 'superadmin';
}

export function isActive(user: AuthenticatedUser | null): user is AuthenticatedUser {
  if (!user) return false;
  return user.status === 'active';
}

export function isAuthorizedDesigner(user: AuthenticatedUser | null): user is AuthenticatedUser {
  return isActive(user) && isDesigner(user);
}

export function isAdmin(user: AuthenticatedUser | null): user is AuthenticatedUser {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'superadmin';
}

export function isAuthorizedAdmin(user: AuthenticatedUser | null): user is AuthenticatedUser {
  return isActive(user) && isAdmin(user);
}

export function isSuperAdmin(user: AuthenticatedUser | null): user is AuthenticatedUser {
  if (!user) return false;
  return user.role === 'superadmin';
}

export function isAuthorizedSuperAdmin(user: AuthenticatedUser | null): user is AuthenticatedUser {
  return isActive(user) && isSuperAdmin(user);
}

export function canManageStore(
  user: AuthenticatedUser | null,
  store: { userId: string; registeredBy?: string | null }
): boolean {
  if (!user || !isActive(user)) return false;
  if (user.role === 'superadmin') return true;
  if (user.role === 'tenant') return store.userId === user.id;
  if (user.role === 'admin') return store.registeredBy === user.id;
  return false;
}

export function getRedirectUrlForRole(role?: string | null): string {
  if (role === 'designer') return '/designer/wallet';
  return '/dashboard';
}

export function isDevHeaderOverrideAllowed(options: {
  nodeEnv?: string;
  isDev?: boolean;
  allowDevHeader?: string;
} = {}): boolean {
  if (options.nodeEnv === 'test') {
    return true;
  }
  return Boolean(options.isDev) && options.allowDevHeader === 'true';
}

export function assertSuperAdminAction(
  user: AuthenticatedUser | null,
  resource: Resource,
  action: Action,
  forbiddenMessage = 'Hanya superadmin yang diizinkan mengakses sumber daya ini'
): AuthenticatedUser {
  if (!user) {
    throw new AppError('Silakan masuk terlebih dahulu', 401, undefined, 'UNAUTHORIZED');
  }
  if (!isAuthorizedSuperAdmin(user) || !canUserAction(user.role, resource, action)) {
    throw new AppError(forbiddenMessage, 403, undefined, 'FORBIDDEN');
  }
  return user;
}
