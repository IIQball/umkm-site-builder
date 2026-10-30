import { describe, it, expect } from 'vitest';
import {
  getNavGroups,
  getNavItems,
  getDashboardHomePath,
  getSettingsHref,
  isPathActive,
  getRoleConfig,
  type NavGroup,
} from '@/components/dashboard/sidebar/sidebar.helpers';
import type { AuthenticatedUser } from '@/lib/auth';

describe('Sidebar Navigation Across All Roles', () => {
  const roles: AuthenticatedUser['role'][] = ['tenant', 'designer', 'admin', 'superadmin'];

  it.each(roles)('role "%s" returns non-empty structured navigation groups', (role) => {
    const groups: NavGroup[] = getNavGroups(role);
    expect(groups.length).toBeGreaterThan(0);

    for (const group of groups) {
      expect(group.title).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);

      for (const item of group.items) {
        expect(item.label).toBeTruthy();
        expect(item.href).toMatch(/^\/[a-zA-Z0-9_\-/]*$/);
        expect(item.icon).toBeTruthy();
        expect(item.group).toBe(group.title);
      }
    }
  });

  it.each(roles)('role "%s" has 0 duplicate hrefs in sidebar', (role) => {
    const items = getNavItems(role);
    const hrefs = items.map((i) => i.href);
    const uniqueHrefs = new Set(hrefs);
    expect(uniqueHrefs.size).toBe(hrefs.length);
  });

  describe('Tenant Role Specific Navigation', () => {
    it('groups tenant items into logical categories', () => {
      const groups = getNavGroups('tenant');
      const titles = groups.map((g) => g.title);

      expect(titles).toEqual([
        'Utama',
        'Manajemen Toko',
        'Desain & Tampilan',
        'Transaksi & Kredit',
        'Pengaturan',
      ]);

      const storeGroup = groups.find((g) => g.title === 'Manajemen Toko');
      expect(storeGroup).toBeDefined();

      const productIdx = storeGroup?.items.findIndex((i) => i.href === '/dashboard/products');
      const aiIdx = storeGroup?.items.findIndex((i) => i.href === '/dashboard/ai');
      expect(aiIdx).toBe((productIdx ?? -1) + 1);

      const transGroup = groups.find((g) => g.title === 'Transaksi & Kredit');
      expect(transGroup).toBeDefined();
      expect(transGroup?.items.some((i) => i.href === '/dashboard/orders')).toBe(true);
      expect(transGroup?.items.some((i) => i.href === '/dashboard/credits/buy')).toBe(true);
    });
  });

  describe('Designer Role Specific Navigation', () => {
    it('groups designer items into logical categories', () => {
      const groups = getNavGroups('designer');
      const titles = groups.map((g) => g.title);

      expect(titles).toEqual([
        'Utama',
        'Studio & Desain',
        'Penjualan & Dompet',
        'Pengaturan',
      ]);

      const designGroup = groups.find((g) => g.title === 'Studio & Desain');
      expect(designGroup?.items.some((i) => i.href === '/designer/templates')).toBe(true);
      expect(designGroup?.items.some((i) => i.href === '/templates')).toBe(true);

      const salesGroup = groups.find((g) => g.title === 'Penjualan & Dompet');
      expect(salesGroup?.items.some((i) => i.href === '/designer/orders')).toBe(true);
      expect(salesGroup?.items.some((i) => i.href === '/designer/wallet')).toBe(true);
    });
  });

  describe('Admin Role Specific Navigation', () => {
    it('groups admin items into logical categories', () => {
      const groups = getNavGroups('admin');
      const titles = groups.map((g) => g.title);

      expect(titles).toEqual([
        'Pendampingan UMKM',
        'Keuangan & Transaksi',
        'Layanan Platform',
        'Sistem & Akun',
      ]);

      const umkmGroup = groups.find((g) => g.title === 'Pendampingan UMKM');
      expect(umkmGroup?.items.some((i) => i.href === '/admin/merchants')).toBe(true);

      const financeGroup = groups.find((g) => g.title === 'Keuangan & Transaksi');
      expect(financeGroup?.items.some((i) => i.href === '/admin/wallet')).toBe(true);
      expect(financeGroup?.items.some((i) => i.href === '/admin/transactions')).toBe(true);

      const systemGroup = groups.find((g) => g.title === 'Sistem & Akun');
      expect(systemGroup?.items.some((i) => i.href === '/admin/audit-logs')).toBe(true);
    });
  });

  describe('Superadmin Role Specific Navigation', () => {
    it('groups superadmin items into logical categories and includes admin whitelist', () => {
      const groups = getNavGroups('superadmin');
      const titles = groups.map((g) => g.title);

      expect(titles).toEqual([
        'Platform & Pengguna',
        'Katalog & Template',
        'Monitoring & Keuangan',
        'Pengaturan Sistem',
      ]);

      const platformGroup = groups.find((g) => g.title === 'Platform & Pengguna');
      const whitelistItem = platformGroup?.items.find((i) => i.href === '/superadmin/whitelist');
      expect(whitelistItem).toBeDefined();
      expect(whitelistItem?.label).toBe('Kelola Akses Admin');
      expect(whitelistItem?.icon).toBe('admin_panel_settings');

      const catalogGroup = groups.find((g) => g.title === 'Katalog & Template');
      expect(catalogGroup?.items.some((i) => i.href === '/superadmin/business-categories')).toBe(true);
      expect(catalogGroup?.items.some((i) => i.href === '/superadmin/template-categories')).toBe(true);

      const monitorGroup = groups.find((g) => g.title === 'Monitoring & Keuangan');
      expect(monitorGroup?.items.some((i) => i.href === '/superadmin/ai-monitoring')).toBe(true);
      expect(monitorGroup?.items.some((i) => i.href === '/superadmin/transactions')).toBe(true);
      expect(monitorGroup?.items.some((i) => i.href === '/admin/audit-logs')).toBe(true);
    });
  });

  describe('Fallback Role Navigation', () => {
    it('provides minimal safe navigation for unexpected role', () => {
      const groups = getNavGroups('unknown_role' as unknown as AuthenticatedUser['role']);
      expect(groups).toHaveLength(1);
      expect(groups[0].title).toBe('Utama');
      expect(groups[0].items.some((i) => i.href === '/dashboard')).toBe(true);
    });
  });

  describe('isPathActive Helper', () => {
    it('matches exact home routes for dashboard, admin, superadmin, designer', () => {
      expect(isPathActive('/dashboard', '/dashboard')).toBe(true);
      expect(isPathActive('/dashboard/', '/dashboard')).toBe(true);
      expect(isPathActive('/dashboard/products', '/dashboard')).toBe(false);

      expect(isPathActive('/admin', '/admin')).toBe(true);
      expect(isPathActive('/admin/merchants', '/admin')).toBe(false);

      expect(isPathActive('/superadmin', '/superadmin')).toBe(true);
      expect(isPathActive('/superadmin/users', '/superadmin')).toBe(false);

      expect(isPathActive('/designer', '/designer')).toBe(true);
      expect(isPathActive('/designer/templates', '/designer')).toBe(false);
    });

    it('matches sub-paths correctly for nested resource routes', () => {
      expect(isPathActive('/dashboard/products', '/dashboard/products')).toBe(true);
      expect(isPathActive('/dashboard/products/new', '/dashboard/products')).toBe(true);
      expect(isPathActive('/dashboard/products-archived', '/dashboard/products')).toBe(false);
      expect(isPathActive('/templates', '/templates')).toBe(true);
      expect(isPathActive('/templates/category-a', '/templates')).toBe(true);
    });

    it('handles empty or missing paths gracefully', () => {
      expect(isPathActive('', '/dashboard')).toBe(false);
      expect(isPathActive('/dashboard', '')).toBe(false);
    });
  });

  describe('Role Config & Helpers', () => {
    it('returns valid home paths and settings href', () => {
      expect(getDashboardHomePath('superadmin')).toBe('/superadmin');
      expect(getDashboardHomePath('admin')).toBe('/admin');
      expect(getDashboardHomePath('designer')).toBe('/designer');
      expect(getDashboardHomePath('tenant')).toBe('/dashboard');
      expect(getDashboardHomePath(null)).toBe('/dashboard');
      expect(getSettingsHref()).toBe('/settings/account');
    });

    it('returns role config metadata', () => {
      const cfg = getRoleConfig('superadmin');
      expect(cfg.label).toBe('Super Admin');
      expect(cfg.badgeLabel).toBe('SUPERADMIN');
    });
  });
});

