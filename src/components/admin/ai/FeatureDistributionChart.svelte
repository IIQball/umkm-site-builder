<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type ApexCharts from 'apexcharts';
  import { formatIDR, formatNumber } from '@/lib/utils/format';
  import { Sparkles, AlertCircle } from 'lucide-svelte';
  import type { AiFeatureDistributionData } from '@/types/admin/ai-monitoring.types';
  import {
    FEATURE_COLORS,
    getFeatureIcon,
    buildDonutChartOptions,
  } from './featureDistribution.helpers';

  export let initialData: AiFeatureDistributionData | undefined = undefined;
  export let selectedYear: number | undefined = undefined;
  export let selectedMonth: number | 'all' | undefined = undefined;

  let chartElement: HTMLDivElement | null = null;
  let chart: ApexCharts | null = null;
  let ApexCtor: typeof ApexCharts | null = null;
  let themeObserver: MutationObserver | null = null;

  let data: AiFeatureDistributionData | null = initialData || null;
  let loading = !initialData;
  let errorMsg: string | null = null;
  let metricMode: 'requests' | 'cost' = 'requests';

  $: distribution = data?.distribution || [];
  $: grandTotalRequests = data?.totalRequests || 0;
  $: grandTotalCostIdr = data?.totalCostIdr || 0;
  $: hasData = grandTotalRequests > 0;

  $: if (chart && data) {
    renderChart();
  }

  $: if (selectedYear !== undefined) {
    fetchDistribution(selectedYear, selectedMonth);
  }

  async function fetchDistribution(year?: number, month?: number | 'all') {
    loading = true;
    errorMsg = null;
    try {
      const params = new URLSearchParams();
      if (year) params.set('year', String(year));
      if (month && month !== 'all') params.set('month', String(month));

      const res = await fetch(`/api/admin/ai/feature-distribution?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal memuat data distribusi fitur');
      const json = await res.json();
      if (json.ok && json.data) {
        data = json.data;
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    } finally {
      loading = false;
    }
  }

  async function renderChart() {
    if (!ApexCtor || !chartElement || !hasData) return;
    const opts = buildDonutChartOptions(
      distribution,
      grandTotalRequests,
      grandTotalCostIdr,
      metricMode
    );
    if (chart) {
      await chart.updateOptions(opts, true, true);
    } else {
      chart = new ApexCtor(chartElement, opts);
      await chart.render();
    }
  }

  onMount(async () => {
    const mod = await import('apexcharts');
    ApexCtor = mod.default;

    if (!data) {
      await fetchDistribution(selectedYear, selectedMonth);
    } else if (hasData) {
      await renderChart();
    }

    themeObserver = new MutationObserver(() => {
      if (chart && hasData) renderChart();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
  });

  onDestroy(() => {
    themeObserver?.disconnect();
    chart?.destroy();
    chart = null;
  });
</script>

<div class="rounded-3xl bg-card border border-light p-6 md:p-7 shadow-xs space-y-6">
  <!-- Header: Title & Metric Mode Toggle -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-light pb-5">
    <div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Sparkles size={18} />
        </div>
        <h3 class="text-heading-md text-main font-bold font-heading">Distribusi Fitur AI</h3>
      </div>
      <p class="text-body-sm text-secondary mt-1">
        Perbandingan volume permintaan dan alokasi nominal biaya antara Logo, Kemasan Produk, dan Poster.
      </p>
    </div>

    <!-- Toggle Metric Mode -->
    <div class="inline-flex p-1 rounded-xl bg-nested border border-light self-start sm:self-auto shrink-0" role="tablist" aria-label="Pilihan Metrik">
      <button
        type="button"
        role="tab"
        aria-selected={metricMode === 'requests'}
        class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer {metricMode === 'requests'
          ? 'bg-card text-main shadow-xs'
          : 'text-muted hover:text-main'}"
        on:click={() => {
          metricMode = 'requests';
          renderChart();
        }}
      >
        Permintaan (Request)
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={metricMode === 'cost'}
        class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer {metricMode === 'cost'
          ? 'bg-card text-main shadow-xs'
          : 'text-muted hover:text-main'}"
        on:click={() => {
          metricMode = 'cost';
          renderChart();
        }}
      >
        Biaya (Nominal Rp)
      </button>
    </div>
  </div>

  <!-- Content State -->
  {#if loading}
    <div class="h-64 flex flex-col items-center justify-center gap-3 text-secondary">
      <span class="loading loading-spinner loading-md text-primary"></span>
      <span class="text-xs font-semibold">Memuat distribusi fitur...</span>
    </div>
  {:else if errorMsg}
    <div class="p-4 rounded-2xl bg-danger/10 text-danger border border-danger/20 flex items-center gap-3 text-sm">
      <AlertCircle size={18} />
      <span>{errorMsg}</span>
    </div>
  {:else if !hasData}
    <div class="h-56 flex flex-col items-center justify-center gap-2 text-center text-secondary border border-dashed border-light rounded-2xl p-6">
      <Sparkles size={32} class="opacity-30 mb-1" />
      <p class="font-bold text-main text-sm">Belum Ada Data Generasi AI</p>
      <p class="text-xs text-muted max-w-sm">
        Tidak ditemukan riwayat eksekusi AI untuk periode yang dipilih. Coba pilih rentang waktu yang berbeda.
      </p>
    </div>
  {:else}
    <!-- Grid: Donut Chart on Left, Detail Cards on Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <!-- Donut Chart Container -->
      <div class="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[280px]">
        <div bind:this={chartElement} class="w-full flex justify-center"></div>
      </div>

      <!-- Feature Breakdown Cards -->
      <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {#each distribution as item (item.featureType)}
          {@const Icon = getFeatureIcon(item.featureType)}
          {@const color = FEATURE_COLORS[item.featureType] || '#6366f1'}
          <div class="p-4 rounded-2xl bg-nested border border-light flex flex-col justify-between gap-3 hover:border-primary/30 transition-all">
            <!-- Feature Title -->
            <div class="flex items-center gap-2.5">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style="background-color: {color}20; color: {color}"
              >
                <svelte:component this={Icon} size={15} />
              </div>
              <span class="font-bold text-xs text-main truncate">{item.label}</span>
            </div>

            <!-- Stats -->
            <div class="space-y-2 pt-1 border-t border-light/60">
              <!-- Requests -->
              <div>
                <div class="flex items-center justify-between text-2xs text-secondary">
                  <span>Permintaan</span>
                  <span class="font-bold text-main">{item.requestPercentage.toFixed(1)}%</span>
                </div>
                <p class="text-sm font-bold text-main mt-0.5">
                  {formatNumber(item.totalRequests)} <span class="text-2xs font-normal text-muted">req</span>
                </p>
              </div>

              <!-- Cost -->
              <div>
                <div class="flex items-center justify-between text-2xs text-secondary">
                  <span>Nominal Biaya</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400">{item.costPercentage.toFixed(1)}%</span>
                </div>
                <p class="text-sm font-bold text-main mt-0.5">
                  {formatIDR(item.totalCostIdr)}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
