<script lang="ts">
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import DesignerKeyMetrics from './DesignerKeyMetrics.svelte';
  import DesignerGrowthLineChart from './DesignerGrowthLineChart.svelte';
  import DesignerActiveTemplatesPerformanceCard from './DesignerActiveTemplatesPerformanceCard.svelte';
  import { calculateDesignerGrowth } from './designerGrowth.helpers';
  import type { DesignerTemplateRecord, DesignerCommissionRecord } from './designerDashboard.types';
  import { computeAvailableYears, filterByPeriod } from '@/lib/utils/format';

  export let allTemplates: DesignerTemplateRecord[] = [];
  export let allCommissions: DesignerCommissionRecord[] = [];
  export let availableBalance: number = 0;
  export let userCreatedYear: number = new Date().getFullYear();

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | 'all' = 'all';

  $: availableYears = computeAvailableYears(
    [...allTemplates, ...allCommissions],
    (item) => item.createdAt,
    userCreatedYear
  );

  $: filteredTemplates = filterByPeriod(
    allTemplates,
    selectedYear,
    selectedMonth,
    (t) => t.createdAt
  );

  $: filteredCommissions = filterByPeriod(
    allCommissions,
    selectedYear,
    selectedMonth,
    (c) => c.createdAt
  );

  // Metrik StatCard berdasarkan filter periode
  $: totalTemplatesCount = filteredTemplates.length;
  $: activeTemplatesCount = filteredTemplates.filter((t) => t.status === 'approved').length;
  $: draftTemplatesCount = filteredTemplates.filter((t) => t.status === 'draft').length;
  $: reviewTemplatesCount = filteredTemplates.filter(
    (t) => t.status === 'in_review' || t.status === 'pending'
  ).length;

  $: totalSalesCount = filteredCommissions.length;
  $: totalNetIncome = filteredCommissions.reduce(
    (sum, c) => sum + Number(c.designerAmount || 0),
    0
  );

  // Diagram 1: Pertumbuhan Pembuatan Template
  $: templateCreationGrowth = calculateDesignerGrowth(
    allTemplates.map((t) => ({ createdAt: t.createdAt })),
    { year: selectedYear, month: selectedMonth }
  );

  // Diagram 2: Pertumbuhan Template Terjual
  $: templateSalesGrowth = calculateDesignerGrowth(
    allCommissions.map((c) => ({ createdAt: c.createdAt })),
    { year: selectedYear, month: selectedMonth }
  );
</script>

<div class="space-y-8">
  <!-- Baris 0: Filter Bar Periode (Tahun & Bulan) -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Dasbor"
    description="Sesuaikan metrik ringkasan, diagram pertumbuhan, dan performa template berdasarkan kurun waktu tertentu."
  />

  <!-- Baris 1: Ringkasan Metrik Kunci (4 StatCard) -->
  <DesignerKeyMetrics
    {totalTemplatesCount}
    {activeTemplatesCount}
    {draftTemplatesCount}
    {reviewTemplatesCount}
    {totalSalesCount}
    {totalNetIncome}
    {availableBalance}
  />

  <!-- Baris 2: Dua Diagram Garis Pertumbuhan (Pembuatan di atas, Penjualan di bawah) -->
  <div class="space-y-6">
    <DesignerGrowthLineChart
      title="Pertumbuhan Pembuatan Template"
      subtitle="Tren kuantitas template yang Anda buat & kembangkan"
      icon="palette"
      themeColor="blue"
      growthData={templateCreationGrowth}
      totalLabel="Total Dibuat"
      unitLabel="Template"
      actionHref="/designer/templates"
      actionLabel="Kelola Template"
    />

    <DesignerGrowthLineChart
      title="Pertumbuhan Penjualan Template"
      subtitle="Tren kuantitas template yang berhasil dibeli oleh merchant"
      icon="shopping_bag"
      themeColor="emerald"
      growthData={templateSalesGrowth}
      totalLabel="Total Terjual"
      unitLabel="Penjualan"
      actionHref="/designer/orders"
      actionLabel="Riwayat Penjualan"
    />
  </div>

  <!-- Baris 3: Performa Template Aktif / Publik & Kontribusi Penjualan -->
  <div>
    <DesignerActiveTemplatesPerformanceCard
      templates={allTemplates}
      commissions={filteredCommissions}
    />
  </div>
</div>
