import { INDONESIAN_MONTHS } from '@/lib/utils/format';

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

export interface MerchantTrafficSummary {
  totalCount: number;
  thisMonthCount: number;
  lastMonthCount: number;
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
  filterMode: 'month' | 'day';
  periodViews: number;
  periodClicks: number;
  periodConversion: string;
  periodEngagementScore: number;
}

export function computeTrafficAvailableYears(
  allPoints: TrafficPoint[],
  fallbackYear?: number
): number[] {
  const currentYear = new Date().getFullYear();
  const years = new Set<number>([currentYear]);
  if (fallbackYear && !isNaN(fallbackYear)) {
    years.add(fallbackYear);
  }

  for (const pt of allPoints) {
    if (pt.key) {
      const year = parseInt(pt.key.split('-')[0], 10);
      if (!isNaN(year) && year > 2000 && year < 2100) {
        years.add(year);
      }
    }
  }

  return Array.from(years).sort((a, b) => b - a);
}

export function pieSlicePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

export function calculateTrafficGrowth(
  allPoints: TrafficPoint[],
  filter: { year: number; month: number | 'all' }
): MerchantTrafficSummary {
  const targetYear = filter.year || new Date().getFullYear();
  const targetMonth = filter.month ?? 'all';

  const totalCount = allPoints.reduce((sum, p) => sum + (p.views || 0), 0);
  const points: MerchantGrowthPoint[] = [];
  const filterMode: 'month' | 'day' = targetMonth === 'all' ? 'month' : 'day';

  let periodLabel = `Tahun ${targetYear}`;
  let activeIdx = 0;

  if (targetMonth === 'all') {
    for (let month = 0; month < 12; month++) {
      const monthPrefix = `${targetYear}-${String(month + 1).padStart(2, '0')}`;
      const countInMonth = allPoints
        .filter((p) => p.key.startsWith(monthPrefix))
        .reduce((sum, p) => sum + (p.views || 0), 0);

      const label = INDONESIAN_MONTHS[month];
      const fullLabel = `${INDONESIAN_MONTHS[month]} ${targetYear}`;

      points.push({
        key: monthPrefix,
        label,
        fullLabel,
        count: countInMonth,
        cumulative: countInMonth, // Non-kumulatif: data periode itu sendiri
        x: 0,
        y: 0,
      });
    }

    const currentYear = new Date().getFullYear();
    activeIdx = targetYear === currentYear ? new Date().getMonth() : 11;
  } else {
    const monthIndex = targetMonth - 1;
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const monthPrefix = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;

    periodLabel = `${INDONESIAN_MONTHS[monthIndex]} ${targetYear}`;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      const countInDay = allPoints
        .filter((p) => p.key === dayKey)
        .reduce((sum, p) => sum + (p.views || 0), 0);

      const label = String(day);
      const fullLabel = `${day} ${INDONESIAN_MONTHS[monthIndex]} ${targetYear}`;

      points.push({
        key: dayKey,
        label,
        fullLabel,
        count: countInDay,
        cumulative: countInDay, // Non-kumulatif: data tanggal itu sendiri
        x: 0,
        y: 0,
      });
    }

    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    if (targetYear === currentYear && monthIndex === currentMonthIndex) {
      activeIdx = Math.min(new Date().getDate() - 1, daysInMonth - 1);
    } else {
      activeIdx = daysInMonth - 1;
    }
  }

  // Hitung metrik periode untuk pie chart & rasio
  const periodFiltered = allPoints.filter((p) => {
    if (targetMonth === 'all') {
      return p.key.startsWith(`${targetYear}-`);
    }
    return p.key.startsWith(`${targetYear}-${String(targetMonth).padStart(2, '0')}-`);
  });

  const periodViews = periodFiltered.reduce((sum, p) => sum + (p.views || 0), 0);
  const periodClicks = periodFiltered.reduce((sum, p) => sum + (p.waClicks || 0), 0);
  const periodConversion =
    periodViews > 0 ? ((periodClicks / periodViews) * 100).toFixed(1) : '0.0';
  const periodEngagementScore = Math.min(
    Math.round((parseFloat(periodConversion) / 100) * 100),
    100
  );

  // Kalkulasi koordinat SVG Line & Area (Non-kumulatif)
  const svgWidth = 850;
  const svgHeight = 280;
  const padLeft = 48;
  const padRight = 32;
  const padTop = 28;
  const padBottom = 40;
  const usableWidth = svgWidth - padLeft - padRight;
  const usableHeight = svgHeight - padTop - padBottom;
  const baselineY = padTop + usableHeight;

  // Nilai maksimum berdasarkan count masing-masing titik (bukan kumulatif)
  const maxVal = Math.max(...points.map((p) => p.count), 4);
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const p = points[i];
    p.x = Math.round(padLeft + (i / Math.max(1, n - 1)) * usableWidth);
    const ratio = maxVal > 0 ? p.count / maxVal : 0;
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
      const cpy1 = p0.y;
      const cpx2 = Math.round(p1.x - dx / 2);
      const cpy2 = p1.y;
      svgLinePath += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${p1.x},${p1.y}`;
    }

    const first = points[0];
    const last = points[points.length - 1];
    svgAreaPath = `${svgLinePath} L ${last.x},${baselineY} L ${first.x},${baselineY} Z`;
  }

  const thisMonthCount = points[activeIdx]?.count ?? 0;
  const lastMonthCount = activeIdx > 0 ? (points[activeIdx - 1]?.count ?? 0) : 0;

  let growthPercentage = 0;
  if (lastMonthCount > 0) {
    growthPercentage = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
  } else if (thisMonthCount > 0) {
    growthPercentage = 100;
  }

  const isPositiveGrowth = thisMonthCount >= lastMonthCount;

  return {
    totalCount,
    thisMonthCount,
    lastMonthCount,
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
    filterMode,
    periodViews,
    periodClicks,
    periodConversion,
    periodEngagementScore,
  };
}
