import type {
  MerchantRegistrationRecord,
  MerchantGrowthPoint,
  MerchantGrowthSummary,
  GrowthFilter,
} from './merchantGrowth.types';

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

export function calculateMerchantGrowth(
  records: MerchantRegistrationRecord[],
  filterOrMonthsOrRef: GrowthFilter | number | Date = 12,
  refDateArg: Date = new Date()
): MerchantGrowthSummary {
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

  const totalMerchants = records.length;
  const parsedDates = records.map((r) =>
    r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt)
  );

  const points: MerchantGrowthPoint[] = [];
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
        newCount: newInMonth,
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
        newCount: newInDay,
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

  const maxVal = Math.max(...points.map((p) => p.cumulative), 4);
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

  const thisMonthNew = points[activeIdx]?.newCount ?? 0;
  const lastMonthNew = activeIdx > 0 ? (points[activeIdx - 1]?.newCount ?? 0) : 0;

  let growthPercentage = 0;
  if (lastMonthNew > 0) {
    growthPercentage = Math.round(((thisMonthNew - lastMonthNew) / lastMonthNew) * 100);
  } else if (thisMonthNew > 0) {
    growthPercentage = 100;
  }

  const isPositiveGrowth = thisMonthNew >= lastMonthNew;

  return {
    totalMerchants,
    thisMonthNew,
    lastMonthNew,
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
