/**
 * Authentication & Role Types
 */

import { z } from "zod";
import { LoginSchema, RegisterSchema } from "@/schemas/auth.schema";

export type UserRole = 'superadmin' | 'admin' | 'designer' | 'tenant';
export type UserStatus = 'active' | 'suspended';

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
