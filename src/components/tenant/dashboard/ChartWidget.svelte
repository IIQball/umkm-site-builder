<script lang="ts">
  import { TrendingUp, ArrowUpRight, Minus, Eye } from 'lucide-svelte';
  import { Card, Badge } from '@/components/ui';
  import { apiFetch } from '@/lib/api/parse-response';
  import {
    CHART_RANGES,
    calculateMerchantGrowth,
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
  let points: TrafficPoint[] = initialPoints;
  let loading = initialPoints.length === 0 && !initialFailed;
  let errorMessage = '';
  let abortCtrl: AbortController | null = null;

  let hoveredIndex: number | null = null;

  $: hasData = points.some((p) => p.views > 0 || p.waClicks > 0);
  $: periodViews = points.reduce((sum, p) => sum + p.views, 0);
  $: periodClicks = points.reduce((sum, p) => sum + p.waClicks, 0);
  $: periodConversion = periodViews > 0 ? ((periodClicks / periodViews) * 100).toFixed(1) : '0.0';

  // Kalkulasi data kurva SVG persis seperti DesignerGrowthLineChart
  $: growthData = calculateMerchantGrowth(points, range);
  $: hoveredPoint = hoveredIndex !== null && growthData.points[hoveredIndex] ? growthData.points[hoveredIndex] : null;

  $: yTicks = [
    { label: `${growthData.maxVal}`, y: growthData.padTop ?? 28 },
    { label: `${Math.round(growthData.maxVal / 2)}`, y: (growthData.padTop ?? 28) + Math.round(growthData.usableHeight / 2) },
    { label: '0', y: growthData.baselineY },
  ];

  // Donut chart SVG calculations
  $: totalInteractions = periodViews + periodClicks;
  $: viewRatio = totalInteractions > 0 ? periodViews / totalInteractions : 0.5;
  $: clickRatio = totalInteractions > 0 ? periodClicks / totalInteractions : 0.5;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  $: viewDash = viewRatio * circumference;
  $: clickDash = clickRatio * circumference;
  $: clickOffset = -viewDash;

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
</script>

<Card
  id="merchant-traffic-chart"
  variant="bordered"
  padding="none"
  radius="2xl"
  class="shadow-xs overflow-hidden h-full flex flex-col justify-between group transition-all duration-300"
>
  <!-- Card Header -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Eye size={18} />
      </div>
      <div>
        <h3 class="text-heading-sm sm:text-heading-md text-main font-bold font-heading leading-tight">
          Pertumbuhan Trafik &amp; Kunjungan Toko
        </h3>
        <p class="text-xs text-secondary mt-0.5 font-sans">
          {growthData.periodLabel ? `Tren aktivitas pengunjung (${growthData.periodLabel})` : 'Tren aktivitas pengunjung'}
        </p>
      </div>
    </div>

    <!-- Badge Growth Indicator & Range Filters -->
    <div class="flex items-center gap-3 self-start md:self-auto">
      <div>
        {#if growthData.recentCount > 0 && growthData.isPositiveGrowth}
          <Badge variant="success" size="sm" dot>
            <TrendingUp size={12} class="mr-0.5 text-success inline" />
            <span>+{growthData.growthPercentage}% {range === '7d' ? 'Hari Ini' : 'Periode Ini'}</span>
          </Badge>
        {:else if growthData.growthPercentage < 0}
          <Badge variant="warning" size="sm" dot>
            <span>{growthData.growthPercentage}% {range === '7d' ? 'Hari Ini' : 'Periode Ini'}</span>
          </Badge>
        {:else}
          <Badge variant="slate" size="sm" dot>
            <Minus size={12} class="mr-0.5 text-muted inline" />
            <span>Stabil</span>
          </Badge>
        {/if}
      </div>

      <!-- Time Range Tabs -->
      <div class="inline-flex p-1 rounded-xl bg-nested border border-light" role="tablist" aria-label="Rentang waktu">
        {#each CHART_RANGES as r}
          <button
            type="button"
            role="tab"
            aria-selected={range === r.value}
            class="px-3 py-1 text-xs font-bold rounded-lg transition-all {range === r.value ? 'bg-card text-main shadow-xs' : 'text-muted hover:text-main'}"
            on:click={() => selectRange(r.value)}
          >
            {r.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Charts Body: Line Chart (6 cols) & Pie/Donut Chart (4 cols) in 1 row -->
  <div class="p-5 sm:p-6 flex-1 relative">
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-6 items-center">
      <!-- Sisi Kiri: Line Chart (6 cols) sama persis dengan DesignerGrowthLineChart -->
      <div class="lg:col-span-6 min-w-0">
        <div class="relative w-full h-64 sm:h-72 select-none overflow-x-auto overflow-y-hidden">
          <div class="w-full h-full {growthData.points.length > 12 ? 'min-w-[640px] md:min-w-0' : 'min-w-[460px] sm:min-w-0'}">
            <!-- Tooltip Floating Card -->
            {#if hoveredPoint}
              <div
                class="absolute -top-3 transform -translate-x-1/2 pointer-events-none bg-main/95 backdrop-blur-md text-canvas px-3 py-2 rounded-xl shadow-xl border border-border z-30 transition-all duration-150 flex flex-col items-center gap-0.5"
                style="left: {(hoveredPoint.x / (growthData.svgWidth || 850)) * 100}%;"
              >
                <span class="text-xs font-semibold text-canvas/70 uppercase tracking-wider">
                  {hoveredPoint.fullLabel}
                </span>
                <div class="flex items-baseline gap-1.5">
                  <span class="font-mono text-sm font-black text-canvas">
                    {hoveredPoint.cumulative}
                  </span>
                  <span class="text-xs text-canvas/70">Pengunjung Kumulatif</span>
                </div>
                <span class="text-xs font-bold text-primary">
                  +{hoveredPoint.count} {range === '7d' ? 'hari ini' : 'periode ini'}
                </span>
              </div>
            {/if}

            <svg
              viewBox="0 0 850 280"
              preserveAspectRatio="none"
              class="w-full h-full overflow-visible"
              aria-label="Pertumbuhan Kunjungan Toko"
            >
              <defs>
                <linearGradient id="growthGrad_blue_MerchantTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--theme-primary, #2563eb)" stop-opacity="0.32" />
                  <stop offset="65%" stop-color="var(--theme-primary, #2563eb)" stop-opacity="0.08" />
                  <stop offset="100%" stop-color="var(--theme-primary, #2563eb)" stop-opacity="0.00" />
                </linearGradient>
              </defs>

              <!-- Horizontal Grid Lines & Ticks -->
              {#each yTicks as tick}
                <line
                  x1={growthData.padLeft}
                  y1={tick.y}
                  x2={growthData.padLeft + growthData.usableWidth}
                  y2={tick.y}
                  stroke="currentColor"
                  stroke-dasharray="4 4"
                  class="text-border-light/60 dark:text-border-light/40"
                  stroke-width="1"
                />
                <text
                  x={growthData.padLeft - 8}
                  y={tick.y + 4}
                  text-anchor="end"
                  class="text-2xs font-mono font-medium fill-muted"
                >
                  {tick.label}
                </text>
              {/each}

              <!-- Gradient Area Fill -->
              {#if growthData.svgAreaPath}
                <path d={growthData.svgAreaPath} fill="url(#growthGrad_blue_MerchantTraffic)" />
              {/if}

              <!-- Line Path -->
              {#if growthData.svgLinePath}
                <path
                  d={growthData.svgLinePath}
                  fill="none"
                  stroke="var(--theme-primary, #2563eb)"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="transition-all duration-300"
                />
              {/if}

              <!-- Hover Guideline -->
              {#if hoveredPoint}
                <line
                  x1={hoveredPoint.x}
                  y1={growthData.padTop ?? 28}
                  x2={hoveredPoint.x}
                  y2={growthData.baselineY}
                  stroke="var(--theme-primary, #2563eb)"
                  stroke-dasharray="3 3"
                  stroke-width="1.5"
                  stroke-opacity="0.6"
                />
              {/if}

              <!-- Data Points & Labels -->
              {#each growthData.points as p, i}
                <g
                  role="button"
                  tabindex="0"
                  aria-label="{p.fullLabel}: {p.cumulative} total, {p.count} baru"
                  class="cursor-pointer focus:outline-none"
                  on:mouseenter={() => (hoveredIndex = i)}
                  on:mouseleave={() => (hoveredIndex = null)}
                  on:focus={() => (hoveredIndex = i)}
                  on:blur={() => (hoveredIndex = null)}
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') hoveredIndex = i;
                  }}
                >
                  <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIndex === i ? 5 : (growthData.points.length > 12 ? 2.5 : 3.5)}
                    class="transition-all duration-200 pointer-events-none {hoveredIndex === i
                      ? 'fill-primary stroke-canvas stroke-2 shadow-md'
                      : 'fill-card stroke-primary stroke-2'}"
                  />
                </g>

                <text
                  x={p.x}
                  y={growthData.baselineY + 22}
                  text-anchor="middle"
                  class="text-xs sm:text-2xs font-bold font-heading transition-colors select-none {hoveredIndex === i
                    ? 'fill-primary font-black'
                    : 'fill-secondary'}"
                >
                  {p.label}
                </text>
              {/each}
            </svg>
          </div>
        </div>
      </div>

      <!-- Sisi Kanan: Pie / Donut Chart (4 cols) dalam satu baris dengan estetika seragam -->
      <div class="lg:col-span-4 min-w-0 flex flex-col items-center justify-center p-4 rounded-2xl bg-nested/40 border border-light/60">
        <h4 class="text-xs font-bold text-main uppercase tracking-wider mb-3">Distribusi Interaksi</h4>
        <div class="relative w-44 h-44 flex items-center justify-center">
          <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            <!-- Background Ring -->
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              stroke-width="14"
              fill="transparent"
              class="text-border-light/40"
            />
            <!-- Sektor Pengunjung (Primary) -->
            {#if periodViews > 0}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="var(--theme-primary, #2563eb)"
                stroke-width="14"
                stroke-linecap="round"
                stroke-dasharray="{viewDash} {circumference}"
                fill="transparent"
                class="transition-all duration-500"
              />
            {/if}
            <!-- Sektor WA Clicks (Emerald/Success) -->
            {#if periodClicks > 0}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="var(--success, #10b981)"
                stroke-width="14"
                stroke-linecap="round"
                stroke-dasharray="{clickDash} {circumference}"
                stroke-dashoffset={clickOffset}
                fill="transparent"
                class="transition-all duration-500"
              />
            {/if}
          </svg>

          <!-- Center Label Donut -->
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span class="text-2xs uppercase tracking-wider text-muted font-bold">Total Interaksi</span>
            <span class="text-lg font-black font-mono text-main leading-none mt-0.5">
              {(periodViews + periodClicks).toLocaleString('id-ID')}
            </span>
            <span class="text-2xs text-secondary mt-1 font-medium">{periodConversion}% konversi</span>
          </div>
        </div>

        <!-- Legend Donut -->
        <div class="flex items-center gap-4 mt-4 text-xs font-medium">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"></span>
            <span class="text-secondary font-mono">{periodViews.toLocaleString('id-ID')}</span>
            <span class="text-muted text-2xs">Kunjungan</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-success flex-shrink-0"></span>
            <span class="text-secondary font-mono">{periodClicks.toLocaleString('id-ID')}</span>
            <span class="text-muted text-2xs">WA</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading, Error & Empty Overlay -->
    {#if loading}
      <div class="absolute inset-0 flex items-center justify-center bg-card/70 backdrop-blur-[1px] z-20">
        <span class="loading loading-spinner loading-md text-primary"></span>
      </div>
    {:else if errorMessage}
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/90 text-center px-6 z-20">
        <p class="text-sm text-secondary">{errorMessage}</p>
        <button type="button" class="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white" on:click={() => loadData(range)}>
          Coba lagi
        </button>
      </div>
    {:else if !hasData}
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none px-4 z-20">
        <p class="px-4 py-2 rounded-xl bg-card/90 border border-light text-xs text-secondary text-center shadow-xs">
          {totalViews > 0 || totalClicks > 0
            ? 'Belum ada aktivitas pada periode ini. Grafik mulai terisi sejak pencatatan harian aktif.'
            : 'Belum ada data. Grafik akan terisi setelah toko Anda dikunjungi.'}
        </p>
      </div>
    {/if}
  </div>

  <!-- Card Footer Metrics persis seperti DesignerGrowthLineChart -->
  <div class="px-5 py-3.5 sm:px-6 bg-nested/50 border-t border-light flex items-center justify-between gap-4">
    <div class="flex items-center gap-4 sm:gap-6 text-xs">
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          Total Kunjungan
        </span>
        <span class="font-mono font-bold text-main">
          {periodViews.toLocaleString('id-ID')} Pengunjung
        </span>
      </div>
      <div class="h-6 w-px bg-light"></div>
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          {range === '7d' ? 'Hari Ini' : 'Periode Ini'}
        </span>
        <span class="font-mono font-bold text-primary">
          +{growthData.recentCount} Pengunjung
        </span>
      </div>
      <div class="h-6 w-px bg-light hidden sm:block"></div>
      <div class="hidden sm:block">
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          Klik WhatsApp
        </span>
        <span class="font-mono font-bold text-success">
          {periodClicks.toLocaleString('id-ID')} Klik ({periodConversion}%)
        </span>
      </div>
    </div>

    <a
      href="/dashboard/store"
      class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
    >
      <span>Kelola Toko</span>
      <ArrowUpRight size={14} />
    </a>
  </div>
</Card>
