/**
 * routeTours.data.ts
 * Registri terpusat langkah Driver.js kontekstual untuk setiap halaman dasbor (Tenant, Designer, Admin, Superadmin).
 */
import type { RouteTourConfig } from './routes/tenantTour';
import { tenantTourRoutes } from './routes/tenantTour';
import { designerTourRoutes } from './routes/designerTour';
import { adminTourRoutes } from './routes/adminTour';
import { superadminTourRoutes } from './routes/superadminTour';

export type { RouteTourConfig };

export const routeTours: RouteTourConfig[] = [
  ...tenantTourRoutes,
  ...designerTourRoutes,
  ...adminTourRoutes,
  ...superadminTourRoutes,
];
