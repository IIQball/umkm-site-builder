import { describe, it, expect } from 'vitest';
import { canUserAction } from '@/lib/auth/permissions';
import type { Role, Resource, Action } from '@/types/auth';

describe('Permissions Matrix (canUserAction)', () => {
  const allRoles: Role[] = ['superadmin', 'admin', 'designer', 'tenant', 'public'];
  
  const expectAllowedRoles = (resource: Resource, action: Action, allowedRoles: Role[]) => {
    allRoles.forEach(role => {
      const allowed = allowedRoles.includes(role);
      const result = canUserAction(role, resource, action);
      expect(result).toBe(allowed);
    });
  };

  describe('Users', () => {
    it('allows admin and superadmin to create users', () => {
      expectAllowedRoles('users', 'create', ['admin', 'superadmin']);
    });
    
    it('allows superadmin, admin, designer, tenant to read', () => {
      expectAllowedRoles('users', 'read', ['superadmin', 'admin', 'designer', 'tenant']);
    });
    
    it('allows superadmin, admin, designer, tenant to update', () => {
      expectAllowedRoles('users', 'update', ['superadmin', 'admin', 'designer', 'tenant']);
    });
    
    it('allows superadmin to delete', () => {
      expectAllowedRoles('users', 'delete', ['superadmin']);
    });
  });

  describe('Admin Whitelist', () => {
    it('allows superadmin to create, read, update, delete', () => {
      expectAllowedRoles('admin_whitelist', 'create', ['superadmin']);
      expectAllowedRoles('admin_whitelist', 'read', ['superadmin']);
      expectAllowedRoles('admin_whitelist', 'update', ['superadmin']);
      expectAllowedRoles('admin_whitelist', 'delete', ['superadmin']);
    });
  });

  describe('Transactions', () => {
    it('allows superadmin to create', () => {
      expectAllowedRoles('transactions', 'create', ['superadmin']);
    });
    
    it('allows superadmin, admin, designer, tenant to read', () => {
      expectAllowedRoles('transactions', 'read', ['superadmin', 'admin', 'designer', 'tenant']);
    });
    
    it('allows superadmin to update', () => {
      expectAllowedRoles('transactions', 'update', ['superadmin']);
    });
    
    it('allows superadmin and admin to refund', () => {
      expectAllowedRoles('transactions', 'refund', ['superadmin', 'admin']);
    });
  });

  describe('Stores', () => {
    it('allows tenant to create', () => {
      expectAllowedRoles('stores', 'create', ['tenant']);
    });
    
    it('allows superadmin, admin, tenant, public to read', () => {
      expectAllowedRoles('stores', 'read', ['superadmin', 'admin', 'tenant', 'public']);
    });
    
    it('allows superadmin, admin, tenant to update', () => {
      expectAllowedRoles('stores', 'update', ['superadmin', 'admin', 'tenant']);
    });
    
    it('allows superadmin to delete', () => {
      expectAllowedRoles('stores', 'delete', ['superadmin']);
    });
  });

  describe('Products', () => {
    it('allows tenant and superadmin to create, tenant to update, delete', () => {
      expectAllowedRoles('products', 'create', ['tenant', 'superadmin']);
      expectAllowedRoles('products', 'update', ['tenant']);
      expectAllowedRoles('products', 'delete', ['tenant']);
    });
    
    it('allows superadmin, admin, tenant, public to read', () => {
      expectAllowedRoles('products', 'read', ['superadmin', 'admin', 'tenant', 'public']);
    });
  });

  describe('Templates', () => {
    it('allows designer to create', () => {
      expectAllowedRoles('templates', 'create', ['designer']);
    });
    
    it('allows all roles to read', () => {
      expectAllowedRoles('templates', 'read', ['superadmin', 'admin', 'designer', 'tenant', 'public']);
    });
    
    it('allows designer to update', () => {
      expectAllowedRoles('templates', 'update', ['designer']);
    });
    
    it('allows admin and superadmin to approve, admin to reject', () => {
      expectAllowedRoles('templates', 'approve', ['admin', 'superadmin']);
      expectAllowedRoles('templates', 'reject', ['admin']);
    });
    
    it('allows superadmin and designer to delete', () => {
      expectAllowedRoles('templates', 'delete', ['superadmin', 'designer']);
    });
  });

  describe('User Templates', () => {
    it('allows superadmin, admin, tenant to create', () => {
      expectAllowedRoles('user_templates', 'create', ['superadmin', 'admin', 'tenant']);
    });
    
    it('allows superadmin, admin, designer, tenant to read', () => {
      expectAllowedRoles('user_templates', 'read', ['superadmin', 'admin', 'designer', 'tenant']);
    });
    
    it('allows superadmin, admin to delete', () => {
      expectAllowedRoles('user_templates', 'delete', ['superadmin', 'admin']);
    });
  });

  describe('Commissions', () => {
    it('allows superadmin to create', () => {
      expectAllowedRoles('commissions', 'create', ['superadmin']);
    });
    
    it('allows superadmin, admin, designer to read', () => {
      expectAllowedRoles('commissions', 'read', ['superadmin', 'admin', 'designer']);
    });
    
    it('allows superadmin, admin to update', () => {
      expectAllowedRoles('commissions', 'update', ['superadmin', 'admin']);
    });
  });

  describe('Wallets', () => {
    it('allows superadmin, admin, designer to read', () => {
      expectAllowedRoles('wallets', 'read', ['superadmin', 'admin', 'designer']);
    });
    
    it('allows superadmin to update', () => {
      expectAllowedRoles('wallets', 'update', ['superadmin']);
    });
  });

  describe('Wallet Mutations', () => {
    it('allows superadmin to create', () => {
      expectAllowedRoles('wallet_mutations', 'create', ['superadmin']);
    });
    
    it('allows superadmin, admin, designer to read', () => {
      expectAllowedRoles('wallet_mutations', 'read', ['superadmin', 'admin', 'designer']);
    });
  });

  describe('Bank Accounts', () => {
    it('allows designer to create, delete', () => {
      expectAllowedRoles('bank_accounts', 'create', ['designer']);
      expectAllowedRoles('bank_accounts', 'delete', ['designer']);
    });
    
    it('allows superadmin, admin, designer to read, update', () => {
      expectAllowedRoles('bank_accounts', 'read', ['superadmin', 'admin', 'designer']);
      expectAllowedRoles('bank_accounts', 'update', ['superadmin', 'admin', 'designer']);
    });
  });

  describe('Payout Requests', () => {
    it('allows designer to create', () => {
      expectAllowedRoles('payout_requests', 'create', ['designer']);
    });
    
    it('allows superadmin, admin, designer to read', () => {
      expectAllowedRoles('payout_requests', 'read', ['superadmin', 'admin', 'designer']);
    });
    
    it('allows admin to process', () => {
      expectAllowedRoles('payout_requests', 'process', ['admin']);
    });
    
    it('allows admin, designer to cancel', () => {
      expectAllowedRoles('payout_requests', 'cancel', ['admin', 'designer']);
    });
  });

  describe('Activity Logs', () => {
    it('allows superadmin, admin, designer, tenant to read', () => {
      expectAllowedRoles('activity_logs', 'read', ['superadmin', 'admin', 'designer', 'tenant']);
    });
  });

  describe('Platform Settings', () => {
    it('allows superadmin, admin to read', () => {
      expectAllowedRoles('platform_settings', 'read', ['superadmin', 'admin']);
    });
    
    it('allows superadmin to update', () => {
      expectAllowedRoles('platform_settings', 'update', ['superadmin']);
    });
  });

  describe('Edge Cases', () => {
    it('returns false for unknown role', () => {
      expect(canUserAction('unknown_role' as unknown as Role, 'users', 'read')).toBe(false);
    });

    it('returns false for null role', () => {
      expect(canUserAction(null, 'users', 'read')).toBe(false);
    });

    it('returns false for undefined role', () => {
      expect(canUserAction(undefined, 'users', 'read')).toBe(false);
    });

    it('returns false for unknown resource', () => {
      expect(canUserAction('superadmin', 'unknown_resource' as unknown as Resource, 'read')).toBe(false);
    });

    it('returns false for unknown action on existing resource', () => {
      expect(canUserAction('superadmin', 'users', 'unknown_action' as unknown as Action)).toBe(false);
    });
  });
});
