<script lang="ts">
  import PeriodFilter from "@/components/common/PeriodFilter.svelte";
  import { Button } from "@/components/ui";
  import { Bot, Wallet, Plus, Sparkles } from "lucide-svelte";
  import { filterByPeriod, computeAvailableYears } from "@/lib/utils/format";
  import type {
    AiMonitoringDashboardData,
    AiMonitoringSummary,
    AiDepositHistoryItem,
  } from "@/types/admin/ai-monitoring.types";
  import AiKeyMetrics from "./AiKeyMetrics.svelte";
  import AiRecentLogsTable from "./AiRecentLogsTable.svelte";
  import AiTestAuditTable from "./AiTestAuditTable.svelte";
  import AiDepositHistoryTable from "./AiDepositHistoryTable.svelte";
  import AiDepositModal from "./AiDepositModal.svelte";

  export let initialData: AiMonitoringDashboardData;
  export let isSuperAdmin: boolean = false;

  let activeTab: "logs" | "audit" | "deposits" = "logs";
  let summary: AiMonitoringSummary = initialData.summary;
  let recentLogs = initialData.recentLogs || [];
  let depositHistory: AiDepositHistoryItem[] = initialData.depositHistory || [];
  let isRefreshing = false;
  let showDepositModal = false;

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
          totalDepositUsd: summary.totalDepositUsd,
          totalDepositIdr: summary.totalDepositIdr,
          remainingDepositUsd: summary.remainingDepositUsd,
          remainingDepositIdr: summary.remainingDepositIdr,
          remainingTokens: summary.remainingTokens,
          activeExchangeRate: summary.activeExchangeRate,
        }
      : summary;

  const handleRefresh = async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
      const [summaryRes, depositsRes] = await Promise.all([
        fetch("/api/admin/ai/summary"),
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
  <!-- Period Filter -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Monitoring AI"
    description="Sesuaikan seluruh riwayat dan statistik komputasi AI platform berdasarkan periode waktu."
  />

  <!-- Reactive Statcards Grid (5 cards) -->
  <AiKeyMetrics summary={activeSummary} />

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
