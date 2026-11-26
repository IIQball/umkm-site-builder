import type { BugReportSource, BugReportStatus } from '@/schemas/bug-report.schema';
import type { BadgeVariant } from '@/components/tokens/colors';
import { formatBugAttachmentSize } from '@/components/common/bugReport.helpers';

export interface BugReportListItem {
  id: string;
  sourceApp: BugReportSource;
  status: BugReportStatus;
  title: string | null;
  description: string;
  stepsToReproduce: string | null;
  routeUrl: string;
  userAgent: string;
  reporterEmail: string | null;
  reporterUserId: string | null;
  reporterRole: string | null;
  reporterName: string | null;
  attachmentMeta: {
    name?: string;
    size?: number;
    mimeType?: string;
    url?: string;
  } | null;
  adminNotes: string | null;
  resolvedBy: string | null;
  resolverName: string | null;
  resolvedAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BugReportStatusCounts {
  all: number;
  unresolved: number;
  in_progress: number;
  resolved: number;
}

export interface BugReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const STATUS_META: Record<BugReportStatus, { label: string; variant: BadgeVariant }> = {
  unresolved: { label: 'Belum Ditangani', variant: 'rose' },
  in_progress: { label: 'Sedang Diproses', variant: 'amber' },
  resolved: { label: 'Selesai', variant: 'emerald' },
};

export const SOURCE_META: Record<BugReportSource, { label: string; variant: BadgeVariant }> = {
  site_builder: { label: 'Site Builder', variant: 'indigo' },
  landing_page: { label: 'Landing Page', variant: 'sky' },
};

export const STATUS_TABS: Array<{ id: 'all' | BugReportStatus; label: string; dotClass?: string }> = [
  { id: 'all', label: 'Semua' },
  { id: 'unresolved', label: 'Belum Ditangani', dotClass: 'bg-error' },
  { id: 'in_progress', label: 'Diproses', dotClass: 'bg-warning' },
  { id: 'resolved', label: 'Selesai', dotClass: 'bg-success' },
];

export function formatBugFileSize(bytes?: number): string {
  if (typeof bytes !== 'number' || Number.isNaN(bytes)) return '-';
  return formatBugAttachmentSize(bytes);
}

export function formatBugRoleLabel(role: string | null): string {
  if (!role || role === 'public') return 'Pengunjung Publik';
  if (role === 'superadmin') return 'Super Admin';
  if (role === 'admin') return 'Admin Dampingan';
  if (role === 'designer') return 'Desainer';
  if (role === 'tenant') return 'Pemilik UMKM';
  return role;
}
