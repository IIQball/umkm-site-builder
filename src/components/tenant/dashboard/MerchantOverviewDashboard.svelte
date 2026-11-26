<script lang="ts">
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import MerchantKeyMetrics from './MerchantKeyMetrics.svelte';
  import MerchantTrafficLineChart from './MerchantTrafficLineChart.svelte';
  import MerchantTrafficPieChart from './MerchantTrafficPieChart.svelte';
  import {
    calculateTrafficGrowth,
    computeTrafficAvailableYears,
    type TrafficPoint,
  } from './chartWidget.helpers';

  export let allHistory: TrafficPoint[] = [];
  export let userCreatedYear: number = new Date().getFullYear();
  export let totalViews: number = 0;
  void totalViews;
  export let totalClicks: number = 0;
  void totalClicks;
  export let isOnboarded: boolean = true;
  void isOnboarded;

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | 'all' = 'all';

  $: availableYears = computeTrafficAvailableYears(allHistory, userCreatedYear);

  $: trafficData = calculateTrafficGrowth(allHistory, {
    year: selectedYear,
    month: selectedMonth,
  });

  $: displayViews =
    trafficData.periodViews === 0 &&
    selectedYear === currentYear &&
    selectedMonth === 'all' &&
    allHistory.length === 0
      ? totalViews
      : trafficData.periodViews;

  $: displayClicks =
    trafficData.periodClicks === 0 &&
    selectedYear === currentYear &&
    selectedMonth === 'all' &&
    allHistory.length === 0
      ? totalClicks
      : trafficData.periodClicks;

  $: displayConversion =
    displayViews > 0
      ? ((displayClicks / displayViews) * 100).toFixed(1)
      : trafficData.periodConversion;

  $: displayEngagementScore = Math.min(
    Math.round((parseFloat(displayConversion) / 100) * 100),
    100
  );
</script>

<div class="space-y-8">
  <!-- 1. Filter Periode (Paling Atas) -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Trafik Toko"
    description="Sesuaikan metrik kunjungan, konversi, dan grafik berdasarkan kurun waktu."
    activeBadgePrefix="Trafik"
  />

  <!-- 2. KPI Metrics (StatCard) yang terpengaruh secara reaktif oleh filter periode -->
  <MerchantKeyMetrics
    views={displayViews}
    waClicks={displayClicks}
    conversionRate={displayConversion}
    engagementScore={displayEngagementScore}
    periodLabel={trafficData.periodLabel}
  />

  <!-- 3. Grafik Trafik (Line Chart & Solid Pie Chart Terpisah) -->
  <div class="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
    <div class="lg:col-span-6 min-w-0">
      <MerchantTrafficLineChart {trafficData} />
    </div>
    <div class="lg:col-span-4 min-w-0">
      <MerchantTrafficPieChart {trafficData} />
    </div>
  </div>
</div>

