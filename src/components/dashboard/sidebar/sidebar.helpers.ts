import type { AuthenticatedUser } from '@/lib/auth';

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  group: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const getNavGroups = (role: AuthenticatedUser['role']): NavGroup[] => {
  if (role === 'designer') {
    return [
      {
        title: 'Workspace',
        items: [
          { label: 'Overview Dasbor', href: '/designer', icon: 'dashboard', group: 'Workspace' },
          { label: 'Dompet & Finansial', href: '/designer/wallet', icon: 'account_balance_wallet', group: 'Workspace' },
          { label: 'Koleksi Template', href: '/designer/templates', icon: 'grid_view', group: 'Workspace' },
          { label: 'Pesanan Masuk', href: '/designer/orders', icon: 'shopping_bag', group: 'Workspace' },
        ],
      },
      {
        title: 'Navigasi',
        items: [
          { label: 'Marketplace Publik', href: '/templates', icon: 'storefront', group: 'Navigasi' },
          {label:'Pengaturan Akun', href:'/designer/settings', icon:'account_circle', group:'Navigasi'},
        ],
      },
    ];
  }

  if (role === 'tenant') {
    return [
      {
        title: 'Utama',
        items: [
          { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', group: 'Utama' },
        ],
      },
      {
        title: 'Desain & Pesanan',
        items: [
          { label: 'Galeri Template', href: '/dashboard/templates', icon: 'palette', group: 'Desain & Pesanan' },
          { label: 'Beli Template', href: '/templates', icon: 'shopping_cart', group: 'Desain & Pesanan' },
          { label: 'Riwayat Pesanan', href: '/dashboard/orders', icon: 'receipt_long', group: 'Desain & Pesanan' },
        ],
      },
      {
        title: 'Manajemen Toko',
        items: [
          { label: 'Katalog Produk', href: '/dashboard/products', icon: 'inventory_2', group: 'Manajemen Toko' },
          { label: 'Kategori Produk', href: '/dashboard/categories', icon: 'category', group: 'Manajemen Toko' },
          { label: 'Pengaturan Toko', href: '/onboarding', icon: 'store', group: 'Manajemen Toko' },
        ],
      },
    ];
  }

  if (role === 'admin') {
    return [
      {
        title: 'Pendampingan UMKM',
        items: [
          { label: 'Overview Dashboard', href: '/admin', icon: 'dashboard', group: 'Pendampingan UMKM' },
          { label: 'Merchant Anda', href: '/admin/merchants', icon: 'storefront', group: 'Pendampingan UMKM' },
          { label: 'Link Registrasi', href: '/admin/registrations', icon: 'link', group: 'Pendampingan UMKM' },
        ],
      },
      {
        title: 'Transaksi & Layanan',
        items: [
          { label: 'Dompet & Payout', href: '/admin/wallet', icon: 'account_balance_wallet', group: 'Transaksi & Layanan' },
          { label: 'Riwayat Transaksi', href: '/admin/transactions', icon: 'receipt_long', group: 'Transaksi & Layanan' },
          { label: 'Marketplace Template', href: '/templates', icon: 'palette', group: 'Transaksi & Layanan' },
          { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'history', group: 'Transaksi & Layanan' },
        ],
      },
    ];
  }

  if (role === 'superadmin') {
    return [
      {
        title: 'Platform & Pengguna',
        items: [
          { label: 'Overview Dashboard', href: '/superadmin', icon: 'dashboard', group: 'Platform & Pengguna' },
          { label: 'Manajemen Pengguna', href: '/superadmin/users', icon: 'group', group: 'Platform & Pengguna' },
          { label: 'Link Registrasi', href: '/superadmin/registrations', icon: 'link', group: 'Platform & Pengguna' },
        ],
      },
      {
        title: 'Katalog & Template',
        items: [
          { label: 'Kurasi Template', href: '/superadmin/templates', icon: 'palette', group: 'Katalog & Template' },
          { label: 'Kategori Template', href: '/superadmin/template-categories', icon: 'category', group: 'Katalog & Template' },
        ],
      },
      {
        title: 'Pengaturan Sistem',
        items: [
          { label: 'Riwayat Transaksi', href: '/superadmin/transactions', icon: 'receipt_long', group: 'Pengaturan Sistem' },
          { label: 'Pengaturan Platform', href: '/superadmin/settings', icon: 'tune', group: 'Pengaturan Sistem' },
          { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'history', group: 'Pengaturan Sistem' },
        ],
      },
    ];
  }

  return [
    {
      title: 'Menu',
      items: [{ label: 'Dashboard', href: '/dashboard', icon: 'dashboard', group: 'Menu' }],
    },
  ];
};

export type RoleConfig = {
  label: string;
  badgeLabel: string;
  icon: string;
  subtext: string;
  badgeBg: string;
  badgeText: string;
};

export const ROLE_CONFIGS: Record<string, RoleConfig> = {
  superadmin: {
    label: "Super Admin",
    badgeLabel: "SUPERADMIN",
    icon: "shield_person",
    subtext: "Akses Penuh Sistem",
    badgeBg: "bg-error/10 text-error border-error/20",
    badgeText: "text-error",
  },
  admin: {
    label: "Admin Platform",
    badgeLabel: "ADMIN",
    icon: "admin_panel_settings",
    subtext: "Operator Platform",
    badgeBg: "bg-warning/10 text-warning border-warning/20",
    badgeText: "text-warning",
  },
  designer: {
    label: "Desainer Template",
    badgeLabel: "DESIGNER",
    icon: "palette",
    subtext: "Kreator Terverifikasi",
    badgeBg: "bg-primary/10 text-primary border-primary/20",
    badgeText: "text-primary",
  },
  tenant: {
    label: "Merchant",
    badgeLabel: "MERCHANT",
    icon: "storefront",
    subtext: "Toko Online Aktif",
    badgeBg: "bg-nested text-secondary border-light",
    badgeText: "text-secondary",
  },
};

export const getRoleConfig = (role: string): RoleConfig => {
  return (
    ROLE_CONFIGS[role] ?? {
      label: role,
      badgeLabel: role.toUpperCase(),
      icon: "person",
      subtext: "Pengguna Terdaftar",
      badgeBg: "bg-nested text-secondary border-light",
      badgeText: "text-secondary",
    }
  );
};

export const getNavItems = (role: AuthenticatedUser['role']): NavItem[] => {
  return getNavGroups(role).flatMap((g) => g.items);
};

export const getDashboardHomePath = (role?: string | null): string => {
  const r = (role || '').toLowerCase().trim();
  if (r === 'superadmin') return '/superadmin';
  if (r === 'admin') return '/admin';
  if (r === 'designer') return '/designer';
  return '/dashboard';
};

export const getSettingsHref = (role?: string | null): string => {
  if (role === 'superadmin') return '/superadmin/settings';
  if (role === 'tenant') return '/onboarding';
  if (role === 'designer') return '/designer/wallet';
  return '/admin';
};
