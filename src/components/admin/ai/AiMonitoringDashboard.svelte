<script lang="ts">
  import PeriodFilter from "@/components/common/PeriodFilter.svelte";
  import { filterByPeriod, computeAvailableYears } from "@/lib/utils/format";
  import type {
    AiMonitoringDashboardData,
    AiMonitoringSummary,
  } from "@/types/admin/ai-monitoring.types";
  import AiKeyMetrics from "./AiKeyMetrics.svelte";
  import AiRecentLogsTable from "./AiRecentLogsTable.svelte";
  import AiTestAuditTable from "./AiTestAuditTable.svelte";

  export let initialData: AiMonitoringDashboardData;

  let activeTab: 'recent' | 'audit' = 'recent';
  let summary: AiMonitoringSummary = initialData.summary;
  let recentLogs = initialData.recentLogs || [];
  let isRefreshing = false;

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | "all" = "all";

  $: availableYears = computeAvailableYears(recentLogs, (l) => l.createdAt);

  $: filteredLogs = filterByPeriod(
    recentLogs,
    selectedYear,
    selectedMonth,
    (l) => l.createdAt,
  );

  // When period filtering is applied and logs exist, recalculate metrics dynamically
  $: activeSummary =
    selectedMonth !== "all" && recentLogs.length > 0
      ? {
          totalExecutions: filteredLogs.length,
          totalCostIdr: filteredLogs.reduce(
            (acc, l) => acc + (l.costIdr || 0),
            0,
          ),
          totalCostUsd: filteredLogs.reduce(
            (acc, l) => acc + (l.costUsd || 0),
            0,
          ),
          totalInputTokens: filteredLogs.reduce(
            (acc, l) => acc + (l.inputTokens || 0),
            0,
          ),
          totalOutputTokens: filteredLogs.reduce(
            (acc, l) => acc + (l.outputTokens || 0),
            0,
          ),
          totalTokens: filteredLogs.reduce(
            (acc, l) => acc + (l.inputTokens || 0) + (l.outputTokens || 0),
            0,
          ),
          statusCounts: {
            success: filteredLogs.filter((l) => l.status === "success").length,
            failed: filteredLogs.filter((l) => l.status === "failed").length,
            pending: filteredLogs.filter((l) => l.status === "pending").length,
            processing: filteredLogs.filter((l) => l.status === "processing")
              .length,
          },
          successRate:
            filteredLogs.length > 0
              ? Number(
                  (
                    (filteredLogs.filter((l) => l.status === "success").length /
                      filteredLogs.length) *
                    100
                  ).toFixed(1),
                )
              : 0,
        }
      : summary;

  const handleRefresh = async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
      const response = await fetch("/api/admin/ai/summary");
      if (response.ok) {
        const json = await response.json();
        if (json.ok && json.data) {
          summary = json.data;
        }
      }
    } catch (err) {
      console.error("[AiMonitoringDashboard] Failed to refresh summary:", err);
    } finally {
      isRefreshing = false;
    }
  };
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Period Filter (Identical to superadmin/transactions) -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Monitoring AI"
    description="Sesuaikan seluruh riwayat dan statistik komputasi AI platform berdasarkan periode waktu."
  />

  <!-- Reactive Statcards Grid (4 cards: Dark, Default White, Blue, Pink) -->
  <AiKeyMetrics summary={activeSummary} />

  <!-- Navigation Tab between Recent Logs and Test Audit Table -->
  <div class="flex items-center gap-2 border-b border-light pb-2">
    <button
      type="button"
      class="px-4 py-2 text-sm font-semibold rounded-xl transition-all {activeTab === 'recent' ? 'bg-main text-canvas shadow-xs' : 'text-secondary hover:text-main hover:bg-nested'}"
      on:click={() => { activeTab = 'recent'; }}
    >
      Log Aktivitas Terbaru
    </button>
    <button
      type="button"
      class="px-4 py-2 text-sm font-semibold rounded-xl transition-all {activeTab === 'audit' ? 'bg-main text-canvas shadow-xs' : 'text-secondary hover:text-main hover:bg-nested'}"
      on:click={() => { activeTab = 'audit'; }}
    >
      Audit Log Pengujian (Testing)
    </button>
  </div>

  <!-- Interactive Table Views -->
  <div class="animate-fade-in-up delay-300">
    {#if activeTab === 'recent'}
      <AiRecentLogsTable
        logs={filteredLogs}
        {isRefreshing}
        on:refresh={handleRefresh}
      />
    {:else}
      <AiTestAuditTable defaultIsTesting="true" />
    {/if}
  </div>
</div>

