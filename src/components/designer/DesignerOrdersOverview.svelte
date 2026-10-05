<script lang="ts">
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import { StatCard } from '@/components/ui';
  import DesignerOrdersTable from './DesignerOrdersTable.svelte';
  import { filterByPeriod, computeAvailableYears } from '@/lib/utils/format';
  import { formatSmartIDR } from '@/lib/currency';
  import type { DesignerOrderItem } from '@/types/finance';

  export let allOrders: DesignerOrderItem[] = [];

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
  $: totalFailedOrders = filteredOrders.filter(
    (o) => !isPaid(o.status) && (o.status || '').toLowerCase() !== 'pending'
  );

  $: totalNetEarned = totalPaidOrders.reduce(
    (sum, o) => sum + (o.commission?.designerAmount ?? Math.round(o.amount * 0.7)),
    0
  );

  $: formattedNetIncome = formatSmartIDR(totalNetEarned);
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Period Filter -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Pesanan Masuk"
    description="Sesuaikan seluruh data pesanan template toko dari tenant berdasarkan periode waktu."
  />

  <!-- Reactive Statcards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
    <StatCard
      label="Total Pesanan"
      value={filteredOrders.length}
      rawValue={filteredOrders.length}
      icon="receipt_long"
      cardTheme="dark"
      badge="Semua Tagihan"
      footerText="Akumulasi pada periode ini"
      delayClass="delay-100"
    />
    <StatCard
      label="Hak Komisi Lunas"
      value={formattedNetIncome}
      rawValue={totalNetEarned}
      icon="payments"
      cardTheme="default"
      badge="Lunas"
      footerText="Total pendapatan bersih"
      delayClass="delay-150"
    />
    <StatCard
      label="Menunggu Pembayaran"
      value={totalPendingOrders.length}
      rawValue={totalPendingOrders.length}
      icon="hourglass_top"
      cardTheme="blue"
      badge="Pending"
      footerText="Belum diselesaikan tenant"
      delayClass="delay-200"
    />
    <StatCard
      label="Batal / Kedaluwarsa"
      value={totalFailedOrders.length}
      rawValue={totalFailedOrders.length}
      icon="cancel"
      cardTheme="orange"
      badge="Expired"
      footerText="Invoice tidak diselesaikan"
      delayClass="delay-250"
    />
  </div>

  <!-- Interactive Table Card -->
  <div class="animate-fade-in-up delay-300">
    <DesignerOrdersTable initialOrders={filteredOrders} />
  </div>
</div>
