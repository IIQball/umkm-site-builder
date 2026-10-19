<script lang="ts">
  import PeriodFilter from "@/components/common/PeriodFilter.svelte";
  import { filterByPeriod, computeAvailableYears } from "@/lib/utils/format";
  import type {
    AiMonitoringDashboardData,
    AiMonitoringSummary,
  } from "@/types/admin/ai-monitoring.types";
  import AiKeyMetrics from "./AiKeyMetrics.svelte";
  import AiRecentLogsTable from "./AiRecentLogsTable.svelte";

  export let initialData: AiMonitoringDashboardData;

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

  <!-- Interactive Table with Search, Segmented Status Filter, and Empty State -->
  <div class="animate-fade-in-up delay-300">
    <AiRecentLogsTable
      logs={filteredLogs}
      {isRefreshing}
      on:refresh={handleRefresh}
    />
  </div>
</div>
