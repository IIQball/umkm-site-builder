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
          { label: 'Dompet & Finansial', href: '/designer/wallet', icon: 'account_balance_wallet', group: 'Workspace' },
          { label: 'Koleksi Template', href: '/designer/templates', icon: 'grid_view', group: 'Workspace' },
          { label: 'Pesanan Masuk', href: '/designer/orders', icon: 'shopping_bag', group: 'Workspace' },
        ],
      },
      {
        title: 'Navigasi',
        items: [
          { label: 'Marketplace Publik', href: '/templates', icon: 'storefront', group: 'Navigasi' },
          { label: 'Profil Desainer', href: '/auth/settings', icon: 'manage_accounts', group: 'Navigasi' },
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
          { label: 'Analitik & Performa', href: '/dashboard/analytics', icon: 'trending_up', group: 'Utama' },
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
          { label: 'Pengaturan Toko', href: '/dashboard/store', icon: 'store', group: 'Manajemen Toko' },
        ],
      },
    ];
  }

  if (role === 'admin') {
    return [
      {
        title: 'Ringkasan',
        items: [
          { label: 'Dashboard', href: '/dashboard', icon: 'monitoring', group: 'Ringkasan' },
          { label: 'Mutasi Transaksi', href: '/admin/transactions', icon: 'receipt_long', group: 'Ringkasan' },
        ],
      },
      {
        title: 'Template & Kurasi',
        items: [
          { label: 'Kurasi Template', href: '/admin/templates', icon: 'palette', group: 'Template & Kurasi' },
          { label: 'Kategori Template', href: '/admin/template-categories', icon: 'category', group: 'Template & Kurasi' },
        ],
      },
      {
        title: 'Sistem & Pengguna',
        items: [
          { label: 'Pengaturan Komisi', href: '/admin/settings', icon: 'tune', group: 'Sistem & Pengguna' },
          { label: 'Manajemen Pengguna', href: '/admin/users', icon: 'group', group: 'Sistem & Pengguna' },
        ],
      },
    ];
  }

  if (role === 'superadmin') {
    return [
      {
        title: 'Administrasi Utama',
        items: [
          { label: 'Kelola Akses Admin', href: '/admin/whitelist', icon: 'admin_panel_settings', group: 'Administrasi Utama' },
          { label: 'Overview Dashboard', href: '/dashboard', icon: 'dashboard', group: 'Administrasi Utama' },
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
    badgeBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50",
    badgeText: "text-rose-700 dark:text-rose-300",
  },
  admin: {
    label: "Admin Platform",
    badgeLabel: "ADMIN",
    icon: "admin_panel_settings",
    subtext: "Operator Platform",
    badgeBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50",
    badgeText: "text-amber-800 dark:text-amber-300",
  },
  designer: {
    label: "Desainer Template",
    badgeLabel: "DESIGNER",
    icon: "palette",
    subtext: "Kreator Terverifikasi",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50",
    badgeText: "text-indigo-700 dark:text-indigo-300",
  },
  tenant: {
    label: "Merchant",
    badgeLabel: "MERCHANT",
    icon: "storefront",
    subtext: "Toko Online Aktif",
    badgeBg: "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    badgeText: "text-slate-700 dark:text-slate-300",
  },
};

export const getRoleConfig = (role: string): RoleConfig => {
  return (
    ROLE_CONFIGS[role] ?? {
      label: role,
      badgeLabel: role.toUpperCase(),
      icon: "person",
      subtext: "Pengguna Terdaftar",
      badgeBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      badgeText: "text-slate-700 dark:text-slate-300",
    }
  );
};

export const getNavItems = (role: AuthenticatedUser['role']): NavItem[] => {
  return getNavGroups(role).flatMap((g) => g.items);
};
