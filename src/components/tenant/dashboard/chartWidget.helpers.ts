import type ApexCharts from 'apexcharts';
import { colors, getChartThemeTokens } from '@/components/tokens/colors';
import { formatNumber } from '@/lib/currency';

export type Range = '7d' | '30d' | '12m';

export interface TrafficPoint {
  key: string;
  label: string;
  views: number;
  waClicks: number;
  conversion: number;
}

export const CHART_RANGES: Array<{ value: Range; label: string }> = [
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
  { value: '12m', label: '12 Bulan' },
];

export const CHART_COLORS = {
  views: colors.semantic.info.DEFAULT,
  clicks: colors.semantic.success.DEFAULT,
  conversion: colors.semantic.warning.DEFAULT,
};

export function buildTrafficChartOptions(range: Range, points: TrafficPoint[]): ApexCharts.ApexOptions {
  const { text, main, isDark } = getChartThemeTokens();
  const nf = (v: number) => formatNumber(Math.round(v));
  const tickAmount = range === '7d' ? 6 : 5;
  const showMarkers = range === '7d';

  return {
    chart: {
      type: 'line',
      height: 300,
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 500 },
    },
    series: [
      { name: 'Pengunjung', data: points.map((p) => p.views) },
      { name: 'Klik WhatsApp', data: points.map((p) => p.waClicks) },
      { name: 'Konversi (%)', data: points.map((p) => p.conversion) },
    ],
    colors: [CHART_COLORS.views, CHART_COLORS.clicks, CHART_COLORS.conversion],
    stroke: { curve: 'straight', width: 4, lineCap: 'round' },
    markers: { size: showMarkers ? 7 : 0, strokeWidth: 0, hover: { size: showMarkers ? 9 : 0 } },
    xaxis: {
      categories: points.map((p) => p.label),
      axisBorder: { show: true, color: main },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      tickPlacement: 'on',
      tickAmount,
      type: range === '30d' ? 'numeric' : 'category',
      labels: { rotate: 0, hideOverlappingLabels: true, style: { colors: text, fontSize: '11px', fontWeight: 600 } },
      crosshairs: { show: false },
    },
    yaxis: [
      {
        seriesName: 'Pengunjung',
        min: 0,
        forceNiceScale: true,
        labels: { style: { colors: text, fontSize: '11px' }, formatter: (v: number) => nf(v) },
      },
      { seriesName: 'Pengunjung', min: 0, show: false },
      {
        seriesName: 'Konversi (%)',
        opposite: true,
        min: 0,
        forceNiceScale: true,
        labels: { style: { colors: text, fontSize: '11px' }, formatter: (v: number) => `${v.toFixed(0)}%` },
      },
    ],
    grid: {
      show: true,
      borderColor: main,
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { left: 8, right: 8 },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontWeight: 600,
      labels: { colors: main },
      markers: { size: 6, strokeWidth: 0 },
      itemMargin: { horizontal: 12 },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: isDark ? 'dark' : 'light',
      y: { formatter: (v: number, opts?: { seriesIndex: number }) => (opts?.seriesIndex === 2 ? `${v.toFixed(1)}%` : nf(v)) },
    },
    dataLabels: { enabled: false },
    noData: { text: 'Memuat data...' },
  };
}

export function buildTrafficPieOptions(periodViews: number, periodClicks: number): ApexCharts.ApexOptions {
  const { main, isDark } = getChartThemeTokens();
  return {
    chart: {
      type: 'pie',
      height: 300,
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: { show: false },
      animations: { enabled: true, speed: 500 },
    },
    series: [periodViews, periodClicks],
    labels: ['Pengunjung', 'Klik WhatsApp'],
    colors: [CHART_COLORS.views, CHART_COLORS.clicks],
    stroke: { show: false },
    plotOptions: { pie: { dataLabels: { offset: -5 } } },
    dataLabels: {
      enabled: true,
      formatter: (val: string, opts?: { seriesIndex: number }) => {
        const value = opts?.seriesIndex === 0 ? periodViews : periodClicks;
        return `${parseFloat(val).toFixed(1)}%\n${Math.round(value).toLocaleString('id-ID')}`;
      },
      style: { fontSize: '12px', fontWeight: 600, colors: ['#ffffff'] },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      fontWeight: 600,
      labels: { colors: main },
      markers: { size: 6, strokeWidth: 0 },
      itemMargin: { horizontal: 8, vertical: 4 },
    },
    tooltip: {
      enabled: true,
      theme: isDark ? 'dark' : 'light',
      y: { formatter: (v: number) => Math.round(v).toLocaleString('id-ID') },
    },
    noData: { text: 'Memuat data...' },
  };
}

