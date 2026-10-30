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
        title: 'Utama',
        items: [
          { label: 'Overview Dasbor', href: '/designer', icon: 'dashboard', group: 'Utama' },
        ],
      },
      {
        title: 'Studio & Desain',
        items: [
          { label: 'Koleksi Template', href: '/designer/templates', icon: 'palette', group: 'Studio & Desain' },
          { label: 'Marketplace Publik', href: '/templates', icon: 'storefront', group: 'Studio & Desain' },
        ],
      },
      {
        title: 'Penjualan & Dompet',
        items: [
          { label: 'Pesanan Masuk', href: '/designer/orders', icon: 'shopping_bag', group: 'Penjualan & Dompet' },
          { label: 'Dompet & Finansial', href: '/designer/wallet', icon: 'account_balance_wallet', group: 'Penjualan & Dompet' },
        ],
      },
      {
        title: 'Pengaturan',
        items: [
          { label: 'Pengaturan Akun', href: '/settings/account', icon: 'manage_accounts', group: 'Pengaturan' },
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
        title: 'Manajemen Toko',
        items: [
          { label: 'Katalog Produk', href: '/dashboard/products', icon: 'inventory_2', group: 'Manajemen Toko' },
          { label: 'Studio AI', href: '/dashboard/ai', icon: 'auto_awesome', group: 'Manajemen Toko' },
          { label: 'Kategori Produk', href: '/dashboard/categories', icon: 'category', group: 'Manajemen Toko' },
        ],
      },
      {
        title: 'Desain & Tampilan',
        items: [
          { label: 'Galeri Template', href: '/dashboard/templates', icon: 'palette', group: 'Desain & Tampilan' },
          { label: 'Beli Template', href: '/templates', icon: 'shopping_cart', group: 'Desain & Tampilan' },
        ],
      },
      {
        title: 'Transaksi & Kredit',
        items: [
          { label: 'Riwayat Pesanan', href: '/dashboard/orders', icon: 'receipt_long', group: 'Transaksi & Kredit' },
          { label: 'Beli Kredit AI', href: '/dashboard/credits/buy', icon: 'flash_on', group: 'Transaksi & Kredit' },
        ],
      },
      {
        title: 'Pengaturan',
        items: [
          { label: 'Pengaturan Toko', href: '/onboarding', icon: 'store', group: 'Pengaturan' },
          { label: 'Pengaturan Akun', href: '/settings/account', icon: 'manage_accounts', group: 'Pengaturan' },
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
        title: 'Keuangan & Transaksi',
        items: [
          { label: 'Dompet & Payout', href: '/admin/wallet', icon: 'account_balance_wallet', group: 'Keuangan & Transaksi' },
          { label: 'Riwayat Transaksi', href: '/admin/transactions', icon: 'receipt_long', group: 'Keuangan & Transaksi' },
        ],
      },
      {
        title: 'Layanan Platform',
        items: [
          { label: 'Marketplace Template', href: '/templates', icon: 'palette', group: 'Layanan Platform' },
          { label: 'Monitoring AI', href: '/admin/ai-monitoring', icon: 'smart_toy', group: 'Layanan Platform' },
        ],
      },
      {
        title: 'Sistem & Akun',
        items: [
          { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'history', group: 'Sistem & Akun' },
          { label: 'Pengaturan Akun', href: '/settings/account', icon: 'manage_accounts', group: 'Sistem & Akun' },
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
          { label: 'Kelola Akses Admin', href: '/superadmin/whitelist', icon: 'admin_panel_settings', group: 'Platform & Pengguna' },
          { label: 'Link Registrasi', href: '/superadmin/registrations', icon: 'link', group: 'Platform & Pengguna' },
        ],
      },
      {
        title: 'Katalog & Template',
        items: [
          { label: 'Kurasi Template', href: '/superadmin/templates', icon: 'palette', group: 'Katalog & Template' },
          { label: 'Kategori Template', href: '/superadmin/template-categories', icon: 'category', group: 'Katalog & Template' },
          { label: 'Kategori Bisnis', href: '/superadmin/business-categories', icon: 'storefront', group: 'Katalog & Template' },
        ],
      },
      {
        title: 'Monitoring & Keuangan',
        items: [
          { label: 'Monitoring AI', href: '/superadmin/ai-monitoring', icon: 'smart_toy', group: 'Monitoring & Keuangan' },
          { label: 'Riwayat Transaksi', href: '/superadmin/transactions', icon: 'receipt_long', group: 'Monitoring & Keuangan' },
          { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'history', group: 'Monitoring & Keuangan' },
        ],
      },
      {
        title: 'Pengaturan Sistem',
        items: [
          { label: 'Pengaturan Platform', href: '/superadmin/settings', icon: 'tune', group: 'Pengaturan Sistem' },
          { label: 'Pengaturan Akun', href: '/settings/account', icon: 'manage_accounts', group: 'Pengaturan Sistem' },
        ],
      },
    ];
  }

  return [
    {
      title: 'Utama',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', group: 'Utama' },
        { label: 'Pengaturan Akun', href: '/settings/account', icon: 'manage_accounts', group: 'Utama' },
      ],
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

export const getSettingsHref = (): string => {
  return '/settings/account';
};

export const isPathActive = (currentPath: string, href: string): boolean => {
  if (!currentPath || !href) return false;
  const cleanCurrent = currentPath.replace(/\/$/, '') || '/';
  const cleanHref = href.replace(/\/$/, '') || '/';
  if (
    cleanHref === '/dashboard' ||
    cleanHref === '/admin' ||
    cleanHref === '/superadmin' ||
    cleanHref === '/designer'
  ) {
    return cleanCurrent === cleanHref;
  }
  return cleanCurrent === cleanHref || cleanCurrent.startsWith(cleanHref + '/');
};
