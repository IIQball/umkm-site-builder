<script lang="ts">
  import { StatCard } from "@/components/ui";
  import { formatSmartIDR } from "@/lib/currency";
  import { formatNumber } from "@/lib/utils/format";
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

<!-- 6 Stat Cards Layout (3 Kolom x 2 Baris sesuai Standar Platform Settings) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  <!-- Card 1: Total Transaksi / Eksekusi (Dark Theme) -->
  <StatCard
    label="TOTAL EKSEKUSI"
    value={summary.totalExecutions}
    rawValue={summary.totalExecutions}
    icon="smart_toy"
    cardTheme="dark"
    badge="Semua Status"
    footerText="Akumulasi pada periode ini"
    delayClass="delay-75"
  />

  <!-- Card 2: Transaksi Lunas / Berhasil (Default White Theme) -->
  <StatCard
    label="GENERASI BERHASIL"
    value={statusCounts.success}
    rawValue={statusCounts.success}
    icon="check_circle"
    cardTheme="default"
    badge="Sukses"
    footerText={`Rasio sukses: ${summary.successRate}%`}
    delayClass="delay-100"
  />

  <!-- Card 3: Fee Platform / Biaya AI (Blue Theme) -->
  <StatCard
    label="BIAYA GENERASI AI"
    value={formattedCostIdr}
    rawValue={summary.totalCostIdr}
    icon="payments"
    cardTheme="blue"
    badge="Estimasi Biaya"
    footerText="Akumulasi komputasi AI"
    delayClass="delay-150"
  />

  <!-- Card 4: Menunggu / Gagal (Orange/Pink Theme) -->
  <StatCard
    label="MENUNGGU / GAGAL"
    value={failedOrPendingCount}
    rawValue={failedOrPendingCount}
    icon="hourglass_top"
    cardTheme="orange"
    badge="Perlu Perhatian"
    footerText={`${statusCounts.failed} gagal, ${statusCounts.pending + statusCounts.processing} antrean`}
    delayClass="delay-200"
  />

  <!-- Card 5: Total Token Konsumsi (Dark Theme) -->
  <StatCard
    label="TOTAL TOKEN KONSUMSI"
    value={summary.totalTokens || 0}
    rawValue={summary.totalTokens || 0}
    valueSuffix="Token"
    icon="data_usage"
    cardTheme="dark"
    badge="Volume Token"
    footerText={`In: ${formatNumber(summary.totalInputTokens || 0)} • Out: ${formatNumber(summary.totalOutputTokens || 0)}`}
    delayClass="delay-250"
  />

  <!-- Card 6: Sisa Token Terkini (Default White Theme) -->
  <StatCard
    label="SISA TOKEN TERKINI"
    value={summary.remainingTokens || 0}
    rawValue={summary.remainingTokens || 0}
    valueSuffix="Token"
    icon="toll"
    cardTheme="default"
    badge="Saldo Aktif"
    footerText={`Saldo: $${(summary.remainingDepositUsd || 0).toFixed(2)} (${formattedRemainingIdr})`}
    delayClass="delay-300"
  />
</div>

