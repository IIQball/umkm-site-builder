<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type ApexCharts from 'apexcharts';

  export let totalViews = 0;
  export let totalClicks = 0;
  export let isOnboarded = true;
  void isOnboarded;
  // Data 12 bulan yang sudah dirender server (opsional)
  export let initialPoints: TrafficPoint[] = [];
  export let initialFailed = false;

  type Range = '7d' | '30d' | '12m';

  interface TrafficPoint {
    key: string;
    label: string;
    views: number;
    waClicks: number;
    conversion: number;
  }

  const RANGES: Array<{ value: Range; label: string }> = [
    { value: '7d', label: '7 Hari' },
    { value: '30d', label: '30 Hari' },
    { value: '12m', label: '12 Bulan' },
  ];

  // Warna mengikuti gambar referensi - lebih kontras
  const COLORS = {
    views: '#2563EB',
    clicks: '#10B981',
    conversion: '#F2E845',
  };

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
  
  // Update chart when points change
  $: if (chart && points.length > 0 && !loading) {
    renderChart();
  }

  // Update pie chart when period data changes
  $: if (pieChart && points.length > 0 && !loading) {
    renderPieChart();
  }

  function themeColors() {
    const style = getComputedStyle(document.documentElement);
    const text = style.getPropertyValue('--color-text-muted').trim() || '#64748b';
    const main = style.getPropertyValue('--color-text-main').trim() || '#0f172a';
    return { text, main };
  }

  function buildOptions(): ApexCharts.ApexOptions {
    const { text, main } = themeColors();
    const nf = (v: number) => Math.round(v).toLocaleString('id-ID');

    // Determine tick amount based on range to reduce crowding
    const tickAmount = range === '7d' ? 6 : range === '30d' ? 5 : 5;
    
    // Hide markers for longer ranges to reduce clutter
    const showMarkers = range === '7d';
    // Show grid lines for all ranges, sparse for 30d via tickAmount

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
      colors: [COLORS.views, COLORS.clicks, COLORS.conversion],
      stroke: { curve: 'straight', width: 4, lineCap: 'round' },
      markers: {
        size: showMarkers ? 7 : 0,
        strokeWidth: 0,
        hover: { size: showMarkers ? 9 : 0 },
      },
      xaxis: {
        categories: points.map((p) => p.label),
        axisBorder: { show: true, color: main },
        axisTicks: { show: false },
        tooltip: { enabled: false },
        tickPlacement: 'on',
        tickAmount,
        type: range === '30d' ? 'numeric' : 'category',
        labels: {
          rotate: 0,
          hideOverlappingLabels: true,
          style: { colors: text, fontSize: '11px', fontWeight: 600 },
        },
        crosshairs: { show: false },
      },
      yaxis: [
        {
          seriesName: 'Pengunjung',
          min: 0,
          forceNiceScale: true,
          labels: {
            style: { colors: text, fontSize: '11px' },
            formatter: (v: number) => nf(v),
          },
        },
        { seriesName: 'Pengunjung', min: 0, show: false },
        {
          seriesName: 'Konversi (%)',
          opposite: true,
          min: 0,
          forceNiceScale: true,
          labels: {
            style: { colors: text, fontSize: '11px' },
            formatter: (v: number) => `${v.toFixed(0)}%`,
          },
        },
      ],
      // Garis putus-putus vertikal di tiap titik, tanpa garis horizontal (sesuai referensi)
      grid: {
        show: true,
        borderColor: main,
        strokeDashArray: 4,
        xaxis: { 
          lines: { 
            show: true,
          } 
        },
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
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
        y: {
          formatter: (v: number, opts?: { seriesIndex: number }) =>
            opts?.seriesIndex === 2 ? `${v.toFixed(1)}%` : nf(v),
        },
      },
      dataLabels: { enabled: false },
      noData: { text: 'Memuat data...' },
    };
  }

  function buildPieOptions(): ApexCharts.ApexOptions {
    const { main } = themeColors();

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
      colors: [COLORS.views, COLORS.clicks],
      stroke: { show: false },
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: string, opts?: { seriesIndex: number }) => {
          const value = opts?.seriesIndex === 0 ? periodViews : periodClicks;
          const percentage = parseFloat(val);
          return `${percentage.toFixed(1)}%\n${Math.round(value).toLocaleString('id-ID')}`;
        },
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#ffffff'],
        },
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
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
        y: {
          formatter: (v: number) => Math.round(v).toLocaleString('id-ID'),
        },
      },
      noData: { text: 'Memuat data...' },
    };
  }

  async function renderChart() {
    if (!chartEl || !ApexCtor) return;
    const options = buildOptions();
    if (chart) {
      await chart.updateOptions(options, true, true);
    } else {
      chart = new ApexCtor(chartEl, options);
      await chart.render();
    }
  }

  async function renderPieChart() {
    if (!pieChartEl || !ApexCtor) return;
    const options = buildPieOptions();
    if (pieChart) {
      await pieChart.updateOptions(options, true, true);
    } else {
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
      const res = await fetch(`/api/tenant/analytics/chart?range=${next}`, {
        signal: abortCtrl.signal,
        credentials: 'same-origin',
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Server mengembalikan halaman HTML (mis. 404/500), bukan JSON
        throw new Error(
          `Endpoint grafik tidak merespons JSON (HTTP ${res.status}). Pastikan server sudah di-restart/di-build ulang setelah file baru ditambahkan.`
        );
      }
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json?.error?.message || json?.message || 'Gagal memuat grafik');
      }
      points = json.data.points as TrafficPoint[];
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
    // ApexCharts butuh `window`, jadi di-import dinamis hanya di browser
    const mod = await import('apexcharts');
    ApexCtor = mod.default;
    if (initialPoints.length > 0 && !initialFailed) {
      // Pakai data dari server, tidak perlu fetch untuk tampilan awal
      points = initialPoints;
      loading = false;
      await renderChart();
      await renderPieChart();
    } else {
      await loadData(range);
    }

    // Perbarui warna chart saat tema light/dark berganti
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

<div
  class="rounded-3xl bg-card border border-light shadow-xs overflow-hidden"
>
  <div class="p-6 border-b border-light flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h3 class="text-heading-md text-main font-bold font-heading">Tren Kunjungan &amp; Konversi</h3>
      <p class="text-body-sm text-secondary mt-0.5">
        Pengunjung, klik WhatsApp, dan tingkat konversi toko Anda dari waktu ke waktu
      </p>
    </div>

    <div class="inline-flex p-1 rounded-xl bg-nested border border-light self-start md:self-auto" role="tablist" aria-label="Rentang waktu">
      {#each RANGES as r}
        <button
          type="button"
          role="tab"
          aria-selected={range === r.value}
          class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all {range === r.value
            ? 'bg-card text-main shadow-xs'
            : 'text-muted hover:text-main'}"
          on:click={() => selectRange(r.value)}
        >
          {r.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Ringkasan periode -->
  <div class="grid grid-cols-3 divide-x divide-[var(--color-border-light)] border-b border-light">
    <div class="px-6 py-4">
      <div class="flex items-center gap-2 text-xs font-semibold text-muted">
        <span class="w-2.5 h-2.5 rounded-full" style="background:{COLORS.views}"></span>Pengunjung
      </div>
      <div class="mt-1 text-xl font-bold text-main font-mono">{periodViews.toLocaleString('id-ID')}</div>
    </div>
    <div class="px-6 py-4">
      <div class="flex items-center gap-2 text-xs font-semibold text-muted">
        <span class="w-2.5 h-2.5 rounded-full" style="background:{COLORS.clicks}"></span>Klik WhatsApp
      </div>
      <div class="mt-1 text-xl font-bold text-main font-mono">{periodClicks.toLocaleString('id-ID')}</div>
    </div>
    <div class="px-6 py-4">
      <div class="flex items-center gap-2 text-xs font-semibold text-muted">
        <span class="w-2.5 h-2.5 rounded-full" style="background:{COLORS.conversion}"></span>Konversi
      </div>
      <div class="mt-1 text-xl font-bold text-main font-mono">{periodConversion}%</div>
    </div>
  </div>

  <div class="relative p-4 md:p-6">
    <div class="grid grid-cols-10 gap-4">
      <!-- Line Chart: 60% -->
      <div class="col-span-6">
        <div bind:this={chartEl} class="min-h-[300px]" aria-label="Grafik garis tren kunjungan dan konversi"></div>
      </div>

      <!-- Pie Chart: 40% -->
      <div class="col-span-4">
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
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white"
          on:click={() => loadData(range)}
        >
          Coba lagi
        </button>
      </div>
    {:else if !hasData}
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
        <p class="px-4 py-2 rounded-xl bg-card/90 border border-light text-xs text-secondary">
          {totalViews > 0 || totalClicks > 0
            ? 'Belum ada aktivitas pada periode ini. Grafik mulai terisi sejak pencatatan harian aktif.'
            : 'Belum ada data. Grafik akan terisi setelah toko Anda dikunjungi.'}
        </p>
      </div>
    {/if}
  </div>
</div>
