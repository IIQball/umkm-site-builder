import type {
  FeeRevenueRecord,
  FeeRevenuePoint,
  FeeRevenueSummary,
  GrowthFilter,
} from './feeRevenue.types';
import { INDONESIAN_MONTHS } from './merchantGrowth.helpers';

export function calculateFeeRevenueGrowth(
  records: FeeRevenueRecord[],
  filterOrMonthsOrRef: GrowthFilter | number | Date = 12,
  refDateArg: Date = new Date()
): FeeRevenueSummary {
  let targetYear = refDateArg.getFullYear();
  let targetMonth: number | 'all' = 'all';

  if (filterOrMonthsOrRef instanceof Date) {
    targetYear = filterOrMonthsOrRef.getFullYear();
    targetMonth = 'all';
  } else if (typeof filterOrMonthsOrRef === 'number') {
    targetYear = refDateArg.getFullYear();
    targetMonth = 'all';
  } else if (filterOrMonthsOrRef && typeof filterOrMonthsOrRef === 'object') {
    targetYear = filterOrMonthsOrRef.year;
    targetMonth = filterOrMonthsOrRef.month ?? 'all';
  }

  const parsedRecords = records.map((r) => ({
    amount: Number(r.amount) || 0,
    date: r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt),
  }));

  const totalRevenue = parsedRecords.reduce((sum, r) => sum + r.amount, 0);
  const points: FeeRevenuePoint[] = [];
  const filterMode: 'month' | 'day' = targetMonth === 'all' ? 'month' : 'day';

  let periodLabel = `Tahun ${targetYear}`;
  let activeIdx = 0;

  if (targetMonth === 'all') {
    const startOfYear = new Date(targetYear, 0, 1, 0, 0, 0, 0);
    let runningCumulative = parsedRecords
      .filter((r) => r.date < startOfYear)
      .reduce((sum, r) => sum + r.amount, 0);

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(targetYear, month, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(targetYear, month + 1, 0, 23, 59, 59, 999);

      const monthAmount = parsedRecords
        .filter((r) => r.date >= startOfMonth && r.date <= endOfMonth)
        .reduce((sum, r) => sum + r.amount, 0);

      runningCumulative += monthAmount;

      const label = INDONESIAN_MONTHS[month];
      const fullLabel = `${INDONESIAN_MONTHS[month]} ${targetYear}`;
      const monthKey = `${targetYear}-${String(month + 1).padStart(2, '0')}`;

      points.push({
        monthKey,
        label,
        fullLabel,
        amount: monthAmount,
        cumulative: runningCumulative,
        x: 0,
        y: 0,
      });
    }

    const currentYear = new Date().getFullYear();
    activeIdx = targetYear === currentYear ? new Date().getMonth() : 11;
  } else {
    const monthIndex = targetMonth - 1;
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const startOfMonth = new Date(targetYear, monthIndex, 1, 0, 0, 0, 0);
    let runningCumulative = parsedRecords
      .filter((r) => r.date < startOfMonth)
      .reduce((sum, r) => sum + r.amount, 0);

    periodLabel = `${INDONESIAN_MONTHS[monthIndex]} ${targetYear}`;

    for (let day = 1; day <= daysInMonth; day++) {
      const startOfDay = new Date(targetYear, monthIndex, day, 0, 0, 0, 0);
      const endOfDay = new Date(targetYear, monthIndex, day, 23, 59, 59, 999);

      const dayAmount = parsedRecords
        .filter((r) => r.date >= startOfDay && r.date <= endOfDay)
        .reduce((sum, r) => sum + r.amount, 0);

      runningCumulative += dayAmount;

      const label = String(day);
      const fullLabel = `${day} ${INDONESIAN_MONTHS[monthIndex]} ${targetYear}`;
      const monthKey = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      points.push({
        monthKey,
        label,
        fullLabel,
        amount: dayAmount,
        cumulative: runningCumulative,
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

  const svgWidth = 850;
  const svgHeight = 280;
  const padLeft = 40;
  const padRight = 32;
  const padTop = 28;
  const padBottom = 40;
  const usableWidth = svgWidth - padLeft - padRight;
  const usableHeight = svgHeight - padTop - padBottom;
  const baselineY = padTop + usableHeight;

  const maxVal = Math.max(...points.map((p) => p.cumulative), 100000);
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
      const cpy1 = p0.y;
      const cpx2 = Math.round(p1.x - dx / 2);
      const cpy2 = p1.y;
      svgLinePath += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${p1.x},${p1.y}`;
    }

    const first = points[0];
    const last = points[points.length - 1];
    svgAreaPath = `${svgLinePath} L ${last.x},${baselineY} L ${first.x},${baselineY} Z`;
  }

  const thisMonthRevenue = points[activeIdx]?.amount ?? 0;
  const lastMonthRevenue = activeIdx > 0 ? (points[activeIdx - 1]?.amount ?? 0) : 0;

  let growthPercentage = 0;
  if (lastMonthRevenue > 0) {
    growthPercentage = Math.round(
      ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    );
  } else if (thisMonthRevenue > 0) {
    growthPercentage = 100;
  }

  const isPositiveGrowth = thisMonthRevenue >= lastMonthRevenue;

  return {
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
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
  };
}
