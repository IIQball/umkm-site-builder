<script lang="ts">
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import { StatCard } from '@/components/ui';
  import OrderHistoryTable from './OrderHistoryTable.svelte';
  import { filterByPeriod, computeAvailableYears } from '@/lib/utils/format';
  import { formatIDR } from '@/lib/currency';
  import type { OrderTransactionItem } from '@/types/finance';

  export let allOrders: OrderTransactionItem[] = [];

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | 'all' = 'all';

  $: availableYears = computeAvailableYears(allOrders, (o) => o.createdAt);

  $: filteredOrders = filterByPeriod(
    allOrders,
    selectedYear,
    selectedMonth,
    (o) => o.createdAt
  );

  $: isPaid = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    return s === 'paid' || s === 'success' || s === 'completed';
  };

  $: totalPaidOrders = filteredOrders.filter((o) => isPaid(o.status));
  $: totalPendingOrders = filteredOrders.filter((o) => (o.status || '').toLowerCase() === 'pending');

  $: totalSpent = totalPaidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  $: formattedTotalSpent = formatIDR(totalSpent);
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Period Filter -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Pesanan"
    description="Sesuaikan riwayat faktur tagihan dan pembelian template berdasarkan periode waktu."
  />

  <!-- Reactive Statcards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
    <StatCard
      label="Total Pesanan"
      value={filteredOrders.length}
      rawValue={filteredOrders.length}
      icon="receipt_long"
      cardTheme="dark"
      badge="Semua Transaksi"
      footerText="Riwayat seluruh invoice"
      delayClass="delay-100"
    />
    <StatCard
      label="Template Lunas"
      value={totalPaidOrders.length}
      rawValue={totalPaidOrders.length}
      icon="check_circle"
      cardTheme="default"
      badge="Lunas"
      footerText="Faktur resmi tersedia"
      delayClass="delay-150"
    />
    <StatCard
      label="Menunggu Pembayaran"
      value={totalPendingOrders.length}
      rawValue={totalPendingOrders.length}
      icon="hourglass_top"
      cardTheme="orange"
      badge="Pending"
      footerText="Selesaikan tagihan pembayaran"
      delayClass="delay-200"
    />
    <StatCard
      label="Total Pengeluaran"
      value={formattedTotalSpent}
      rawValue={totalSpent}
      icon="payments"
      cardTheme="blue"
      badge="Akumulasi"
      footerText="Total pembelian template lunas"
      delayClass="delay-250"
    />
  </div>

  <!-- Interactive Table Card -->
  <div class="animate-fade-in-up delay-300">
    <OrderHistoryTable
      initialOrders={filteredOrders}
      isAdmin={false}
      isReadOnly={false}
      tableTitle="Riwayat Tagihan & Pembelian"
      tableSubtitle="Daftar seluruh invoice pembelian template, status transaksi, dan link pembayaran."
    />
  </div>
</div>
