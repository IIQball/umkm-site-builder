/**
 * Notification helpers for icon resolution, deep links, and category tabs.
 */

export interface AppNotificationItem {
  id: string;
  type: string;
  title?: string;
  message?: string;
  isRead?: boolean;
  metadata?: {
    tenantId?: string;
    requested?: {
      productSlots?: number;
      categorySlots?: number;
    };
    [key: string]: unknown;
  } | null;
  createdAt?: string | Date;
}

export function getNotificationIcon(type: string): string {
  if (type === 'user_registered') return 'person_add';
  if (type === 'template_submitted') return 'palette';
  if (type === 'template_reviewed') return 'fact_check';
  if (type === 'template_purchased') return 'shopping_cart';
  if (type === 'store_managed_by_admin') return 'storefront';
  if (type === 'quota_upgrade_request') return 'rocket_launch';
  return 'notifications';
}

export function getNotificationLink(
  notif: Partial<AppNotificationItem> | null | undefined,
  userRole?: string
): string {
  const type = notif?.type;
  if (type === 'user_registered') return '/superadmin/users';
  if (type === 'template_submitted') return '/superadmin/templates';
  if (type === 'template_reviewed') return '/designer/templates';
  if (type === 'template_purchased') return userRole === 'tenant' ? '/tenant/store' : '/designer/wallet';
  if (type === 'store_managed_by_admin') return '/tenant/store';
  if (type === 'quota_upgrade_request') {
    if (userRole === 'tenant') return '/tenant/store';
    const { tenantId, requested } = notif?.metadata || {};
    if (tenantId) {
      let url = `/superadmin/users?action=quota&tenantId=${tenantId}`;
      if (requested?.productSlots) url += `&addProd=${requested.productSlots}`;
      if (requested?.categorySlots) url += `&addCat=${requested.categorySlots}`;
      return url;
    }
    return '/superadmin/users';
  }
  return '#';
}

export interface NotificationTab {
  id: string;
  label: string;
  count: number;
}

export function filterNotifications(
  notifications: AppNotificationItem[],
  activeTab: string
): AppNotificationItem[] {
  if (activeTab === 'users') return notifications.filter((n) => n.type === 'user_registered');
  if (activeTab === 'sales') return notifications.filter((n) => n.type === 'template_purchased');
  if (activeTab === 'template') return notifications.filter((n) => ['template_submitted', 'template_reviewed'].includes(n.type));
  if (activeTab === 'store') return notifications.filter((n) => ['store_managed_by_admin', 'template_purchased'].includes(n.type));
  if (activeTab === 'quota') return notifications.filter((n) => ['quota_upgrade_request'].includes(n.type));
  return notifications;
}

export function buildNotificationTabs(
  notifications: AppNotificationItem[],
  userRole?: string
): NotificationTab[] {
  const unread = notifications.filter((n) => !n.isRead);
  const count = (pred: (n: AppNotificationItem) => boolean) => unread.filter(pred).length;

  return [
    { id: 'all', label: 'Semua', count: unread.length },
    { id: 'template', label: 'Template', count: count((n) => ['template_submitted', 'template_reviewed'].includes(n.type)) },
    ...(userRole === 'superadmin' ? [{ id: 'users', label: 'Pengguna', count: count((n) => n.type === 'user_registered') }] : []),
    ...(userRole === 'designer' ? [{ id: 'sales', label: 'Penjualan', count: count((n) => n.type === 'template_purchased') }] : []),
    ...(userRole === 'tenant' ? [{ id: 'store', label: 'Toko', count: count((n) => ['store_managed_by_admin', 'template_purchased'].includes(n.type)) }] : []),
    ...(userRole === 'superadmin' || userRole === 'tenant' ? [{ id: 'quota', label: 'Kuota', count: count((n) => n.type === 'quota_upgrade_request') }] : []),
  ];
}

