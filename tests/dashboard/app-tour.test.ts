import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getDriverSteps,
  getTourSteps,
  isTourCompleted,
  setTourCompleted,
  isDashboardHomePage,
} from '@/components/dashboard/tour/tour.helpers';

describe('Dashboard App Tour Helpers', () => {
  let localStorageMock: Record<string, string> = {};
  const originalLocalStorage = globalThis.localStorage;

  beforeEach(() => {
    localStorageMock = {};
    (globalThis as unknown as { localStorage: unknown }).localStorage = {
      getItem: (key: string) => localStorageMock[key] ?? null,
      setItem: (key: string, val: string) => {
        localStorageMock[key] = val;
      },
      removeItem: (key: string) => {
        delete localStorageMock[key];
      },
      clear: () => {
        localStorageMock = {};
      },
    };
  });

  afterEach(() => {
    (globalThis as unknown as { localStorage: unknown }).localStorage = originalLocalStorage;
  });

  it('identifies home pages correctly', () => {
    expect(isDashboardHomePage('/dashboard')).toBe(true);
    expect(isDashboardHomePage('/dashboard/')).toBe(true);
    expect(isDashboardHomePage('/designer')).toBe(true);
    expect(isDashboardHomePage('/admin')).toBe(true);
    expect(isDashboardHomePage('/superadmin')).toBe(true);

    expect(isDashboardHomePage('/dashboard/products')).toBe(false);
    expect(isDashboardHomePage('/designer/templates')).toBe(false);
    expect(isDashboardHomePage('/superadmin/settings')).toBe(false);
  });

  it('shows shell navigation only on home page and excludes shell on sub-pages', () => {
    // 1. Home page includes shell
    const homeSteps = getDriverSteps('tenant', '/dashboard');
    expect(homeSteps.length).toBeGreaterThanOrEqual(5);
    expect(homeSteps[0].element).toBe('#dashboard-sidebar');
    expect(homeSteps[1].element).toBe('#navbar-breadcrumbs');
    expect(homeSteps[2].element).toBe('#navbar-notifications');
    expect(homeSteps[3].element).toBe('#navbar-user-menu');

    // 2. Sub-page does NOT include shell
    const productSteps = getDriverSteps('tenant', '/dashboard/products');
    expect(productSteps.every((s) => s.element !== '#dashboard-sidebar')).toBe(true);
    expect(productSteps.every((s) => s.element !== '#navbar-breadcrumbs')).toBe(true);
    expect(productSteps.every((s) => s.element !== '#navbar-notifications')).toBe(true);
    expect(productSteps.every((s) => s.element !== '#navbar-user-menu')).toBe(true);
  });

  it('does not provide any driver steps for superadmin role', () => {
    expect(getDriverSteps('superadmin', '/superadmin')).toEqual([]);
    expect(getDriverSteps('superadmin', '/superadmin/template-categories')).toEqual([]);
    expect(getDriverSteps('superadmin', '/superadmin/settings')).toEqual([]);
  });

  it('provides tailored driver steps for admin template categories page', () => {
    const steps = getDriverSteps('admin', '/superadmin/template-categories');
    expect(steps.length).toBe(4);
    expect(steps[0].element).toBe('#btn-add-category-top');
    expect(steps[0].popover?.title).toContain('Tambah Kategori');
    expect(steps[3].element).toBe('table');
  });

  it('provides tailored driver steps for merchant products page', () => {
    const steps = getDriverSteps('tenant', '/dashboard/products');
    expect(steps.length).toBe(4);
    expect(steps[0].element).toBe('#add-product-btn');
    expect(steps[0].popover?.title).toContain('Tambah Produk');
    expect(steps[3].element).toBe('table');
  });

  it('provides tailored driver steps for merchant categories page', () => {
    const steps = getDriverSteps('tenant', '/dashboard/categories');
    expect(steps.length).toBe(3);
    expect(steps[0].element).toBe('#add-category-btn');
    expect(steps[0].popover?.title).toContain('Tambah Kategori');
    expect(steps[2].element).toBe('table');
  });

  it('provides tailored driver steps for designer templates page', () => {
    const steps = getDriverSteps('designer', '/designer/templates');
    expect(steps.length).toBe(3);
    expect(steps[0].element).toBe('a[href="/builder/new"]');
    expect(steps[0].popover?.title).toContain('Rancang Template');
    expect(steps[2].element).toBe('table');
  });

  it('provides tailored driver steps for designer wallet page', () => {
    const steps = getDriverSteps('designer', '/designer/wallet');
    expect(steps.length).toBe(3);
    expect(steps[0].popover?.title).toContain('Saldo');
    expect(steps[1].popover?.title).toContain('Payout');
  });

  it('provides tailored driver steps for admin registrations page', () => {
    const steps = getDriverSteps('admin', '/admin/registrations');
    expect(steps.length).toBe(3);
    expect(steps[0].element).toBe('#btn-create-invitation');
    expect(steps[0].popover?.title).toContain('Buat Undangan');
  });

  it('provides tailored driver steps for admin whitelist page', () => {
    const steps = getDriverSteps('admin', '/superadmin/whitelist');
    expect(steps.length).toBe(3);
    expect(steps[0].element).toBe('#btn-add-admin-whitelist');
    expect(steps[0].popover?.title).toContain('Tambah Akun Administrator');
  });

  it('provides backwards-compatible getTourSteps helper', () => {
    const steps = getTourSteps('tenant', '/dashboard');
    expect(steps.length).toBeGreaterThanOrEqual(5);
    expect(steps[0].targetId).toBe('dashboard-sidebar');
  });

  it('tracks tour completion status in localStorage per role and path', () => {
    const path = '/superadmin/template-categories';
    expect(isTourCompleted('superadmin', path)).toBe(false);

    setTourCompleted('superadmin', true, path);
    expect(isTourCompleted('superadmin', path)).toBe(true);
    expect(isTourCompleted('superadmin', '/superadmin/settings')).toBe(false);

    setTourCompleted('superadmin', false, path);
    expect(isTourCompleted('superadmin', path)).toBe(false);
  });
});
