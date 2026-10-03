<script lang="ts">
  import AdminPeriodFilter from './AdminPeriodFilter.svelte';
  import AdminKeyMetrics from './AdminKeyMetrics.svelte';
  import AdminMerchantGrowthChart from '../growth/AdminMerchantGrowthChart.svelte';
  import AdminFeeRevenueChart from '../growth/AdminFeeRevenueChart.svelte';
  import AdminRecentTransactionsCard from './AdminRecentTransactionsCard.svelte';
  import AdminRecentMerchantsCard from './AdminRecentMerchantsCard.svelte';
  import { calculateMerchantGrowth } from '../growth/merchantGrowth.helpers';
  import { calculateFeeRevenueGrowth } from '../growth/feeRevenue.helpers';

  export let allTenants: Array<{
    id: string;
    name: string | null;
    email: string;
    createdAt: string | Date;
    storeId?: string | null;
    storeName?: string | null;
    storeStatus?: string | null;
  }> = [];

  export let allTransactions: Array<{
    id: string;
    externalId?: string | null;
    amount: number;
    adminFee: number | null;
    status: string;
    type: string;
    createdAt: string | Date;
    templateId?: string | null;
    templateName: string | null;
    templateThumbnailUrl?: string | null;
    merchantName: string | null;
    storeName: string | null;
  }> = [];

  export let availableBalance: number = 0;
  export let userCreatedYear: number = new Date().getFullYear();

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | 'all' = 'all';

  $: availableYears = (() => {
    let earliest = userCreatedYear || currentYear;
    for (const t of allTenants) {
      const y = new Date(t.createdAt).getFullYear();
      if (!isNaN(y) && y < earliest && y >= 2020) earliest = y;
    }
    for (const tx of allTransactions) {
      const y = new Date(tx.createdAt).getFullYear();
      if (!isNaN(y) && y < earliest && y >= 2020) earliest = y;
    }
    const years: number[] = [];
    for (let y = earliest; y <= currentYear; y++) {
      years.push(y);
    }
    return years.sort((a, b) => b - a);
  })();

  $: startPeriod =
    selectedMonth === 'all'
      ? new Date(selectedYear, 0, 1, 0, 0, 0, 0)
      : new Date(selectedYear, (selectedMonth as number) - 1, 1, 0, 0, 0, 0);

  $: endPeriod =
    selectedMonth === 'all'
      ? new Date(selectedYear, 11, 31, 23, 59, 59, 999)
      : new Date(selectedYear, selectedMonth as number, 0, 23, 59, 59, 999);

  $: filteredTenants = allTenants.filter((t) => {
    const d = new Date(t.createdAt);
    return d >= startPeriod && d <= endPeriod;
  });

  $: filteredTransactions = allTransactions.filter((t) => {
    const d = new Date(t.createdAt);
    return d >= startPeriod && d <= endPeriod;
  });

  $: isPaid = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    return s === 'paid' || s === 'success' || s === 'completed';
  };

  $: totalMerchantsCount = filteredTenants.length;
  $: activeStoresCount = filteredTenants.filter(
    (t) => t.storeStatus === 'published' || t.storeStatus === 'active'
  ).length;
  $: draftStoresCount = filteredTenants.filter(
    (t) => t.storeId && t.storeStatus !== 'published' && t.storeStatus !== 'active'
  ).length;
  $: noStoreCount = filteredTenants.filter((t) => !t.storeId).length;
  $: needsSetupCount = draftStoresCount + noStoreCount;

  $: paidTransactions = filteredTransactions.filter((t) => isPaid(t.status));
  $: totalEarnedCommission = paidTransactions.reduce(
    (sum, t) => sum + Number(t.adminFee || 0),
    0
  );

  $: merchantGrowthData = calculateMerchantGrowth(
    allTenants.map((t) => ({ id: t.id, createdAt: t.createdAt })),
    { year: selectedYear, month: selectedMonth }
  );

  $: feeRevenueData = calculateFeeRevenueGrowth(
    allTransactions
      .filter((t) => isPaid(t.status))
      .map((t) => ({
        amount: Number(t.adminFee || 0),
        createdAt: t.createdAt,
      })),
    { year: selectedYear, month: selectedMonth }
  );

  $: recentMerchants = filteredTenants.slice(0, 5).map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    createdAt: t.createdAt,
    storeName: t.storeName || null,
    storeStatus: t.storeStatus || null,
    storeId: t.storeId || null,
  }));

  $: recentTransactions = filteredTransactions.slice(0, 5).map((t) => ({
    id: t.id,
    externalId: t.externalId,
    amount: Number(t.amount),
    adminFee: Number(t.adminFee || 0),
    status: t.status,
    createdAt: t.createdAt,
    templateId: t.templateId,
    templateName: t.templateName,
    templateThumbnailUrl: t.templateThumbnailUrl,
    merchantName: t.merchantName || 'Merchant',
    storeName: t.storeName || 'Toko Merchant',
  }));
</script>

<div class="space-y-8">
  <!-- Baris 0: Filter Bar Periode (Tahun & Bulan) -->
  <AdminPeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
  />

  <!-- Baris 1: Ringkasan Metrik Kunci (4 Statcard seragam dengan /admin/transactions) -->
  <AdminKeyMetrics
    {totalMerchantsCount}
    {activeStoresCount}
    {needsSetupCount}
    {totalEarnedCommission}
    {availableBalance}
  />

  <!-- Baris 2: Dua Grafik Analitik Pertumbuhan & Pendapatan -->
  <div class="space-y-6">
    <AdminMerchantGrowthChart growthData={merchantGrowthData} />
    <AdminFeeRevenueChart revenueData={feeRevenueData} />
  </div>

  <!-- Baris 3: Aktivitas Terkini (5 Data Terbaru Sesuai Periode Terpilih) -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    <AdminRecentTransactionsCard transactions={recentTransactions} />
    <AdminRecentMerchantsCard merchants={recentMerchants} />
  </div>
</div>
