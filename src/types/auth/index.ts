/**
 * Authentication & Role Types
 */

export type UserRole = 'superadmin' | 'admin' | 'designer' | 'tenant';
export type UserStatus = 'active' | 'suspended';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
