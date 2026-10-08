<script lang="ts">
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import { StatCard } from '@/components/ui';
  import OrderHistoryTable from '@/components/dashboard/OrderHistoryTable.svelte';
  import { filterByPeriod, computeAvailableYears } from '@/lib/utils/format';
  import { formatSmartIDR } from '@/lib/currency';
  import type { OrderTransactionItem } from '@/types/finance';

  export let allTransactions: OrderTransactionItem[] = [];
  export let pagination: { currentPage: number; totalItems: number; pageSize: number; totalPages: number } | undefined = undefined;

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

  $: totalPaidVolume = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  $: totalAdminFeeEarned = paidOrders.reduce((sum, o) => sum + (o.adminFee || 0), 0);

  $: formattedPaidVolume = formatSmartIDR(totalPaidVolume);
  $: formattedAdminFee = formatSmartIDR(totalAdminFeeEarned);
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Period Filter -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Transaksi Admin"
    description="Sesuaikan seluruh pesanan template binaan, omset penjualan, dan fee pendampingan berdasarkan periode waktu."
  />

  <!-- Reactive Statcards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      label="Total Transaksi"
      value={filteredTransactions.length}
      rawValue={filteredTransactions.length}
      icon="receipt_long"
      cardTheme="dark"
      badge="Semua Invoice"
      footerText="Akumulasi pada periode ini"
      delayClass="delay-100"
    />
    <StatCard
      label="Transaksi Sukses"
      value={paidOrders.length}
      rawValue={paidOrders.length}
      icon="check_circle"
      cardTheme="default"
      badge="Lunas"
      footerText="Pembayaran telah diverifikasi"
      delayClass="delay-150"
    />
    <StatCard
      label="Fee Pendampingan"
      value={formattedAdminFee}
      rawValue={totalAdminFeeEarned}
      icon="payments"
      cardTheme="blue"
      badge="Fee Bersih"
      footerText={`Dari omset ${formattedPaidVolume}`}
      delayClass="delay-200"
    />
    <StatCard
      label="Menunggu Pembayaran"
      value={pendingOrders.length}
      rawValue={pendingOrders.length}
      icon="hourglass_top"
      cardTheme="orange"
      badge="Pending"
      footerText="Menunggu pembayaran merchant"
      delayClass="delay-250"
    />
  </div>

  <!-- Interactive Table -->
  <div class="animate-fade-in-up delay-300">
    <OrderHistoryTable
      initialOrders={filteredTransactions}
      {pagination}
      isAdmin={true}
      isReadOnly={false}
      tableTitle="Riwayat Transaksi & Pembelian Template"
      tableSubtitle="Daftar seluruh pesanan template toko merchant binaan, rincian biaya lisensi, fee jasa pendampingan, dan faktur resmi."
    />
  </div>
</div>
