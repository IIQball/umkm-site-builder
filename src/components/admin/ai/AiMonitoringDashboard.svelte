<script lang="ts">
  import PeriodFilter from "@/components/common/PeriodFilter.svelte";
  import { Button, Badge } from "@/components/ui";
  import { Bot, Wallet, Plus, Sparkles, AlertTriangle } from "lucide-svelte";
  import { filterByPeriod, computeAvailableYears } from "@/lib/utils/format";
  import type {
    AiMonitoringDashboardData,
    AiMonitoringSummary,
    AiDepositHistoryItem,
  } from "@/types/admin/ai-monitoring.types";
  import AiKeyMetrics from "./AiKeyMetrics.svelte";
  import CostTrendChart from "./CostTrendChart.svelte";
  import AiRecentLogsTable from "./AiRecentLogsTable.svelte";
  import AiTestAuditTable from "./AiTestAuditTable.svelte";
  import AiDepositHistoryTable from "./AiDepositHistoryTable.svelte";
  import AiDepositModal from "./AiDepositModal.svelte";
  import FeatureDistributionChart from "./FeatureDistributionChart.svelte";
  import TopMerchantsAiTable from "./TopMerchantsAiTable.svelte";

  export let initialData: AiMonitoringDashboardData;
  export let isSuperAdmin: boolean = false;

  let activeTab: "logs" | "audit" | "deposits" = "logs";
  let summary: AiMonitoringSummary = initialData.summary;
  let recentLogs = initialData.recentLogs || [];
  let depositHistory: AiDepositHistoryItem[] = initialData.depositHistory || [];
  let isRefreshing = false;
  let showDepositModal = false;

  $: remainingUsd = summary?.remainingDepositUsd ?? 0;

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | "all" = "all";

  $: availableYears = computeAvailableYears(
    [...recentLogs, ...depositHistory],
    (item) => item.createdAt,
  );

  $: filteredLogs = filterByPeriod(
    recentLogs,
    selectedYear,
    selectedMonth,
    (l) => l.createdAt,
  );

  $: filteredDeposits = filterByPeriod(
    depositHistory,
    selectedYear,
    selectedMonth,
    (d) => d.createdAt,
  );

  // Reaktif memuat agregasi metrik database yang akurat saat periode filter berubah
  let lastFetchedPeriod = `${selectedYear}-${selectedMonth}`;
  $: if (selectedYear !== undefined && `${selectedYear}-${selectedMonth}` !== lastFetchedPeriod) {
    lastFetchedPeriod = `${selectedYear}-${selectedMonth}`;
    fetchSummaryForPeriod(selectedYear, selectedMonth);
  }

  async function fetchSummaryForPeriod(year?: number, month?: number | 'all') {
    try {
      const params = new URLSearchParams();
      if (year) params.set('year', String(year));
      if (month && month !== 'all') params.set('month', String(month));
      const res = await fetch(`/api/admin/ai/summary?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          summary = json.data;
        }
      }
    } catch (err) {
      console.error('[AiMonitoringDashboard] Failed to fetch period summary:', err);
    }
  }

  const handleRefresh = async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
      const params = new URLSearchParams();
      if (selectedYear) params.set('year', String(selectedYear));
      if (selectedMonth && selectedMonth !== 'all') params.set('month', String(selectedMonth));

      const [summaryRes, depositsRes] = await Promise.all([
        fetch(`/api/admin/ai/summary?${params.toString()}`),
        fetch("/api/admin/ai/deposits"),
      ]);

      if (summaryRes.ok) {
        const json = await summaryRes.json();
        if (json.ok && json.data) {
          summary = json.data;
        }
      }

      if (depositsRes.ok) {
        const json = await depositsRes.json();
        if (json.ok && Array.isArray(json.data)) {
          depositHistory = json.data;
        } else if (json.deposits) {
          depositHistory = json.deposits;
        }
      }
    } catch (err) {
      console.error("[AiMonitoringDashboard] Failed to refresh data:", err);
    } finally {
      isRefreshing = false;
    }
  };
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Peringatan Kritis Jika Saldo Token AI Platform Habis -->
  {#if remainingUsd <= 0}
    <div class="p-4 sm:p-5 rounded-3xl bg-error/10 border border-error/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div class="flex items-start gap-3.5">
        <div class="w-10 h-10 rounded-2xl bg-error/20 text-error flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle size={22} />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-sm sm:text-base font-bold text-main font-heading">
              PERINGATAN KRITIS: Saldo Kuota Token AI Platform Habis! ($0.00 USD)
            </h3>
            <Badge variant="error" size="sm" dot={false}>Darurat</Badge>
          </div>
          <p class="text-xs sm:text-body-sm text-secondary mt-1 leading-relaxed">
            Seluruh transaksi checkout paket kredit AI oleh tenant diblokir otomatis untuk mencegah overbooking. Segera lakukan top up saldo deposit AI platform agar layanan pembuatan desain visual AI tetap berjalan normal.
          </p>
        </div>
      </div>
      {#if isSuperAdmin}
        <Button variant="destructive" size="sm" class="font-bold flex-shrink-0 shadow-xs" on:click={() => (showDepositModal = true)}>
          <Plus size={16} class="mr-1" />
          <span>Top Up Deposit AI</span>
        </Button>
      {/if}
    </div>
  {:else if remainingUsd < 5}
    <div class="p-4 rounded-3xl bg-warning/10 border border-warning/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
      <div class="flex items-start gap-3.5">
        <div class="w-10 h-10 rounded-2xl bg-warning/20 text-warning flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-main font-heading">
              Perhatian: Saldo Deposit Token AI Mulai Menipis (${remainingUsd.toFixed(2)} USD Tersisa)
            </h3>
            <Badge variant="warning" size="sm" dot={false}>Perlu Perhatian</Badge>
          </div>
          <p class="text-xs text-secondary mt-0.5 leading-relaxed">
            Kapasitas kuota token AI sistem mendekati batas minimum. Pertimbangkan untuk melakukan deposit tambahan sebelum saldo habis.
          </p>
        </div>
      </div>
      {#if isSuperAdmin}
        <Button variant="secondary" size="sm" class="font-bold flex-shrink-0 shadow-xs" on:click={() => (showDepositModal = true)}>
          <Plus size={16} class="mr-1" />
          <span>Tambah Deposit</span>
        </Button>
      {/if}
    </div>
  {/if}

  <!-- Period Filter -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Monitoring AI"
    description="Sesuaikan seluruh riwayat dan statistik komputasi AI platform berdasarkan periode waktu."
  />

  <!-- Reactive Statcards Grid (5 cards) -->
  <AiKeyMetrics {summary} />

  <!-- Daily AI Cost Trends & Quota Chart -->
  <CostTrendChart />

  <!-- AI Feature Distribution Donut Chart (Requests & Rupiah) -->
  <FeatureDistributionChart
    initialData={initialData.featureDistribution}
    {selectedYear}
    {selectedMonth}
  />

  <!-- Top Active Merchants Ranking Table -->
  <TopMerchantsAiTable
    {selectedYear}
    {selectedMonth}
  />

  <!-- Tab Navigation & Action Bar -->
  <div
    class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-light pb-2"
  >
    <div class="flex items-center gap-2 overflow-x-auto">
      <Button
        variant={activeTab === 'logs' ? 'dark' : 'ghost'}
        size="sm"
        class="!rounded-xl gap-2 font-bold cursor-pointer shrink-0"
        on:click={() => (activeTab = 'logs')}
      >
        <Bot size={16} />
        <span>Log Generasi AI</span>
        <span
          class="text-2xs px-2 py-0.5 rounded-full font-bold {activeTab === 'logs'
            ? 'bg-canvas/20 text-canvas'
            : 'bg-nested text-secondary'}"
        >
          {filteredLogs.length}
        </span>
      </Button>

      <Button
        variant={activeTab === 'audit' ? 'dark' : 'ghost'}
        size="sm"
        class="!rounded-xl gap-2 font-bold cursor-pointer shrink-0"
        on:click={() => (activeTab = 'audit')}
      >
        <Sparkles size={16} />
        <span>Audit Pengujian (Testing)</span>
      </Button>

      <Button
        variant={activeTab === 'deposits' ? 'dark' : 'ghost'}
        size="sm"
        class="!rounded-xl gap-2 font-bold cursor-pointer shrink-0"
        on:click={() => (activeTab = 'deposits')}
      >
        <Wallet size={16} />
        <span>Riwayat Deposit Saldo AI</span>
        <span
          class="text-2xs px-2 py-0.5 rounded-full font-bold {activeTab === 'deposits'
            ? 'bg-canvas/20 text-canvas'
            : 'bg-nested text-secondary'}"
        >
          {filteredDeposits.length}
        </span>
      </Button>
    </div>

    {#if isSuperAdmin}
      <Button
        variant="primary"
        size="sm"
        class="!rounded-xl gap-2 font-bold shadow-xs cursor-pointer w-full sm:w-auto shrink-0"
        on:click={() => (showDepositModal = true)}
      >
        <Plus size={16} />
        <span>Catat Deposit AI</span>
      </Button>
    {/if}
  </div>

  <!-- Tables based on active tab -->
  <div class="animate-fade-in-up delay-200">
    {#if activeTab === "logs"}
      <AiRecentLogsTable
        logs={filteredLogs}
        {isRefreshing}
        on:refresh={handleRefresh}
      />
    {:else if activeTab === "audit"}
      <AiTestAuditTable defaultIsTesting="true" />
    {:else}
      <AiDepositHistoryTable
        deposits={filteredDeposits}
        {isRefreshing}
        {isSuperAdmin}
        on:refresh={handleRefresh}
        on:openDeposit={() => (showDepositModal = true)}
      />
    {/if}
  </div>

  <!-- Superadmin AI Deposit Modal -->
  {#if isSuperAdmin}
    <AiDepositModal
      bind:isOpen={showDepositModal}
      on:close={() => (showDepositModal = false)}
      on:success={handleRefresh}
    />
  {/if}
</div>