/**
 * Session resolver — placeholder for BetterAuth integration.
 *
 * ponytail: minimal cookie decode; replace with `auth.api.getSession()` once
 * BetterAuth is wired (Phase 1.2). This stub lets the categories endpoint
 * compile and pass the guard order today.
 * 
 * DEV MODE: Auto-creates mock session for local testing when auth not implemented.
 */

import type { APIContext } from 'astro';
import { unauthorized } from '../../types/api';
import type { ErrorResponse } from '../../types/api';

export interface Session {
  userId: string;
  role: 'superadmin' | 'admin' | 'designer' | 'tenant';
}

/**
 * Extract session from request.
 * Returns null when cookie is missing or invalid.
 * 
 * DEV MODE: Returns mock session if import.meta.env.DEV is true.
 */
export function getSession(context: APIContext): Session | null {
  const isDev = import.meta.env.DEV;
  const token = context.cookies.get('session')?.value;
  
  if (!token && isDev) {
    return {
      userId: 'dev_user_123',
      role: 'tenant',
    };
  }

  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token)) as Session;
    if (!decoded.userId || !decoded.role) return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Require an authenticated session.
 * Returns the session or an ErrorResponse + status.
 * 
 * DEV MODE: Bypasses auth check if import.meta.env.DEV is true.
 */
export function requireSession(
  context: APIContext
): Session | { error: ErrorResponse; status: number } {
  const session = getSession(context);
  if (!session) {
    return { error: unauthorized(), status: 401 };
  }
  return session;
}
