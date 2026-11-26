import type { BadgeVariant } from '@/components/tokens/colors';
import { formatNumber } from '@/lib/utils/format';

export interface RankBadgeInfo {
  label: string;
  variant: BadgeVariant;
}

/**
 * Returns design system semantic badge configuration for merchant rank podium.
 */
export function getRankBadgeInfo(rank: number): RankBadgeInfo {
  if (rank === 1) {
    return { label: '#1', variant: 'warning' };
  }
  if (rank === 2) {
    return { label: '#2', variant: 'slate' };
  }
  if (rank === 3) {
    return { label: '#3', variant: 'orange' };
  }
  return { label: `#${rank}`, variant: 'secondary' };
}

/**
 * Maps AI generation success rate to semantic status badge color variant.
 */
export function getSuccessRateVariant(rate: number): BadgeVariant {
  if (rate >= 90) return 'success';
  if (rate >= 80) return 'info';
  return 'warning';
}

/**
 * Formats token counts compactly (k / M) with design system formatNumber fallback.
 */
export function formatCompactTokens(tokens: number): string {
  if (!tokens || tokens <= 0) return '0';
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}k`;
  }
  return formatNumber(tokens);
}
