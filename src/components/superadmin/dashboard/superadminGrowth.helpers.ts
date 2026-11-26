import { INDONESIAN_MONTHS } from '@/lib/utils/format';
import { buildPathAndSummary } from './superadminGrowthPath.helpers';

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

function calculateGrowthSeries<T>(
  items: T[],
  getDate: (item: T) => string | Date,
  getValue: (item: T) => number,
  filter: GrowthFilter,
  refDateArg: Date,
  includeDecimals: boolean
): GrowthSummary {
  const targetYear = filter.year;
  const targetMonth = filter.month ?? 'all';

  const parsedRecords = items.map((item) => ({
    value: getValue(item),
    date: getDate(item) instanceof Date ? (getDate(item) as Date) : new Date(getDate(item)),
  }));

  const total = parsedRecords.reduce((sum, record) => sum + record.value, 0);
  const points: GrowthPoint[] = [];
  const filterMode: 'month' | 'day' = targetMonth === 'all' ? 'month' : 'day';

  let periodLabel = `Tahun ${targetYear}`;
  let activeIdx = 0;

  if (targetMonth === 'all') {
    const startOfYear = new Date(targetYear, 0, 1, 0, 0, 0, 0);
    let runningCumulative = parsedRecords
      .filter((record) => record.date < startOfYear)
      .reduce((sum, record) => sum + record.value, 0);

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(targetYear, month, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(targetYear, month + 1, 0, 23, 59, 59, 999);

      const monthValue = parsedRecords
        .filter((record) => record.date >= startOfMonth && record.date <= endOfMonth)
        .reduce((sum, record) => sum + record.value, 0);

      runningCumulative += monthValue;

      points.push({
        monthKey: `${targetYear}-${String(month + 1).padStart(2, '0')}`,
        label: INDONESIAN_MONTHS[month],
        fullLabel: `${INDONESIAN_MONTHS[month]} ${targetYear}`,
        countOrAmount: monthValue,
        cumulative: runningCumulative,
        x: 0,
        y: 0,
      });
    }

    activeIdx = targetYear === refDateArg.getFullYear() ? refDateArg.getMonth() : 11;
  } else {
    const monthIndex = targetMonth - 1;
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const startOfMonth = new Date(targetYear, monthIndex, 1, 0, 0, 0, 0);
    let runningCumulative = parsedRecords
      .filter((record) => record.date < startOfMonth)
      .reduce((sum, record) => sum + record.value, 0);

    periodLabel = `${INDONESIAN_MONTHS[monthIndex]} ${targetYear}`;

    for (let day = 1; day <= daysInMonth; day++) {
      const startOfDay = new Date(targetYear, monthIndex, day, 0, 0, 0, 0);
      const endOfDay = new Date(targetYear, monthIndex, day, 23, 59, 59, 999);

      const dayValue = parsedRecords
        .filter((record) => record.date >= startOfDay && record.date <= endOfDay)
        .reduce((sum, record) => sum + record.value, 0);

      runningCumulative += dayValue;

      points.push({
        monthKey: `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        label: String(day),
        fullLabel: `${day} ${INDONESIAN_MONTHS[monthIndex]} ${targetYear}`,
        countOrAmount: dayValue,
        cumulative: runningCumulative,
        x: 0,
        y: 0,
      });
    }

    const isCurrentMonth =
      targetYear === refDateArg.getFullYear() && monthIndex === refDateArg.getMonth();
    activeIdx = isCurrentMonth ? Math.min(refDateArg.getDate() - 1, daysInMonth - 1) : daysInMonth - 1;
  }

  return buildPathAndSummary(total, points, activeIdx, periodLabel, filterMode, includeDecimals);
}

export function calculateCountGrowth(
  items: Array<{ createdAt: string | Date }>,
  filter: GrowthFilter,
  refDateArg: Date = new Date()
): GrowthSummary {
  return calculateGrowthSeries(
    items,
    (item) => item.createdAt,
    () => 1,
    filter,
    refDateArg,
    false
  );
}

export function calculateAmountGrowth(
  items: Array<{ amount: number; createdAt: string | Date }>,
  filter: GrowthFilter,
  refDateArg: Date = new Date()
): GrowthSummary {
  return calculateGrowthSeries(
    items,
    (item) => item.createdAt,
    (item) => Number(item.amount) || 0,
    filter,
    refDateArg,
    true
  );
}
