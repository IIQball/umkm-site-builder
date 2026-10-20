<script lang="ts">
  import { StatCard } from "@/components/ui";
  import { formatSmartIDR } from "@/lib/currency";
  import type { AiMonitoringSummary } from "@/types/admin/ai-monitoring.types";

  export let summary: AiMonitoringSummary;

  $: statusCounts = summary.statusCounts || {
    success: 0,
    failed: 0,
    pending: 0,
    processing: 0,
  };
  $: formattedCostIdr = formatSmartIDR(summary.totalCostIdr || 0);
  $: formattedRemainingIdr = formatSmartIDR(summary.remainingDepositIdr || 0);
  $: failedOrPendingCount =
    (statusCounts.failed || 0) + (statusCounts.pending || 0);
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
  <!-- 1. Sisa Token Terkini -->
  <StatCard
    label="SISA TOKEN TERKINI"
    value={summary.remainingTokens || 0}
    rawValue={summary.remainingTokens || 0}
    valueSuffix="Token"
    icon="toll"
    cardTheme="default"
    badge="Saldo Aktif"
    footerText={`Saldo: $${(summary.remainingDepositUsd || 0).toFixed(2)} (${formattedRemainingIdr})`}
    delayClass="delay-75"
  />

  <!-- 2. Total Transaksi / Eksekusi (Dark Theme) -->
  <StatCard
    label="TOTAL EKSEKUSI"
    value={summary.totalExecutions}
    rawValue={summary.totalExecutions}
    icon="smart_toy"
    cardTheme="dark"
    badge="Semua Status"
    footerText="Akumulasi pada periode ini"
    delayClass="delay-100"
  />

  <!-- 3. Transaksi Lunas / Berhasil (Default White Theme) -->
  <StatCard
    label="GENERASI BERHASIL"
    value={statusCounts.success}
    rawValue={statusCounts.success}
    icon="check_circle"
    cardTheme="default"
    badge="Sukses"
    footerText={`Rasio sukses: ${summary.successRate}%`}
    delayClass="delay-150"
  />

  <!-- 4. Fee Platform / Biaya AI (Blue Theme) -->
  <StatCard
    label="BIAYA GENERASI"
    value={formattedCostIdr}
    rawValue={summary.totalCostIdr}
    icon="payments"
    cardTheme="blue"
    badge="Estimasi Biaya"
    footerText="Akumulasi komputasi AI"
    delayClass="delay-200"
  />

  <!-- 5. Menunggu / Gagal (Orange Theme -> Pink Accent) -->
  <StatCard
    label="MENUNGGU / GAGAL"
    value={failedOrPendingCount}
    rawValue={failedOrPendingCount}
    icon="hourglass_top"
    cardTheme="orange"
    badge="Menunggu"
    footerText={`${statusCounts.failed} batal/gagal tercatat`}
    delayClass="delay-250"
  />
</div>

