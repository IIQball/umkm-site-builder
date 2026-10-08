<script lang="ts">
  import { TrendingUp, DollarSign, ArrowUpRight } from 'lucide-svelte';
  import { Card, Badge } from '@/components/ui';
  import { formatSmartIDR } from '@/lib/currency';
  import type { GrowthSummary } from './superadminGrowth.helpers';

  export let growthData: GrowthSummary;

  let hoveredIndex: number | null = null;
  $: hoveredPoint = hoveredIndex !== null ? growthData.points[hoveredIndex] : null;

  $: yTicks =
    growthData.maxVal > 0
      ? [
          { label: formatSmartIDR(growthData.maxVal), y: growthData.padTop ?? 28 },
          {
            label: formatSmartIDR(Math.round(growthData.maxVal / 2)),
            y: (growthData.padTop ?? 28) + Math.round(growthData.usableHeight / 2),
          },
          { label: 'Rp 0', y: growthData.baselineY },
        ]
      : [{ label: 'Rp 0', y: growthData.baselineY }];
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
      <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
        <DollarSign size={18} />
      </div>
      <div>
        <h3 class="text-heading-sm sm:text-heading-md text-main font-bold font-heading leading-tight">
          Pendapatan & Fee Platform
        </h3>
        <p class="text-body-xs text-secondary mt-0.5 font-sans">
          {growthData.periodLabel ? `Fee transaksi (${growthData.periodLabel})` : 'Fee transaksi platform'}
        </p>
      </div>
    </div>

    <!-- Growth Indicator -->
    <div>
      {#if growthData.thisPeriod > 0 && growthData.isPositiveGrowth}
        <Badge variant="success" size="sm" dot>
          <TrendingUp size={12} class="mr-0.5 text-success inline" />
          <span>+{growthData.growthPercentage}%</span>
        </Badge>
      {:else if growthData.growthPercentage < 0}
        <Badge variant="warning" size="sm" dot>
          <span>{growthData.growthPercentage}%</span>
        </Badge>
      {:else}
        <Badge variant="slate" size="sm">
          <span>Stabil</span>
        </Badge>
      {/if}
    </div>
  </div>

  <!-- SVG Chart Container -->
  <div class="p-5 sm:p-6 flex-1 flex flex-col justify-center relative">
    <div class="relative w-full h-64 sm:h-72 select-none overflow-x-auto overflow-y-hidden">
      <div class="w-full h-full {growthData.points.length > 12 ? 'min-w-[640px] md:min-w-0' : 'min-w-[560px] sm:min-w-0'}">
        <!-- Floating Tooltip Card -->
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
                {formatSmartIDR(hoveredPoint.cumulative)}
              </span>
              <span class="text-xs text-canvas/70">Akumulasi Fee</span>
            </div>
            <span class="text-xs font-bold text-emerald-400">
              +{formatSmartIDR(hoveredPoint.countOrAmount)} periode ini
            </span>
          </div>
        {/if}

        <svg
          viewBox="0 0 850 280"
          preserveAspectRatio="none"
          class="w-full h-full overflow-visible"
          aria-label="Grafik garis pertumbuhan pendapatan fee platform superadmin"
        >
          <defs>
            <linearGradient id="superadminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#059669" stop-opacity="0.35" />
              <stop offset="65%" stop-color="#059669" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#059669" stop-opacity="0.00" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
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

          <!-- Gradient Area -->
          {#if growthData.svgAreaPath}
            <path d={growthData.svgAreaPath} fill="url(#superadminRevenueGradient)" />
          {/if}

          <!-- Line Path -->
          {#if growthData.svgLinePath}
            <path
              d={growthData.svgLinePath}
              fill="none"
              stroke="#059669"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-all duration-300"
            />
          {/if}

          <!-- Hover Line -->
          {#if hoveredPoint}
            <line
              x1={hoveredPoint.x}
              y1={growthData.padTop ?? 28}
              x2={hoveredPoint.x}
              y2={growthData.baselineY}
              stroke="#059669"
              stroke-dasharray="3 3"
              stroke-width="1.5"
              stroke-opacity="0.6"
            />
          {/if}

          <!-- Points -->
          {#each growthData.points as p, i}
            <g
              role="button"
              tabindex="0"
              aria-label="{p.fullLabel}: {formatSmartIDR(p.cumulative)} fee akumulasi"
              class="cursor-pointer focus:outline-none"
              on:mouseenter={() => (hoveredIndex = i)}
              on:mouseleave={() => (hoveredIndex = null)}
              on:focus={() => (hoveredIndex = i)}
              on:blur={() => (hoveredIndex = null)}
            >
              <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 5 : (growthData.points.length > 12 ? 2.5 : 3.5)}
                class="transition-all duration-200 pointer-events-none {hoveredIndex === i
                  ? 'fill-emerald-600 stroke-canvas stroke-2 shadow-md'
                  : 'fill-card stroke-emerald-600 stroke-2'}"
              />
            </g>

            <text
              x={p.x}
              y={growthData.baselineY + 22}
              text-anchor="middle"
              class="text-xs sm:text-2xs font-bold font-heading transition-colors select-none {hoveredIndex === i
                ? 'fill-emerald-600 font-black'
                : 'fill-secondary'}"
            >
              {p.label}
            </text>
          {/each}
        </svg>
      </div>
    </div>
  </div>

  <!-- Card Footer -->
  <div class="px-5 py-3.5 sm:px-6 bg-nested/50 border-t border-light flex items-center justify-between gap-4">
    <div class="flex items-center gap-4 sm:gap-6 text-xs">
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">Total Fee Terkumpul</span>
        <span class="font-mono font-bold text-main">{formatSmartIDR(growthData.total)}</span>
      </div>
      <div class="h-6 w-px bg-light"></div>
      <div>
        <span class="text-xs uppercase tracking-wider text-muted font-bold block">
          {growthData.filterMode === 'day' ? 'Hari Ini' : 'Bulan Ini'}
        </span>
        <span class="font-mono font-bold text-emerald-600">+{formatSmartIDR(growthData.thisPeriod)}</span>
      </div>
    </div>

    <a
      href="/superadmin/transactions"
      class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
    >
      <span>Riwayat Transaksi</span>
      <ArrowUpRight size={14} />
    </a>
  </div>
</Card>
