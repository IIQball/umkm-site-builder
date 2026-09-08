import type { Role, Resource, Action, PermissionMatrix } from '@/types/auth';

const matrix: PermissionMatrix = {
  users: {
    create: ['admin', 'superadmin'], // admin/superadmin register users
    read: ['superadmin', 'admin', 'designer', 'tenant'], // own/any
    update: ['superadmin', 'admin', 'designer', 'tenant'], // own/any
    delete: ['superadmin'], // any
  },
  admin_whitelist: {
    create: ['superadmin'],
    read: ['superadmin'],
    update: ['superadmin'],
    delete: ['superadmin'],
  },
  transactions: {
    create: ['superadmin'], // webhook
    read: ['superadmin', 'admin', 'designer', 'tenant'], // own/any
    update: ['superadmin'], // webhook status
    refund: ['superadmin', 'admin'],
  },
  stores: {
    create: ['tenant'], // admin ditolak
    read: ['superadmin', 'admin', 'tenant', 'public'], // own/any/public
    update: ['superadmin', 'admin', 'tenant'], // config/subdomain
    delete: ['superadmin'],
  },
  products: {
    create: ['tenant', 'superadmin'], // own store or superadmin
    read: ['superadmin', 'admin', 'tenant', 'public'], // own/any/public
    update: ['tenant'], // own store
    delete: ['tenant'], // own store
  },
  templates: {
    create: ['designer'],
    read: ['superadmin', 'admin', 'designer', 'tenant', 'public'],
    update: ['designer'],
    approve: ['admin', 'superadmin'],
    reject: ['admin'],
    delete: ['superadmin', 'designer'],
  },
  user_templates: {
    create: ['superadmin', 'admin', 'tenant'], // assign default / purchase
    read: ['superadmin', 'admin', 'designer', 'tenant'],
    delete: ['superadmin', 'admin'], // revoke
  },
  commissions: {
    create: ['superadmin'], // auto
    read: ['superadmin', 'admin', 'designer'],
    update: ['superadmin', 'admin'], // status
  },
  wallets: {
    read: ['superadmin', 'admin', 'designer'],
    update: ['superadmin'], // balance
  },
  wallet_mutations: {
    create: ['superadmin'], // auto
    read: ['superadmin', 'admin', 'designer'],
  },
  bank_accounts: {
    create: ['designer'],
    read: ['superadmin', 'admin', 'designer'],
    update: ['superadmin', 'admin', 'designer'],
    delete: ['designer'],
  },
  payout_requests: {
    create: ['designer'],
    read: ['superadmin', 'admin', 'designer'],
    process: ['admin'],
    cancel: ['admin', 'designer'],
  },
  activity_logs: {
    read: ['superadmin', 'admin', 'designer', 'tenant'],
  },
  platform_settings: {
    read: ['superadmin', 'admin'],
    update: ['superadmin'],
  }
};

/**
 * Validates whether a user with a specific role can perform an action on a resource.
 * This only enforces the first layer (Role x Action) of the permission matrix.
 * It DOES NOT check ownership or resource state. Those must be checked in the handler.
 */
export function canUserAction(
  role: string | null | undefined,
  resource: Resource,
  action: Action
): boolean {
  if (!role) return false;
  
  const userRole = role as Role;
  
  const resourcePermissions = matrix[resource];
  if (!resourcePermissions) return false;
  
  const allowedRoles = resourcePermissions[action];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole);
}
