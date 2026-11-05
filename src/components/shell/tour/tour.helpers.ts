/**
 * tour.helpers.ts
 * Data step panduan interaktif (App-Tour) berbasis Driver.js berdasarkan role pengguna dan rute halaman.
 */
import type { DriveStep } from 'driver.js';
import { routeTours } from './routeTours.data';
import { getShellSteps, getSidebarSelector } from './routes/shellTour.helpers';

export { getSidebarSelector };

export interface TourStep {
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  targetId?: string;
}

export function isDashboardHomePage(path: string): boolean {
  const clean = (path || '').replace(/\/$/, '');
  return (
    clean === '/dashboard' ||
    clean === '/designer' ||
    clean === '/admin' ||
    clean === '/superadmin'
  );
}

export function getDriverSteps(role: string, currentPath?: string): DriveStep[] {
  const normalizedRole = role.toLowerCase();
  if (normalizedRole === 'superadmin') {
    return [];
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const path = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '');
  const cleanPath = path ? path.replace(/\/$/, '') : '';

  // 1. Cek konfigurasi rute kontekstual
  if (cleanPath) {
    const matchedRoute = routeTours.find((r) => r.match(cleanPath));
    if (matchedRoute) {
      return matchedRoute.steps(isMobile);
    }
  }

  // 2. Fallback untuk beranda yang belum terpetakan khusus
  return [
    ...getShellSteps(normalizedRole, isMobile),
    {
      element: '#dashboard-content-container',
      popover: {
        title: 'Area Kerja Utama Dasbor',
        description: 'Semua informasi metrik performa, kontrol data, dan operasional Anda ditampilkan di sini.',
        side: 'top',
        align: 'center',
      },
    },
  ];
}

// Representasi backwards-compatible untuk komponen warisan
export function getTourSteps(role: string, currentPath?: string): TourStep[] {
  const driverSteps = getDriverSteps(role, currentPath);
  return driverSteps.map((step, idx) => ({
    title: step.popover?.title || '',
    description: step.popover?.description || '',
    icon: idx === 0 ? 'menu_open' : idx === 1 ? 'search' : idx === 2 ? 'notifications' : idx === 3 ? 'account_circle' : 'dashboard',
    badge: `Langkah ${idx + 1}/${driverSteps.length}`,
    targetId: typeof step.element === 'string' ? step.element.replace('#', '') : undefined,
  }));
}

export function getTourKey(role: string, path?: string): string {
  const normRole = role.toLowerCase();
  const cleanPath = (path || (typeof window !== 'undefined' ? window.location.pathname : ''))
    .replace(/^\//, '')
    .replace(/\//g, '_') || 'home';
  return `pinoka_tour_${normRole}_${cleanPath}`;
}

export function isTourCompleted(role: string, path?: string): boolean {
  try {
    if (typeof localStorage === 'undefined') return true;
    const key = getTourKey(role, path);
    return localStorage.getItem(key) === 'true';
  } catch {
    return true;
  }
}

export function setTourCompleted(role: string, completed = true, path?: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const key = getTourKey(role, path);
    if (completed) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Abaikan kesalahan localStorage bila storage diblokir browser
  }
}
