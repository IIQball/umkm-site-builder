import { describe, it, expect } from 'bun:test';
import {
  getNotificationIcon,
  getNotificationLink,
  filterNotifications,
  buildNotificationTabs,
} from '@/components/dashboard/navbar/notification.helpers';

describe('Navbar Notifications Helpers & Deep Links', () => {
  describe('getNotificationIcon', () => {
    it('maps notification types to correct Material Symbols icon names', () => {
      expect(getNotificationIcon('user_registered')).toBe('person_add');
      expect(getNotificationIcon('template_submitted')).toBe('palette');
      expect(getNotificationIcon('template_reviewed')).toBe('fact_check');
      expect(getNotificationIcon('template_purchased')).toBe('shopping_cart');
      expect(getNotificationIcon('store_managed_by_admin')).toBe('storefront');
      expect(getNotificationIcon('quota_upgrade_request')).toBe('rocket_launch');
      expect(getNotificationIcon('unknown_type')).toBe('notifications');
    });
  });

  describe('getNotificationLink', () => {
    it('resolves correct links based on notification type and user role', () => {
      // User registration -> superadmin users management
      expect(getNotificationLink({ type: 'user_registered' })).toBe('/superadmin/users');

      // Template submission -> superadmin curation
      expect(getNotificationLink({ type: 'template_submitted' })).toBe('/superadmin/templates');

      // Template reviewed -> designer templates
      expect(getNotificationLink({ type: 'template_reviewed' })).toBe('/designer/templates');

      // Template purchased
      expect(getNotificationLink({ type: 'template_purchased' }, 'tenant')).toBe('/tenant/store');
      expect(getNotificationLink({ type: 'template_purchased' }, 'designer')).toBe('/designer/wallet');

      // Store managed by admin
      expect(getNotificationLink({ type: 'store_managed_by_admin' })).toBe('/tenant/store');
    });

    it('resolves quota upgrade requests with query parameters for superadmin', () => {
      const quotaNotif = {
        type: 'quota_upgrade_request',
        metadata: {
          tenantId: 'store_123',
          requested: { productSlots: 10, categorySlots: 5 },
        },
      };

      const link = getNotificationLink(quotaNotif, 'superadmin');
      expect(link).toBe('/superadmin/users?action=quota&tenantId=store_123&addProd=10&addCat=5');
    });

    it('resolves quota upgrade requests to store for tenant', () => {
      const quotaNotif = {
        type: 'quota_upgrade_request',
        metadata: { tenantId: 'store_123' },
      };

      const link = getNotificationLink(quotaNotif, 'tenant');
      expect(link).toBe('/tenant/store');
    });

    it('falls back safely for unknown notification types', () => {
      expect(getNotificationLink({ type: 'custom_alert' })).toBe('#');
      expect(getNotificationLink(null)).toBe('#');
    });
  });

  describe('filterNotifications', () => {
    const list = [
      { id: '1', type: 'user_registered' },
      { id: '2', type: 'template_submitted' },
      { id: '3', type: 'template_purchased' },
      { id: '4', type: 'quota_upgrade_request' },
    ];

    it('returns all when activeTab is all', () => {
      expect(filterNotifications(list, 'all').length).toBe(4);
    });

    it('filters correctly by activeTab category', () => {
      expect(filterNotifications(list, 'users').map((n) => n.id)).toEqual(['1']);
      expect(filterNotifications(list, 'template').map((n) => n.id)).toEqual(['2']);
      expect(filterNotifications(list, 'sales').map((n) => n.id)).toEqual(['3']);
      expect(filterNotifications(list, 'quota').map((n) => n.id)).toEqual(['4']);
    });
  });

  describe('buildNotificationTabs', () => {
    const list = [
      { id: '1', type: 'user_registered', isRead: false },
      { id: '2', type: 'template_submitted', isRead: false },
      { id: '3', type: 'quota_upgrade_request', isRead: true },
    ];

    it('builds tabs with correct unread counts per role', () => {
      const superadminTabs = buildNotificationTabs(list, 'superadmin');
      const allTab = superadminTabs.find((t) => t.id === 'all');
      const usersTab = superadminTabs.find((t) => t.id === 'users');
      const quotaTab = superadminTabs.find((t) => t.id === 'quota');

      expect(allTab?.count).toBe(2);
      expect(usersTab?.count).toBe(1);
      expect(quotaTab?.count).toBe(0); // already read
    });
  });
});

