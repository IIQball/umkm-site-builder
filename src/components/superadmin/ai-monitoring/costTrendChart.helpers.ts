import { formatSmartIDR } from '@/lib/currency';
import type { AiDailyCostPoint } from '@/types/admin/ai-cost-trends.types';

export interface BarChartPoint {
  date: string;
  label: string;
  costIdr: number;
  costUsd: number;
  tokens: number;
  executionCount: number;
  successCount: number;
  failedCount: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChartLayout {
  svgWidth: number;
  svgHeight: number;
  padLeft: number;
  padRight: number;
  padTop: number;
  padBottom: number;
  usableWidth: number;
  usableHeight: number;
  baselineY: number;
  maxCost: number;
  bars: BarChartPoint[];
  yTicks: { label: string; y: number }[];
}

/**
 * Computes SVG geometry and bar coordinates for daily cost trend bar chart.
 */
export function computeBarChartLayout(
  points: AiDailyCostPoint[],
  svgWidth = 800,
  svgHeight = 240
): ChartLayout {
  const padLeft = 68;
  const padRight = 16;
  const padTop = 24;
  const padBottom = 34;

  const usableWidth = Math.max(100, svgWidth - padLeft - padRight);
  const usableHeight = Math.max(50, svgHeight - padTop - padBottom);
  const baselineY = padTop + usableHeight;

  const rawMax = Math.max(...points.map((p) => p.costIdr), 0);
  // Round up maxCost to nice step or minimum 1000
  const maxCost = rawMax > 0 ? Math.ceil(rawMax * 1.15) : 1000;

  const count = points.length;
  const slotWidth = count > 0 ? usableWidth / count : usableWidth;
  const barGap = count > 20 ? 4 : count > 10 ? 8 : 14;
  const barWidth = Math.max(4, Math.min(36, slotWidth - barGap));

  const bars: BarChartPoint[] = points.map((p, i) => {
    const rawHeight = maxCost > 0 ? (p.costIdr / maxCost) * usableHeight : 0;
    // Ensure small height minimum for visibility if cost > 0
    const height = p.costIdr > 0 ? Math.max(4, rawHeight) : 0;
    const x = padLeft + i * slotWidth + (slotWidth - barWidth) / 2;
    const y = baselineY - height;

    return {
      ...p,
      x,
      y,
      width: barWidth,
      height,
    };
  });

  const yTicks = [
    { label: formatSmartIDR(maxCost), y: padTop + 4 },
    { label: formatSmartIDR(Math.round(maxCost / 2)), y: padTop + usableHeight / 2 + 4 },
    { label: 'Rp 0', y: baselineY + 4 },
  ];

  return {
    svgWidth,
    svgHeight,
    padLeft,
    padRight,
    padTop,
    padBottom,
    usableWidth,
    usableHeight,
    baselineY,
    maxCost,
    bars,
    yTicks,
  };
}

/**
 * Status color & badge helper for budget usage percentage.
 */
export function getBudgetUsageStatus(percentage: number): {
  variant: 'success' | 'warning' | 'error' | 'slate';
  text: string;
  bgClass: string;
  textClass: string;
} {
  if (percentage <= 0) {
    return {
      variant: 'slate',
      text: 'Belum Terpakai',
      bgClass: 'bg-nested',
      textClass: 'text-secondary',
    };
  }
  if (percentage < 70) {
    return {
      variant: 'success',
      text: 'Aman',
      bgClass: 'bg-emerald-500/10',
      textClass: 'text-emerald-700 dark:text-emerald-400',
    };
  }
  if (percentage <= 90) {
    return {
      variant: 'warning',
      text: 'Mendekati Batas',
      bgClass: 'bg-amber-500/10',
      textClass: 'text-amber-700 dark:text-amber-400',
    };
  }
  return {
    variant: 'error',
    text: 'Kritis / Habis',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-700 dark:text-rose-400',
  };
}
