import type ApexCharts from 'apexcharts';
import { getChartThemeTokens } from '@/components/tokens/colors';

export interface DailyPoint {
  date: string;
  label: string;
  dayName: string;
  fullLabel: string;
  creditsUsed: number;
  generationsCount: number;
}

export interface UsageSummary {
  totalCreditsUsed7d: number;
  totalGenerations7d: number;
  dailyAverage: number;
  currentBalance: number;
  totalPurchased: number;
  totalUsedLifetime: number;
  highestUsageDay: {
    date: string;
    label: string;
    creditsUsed: number;
  } | null;
}

export interface UsageResponseData {
  points: DailyPoint[];
  summary: UsageSummary;
}

export function buildTenantChartOptions(points: DailyPoint[]): ApexCharts.ApexOptions {
  const { text: textMuted, main: textMain, primary, border, isDark } = getChartThemeTokens();

  return {
    chart: {
      type: 'bar',
      height: 280,
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: { show: false },
      animations: { enabled: true, speed: 300 },
    },
    series: [
      {
        name: 'Kredit Digunakan',
        data: points.map((p) => p.creditsUsed),
      },
    ],
    colors: [primary],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '38%',
        distributed: false,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val > 0 ? `${val}` : ''),
      offsetY: -20,
      style: {
        fontSize: '11px',
        fontWeight: 700,
        colors: [textMain],
      },
    },
    xaxis: {
      categories: points.map((p) => `${p.dayName} ${p.label.split(' ')[0]}`),
      axisBorder: {
        show: true,
        color: border,
      },
      axisTicks: { show: false },
      labels: {
        style: { colors: textMuted, fontSize: '11px', fontWeight: 600 },
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        style: { colors: textMuted, fontSize: '11px' },
        formatter: (v: number) => `${Math.round(v)}`,
      },
    },
    grid: {
      borderColor: border,
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: { left: 8, right: 8, top: 12 },
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (val: number, opts?: { dataPointIndex: number }) => {
          const pt = points[opts?.dataPointIndex ?? 0];
          return `${val} kredit (${pt?.generationsCount ?? 0} visual)`;
        },
      },
    },
    noData: {
      text: 'Belum ada data pemakaian',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: textMuted,
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
  };
}

