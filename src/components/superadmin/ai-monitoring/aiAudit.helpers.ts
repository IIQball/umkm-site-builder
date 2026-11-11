import { formatDate, formatIDR, formatNumber } from '@/lib/utils/format';

export interface AuditBadgeStyle {
  label: string;
  cls: string;
}

export const getFeatureLabel = (type: string): string => {
  switch (type) {
    case 'logo':
      return 'Logo Toko';
    case 'packaging_mockup':
      return 'Mockup Kemasan';
    case 'product_poster':
      return 'Poster Produk';
    default:
      return type || '-';
  }
};

export const getStatusBadge = (status: string): AuditBadgeStyle => {
  switch (status) {
    case 'success':
      return {
        label: 'Sukses',
        cls: 'bg-success/10 text-success border-success/20',
      };
    case 'failed':
      return {
        label: 'Gagal',
        cls: 'bg-error/10 text-error border-error/20',
      };
    case 'processing':
      return {
        label: 'Diproses',
        cls: 'bg-info/10 text-info border-info/20',
      };
    case 'pending':
      return {
        label: 'Menunggu',
        cls: 'bg-warning/10 text-warning border-warning/20',
      };
    default:
      return {
        label: status || 'Unknown',
        cls: 'bg-nested text-secondary border-light',
      };
  }
};

export const getQualityBadge = (qualityTier?: string | null): AuditBadgeStyle => {
  const tier = (qualityTier || '').toLowerCase();
  if (tier === 'hd' || tier === 'high') {
    return {
      label: 'HD / Tinggi',
      cls: 'bg-accent/10 text-accent border-accent/20',
    };
  }
  if (tier === 'standard' || tier === 'medium') {
    return {
      label: 'Standar',
      cls: 'bg-info/10 text-info border-info/20',
    };
  }
  return {
    label: qualityTier || '-',
    cls: 'bg-nested/80 text-muted border-light',
  };
};

export const formatResolution = (sizeRatio?: string | null): string => {
  if (!sizeRatio) return '-';
  if (sizeRatio === '1:1') return '1:1 (1024×1024)';
  if (sizeRatio === '9:16') return '9:16 (1024×1792)';
  if (sizeRatio === '16:9') return '16:9 (1792×1024)';
  return sizeRatio;
};

export const formatAuditTokens = (tokens: number): string => {
  return formatNumber(tokens || 0);
};

export const formatAuditCost = (idr: number): string => {
  return formatIDR(idr || 0);
};

export const formatAuditDate = (dateStr: string): string => {
  return formatDate(dateStr, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
