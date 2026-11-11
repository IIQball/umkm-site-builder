<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type ApexCharts from 'apexcharts';
  import { apiFetch } from '@/lib/api/parse-response';
  import {
    CHART_RANGES,
    CHART_COLORS,
    buildTrafficChartOptions,
    buildTrafficPieOptions,
    type Range,
    type TrafficPoint,
  } from './chartWidget.helpers';

  export let totalViews = 0;
  export let totalClicks = 0;
  export let isOnboarded = true;
  void isOnboarded;
  export let initialPoints: TrafficPoint[] = [];
  export let initialFailed = false;

  let range: Range = '12m';
  let points: TrafficPoint[] = [];
  let loading = true;
  let errorMessage = '';

  let chartEl: HTMLDivElement;
  let pieChartEl: HTMLDivElement;
  let chart: ApexCharts | null = null;
  let pieChart: ApexCharts | null = null;
  let ApexCtor: typeof ApexCharts | null = null;
  let abortCtrl: AbortController | null = null;
  let themeObserver: MutationObserver | null = null;

  $: hasData = points.some((p) => p.views > 0 || p.waClicks > 0);
  $: periodViews = points.reduce((sum, p) => sum + p.views, 0);
  $: periodClicks = points.reduce((sum, p) => sum + p.waClicks, 0);
  $: periodConversion = periodViews > 0 ? ((periodClicks / periodViews) * 100).toFixed(1) : '0.0';

  $: if (chart && points.length > 0 && !loading) renderChart();
  $: if (pieChart && points.length > 0 && !loading) renderPieChart();

  async function renderChart() {
    if (!chartEl || !ApexCtor) return;
    const options = buildTrafficChartOptions(range, points);
    if (chart) await chart.updateOptions(options, true, true);
    else {
      chart = new ApexCtor(chartEl, options);
      await chart.render();
    }
  }

  async function renderPieChart() {
    if (!pieChartEl || !ApexCtor) return;
    const options = buildTrafficPieOptions(periodViews, periodClicks);
    if (pieChart) await pieChart.updateOptions(options, true, true);
    else {
      pieChart = new ApexCtor(pieChartEl, options);
      await pieChart.render();
    }
  }

  async function loadData(next: Range) {
    abortCtrl?.abort();
    abortCtrl = new AbortController();
    loading = true;
    errorMessage = '';

    try {
      const result = await apiFetch<{ points: TrafficPoint[] }>(
        `/api/tenant/analytics/chart?range=${next}`,
        { signal: abortCtrl.signal, credentials: 'same-origin', fallbackError: 'Gagal memuat grafik' }
      );
      if (!result.success || !result.data) throw new Error(result.message);
      points = result.data.points;
      await renderChart();
      loading = false;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      loading = false;
      errorMessage = (err as Error).message || 'Gagal memuat grafik';
      console.error('[CHART] loadData error:', err);
    }
  }

  function selectRange(next: Range) {
    if (next === range && points.length && !errorMessage) return;
    range = next;
    loadData(next);
  }

  onMount(async () => {
    const mod = await import('apexcharts');
    ApexCtor = mod.default;
    if (initialPoints.length > 0 && !initialFailed) {
      points = initialPoints;
      loading = false;
      await renderChart();
      await renderPieChart();
    } else {
      await loadData(range);
    }

    themeObserver = new MutationObserver(() => {
      if (chart && points.length) renderChart();
      if (pieChart && points.length) renderPieChart();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  });

  onDestroy(() => {
    abortCtrl?.abort();
    themeObserver?.disconnect();
    chart?.destroy();
    chart = null;
    pieChart?.destroy();
    pieChart = null;
  });
</script>

<div id="merchant-traffic-chart" class="rounded-3xl bg-card border border-light shadow-xs overflow-hidden">
  <div class="p-5 sm:p-6 border-b border-light flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="min-w-0">
      <h3 class="text-heading-md text-main font-bold font-heading">Tren Kunjungan &amp; Konversi</h3>
      <p class="text-body-sm text-secondary mt-0.5">
        Pengunjung, klik WhatsApp, dan tingkat konversi toko Anda dari waktu ke waktu
      </p>
    </div>

    <div class="inline-flex p-1 rounded-xl bg-nested border border-light self-start md:self-auto" role="tablist" aria-label="Rentang waktu">
      {#each CHART_RANGES as r}
        <button
          type="button"
          role="tab"
          aria-selected={range === r.value}
          class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all {range === r.value ? 'bg-card text-main shadow-xs' : 'text-muted hover:text-main'}"
          on:click={() => selectRange(r.value)}
        >
          {r.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border-light)] border-b border-light">
    <div class="px-5 sm:px-6 py-4">
      <div class="flex items-center gap-2 text-xs font-semibold text-muted">
        <span class="w-2.5 h-2.5 rounded-full" style="background:{CHART_COLORS.views}"></span>Pengunjung
      </div>
      <div class="mt-1 text-xl font-bold text-main font-mono">{periodViews.toLocaleString('id-ID')}</div>
    </div>
    <div class="px-5 sm:px-6 py-4">
      <div class="flex items-center gap-2 text-xs font-semibold text-muted">
        <span class="w-2.5 h-2.5 rounded-full" style="background:{CHART_COLORS.clicks}"></span>Klik WhatsApp
      </div>
      <div class="mt-1 text-xl font-bold text-main font-mono">{periodClicks.toLocaleString('id-ID')}</div>
    </div>
    <div class="px-5 sm:px-6 py-4">
      <div class="flex items-center gap-2 text-xs font-semibold text-muted">
        <span class="w-2.5 h-2.5 rounded-full" style="background:{CHART_COLORS.conversion}"></span>Konversi
      </div>
      <div class="mt-1 text-xl font-bold text-main font-mono">{periodConversion}%</div>
    </div>
  </div>

  <div class="relative p-4 md:p-6">
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-4">
      <div class="lg:col-span-6 min-w-0">
        <div bind:this={chartEl} class="min-h-[300px]" aria-label="Grafik garis tren kunjungan dan konversi"></div>
      </div>
      <div class="lg:col-span-4 min-w-0">
        <div bind:this={pieChartEl} class="min-h-[300px]" aria-label="Grafik pie distribusi pengunjung dan klik"></div>
      </div>
    </div>

    {#if loading}
      <div class="absolute inset-0 flex items-center justify-center bg-card/70 backdrop-blur-[1px]">
        <span class="loading loading-spinner loading-md text-primary"></span>
      </div>
    {:else if errorMessage}
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/90 text-center px-6">
        <p class="text-sm text-secondary">{errorMessage}</p>
        <button type="button" class="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white" on:click={() => loadData(range)}>
          Coba lagi
        </button>
      </div>
    {:else if !hasData}
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none px-4">
        <p class="px-4 py-2 rounded-xl bg-card/90 border border-light text-xs text-secondary text-center">
          {totalViews > 0 || totalClicks > 0
            ? 'Belum ada aktivitas pada periode ini. Grafik mulai terisi sejak pencatatan harian aktif.'
            : 'Belum ada data. Grafik akan terisi setelah toko Anda dikunjungi.'}
        </p>
      </div>
    {/if}
  </div>
</div>
