<script lang="ts">
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import { StatCard } from '@/components/ui';
  import OrderHistoryTable from '@/components/dashboard/OrderHistoryTable.svelte';
  import { filterByPeriod, computeAvailableYears } from '@/lib/utils/format';
  import { formatSmartIDR } from '@/lib/currency';
  import type { OrderTransactionItem } from '@/types/finance';

  export let allTransactions: OrderTransactionItem[] = [];

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | 'all' = 'all';

  $: availableYears = computeAvailableYears(allTransactions, (t) => t.createdAt);

  $: filteredTransactions = filterByPeriod(
    allTransactions,
    selectedYear,
    selectedMonth,
    (t) => t.createdAt
  );

  $: isPaid = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    return s === 'paid' || s === 'success' || s === 'completed';
  };

  $: paidOrders = filteredTransactions.filter((o) => isPaid(o.status));
  $: pendingOrders = filteredTransactions.filter((o) => (o.status || '').toLowerCase() === 'pending');
  $: failedOrders = filteredTransactions.filter((o) => !isPaid(o.status) && (o.status || '').toLowerCase() !== 'pending');

  $: totalVolume = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  $: totalAdminFee = paidOrders.reduce((sum, o) => sum + (o.adminFee || 0), 0);

  $: formattedTotalVolume = formatSmartIDR(totalVolume);
  $: formattedAdminFee = formatSmartIDR(totalAdminFee);
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Period Filter -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Transaksi"
    description="Sesuaikan seluruh riwayat transaksi pembelian template merchant di platform berdasarkan periode waktu."
  />

  <!-- Reactive Statcards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      label="Total Transaksi"
      value={filteredTransactions.length}
      rawValue={filteredTransactions.length}
      icon="receipt_long"
      cardTheme="dark"
      badge="Semua Status"
      footerText="Akumulasi pada periode ini"
      delayClass="delay-100"
    />
    <StatCard
      label="Transaksi Lunas"
      value={paidOrders.length}
      rawValue={paidOrders.length}
      icon="check_circle"
      cardTheme="default"
      badge="Lunas"
      footerText={`Total perputaran: ${formattedTotalVolume}`}
      delayClass="delay-150"
    />
    <StatCard
      label="Fee Platform/Admin"
      value={formattedAdminFee}
      rawValue={totalAdminFee}
      icon="payments"
      cardTheme="blue"
      badge="Fee Bersih"
      footerText="Fee jasa pendampingan/platform"
      delayClass="delay-200"
    />
    <StatCard
      label="Menunggu Pembayaran"
      value={pendingOrders.length}
      rawValue={pendingOrders.length}
      icon="hourglass_top"
      cardTheme="orange"
      badge="Pending"
      footerText={`${failedOrders.length} batal/gagal tercatat`}
      delayClass="delay-250"
    />
  </div>

  <!-- Interactive Table (Superadmin: View-only with full status support) -->
  <div class="animate-fade-in-up delay-300">
    <OrderHistoryTable
      initialOrders={filteredTransactions}
      isAdmin={true}
      isReadOnly={true}
      tableTitle="Riwayat Transaksi Pembelian Template"
      tableSubtitle="Daftar seluruh pesanan template platform, rincian pembayaran merchant, fee pendampingan admin, dan status invoice (hanya baca)."
    />
  </div>
</div>
