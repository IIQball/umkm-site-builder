<script lang="ts">
  import { TrendingUp, Minus, Eye } from 'lucide-svelte';
  import { Card, Badge } from '@/components/ui';
  import type { MerchantTrafficSummary } from './chartWidget.helpers';

  export let trafficData: MerchantTrafficSummary;
  export let title: string = 'Pertumbuhan Kunjungan Toko';
  export let subtitle: string = 'Tren kunjungan toko harian';
  export let totalLabel: string = 'Total Kunjungan';
  export let unitLabel: string = 'Views';

  let hoveredIndex: number | null = null;
  $: hoveredPoint = hoveredIndex !== null ? trafficData.points[hoveredIndex] : null;

  $: yTicks = [
    { label: `${trafficData.maxVal}`, y: trafficData.padTop ?? 28 },
    {
      label: `${Math.round(trafficData.maxVal / 2)}`,
      y: (trafficData.padTop ?? 28) + Math.round(trafficData.usableHeight / 2),
    },
    { label: '0', y: trafficData.baselineY },
  ];

  const strokeColor = 'var(--theme-primary, #2563eb)';
  const gradientId = 'trafficGrad_blue';
</script>

<Card
  variant="bordered"
  padding="none"
  radius="2xl"
  class="shadow-xs overflow-hidden h-full flex flex-col justify-between group transition-all duration-300"
>
  <!-- Card Header -->
  <div class="p-5 sm:p-6 border-b border-light flex items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs"
      >
        <Eye size={18} />
      </div>
      <div>
        <h3 class="text-heading-sm sm:text-heading-md text-main font-bold font-heading leading-tight">
          {title}
        </h3>
        <p class="text-xs text-secondary mt-0.5 font-sans">
          {trafficData.periodLabel ? `${subtitle} (${trafficData.periodLabel})` : subtitle}
        </p>
      </div>
    </div>

    <!-- Badge Growth Indicator -->
    <div>
      {#if trafficData.thisMonthCount > 0 && trafficData.isPositiveGrowth}
        <Badge variant="success" size="sm" dot>
          <TrendingUp size={12} class="mr-0.5 text-success inline" />
          <span>+{trafficData.growthPercentage}% {trafficData.filterMode === 'day' ? 'Hari Ini' : 'Bln Ini'}</span>
        </Badge>
      {:else if trafficData.growthPercentage < 0}
        <Badge variant="warning" size="sm" dot>
          <span>{trafficData.growthPercentage}% {trafficData.filterMode === 'day' ? 'Hari Ini' : 'Bln Ini'}</span>
        </Badge>
      {:else}
        <Badge variant="slate" size="sm" dot>
          <Minus size={12} class="mr-0.5 text-muted inline" />
          <span>Stabil</span>
        </Badge>
      {/if}
    </div>
  </div>

  <!-- SVG Chart Container -->
  <div class="p-5 sm:p-6 flex-1 flex flex-col justify-center relative">
    <div class="relative w-full h-64 sm:h-72 select-none overflow-x-auto overflow-y-hidden">
      <div class="w-full h-full {trafficData.points.length > 12 ? 'min-w-[640px] md:min-w-0' : 'min-w-[560px] sm:min-w-0'}">
        <!-- Tooltip Floating Card -->
        {#if hoveredPoint}
          <div
            class="absolute -top-3 transform -translate-x-1/2 pointer-events-none bg-main/95 backdrop-blur-md text-canvas px-3 py-2 rounded-xl shadow-xl border border-border z-30 transition-all duration-150 flex flex-col items-center gap-0.5"
            style="left: {(hoveredPoint.x / (trafficData.svgWidth || 850)) * 100}%;"
          >
            <span class="text-xs font-semibold text-canvas/70 uppercase tracking-wider">
              {hoveredPoint.fullLabel}
            </span>
            <div class="flex items-baseline gap-1.5">
              <span class="font-mono text-sm font-black text-canvas">
                {hoveredPoint.count}
              </span>
              <span class="text-xs text-canvas/70">{unitLabel}</span>
            </div>
            <span class="text-xs font-bold text-primary">
              {trafficData.filterMode === 'day' ? 'Kunjungan harian' : 'Kunjungan bulanan'}
            </span>
          </div>
        {/if}

        <svg
          viewBox="0 0 850 280"
          preserveAspectRatio="none"
          class="w-full h-full overflow-visible"
          aria-label={title}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--theme-primary, #2563eb)" stop-opacity="0.32" />
              <stop offset="65%" stop-color="var(--theme-primary, #2563eb)" stop-opacity="0.08" />
              <stop offset="100%" stop-color="var(--theme-primary, #2563eb)" stop-opacity="0.00" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines & Ticks -->
          {#each yTicks as tick}
            <line
              x1={trafficData.padLeft}
              y1={tick.y}
              x2={trafficData.padLeft + trafficData.usableWidth}
              y2={tick.y}
              stroke="currentColor"
              stroke-dasharray="4 4"
              class="text-border-light/60 dark:text-border-light/40"
              stroke-width="1"
            />
            <text
              x={trafficData.padLeft - 8}
              y={tick.y + 4}
              text-anchor="end"
              class="text-xs font-mono font-medium fill-muted"
            >
              {tick.label}
            </text>
          {/each}

          <!-- Gradient Area Fill -->
          {#if trafficData.svgAreaPath}
            <path d={trafficData.svgAreaPath} fill="url(#{gradientId})" />
          {/if}

          <!-- Line Path -->
          {#if trafficData.svgLinePath}
            <path
              d={trafficData.svgLinePath}
              fill="none"
              stroke={strokeColor}
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
              y1={trafficData.padTop ?? 28}
              x2={hoveredPoint.x}
              y2={trafficData.baselineY}
              stroke={strokeColor}
              stroke-dasharray="3 3"
              stroke-width="1.5"
              stroke-opacity="0.6"
            />
          {/if}

          <!-- Data Points & Labels -->
          {#each trafficData.points as p, i}
            <g
              role="button"
              tabindex="0"
              aria-label="{p.fullLabel}: {p.count} kunjungan"
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
                r={hoveredIndex === i ? 5 : (trafficData.points.length > 12 ? 2.5 : 3.5)}
                class="transition-all duration-200 pointer-events-none {hoveredIndex === i
                  ? 'fill-primary stroke-canvas stroke-2 shadow-md'
                  : 'fill-card stroke-primary stroke-2'}"
              />
            </g>

            <text
              x={p.x}
              y={trafficData.baselineY + 22}
              text-anchor="middle"
              class="{trafficData.points.length > 12 ? 'text-2xs sm:text-xs' : 'text-xs sm:text-sm'} font-bold font-heading transition-colors select-none {hoveredIndex === i
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

  <!-- Card Footer Metrics -->
  <div class="px-5 py-3.5 sm:px-6 bg-nested/50 border-t border-light flex items-center justify-between gap-4">
    <div class="flex items-center gap-4 sm:gap-6 text-xs">
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          {totalLabel}
        </span>
        <span class="font-mono font-bold text-main">
          {trafficData.periodViews.toLocaleString('id-ID')} {unitLabel}
        </span>
      </div>
      <div class="h-6 w-px bg-light"></div>
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          {trafficData.filterMode === 'day' ? 'Hari Ini' : 'Bulan Ini'}
        </span>
        <span class="font-mono font-bold text-primary">
          {trafficData.thisMonthCount.toLocaleString('id-ID')} {unitLabel}
        </span>
      </div>
    </div>
  </div>
</Card>

