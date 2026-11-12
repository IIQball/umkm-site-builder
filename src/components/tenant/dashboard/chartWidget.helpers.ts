export type Range = '7d' | '30d' | '12m';

export interface TrafficPoint {
  key: string;
  label: string;
  views: number;
  waClicks: number;
  conversion: number;
}

export interface MerchantGrowthPoint {
  key: string;
  label: string;
  fullLabel: string;
  count: number;
  cumulative: number;
  x: number;
  y: number;
}

export interface MerchantGrowthSummary {
  totalCount: number;
  recentCount: number;
  prevCount: number;
  growthPercentage: number;
  isPositiveGrowth: boolean;
  points: MerchantGrowthPoint[];
  svgLinePath: string;
  svgAreaPath: string;
  maxVal: number;
  baselineY: number;
  padLeft: number;
  padTop: number;
  svgWidth: number;
  svgHeight: number;
  usableWidth: number;
  usableHeight: number;
  periodLabel: string;
  range: Range;
}

export const CHART_RANGES: Array<{ value: Range; label: string }> = [
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
  { value: '12m', label: '12 Bulan' },
];

export function calculateMerchantGrowth(
  rawPoints: TrafficPoint[],
  range: Range
): MerchantGrowthSummary {
  const points: MerchantGrowthPoint[] = [];
  const svgWidth = 850;
  const svgHeight = 280;
  const padLeft = 48;
  const padRight = 32;
  const padTop = 28;
  const padBottom = 40;
  const usableWidth = svgWidth - padLeft - padRight;
  const usableHeight = svgHeight - padTop - padBottom;
  const baselineY = padTop + usableHeight;

  let totalCount = 0;
  let runningCumulative = 0;

  for (let i = 0; i < rawPoints.length; i++) {
    const p = rawPoints[i];
    const count = p.views;
    runningCumulative += count;
    totalCount += count;

    points.push({
      key: p.key,
      label: p.label,
      fullLabel: p.label,
      count,
      cumulative: runningCumulative,
      x: 0,
      y: 0,
    });
  }

  const maxVal = Math.max(...points.map((p) => p.cumulative), 4);
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const pt = points[i];
    pt.x = Math.round(padLeft + (i / Math.max(1, n - 1)) * usableWidth);
    const ratio = maxVal > 0 ? pt.cumulative / maxVal : 0;
    pt.y = Math.round(baselineY - ratio * usableHeight);
  }

  let svgLinePath = '';
  let svgAreaPath = '';

  if (points.length > 0) {
    svgLinePath = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const dx = p1.x - p0.x;
      const cpx1 = Math.round(p0.x + dx / 2);
      const cpy1 = p0.y;
      const cpx2 = Math.round(p1.x - dx / 2);
      const cpy2 = p1.y;
      svgLinePath += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${p1.x},${p1.y}`;
    }

    const first = points[0];
    const last = points[points.length - 1];
    svgAreaPath = `${svgLinePath} L ${last.x},${baselineY} L ${first.x},${baselineY} Z`;
  }

  const activeIdx = Math.max(0, points.length - 1);
  const recentCount = points[activeIdx]?.count ?? 0;
  const prevCount = activeIdx > 0 ? (points[activeIdx - 1]?.count ?? 0) : 0;

  let growthPercentage = 0;
  if (prevCount > 0) {
    growthPercentage = Math.round(((recentCount - prevCount) / prevCount) * 100);
  } else if (recentCount > 0) {
    growthPercentage = 100;
  }

  const isPositiveGrowth = recentCount >= prevCount;
  const periodLabel = range === '7d' ? '7 Hari Terakhir' : range === '30d' ? '30 Hari Terakhir' : '12 Bulan Terakhir';

  return {
    totalCount,
    recentCount,
    prevCount,
    growthPercentage,
    isPositiveGrowth,
    points,
    svgLinePath,
    svgAreaPath,
    maxVal,
    baselineY,
    padLeft,
    padTop,
    svgWidth,
    svgHeight,
    usableWidth,
    usableHeight,
    periodLabel,
    range,
  };
}
