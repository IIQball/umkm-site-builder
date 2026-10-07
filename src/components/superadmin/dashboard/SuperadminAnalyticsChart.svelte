<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type ApexCharts from 'apexcharts';
  import { INDONESIAN_MONTHS, filterByPeriod } from '@/lib/utils/format';
  import { formatSmartIDR } from '@/lib/currency';

  export let allTransactions: Array<{
    id: string;
    amount: number;
    adminFee: number | null;
    status: string;
    createdAt: string | Date;
  }> = [];

  export let allUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string | Date;
  }> = [];

  export let selectedYear: number = new Date().getFullYear();
  export let selectedMonth: number | 'all' = 'all';

  let finChartEl: HTMLDivElement;
  let donutChartEl: HTMLDivElement;
  let finChart: ApexCharts | null = null;
  let donutChart: ApexCharts | null = null;
  let ApexCtor: typeof ApexCharts | null = null;
  let themeObserver: MutationObserver | null = null;
  let isMounted = false;

  $: isPaid = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    return s === 'paid' || s === 'success' || s === 'completed';
  };

  $: filteredTransactions = filterByPeriod(
    allTransactions,
    selectedYear,
    selectedMonth,
    (t) => t.createdAt
  );

  $: filteredUsers = filterByPeriod(
    allUsers,
    selectedYear,
    selectedMonth,
    (u) => u.createdAt
  );

  $: paidTx = filteredTransactions.filter((t) => isPaid(t.status));
  $: totalGrossVolume = paidTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  $: totalPlatformFee = paidTx.reduce((sum, t) => sum + Number(t.adminFee || 0), 0);

  // Compute breakdown role pengguna
  $: tenantCount = filteredUsers.filter((u) => u.role === 'tenant').length;
  $: designerCount = filteredUsers.filter((u) => u.role === 'designer').length;
  $: adminCount = filteredUsers.filter((u) => u.role === 'admin').length;
  $: superadminCount = filteredUsers.filter((u) => u.role === 'superadmin').length;

  $: userRoleSeries = [tenantCount, designerCount, adminCount, superadminCount];

  // Helper compute period points for ApexCharts (Bar & Area)
  $: chartDataPoints = (() => {
    const points: Array<{ label: string; fee: number; volume: number }> = [];

    if (selectedMonth === 'all') {
      for (let m = 0; m < 12; m++) {
        const start = new Date(selectedYear, m, 1, 0, 0, 0, 0);
        const end = new Date(selectedYear, m + 1, 0, 23, 59, 59, 999);

        const mTx = allTransactions.filter((t) => {
          const d = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
          return d >= start && d <= end && isPaid(t.status);
        });

        const fee = mTx.reduce((sum, t) => sum + Number(t.adminFee || 0), 0);
        const volume = mTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);

        points.push({
          label: INDONESIAN_MONTHS[m],
          fee,
          volume,
        });
      }
    } else {
      const monthIdx = selectedMonth - 1;
      const days = new Date(selectedYear, selectedMonth, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const start = new Date(selectedYear, monthIdx, d, 0, 0, 0, 0);
        const end = new Date(selectedYear, monthIdx, d, 23, 59, 59, 999);

        const dTx = allTransactions.filter((t) => {
          const dt = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
          return dt >= start && dt <= end && isPaid(t.status);
        });

        const fee = dTx.reduce((sum, t) => sum + Number(t.adminFee || 0), 0);
        const volume = dTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);

        points.push({
          label: String(d),
          fee,
          volume,
        });
      }
    }

    return points;
  })();

  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');
    return {
      isDark,
      text: isDark ? '#94a3b8' : '#64748b',
      title: isDark ? '#f8fafc' : '#0f172a',
      border: isDark ? '#334155' : '#e2e8f0',
      tooltipTheme: (isDark ? 'dark' : 'light') as 'dark' | 'light',
      // Redupkan warna pada mode gelap agar lembut dan konsisten dengan StatCard
      financialColors: isDark ? ['#38BDF8', '#B90162'] : ['#00A3EF', '#FC018B'],
      donutColors: isDark
        ? ['#38BDF8', '#6F00A0', '#FDA201', '#B90162']
        : ['#00A3EF', '#9A00DD', '#FECF02', '#FC018B'],
    };
  }

  function buildFinancialChartOptions(): ApexCharts.ApexOptions {
    const theme = getThemeColors();
    const categories = chartDataPoints.map((p) => p.label);
    const feeData = chartDataPoints.map((p) => p.fee);
    const volumeData = chartDataPoints.map((p) => p.volume);

    return {
      chart: {
        type: 'line',
        height: 320,
        background: 'transparent',
        fontFamily: 'inherit',
        toolbar: { show: false },
        animations: { enabled: true, speed: 400 },
      },
      stroke: {
        width: [0, 3],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          borderRadius: 6,
        },
      },
      series: [
        {
          name: 'Gross Volume (Omzet)',
          type: 'column',
          data: volumeData,
        },
        {
          name: 'Fee Platform',
          type: 'area',
          data: feeData,
        },
      ],
      colors: theme.financialColors,
      fill: {
        opacity: theme.isDark ? [0.3, 0.2] : [0.35, 0.25],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: theme.isDark ? 0.4 : 0.5,
          opacityTo: 0.05,
        },
      },
      xaxis: {
        categories,
        labels: {
          style: { colors: theme.text, fontSize: '11px', fontWeight: 600 },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: [
        {
          labels: {
            style: { colors: theme.text, fontSize: '11px' },
            formatter: (v) => formatSmartIDR(v),
          },
        },
      ],
      grid: {
        borderColor: theme.border,
        strokeDashArray: 4,
        padding: { left: 10, right: 10 },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: theme.title },
        markers: { size: 6 },
      },
      tooltip: {
        theme: theme.tooltipTheme,
        shared: true,
        intersect: false,
        y: {
          formatter: (v) => formatSmartIDR(v),
        },
      },
      dataLabels: { enabled: false },
      noData: { text: 'Belum ada data transaksi' },
    };
  }

  function buildDonutChartOptions(): ApexCharts.ApexOptions {
    const theme = getThemeColors();

    return {
      chart: {
        type: 'donut',
        height: 280,
        background: 'transparent',
        fontFamily: 'inherit',
      },
      series: userRoleSeries,
      labels: ['Merchant (Tenant)', 'Desainer Template', 'Admin Pendamping', 'Super Admin'],
      colors: theme.donutColors,
      legend: {
        position: 'bottom',
        labels: { colors: theme.title },
        fontSize: '12px',
        itemMargin: { horizontal: 8, vertical: 4 },
      },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Pengguna',
                color: theme.text,
                formatter: () => `${filteredUsers.length}`,
              },
            },
          },
        },
      },
      tooltip: {
        theme: theme.tooltipTheme,
        y: {
          formatter: (val) => `${val} akun`,
        },
      },
      dataLabels: { enabled: false },
    };
  }

  async function renderCharts() {
    if (!isMounted || !ApexCtor) return;

    if (finChartEl) {
      const finOpts = buildFinancialChartOptions();
      if (finChart) {
        await finChart.updateOptions(finOpts, true, true);
      } else {
        finChart = new ApexCtor(finChartEl, finOpts);
        await finChart.render();
      }
    }

    if (donutChartEl) {
      const donutOpts = buildDonutChartOptions();
      if (donutChart) {
        await donutChart.updateOptions(donutOpts, true, true);
      } else {
        donutChart = new ApexCtor(donutChartEl, donutOpts);
        await donutChart.render();
      }
    }
  }

  $: if (isMounted && chartDataPoints && userRoleSeries) {
    renderCharts();
  }

  onMount(async () => {
    isMounted = true;
    const mod = await import('apexcharts');
    ApexCtor = mod.default;

    await renderCharts();

    themeObserver = new MutationObserver(() => {
      renderCharts();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });
  });

  onDestroy(() => {
    themeObserver?.disconnect();
    finChart?.destroy();
    donutChart?.destroy();
    finChart = null;
    donutChart = null;
  });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Executive Financial & Volume Chart (2 Columns Wide) -->
  <div class="lg:col-span-2 bg-card border border-light rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-light">
      <div>
        <h3 class="text-heading-sm text-main font-bold font-heading">
          Performa Finansial & Volume Platform
        </h3>
        <p class="text-xs text-secondary mt-0.5 font-sans">
          Grafik kombinasi Gross Volume omzet dan Fee Pendapatan Platform
        </p>
      </div>

      <div class="flex items-center gap-4 text-xs font-mono">
        <div class="text-right">
          <span class="text-3xs uppercase tracking-wider text-muted block font-sans">Gross Volume</span>
          <span class="font-bold text-main">{formatSmartIDR(totalGrossVolume)}</span>
        </div>
        <div class="h-6 w-px bg-light"></div>
        <div class="text-right">
          <span class="text-3xs uppercase tracking-wider text-muted block font-sans">Fee Bersih</span>
          <span class="font-bold text-secondary">{formatSmartIDR(totalPlatformFee)}</span>
        </div>
      </div>
    </div>

    <!-- Chart Canvas -->
    <div class="pt-4 min-h-[320px] relative">
      <div bind:this={finChartEl}></div>
    </div>
  </div>

  <!-- User Role Distribution Donut Chart (1 Column Wide) -->
  <div class="bg-card border border-light rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
    <div class="pb-4 border-b border-light">
      <h3 class="text-heading-sm text-main font-bold font-heading">
        Distribusi Peran Pengguna
      </h3>
      <p class="text-xs text-secondary mt-0.5 font-sans">
        Proporsi akun berdasarkan peran di sistem
      </p>
    </div>

    <!-- Donut Chart Canvas -->
    <div class="pt-4 min-h-[280px] flex items-center justify-center">
      <div bind:this={donutChartEl} class="w-full"></div>
    </div>
  </div>
</div>
