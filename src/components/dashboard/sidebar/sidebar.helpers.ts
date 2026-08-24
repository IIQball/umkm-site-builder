import type { AuthenticatedUser } from '@/lib/auth';

export type NavItem = { label: string; href: string; icon: string; group?: string };

export const getNavItems = (role: AuthenticatedUser['role']): NavItem[] => {
  if (role === 'designer') return [
    { label: 'Dashboard',         href: '/designer/wallet',    icon: 'account_balance_wallet', group: 'GENERAL' },
    { label: 'Template Saya',     href: '/designer/templates', icon: 'grid_view',              group: 'GENERAL' },
    { label: 'Profil Desainer',   href: '/auth/settings',      icon: 'manage_accounts',        group: 'ACCOUNT' },
    { label: 'Kembali ke Publik', href: '/public/templates',   icon: 'open_in_new',            group: 'ACCOUNT' },
  ];
  if (role === 'tenant') return [
    { label: 'Dashboard',       href: '/dashboard',            icon: 'dashboard' },
    { label: 'Produk',          href: '/dashboard/products',   icon: 'inventory_2' },
    { label: 'Kategori',        href: '/dashboard/categories', icon: 'category' },
    { label: 'Pengaturan Toko', href: '/dashboard/store',      icon: 'store' },
  ];
  if (role === 'superadmin') return [
    { label: 'Manage Admin',    href: '/admin/whitelist',      icon: 'admin_panel_settings' },
  ];
  if (role === 'admin') return [
    { label: 'Overview',           href: '/dashboard',          icon: 'monitoring' },
    { label: 'Kurasi Template',    href: '/admin/templates',    icon: 'palette' },
    { label: 'Pengaturan Komisi',  href: '/admin/settings',     icon: 'settings' },
    { label: 'Manajemen User',     href: '/admin/users',        icon: 'group' },
    { label: 'Transaksi',          href: '/admin/transactions', icon: 'receipt_long' },
  ];
  return [{ label: 'Dashboard', href: '/dashboard', icon: 'dashboard' }];
};
