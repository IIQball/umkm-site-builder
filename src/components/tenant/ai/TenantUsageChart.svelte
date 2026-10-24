<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type ApexCharts from 'apexcharts';
  import Card from '@/components/ui/Card.svelte';
  import Button from '@/components/ui/Button.svelte';
  import Badge from '@/components/ui/Badge.svelte';
  import StatCard from '@/components/ui/StatCard.svelte';
  import { colors } from '@/components/tokens/colors';
  import { Zap, Sparkles, RefreshCw, ArrowUpRight, AlertCircle } from 'lucide-svelte';

  export let initialData: UsageResponseData | null = null;

  interface DailyPoint {
    date: string;
    label: string;
    dayName: string;
    fullLabel: string;
    creditsUsed: number;
    generationsCount: number;
  }

  interface UsageSummary {
    totalCreditsUsed7d: number;
    totalGenerations7d: number;
    dailyAverage: number;
    currentBalance: number;
    totalPurchased: number;
    totalUsedLifetime: number;
    highestUsageDay: {
      date: string;
      label: string;
      creditsUsed: number;
    } | null;
  }

  interface UsageResponseData {
    points: DailyPoint[];
    summary: UsageSummary;
  }

  let points: DailyPoint[] = initialData?.points ?? [];
  let summary: UsageSummary = initialData?.summary ?? {
    totalCreditsUsed7d: 0,
    totalGenerations7d: 0,
    dailyAverage: 0,
    currentBalance: 0,
    totalPurchased: 0,
    totalUsedLifetime: 0,
    highestUsageDay: null,
  };

  let loading = !initialData;
  let errorMessage = '';

  let chartEl: HTMLDivElement;
  let chart: ApexCharts | null = null;
  let ApexCtor: typeof ApexCharts | null = null;
  let abortCtrl: AbortController | null = null;
  let themeObserver: MutationObserver | null = null;

  function themeTokens() {
    const style = getComputedStyle(document.documentElement);
    const textMuted = style.getPropertyValue('--color-text-muted').trim() || '#64748b';
    const textMain = style.getPropertyValue('--color-text-main').trim() || '#0f172a';
    const primary = style.getPropertyValue('--color-primary').trim() || colors.primary.DEFAULT;
    return { textMuted, textMain, primary };
  }

  function buildChartOptions(): ApexCharts.ApexOptions {
    const { textMuted, textMain, primary } = themeTokens();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    return {
      chart: {
        type: 'bar',
        height: 280,
        background: 'transparent',
        fontFamily: 'inherit',
        toolbar: { show: false },
        animations: { enabled: true, speed: 450 },
      },
      series: [
        {
          name: 'Kredit Digunakan',
          data: points.map((p) => p.creditsUsed),
        },
      ],
      colors: [primary],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '38%',
          distributed: false,
          dataLabels: { position: 'top' },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => (val > 0 ? `${val}` : ''),
        offsetY: -20,
        style: {
          fontSize: '11px',
          fontWeight: 700,
          colors: [textMain],
        },
      },
      xaxis: {
        categories: points.map((p) => `${p.dayName} ${p.label.split(' ')[0]}`),
        axisBorder: { show: true, color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
        axisTicks: { show: false },
        labels: {
          style: { colors: textMuted, fontSize: '11px', fontWeight: 600 },
        },
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          style: { colors: textMuted, fontSize: '11px' },
          formatter: (v: number) => `${Math.round(v)}`,
        },
      },
      grid: {
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
        padding: { left: 8, right: 8, top: 12 },
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        y: {
          formatter: (val: number, opts?: { dataPointIndex: number }) => {
            const pt = points[opts?.dataPointIndex ?? 0];
            return `${val} kredit (${pt?.generationsCount ?? 0} visual)`;
          },
        },
      },
      noData: { text: 'Belum ada data pemakaian' },
    };
  }

  async function renderChart() {
    if (!chartEl || !ApexCtor || points.length === 0) return;
    const options = buildChartOptions();
    if (chart) {
      await chart.updateOptions(options, true, true);
    } else {
      chart = new ApexCtor(chartEl, options);
      await chart.render();
    }
  }

  async function fetchStats() {
    abortCtrl?.abort();
    abortCtrl = new AbortController();
    loading = true;
    errorMessage = '';

    try {
      const res = await fetch('/api/tenant/ai/usage-stats', {
        signal: abortCtrl.signal,
        credentials: 'same-origin',
      });

      if (!res.ok) {
        throw new Error(`Gagal memuat data statistik (HTTP ${res.status})`);
      }

      const json = await res.json();
      if (!json.ok || !json.data) {
        throw new Error(json?.error?.message || 'Gagal memuat riwayat penggunaan kredit');
      }

      points = json.data.points;
      summary = json.data.summary;
      await renderChart();
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      errorMessage = (err as Error).message || 'Terjadi kesalahan saat memuat grafik';
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    const mod = await import('apexcharts');
    ApexCtor = mod.default;

    if (initialData) {
      await renderChart();
    } else {
      await fetchStats();
    }

    themeObserver = new MutationObserver(() => {
      if (chart && points.length) renderChart();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
  });

  onDestroy(() => {
    abortCtrl?.abort();
    themeObserver?.disconnect();
    chart?.destroy();
    chart = null;
  });
</script>

<Card variant="bordered" padding="lg" radius="xl" class="overflow-hidden space-y-6">
  <!-- Header: Title, Design System Badge & Action Buttons -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-light">
    <div class="space-y-1">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Zap size={18} class="fill-current text-primary" />
        </div>
        <h2 class="text-heading-sm font-bold text-main tracking-tight">
          Riwayat Penggunaan Kredit AI
        </h2>
        <Badge variant="primary" size="sm" uppercase dot>7 Hari Terakhir</Badge>
      </div>
      <p class="text-xs text-muted leading-relaxed">
        Pantau frekuensi pembuatan visual dan alokasi kredit Studio AI toko Anda.
      </p>
    </div>

    <!-- Actions via Standard UI Buttons -->
    <div class="flex items-center gap-2 self-start sm:self-auto">
      <Button
        variant="secondary"
        size="sm"
        on:click={fetchStats}
        disabled={loading}
        title="Muat ulang data"
      >
        <RefreshCw size={14} class={loading ? 'animate-spin' : ''} />
      </Button>
      <Button variant="secondary" size="sm" href="/dashboard/ai">
        <Sparkles size={14} class="text-primary mr-1" />
        <span>Buka Studio AI</span>
      </Button>
      <Button variant="primary" size="sm" href="/dashboard/credits/buy">
        <span>Beli Kredit</span>
        <ArrowUpRight size={14} class="ml-1" />
      </Button>
    </div>
  </div>

  <!-- Metric Summary via UI StatCard Components -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      label="Pemakaian 7 Hari"
      value={summary.totalCreditsUsed7d}
      rawValue={summary.totalCreditsUsed7d}
      valueSuffix="kredit"
      badge="7 Hari"
      cardTheme="blue"
      footerText={`${summary.totalGenerations7d}x generasi visual`}
    />
    <StatCard
      label="Saldo Tersedia"
      value={summary.currentBalance}
      rawValue={summary.currentBalance}
      valueSuffix="kredit"
      badge={summary.currentBalance <= 1 ? 'Menipis' : 'Aktif'}
      cardTheme={summary.currentBalance <= 1 ? 'orange' : 'default'}
      footerText="Sisa saldo siap pakai"
    />
    <StatCard
      label="Rata-rata Harian"
      value={summary.dailyAverage}
      rawValue={summary.dailyAverage}
      valueSuffix="kredit/hari"
      badge="Harian"
      cardTheme="default"
      footerText="Konsistensi aktivitas toko"
    />
    <StatCard
      label="Puncak Pemakaian"
      value={summary.highestUsageDay ? summary.highestUsageDay.creditsUsed : 0}
      rawValue={summary.highestUsageDay ? summary.highestUsageDay.creditsUsed : 0}
      valueSuffix="kredit"
      badge="Puncak"
      cardTheme="dark"
      footerText={summary.highestUsageDay ? summary.highestUsageDay.label : 'Belum ada'}
    />
  </div>

  <!-- Bar Chart Canvas via ApexCharts -->
  <div class="pt-2">
    {#if loading && !points.length}
      <div class="h-64 flex items-center justify-center">
        <span class="loading loading-spinner loading-md text-primary"></span>
      </div>
    {:else if errorMessage}
      <div class="py-10 flex flex-col items-center justify-center text-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
          <AlertCircle size={22} />
        </div>
        <p class="text-sm font-semibold text-main">{errorMessage}</p>
        <Button variant="primary" size="sm" on:click={fetchStats}>Coba Lagi</Button>
      </div>
    {:else}
      <div bind:this={chartEl} class="w-full"></div>
    {/if}
  </div>
</Card>
