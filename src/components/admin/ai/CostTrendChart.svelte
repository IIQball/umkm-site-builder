<script lang="ts">
  import { onMount } from 'svelte';
  import { BarChart3, RefreshCw, Calendar } from 'lucide-svelte';
  import { Card, Button } from '@/components/ui';
  import { formatSmartIDR } from '@/lib/currency';
  import type { AiCostTrendsData } from '@/types/admin/ai-cost-trends.types';
  import {
    computeBarChartLayout,
    getBudgetUsageStatus,
    type BarChartPoint,
  } from './costTrendChart.helpers';
  import CostTrendMetricCards from './CostTrendMetricCards.svelte';

  export let initialData: AiCostTrendsData | null = null;

  let selectedDays: 7 | 14 | 30 = 14;
  let data: AiCostTrendsData | null = initialData;
  let isLoading = false;
  let hoveredBar: BarChartPoint | null = null;
  let hoveredIndex: number | null = null;

  $: summary = data?.summary || {
    totalSpentIdr: 0,
    totalSpentUsd: 0,
    monthlyDepositLimitIdr: 0,
    monthlyDepositLimitUsd: 0,
    remainingDepositIdr: 0,
    remainingDepositUsd: 0,
    budgetUsedPercentage: 0,
    costPerPercentUsageIdr: 0,
    costPerPercentUsageUsd: 0,
    averageDailyCostIdr: 0,
    peakDailyCostIdr: 0,
    totalTokens: 0,
    totalExecutions: 0,
    days: selectedDays,
  };

  $: dailyTrends = data?.dailyTrends || [];
  $: chartLayout = computeBarChartLayout(dailyTrends, 800, 240);
  $: budgetStatus = getBudgetUsageStatus(summary.budgetUsedPercentage);

  async function fetchTrends(days: number) {
    isLoading = true;
    try {
      const res = await fetch(`/api/admin/ai/cost-trends?days=${days}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          data = json.data;
        }
      }
    } catch (err) {
      console.error('[CostTrendChart] Failed to load trends:', err);
    } finally {
      isLoading = false;
    }
  }

  function handlePeriodChange(days: 7 | 14 | 30) {
    if (selectedDays === days && data) return;
    selectedDays = days;
    fetchTrends(days);
  }

  onMount(() => {
    if (!data) {
      fetchTrends(selectedDays);
    }
  });
</script>

<div class="space-y-5">
  <!-- Top Bar: Title & Period Filter Controls -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
        <BarChart3 size={20} />
      </div>
      <div>
        <h2 class="text-heading-sm sm:text-heading-md text-main font-bold font-heading leading-tight">
          Tren Pengeluaran Harian & Kuota AI
        </h2>
        <p class="text-body-xs text-secondary mt-0.5 font-sans">
          Monitoring fluktuasi biaya harian, rasio limit deposit, dan harga unit per 1% kuota.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 self-start sm:self-auto">
      <div class="inline-flex items-center p-1 bg-nested rounded-xl border border-light">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer {selectedDays === 7 ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
          on:click={() => handlePeriodChange(7)}
        >
          7 Hari
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer {selectedDays === 14 ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
          on:click={() => handlePeriodChange(14)}
        >
          14 Hari
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer {selectedDays === 30 ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
          on:click={() => handlePeriodChange(30)}
        >
          30 Hari
        </button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        class="!p-2 !rounded-xl text-secondary hover:text-main cursor-pointer"
        disabled={isLoading}
        on:click={() => fetchTrends(selectedDays)}
        aria-label="Refresh tren pengeluaran"
      >
        <RefreshCw size={16} class={isLoading ? 'animate-spin' : ''} />
      </Button>
    </div>
  </div>

  <!-- Metric Cards: Modular Component -->
  <CostTrendMetricCards {summary} {budgetStatus} />

  <!-- Main Bar Chart Container -->
  <Card variant="bordered" padding="none" radius="2xl" class="shadow-xs overflow-hidden">
    <div class="p-5 sm:p-6 border-b border-light flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <Calendar size={16} class="text-secondary" />
        <h3 class="text-body-sm font-bold text-main">
          Fluktuasi Biaya ({selectedDays} Hari Terakhir)
        </h3>
      </div>
      <span class="text-2xs text-muted font-mono font-medium">
        Total {summary.totalExecutions} generasi ({summary.totalTokens.toLocaleString('id-ID')} token)
      </span>
    </div>

    <div class="p-5 sm:p-6 select-none">
      <div class="w-full h-60 sm:h-64 overflow-x-auto overflow-y-hidden">
        <div class="w-full h-full min-w-[500px] relative">
          <!-- Floating Tooltip Card -->
          {#if hoveredBar}
            <div
              class="absolute -top-2 transform -translate-x-1/2 pointer-events-none bg-main/95 backdrop-blur-md text-canvas px-3.5 py-2.5 rounded-xl shadow-xl border border-border z-30 transition-all duration-150 flex flex-col items-center gap-1 min-w-[150px]"
              style="left: {(hoveredBar.x / chartLayout.svgWidth) * 100}%;"
            >
              <span class="text-2xs font-semibold text-canvas/70 uppercase tracking-wider">
                {hoveredBar.label}
              </span>
              <span class="font-mono text-body-sm font-black text-canvas">
                {formatSmartIDR(hoveredBar.costIdr)}
              </span>
              <div class="flex items-center gap-2 text-2xs text-canvas/80">
                <span>{hoveredBar.executionCount} gen ({hoveredBar.successCount} sukses)</span>
              </div>
              <span class="text-3xs font-mono text-indigo-300">
                {hoveredBar.tokens.toLocaleString('id-ID')} token
              </span>
            </div>
          {/if}

          <svg
            viewBox="0 0 800 240"
            preserveAspectRatio="none"
            class="w-full h-full overflow-visible"
            role="img"
            aria-label="Grafik batang tren pengeluaran harian AI"
          >
            <defs>
              <linearGradient id="aiBarGradDefault" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" />
                <stop offset="100%" stop-color="#4f46e5" />
              </linearGradient>
              <linearGradient id="aiBarGradHover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#818cf8" />
                <stop offset="100%" stop-color="#6366f1" />
              </linearGradient>
            </defs>

            <!-- Horizontal Grid Lines -->
            {#each chartLayout.yTicks as tick}
              <line
                x1={chartLayout.padLeft}
                y1={tick.y}
                x2={chartLayout.usableWidth + chartLayout.padLeft}
                y2={tick.y}
                stroke="currentColor"
                stroke-dasharray="3 3"
                class="text-border-light/60 dark:text-border-light/40"
                stroke-width="1"
              />
              <text
                x={chartLayout.padLeft - 8}
                y={tick.y + 3}
                text-anchor="end"
                class="text-2xs font-mono font-medium fill-muted"
              >
                {tick.label}
              </text>
            {/each}

            <!-- Bars -->
            {#each chartLayout.bars as bar, i}
              <g
                role="button"
                tabindex="0"
                aria-label="{bar.label}: {formatSmartIDR(bar.costIdr)}"
                class="cursor-pointer focus:outline-none"
                on:mouseenter={() => { hoveredBar = bar; hoveredIndex = i; }}
                on:mouseleave={() => { hoveredBar = null; hoveredIndex = null; }}
                on:focus={() => { hoveredBar = bar; hoveredIndex = i; }}
                on:blur={() => { hoveredBar = null; hoveredIndex = null; }}
              >
                <!-- Invisible wider click/hover target -->
                <rect
                  x={bar.x - 2}
                  y={chartLayout.padTop}
                  width={bar.width + 4}
                  height={chartLayout.usableHeight}
                  fill="transparent"
                />

                <!-- Visible Bar -->
                <rect
                  x={bar.x}
                  y={bar.costIdr > 0 ? bar.y : chartLayout.baselineY - 2}
                  width={bar.width}
                  height={bar.costIdr > 0 ? bar.height : 2}
                  rx={bar.width > 12 ? 4 : 2}
                  fill={hoveredIndex === i ? 'url(#aiBarGradHover)' : (bar.costIdr > 0 ? 'url(#aiBarGradDefault)' : 'currentColor')}
                  class="transition-all duration-150 {bar.costIdr === 0 ? 'text-border-light/40' : ''}"
                />

                <!-- X Axis Label -->
                <text
                  x={bar.x + bar.width / 2}
                  y={chartLayout.baselineY + 18}
                  text-anchor="middle"
                  class="text-2xs font-sans font-medium transition-colors select-none {hoveredIndex === i ? 'fill-indigo-600 font-bold' : 'fill-secondary'}"
                >
                  {selectedDays > 14 && i % 2 !== 0 ? '' : bar.label.split(' ')[0]}
                </text>
              </g>
            {/each}
          </svg>
        </div>
      </div>
    </div>
  </Card>
</div>
