<script lang="ts">
  import { TrendingUp, Coins, ArrowUpRight, Minus } from 'lucide-svelte';
  import { Card, Badge } from '@/components/ui';
  import { formatSmartIDR, formatIDR } from '@/lib/currency';
  import type { FeeRevenueSummary } from './feeRevenue.types';

  export let revenueData: FeeRevenueSummary;

  let hoveredIndex: number | null = null;
  $: hoveredPoint = hoveredIndex !== null ? revenueData.points[hoveredIndex] : null;

  $: yTicks = [
    { label: formatSmartIDR(revenueData.maxVal), y: revenueData.padTop ?? 28 },
    { label: formatSmartIDR(Math.round(revenueData.maxVal / 2)), y: (revenueData.padTop ?? 28) + Math.round(revenueData.usableHeight / 2) },
    { label: '0', y: revenueData.baselineY },
  ];
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
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Coins size={18} />
      </div>
      <div>
        <h3 class="text-heading-sm sm:text-heading-md text-main font-bold font-heading leading-tight">
          Pendapatan Fee Pendampingan
        </h3>
        <p class="text-body-xs text-secondary mt-0.5 font-sans">
          {revenueData.periodLabel ? `Tren komisi fee (${revenueData.periodLabel})` : 'Tren komisi fee pendaftaran & transaksi'}
        </p>
      </div>
    </div>

    <!-- Badge Growth Indicator -->
    <div>
      {#if revenueData.thisMonthRevenue > 0 && revenueData.isPositiveGrowth}
        <Badge variant="success" size="sm" dot>
          <TrendingUp size={12} class="mr-0.5 text-success inline" />
          <span>+{revenueData.growthPercentage}% {revenueData.filterMode === 'day' ? 'Hari Ini' : 'Bln Ini'}</span>
        </Badge>
      {:else if revenueData.growthPercentage < 0}
        <Badge variant="warning" size="sm" dot>
          <span>{revenueData.growthPercentage}% {revenueData.filterMode === 'day' ? 'Hari Ini' : 'Bln Ini'}</span>
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
      <div class="w-full h-full {revenueData.points.length > 12 ? 'min-w-[640px] md:min-w-0' : 'min-w-[560px] sm:min-w-0'}">
        <!-- Tooltip Floating Card -->
        {#if hoveredPoint}
          <div
            class="absolute -top-3 transform -translate-x-1/2 pointer-events-none bg-main/95 backdrop-blur-md text-canvas px-3 py-2 rounded-xl shadow-xl border border-border z-30 transition-all duration-150 flex flex-col items-center gap-0.5"
            style="left: {(hoveredPoint.x / (revenueData.svgWidth || 850)) * 100}%;"
          >
            <span class="text-3xs font-semibold text-canvas/70 uppercase tracking-wider">
              {hoveredPoint.fullLabel}
            </span>
            <div class="flex items-baseline gap-1.5">
              <span class="font-mono text-sm font-black text-canvas">
                {formatIDR(hoveredPoint.cumulative)}
              </span>
              <span class="text-3xs text-canvas/70">Kumulatif</span>
            </div>
            <span class="text-3xs font-bold text-success">
              +{formatIDR(hoveredPoint.amount)} {revenueData.filterMode === 'day' ? 'hari ini' : 'bulan ini'}
            </span>
          </div>
        {/if}

        <svg
          viewBox="0 0 850 280"
          preserveAspectRatio="none"
          class="w-full h-full overflow-visible"
          aria-label="Grafik garis pendapatan fee pendampingan"
        >
          <defs>
            <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--color-success, #10b981)" stop-opacity="0.32" />
              <stop offset="65%" stop-color="var(--color-success, #10b981)" stop-opacity="0.08" />
              <stop offset="100%" stop-color="var(--color-success, #10b981)" stop-opacity="0.00" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines & Ticks -->
          {#each yTicks as tick}
            <line
              x1={revenueData.padLeft}
              y1={tick.y}
              x2={revenueData.padLeft + revenueData.usableWidth}
              y2={tick.y}
              stroke="currentColor"
              stroke-dasharray="4 4"
              class="text-border-light/60 dark:text-border-light/40"
              stroke-width="1"
            />
            <text
              x={revenueData.padLeft - 8}
              y={tick.y + 4}
              text-anchor="end"
              class="text-2xs font-mono font-medium fill-muted"
            >
              {tick.label}
            </text>
          {/each}

          <!-- Gradient Area Fill -->
          {#if revenueData.svgAreaPath}
            <path d={revenueData.svgAreaPath} fill="url(#adminRevenueGradient)" />
          {/if}

          <!-- Line Path -->
          {#if revenueData.svgLinePath}
            <path
              d={revenueData.svgLinePath}
              fill="none"
              stroke="var(--color-success, #10b981)"
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
              y1={revenueData.padTop ?? 28}
              x2={hoveredPoint.x}
              y2={revenueData.baselineY}
              stroke="var(--color-success, #10b981)"
              stroke-dasharray="3 3"
              stroke-width="1.5"
              stroke-opacity="0.6"
            />
          {/if}

          <!-- Data Points & Labels -->
          {#each revenueData.points as p, i}
            <g
              role="button"
              tabindex="0"
              aria-label="{p.fullLabel}: {formatIDR(p.cumulative)} kumulatif, {formatIDR(p.amount)} didapat"
              class="cursor-pointer focus:outline-none"
              on:mouseenter={() => (hoveredIndex = i)}
              on:mouseleave={() => (hoveredIndex = null)}
              on:focus={() => (hoveredIndex = i)}
              on:blur={() => (hoveredIndex = null)}
              on:keydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') hoveredIndex = i;
              }}
            >
              <!-- Hit Area for smooth hover target -->
              <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

              <!-- Point Circle -->
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 5 : (revenueData.points.length > 12 ? 2.5 : 3.5)}
                class="transition-all duration-200 pointer-events-none {hoveredIndex === i
                  ? 'fill-success stroke-canvas stroke-2 shadow-md'
                  : 'fill-card stroke-success stroke-2'}"
              />
            </g>

            <!-- X-Axis Month / Day Label -->
            <text
              x={p.x}
              y={revenueData.baselineY + 22}
              text-anchor="middle"
              class="text-3xs sm:text-2xs font-bold font-heading transition-colors select-none {hoveredIndex === i
                ? 'fill-success font-black'
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
        <span class="text-3xs uppercase tracking-wider text-muted font-bold block">
          Total Fee Diterima
        </span>
        <span class="font-mono font-bold text-main">
          {formatIDR(revenueData.totalRevenue)}
        </span>
      </div>
      <div class="h-6 w-px bg-light"></div>
      <div>
        <span class="text-3xs uppercase tracking-wider text-muted font-bold block">
          {revenueData.filterMode === 'day' ? 'Hari Ini' : 'Bulan Ini'}
        </span>
        <span class="font-mono font-bold text-success">
          +{formatIDR(revenueData.thisMonthRevenue)}
        </span>
      </div>
    </div>

    <a
      href="/admin/wallet"
      class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
    >
      <span>Dompet & Payout</span>
      <ArrowUpRight size={14} />
    </a>
  </div>
</Card>
