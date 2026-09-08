/**
 * Authentication & Role Types
 */

import { z } from "zod";
import { LoginSchema, RegisterSchema } from "@/schemas/auth.schema";

export type UserRole = 'superadmin' | 'admin' | 'designer' | 'tenant';
export type UserStatus = 'active' | 'suspended';

export type Role = UserRole | 'public';

export type Resource = 
  | 'users' 
  | 'admin_whitelist' 
  | 'transactions' 
  | 'stores' 
  | 'products' 
  | 'templates' 
  | 'user_templates' 
  | 'commissions' 
  | 'wallets' 
  | 'wallet_mutations' 
  | 'bank_accounts' 
  | 'payout_requests' 
  | 'activity_logs' 
  | 'platform_settings';

export type Action = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'approve' 
  | 'reject' 
  | 'refund' 
  | 'process' 
  | 'cancel';

export type PermissionMatrix = {
  [K in Resource]?: {
    [A in Action]?: Role[];
  };
};

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
