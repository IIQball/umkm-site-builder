import { INDONESIAN_MONTHS } from '@/lib/utils/format';

export interface GrowthFilter {
  year: number;
  month?: number | 'all';
}

export interface GrowthPoint {
  monthKey: string;
  label: string;
  fullLabel: string;
  countOrAmount: number;
  cumulative: number;
  x: number;
  y: number;
}

export interface GrowthSummary {
  total: number;
  thisPeriod: number;
  lastPeriod: number;
  growthPercentage: number;
  isPositiveGrowth: boolean;
  points: GrowthPoint[];
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
}

export function calculateCountGrowth(
  items: Array<{ createdAt: string | Date }>,
  filter: GrowthFilter,
  refDateArg: Date = new Date()
): GrowthSummary {
  const targetYear = filter.year;
  const targetMonth = filter.month ?? 'all';

  const parsedDates = items.map((i) =>
    i.createdAt instanceof Date ? i.createdAt : new Date(i.createdAt)
  );

  const total = items.length;
  const points: GrowthPoint[] = [];
  const filterMode: 'month' | 'day' = targetMonth === 'all' ? 'month' : 'day';

  let periodLabel = `Tahun ${targetYear}`;
  let activeIdx = 0;

  if (targetMonth === 'all') {
    const startOfYear = new Date(targetYear, 0, 1, 0, 0, 0, 0);
    let runningCumulative = parsedDates.filter((d) => d < startOfYear).length;

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(targetYear, month, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(targetYear, month + 1, 0, 23, 59, 59, 999);

      const newInMonth = parsedDates.filter(
        (d) => d >= startOfMonth && d <= endOfMonth
      ).length;

      runningCumulative += newInMonth;

      const label = INDONESIAN_MONTHS[month];
      const fullLabel = `${INDONESIAN_MONTHS[month]} ${targetYear}`;
      const monthKey = `${targetYear}-${String(month + 1).padStart(2, '0')}`;

      points.push({
        monthKey,
        label,
        fullLabel,
        countOrAmount: newInMonth,
        cumulative: runningCumulative,
        x: 0,
        y: 0,
      });
    }

    const currentYear = refDateArg.getFullYear();
    activeIdx = targetYear === currentYear ? refDateArg.getMonth() : 11;
  } else {
    const monthIndex = targetMonth - 1;
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const startOfMonth = new Date(targetYear, monthIndex, 1, 0, 0, 0, 0);
    let runningCumulative = parsedDates.filter((d) => d < startOfMonth).length;

    periodLabel = `${INDONESIAN_MONTHS[monthIndex]} ${targetYear}`;

    for (let day = 1; day <= daysInMonth; day++) {
      const startOfDay = new Date(targetYear, monthIndex, day, 0, 0, 0, 0);
      const endOfDay = new Date(targetYear, monthIndex, day, 23, 59, 59, 999);

      const newInDay = parsedDates.filter(
        (d) => d >= startOfDay && d <= endOfDay
      ).length;

      runningCumulative += newInDay;

      const label = String(day);
      const fullLabel = `${day} ${INDONESIAN_MONTHS[monthIndex]} ${targetYear}`;
      const monthKey = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      points.push({
        monthKey,
        label,
        fullLabel,
        countOrAmount: newInDay,
        cumulative: runningCumulative,
        x: 0,
        y: 0,
      });
    }

    const currentYear = refDateArg.getFullYear();
    const currentMonthIndex = refDateArg.getMonth();
    if (targetYear === currentYear && monthIndex === currentMonthIndex) {
      activeIdx = Math.min(refDateArg.getDate() - 1, daysInMonth - 1);
    } else {
      activeIdx = daysInMonth - 1;
    }
  }

  return buildPathAndSummary(total, points, activeIdx, periodLabel, filterMode);
}

export function calculateAmountGrowth(
  items: Array<{ amount: number; createdAt: string | Date }>,
  filter: GrowthFilter,
  refDateArg: Date = new Date()
): GrowthSummary {
  const targetYear = filter.year;
  const targetMonth = filter.month ?? 'all';

  const parsedRecords = items.map((i) => ({
    amount: Number(i.amount) || 0,
    date: i.createdAt instanceof Date ? i.createdAt : new Date(i.createdAt),
  }));

  const total = parsedRecords.reduce((sum, r) => sum + r.amount, 0);
  const points: GrowthPoint[] = [];
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
        countOrAmount: monthAmount,
        cumulative: runningCumulative,
        x: 0,
        y: 0,
      });
    }

    const currentYear = refDateArg.getFullYear();
    activeIdx = targetYear === currentYear ? refDateArg.getMonth() : 11;
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
        countOrAmount: dayAmount,
        cumulative: runningCumulative,
        x: 0,
        y: 0,
      });
    }

    const currentYear = refDateArg.getFullYear();
    const currentMonthIndex = refDateArg.getMonth();
    if (targetYear === currentYear && monthIndex === currentMonthIndex) {
      activeIdx = Math.min(refDateArg.getDate() - 1, daysInMonth - 1);
    } else {
      activeIdx = daysInMonth - 1;
    }
  }

  return buildPathAndSummary(total, points, activeIdx, periodLabel, filterMode, true);
}

function buildPathAndSummary(
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
      const cpy1 = p0.y;
      const cpx2 = Math.round(p1.x - dx / 2);
      const cpy2 = p1.y;
      svgLinePath += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${p1.x},${p1.y}`;
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

  const isPositiveGrowth = thisPeriod >= lastPeriod;

  return {
    total,
    thisPeriod,
    lastPeriod,
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
