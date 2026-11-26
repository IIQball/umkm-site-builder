<script lang="ts">
  import { PieChart } from 'lucide-svelte';
  import { Card, Badge } from '@/components/ui';
  import { pieSlicePath, type MerchantTrafficSummary } from './chartWidget.helpers';

  export let trafficData: MerchantTrafficSummary;

  const cx = 100;
  const cy = 100;
  const r = 80;
  const TAU = 2 * Math.PI;
  const startAngle = -Math.PI / 2; // Mulai dari atas (jam 12)

  $: totalInteractions = trafficData.periodViews + trafficData.periodClicks;
  $: viewsPercentage = totalInteractions > 0
    ? Math.round((trafficData.periodViews / totalInteractions) * 100)
    : 0;
  $: clicksPercentage = totalInteractions > 0
    ? 100 - viewsPercentage
    : 0;

  // Sudut pembagi irisan
  $: viewsAngle = totalInteractions > 0 ? (trafficData.periodViews / totalInteractions) * TAU : TAU;
  $: viewsPath =
    totalInteractions > 0 && trafficData.periodViews > 0 && trafficData.periodClicks > 0
      ? pieSlicePath(cx, cy, r, startAngle, startAngle + viewsAngle)
      : '';
  $: clicksPath =
    totalInteractions > 0 && trafficData.periodClicks > 0 && trafficData.periodViews > 0
      ? pieSlicePath(cx, cy, r, startAngle + viewsAngle, startAngle + TAU)
      : '';
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
        <PieChart size={18} />
      </div>
      <div>
        <h3 class="text-heading-sm sm:text-heading-md text-main font-bold font-heading leading-tight">
          Distribusi Interaksi
        </h3>
        <p class="text-xs text-secondary mt-0.5 font-sans">
          Rasio interaksi {trafficData.periodLabel ? `(${trafficData.periodLabel})` : ''}
        </p>
      </div>
    </div>

    <div>
      <Badge variant="primary" size="sm" dot>
        <span>Konversi {trafficData.periodConversion}%</span>
      </Badge>
    </div>
  </div>

  <!-- SVG Solid Pie Container -->
  <div class="p-5 sm:p-6 flex-1 flex flex-col items-center justify-center gap-6">
    <div class="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
      <svg viewBox="0 0 200 200" class="w-full h-full transform transition-transform duration-300">
        {#if totalInteractions === 0}
          <!-- Empty State Solid Circle -->
          <circle
            {cx}
            {cy}
            {r}
            class="fill-border-light/40 dark:fill-border-light/20"
          />
          <text
            x={cx}
            y={cy + 4}
            text-anchor="middle"
            class="text-xs font-semibold fill-muted select-none"
          >
            Belum ada data
          </text>
        {:else if trafficData.periodClicks === 0}
          <!-- 100% Views -->
          <circle
            {cx}
            {cy}
            {r}
            fill="var(--theme-primary, #2563eb)"
            class="transition-all duration-300"
          />
        {:else if trafficData.periodViews === 0}
          <!-- 100% Clicks -->
          <circle
            {cx}
            {cy}
            {r}
            fill="var(--success, #10b981)"
            class="transition-all duration-300"
          />
        {:else}
          <!-- Solid Slices -->
          <path
            d={viewsPath}
            fill="var(--theme-primary, #2563eb)"
            class="transition-all duration-300 hover:opacity-90 cursor-pointer"
          />
          <path
            d={clicksPath}
            fill="var(--success, #10b981)"
            class="transition-all duration-300 hover:opacity-90 cursor-pointer"
          />
        {/if}
      </svg>
    </div>

    <!-- Legend -->
    <div class="w-full grid grid-cols-2 gap-3 max-w-xs">
      <div class="p-2.5 rounded-xl bg-nested/50 border border-light flex items-center gap-2.5">
        <span class="w-3 h-3 rounded-full bg-primary flex-shrink-0"></span>
        <div class="min-w-0">
          <span class="text-2xs uppercase tracking-wider text-muted font-bold block truncate">Kunjungan</span>
          <div class="flex items-baseline gap-1">
            <span class="font-mono font-bold text-main text-sm">
              {trafficData.periodViews.toLocaleString('id-ID')}
            </span>
            <span class="text-2xs text-secondary font-mono">({viewsPercentage}%)</span>
          </div>
        </div>
      </div>

      <div class="p-2.5 rounded-xl bg-nested/50 border border-light flex items-center gap-2.5">
        <span class="w-3 h-3 rounded-full bg-success flex-shrink-0"></span>
        <div class="min-w-0">
          <span class="text-2xs uppercase tracking-wider text-muted font-bold block truncate">Klik WA</span>
          <div class="flex items-baseline gap-1">
            <span class="font-mono font-bold text-main text-sm">
              {trafficData.periodClicks.toLocaleString('id-ID')}
            </span>
            <span class="text-2xs text-secondary font-mono">({clicksPercentage}%)</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Card Footer Metrics -->
  <div class="px-5 py-3.5 sm:px-6 bg-nested/50 border-t border-light flex items-center justify-between gap-4">
    <div>
      <span class="text-xs uppercase tracking-wider text-muted font-bold block">
        Tingkat Konversi
      </span>
      <span class="font-mono font-bold text-primary">
        {trafficData.periodConversion}%
      </span>
    </div>
    <div class="text-right">
      <span class="text-xs uppercase tracking-wider text-muted font-bold block">
        Total Interaksi
      </span>
      <span class="font-mono font-bold text-main">
        {totalInteractions.toLocaleString('id-ID')}
      </span>
    </div>
  </div>
</Card>
