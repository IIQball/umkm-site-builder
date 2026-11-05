import type ApexCharts from 'apexcharts';
import { formatIDR, formatNumber } from '@/lib/utils/format';
import { Image, Package, Palette } from 'lucide-svelte';
import type { AiFeatureDistributionItem } from '@/types/admin/ai-monitoring.types';
import type { AiFeatureType } from '@/types/ai';

export const FEATURE_COLORS: Record<AiFeatureType, string> = {
  logo: '#6366f1',
  packaging_mockup: '#10b981',
  product_poster: '#f59e0b',
};

export function getFeatureIcon(type: string) {
  if (type === 'logo') return Image;
  if (type === 'packaging_mockup') return Package;
  return Palette;
}

export function getThemeColors() {
  if (typeof window === 'undefined') return { text: '#64748b', main: '#0f172a' };
  const style = getComputedStyle(document.documentElement);
  const text = style.getPropertyValue('--color-text-muted').trim() || '#64748b';
  const main = style.getPropertyValue('--color-text-main').trim() || '#0f172a';
  return { text, main };
}

export function buildDonutChartOptions(
  distribution: AiFeatureDistributionItem[],
  grandTotalRequests: number,
  grandTotalCostIdr: number,
  metricMode: 'requests' | 'cost'
): ApexCharts.ApexOptions {
  const { text, main } = getThemeColors();
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'dark';

  const series = distribution.map((item) =>
    metricMode === 'requests' ? item.totalRequests : item.totalCostIdr
  );
  const labels = distribution.map((item) => item.label);
  const colors = distribution.map((item) => FEATURE_COLORS[item.featureType] || '#94a3b8');

  return {
    chart: {
      type: 'donut',
      height: 270,
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: { show: false },
      animations: { enabled: true, speed: 400 },
    },
    series,
    labels,
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: [isDark ? '#1e293b' : '#ffffff'],
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '13px',
              fontWeight: 600,
              color: text,
              offsetY: -4,
            },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 700,
              color: main,
              offsetY: 6,
              formatter: (val: string) => {
                const num = Number(val) || 0;
                return metricMode === 'requests' ? `${formatNumber(num)} req` : formatIDR(num);
              },
            },
            total: {
              show: true,
              label: metricMode === 'requests' ? 'Total Request' : 'Total Biaya',
              fontSize: '12px',
              fontWeight: 600,
              color: text,
              formatter: () => {
                return metricMode === 'requests'
                  ? `${formatNumber(grandTotalRequests)} req`
                  : formatIDR(grandTotalCostIdr);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number | string) => {
        const num = typeof val === 'number' ? val : parseFloat(val);
        return num > 6 ? `${num.toFixed(1)}%` : '';
      },
      dropShadow: { enabled: false },
      style: { fontSize: '11px', fontWeight: 600, colors: ['#ffffff'] },
    },
    legend: { show: false },
    noData: {
      text: metricMode === 'requests' ? 'Belum ada data permintaan' : 'Belum ada data biaya',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: text,
        fontSize: '13px',
        fontFamily: 'inherit',
      },
    },
    tooltip: {
      enabled: true,
      theme: isDark ? 'dark' : 'light',
      custom: ({ seriesIndex }: { seriesIndex: number }) => {
        const item = distribution[seriesIndex];
        if (!item) return '';
        const color = colors[seriesIndex];
        return `
          <div style="padding: 10px 14px; font-size: 12px; line-height: 1.5; border-radius: 12px; background: ${isDark ? '#0f172a' : '#ffffff'}; border: 1px solid ${isDark ? '#334155' : '#e2e8f0'}; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 6px; color: ${isDark ? '#f8fafc' : '#0f172a'}">
              <span style="width: 10px; height: 10px; border-radius: 9999px; background-color: ${color}; display: inline-block;"></span>
              <span>${item.label}</span>
            </div>
            <div style="color: ${isDark ? '#94a3b8' : '#64748b'}; display: flex; justify-content: space-between; gap: 16px;">
              <span>Total Permintaan:</span>
              <strong style="color: ${isDark ? '#f8fafc' : '#0f172a'}">${formatNumber(item.totalRequests)} (${item.requestPercentage.toFixed(1)}%)</strong>
            </div>
            <div style="color: ${isDark ? '#94a3b8' : '#64748b'}; display: flex; justify-content: space-between; gap: 16px;">
              <span>Total Biaya:</span>
              <strong style="color: #10b981">${formatIDR(item.totalCostIdr)} (${item.costPercentage.toFixed(1)}%)</strong>
            </div>
          </div>
        `;
      },
    },
  };
}
