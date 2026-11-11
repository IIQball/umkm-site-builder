import type { GrowthPoint, GrowthSummary } from './superadminGrowth.helpers';

export function buildPathAndSummary(
  total: number,
  points: GrowthPoint[],
  activeIdx: number,
  periodLabel: string,
  filterMode: 'month' | 'day',
  isCurrency = false
): GrowthSummary {
  const svgWidth = 850;
  const svgHeight = 280;
  const padLeft = isCurrency ? 76 : 40;
  const padRight = 32;
  const padTop = 28;
  const padBottom = 40;
  const usableWidth = svgWidth - padLeft - padRight;
  const usableHeight = svgHeight - padTop - padBottom;
  const baselineY = padTop + usableHeight;

  const actualMax = Math.max(...points.map((p) => p.cumulative), 0);
  const maxVal = actualMax;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const p = points[i];
    p.x = Math.round(padLeft + (i / Math.max(1, n - 1)) * usableWidth);
    const ratio = maxVal > 0 ? p.cumulative / maxVal : 0;
    p.y = Math.round(baselineY - ratio * usableHeight);
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
      const cpx2 = Math.round(p1.x - dx / 2);
      svgLinePath += ` C ${cpx1},${p0.y} ${cpx2},${p1.y} ${p1.x},${p1.y}`;
    }

    const first = points[0];
    const last = points[points.length - 1];
    svgAreaPath = `${svgLinePath} L ${last.x},${baselineY} L ${first.x},${baselineY} Z`;
  }

  const thisPeriod = points[activeIdx]?.countOrAmount ?? 0;
  const lastPeriod = activeIdx > 0 ? (points[activeIdx - 1]?.countOrAmount ?? 0) : 0;

  let growthPercentage = 0;
  if (lastPeriod > 0) {
    growthPercentage = Math.round(((thisPeriod - lastPeriod) / lastPeriod) * 100);
  } else if (thisPeriod > 0) {
    growthPercentage = 100;
  }

  return {
    total,
    thisPeriod,
    lastPeriod,
    growthPercentage,
    isPositiveGrowth: thisPeriod >= lastPeriod,
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
    filterMode,
  };
}

