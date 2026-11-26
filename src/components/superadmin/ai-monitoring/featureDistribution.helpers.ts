import type ApexCharts from 'apexcharts';
import { colors as themeColors, getChartThemeTokens } from '@/components/tokens/colors';
import { formatIDR, formatNumber } from '@/lib/utils/format';
import { Image, Package, Palette } from 'lucide-svelte';
import type { AiFeatureDistributionItem } from '@/types/admin/ai-monitoring.types';
import type { AiFeatureType } from '@/types/ai';

export const FEATURE_COLORS: Record<AiFeatureType, string> = {
  logo: themeColors.semantic.accent.DEFAULT,
  packaging_mockup: themeColors.semantic.success.DEFAULT,
  product_poster: themeColors.semantic.warning.dark,
};

export function getFeatureIcon(type: string) {
  if (type === 'logo') return Image;
  if (type === 'packaging_mockup') return Package;
  return Palette;
}

export function buildDonutChartOptions(
  distribution: AiFeatureDistributionItem[],
  grandTotalRequests: number,
  grandTotalCostIdr: number,
  metricMode: 'requests' | 'cost'
): ApexCharts.ApexOptions {
  const { text, main, card, border, success, isDark } = getChartThemeTokens();

  const series = distribution.map((item) =>
    metricMode === 'requests' ? item.totalRequests : item.totalCostIdr
  );
  const labels = distribution.map((item) => item.label);
  const colors = distribution.map((item) => FEATURE_COLORS[item.featureType] || text);

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
      colors: [card],
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
          <div style="padding: 10px 14px; font-size: 12px; line-height: 1.5; border-radius: 12px; background: ${card}; border: 1px solid ${border}; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 6px; color: ${main}">
              <span style="width: 10px; height: 10px; border-radius: 9999px; background-color: ${color}; display: inline-block;"></span>
              <span>${item.label}</span>
            </div>
            <div style="color: ${text}; display: flex; justify-content: space-between; gap: 16px;">
              <span>Total Permintaan:</span>
              <strong style="color: ${main}">${formatNumber(item.totalRequests)} (${item.requestPercentage.toFixed(1)}%)</strong>
            </div>
            <div style="color: ${text}; display: flex; justify-content: space-between; gap: 16px;">
              <span>Total Biaya:</span>
              <strong style="color: ${success}">${formatIDR(item.totalCostIdr)} (${item.costPercentage.toFixed(1)}%)</strong>
            </div>
          </div>
        `;
      },
    },
  };
}
