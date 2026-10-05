<script lang="ts">
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import { StatCard } from '@/components/ui';
  import TemplateReviewPanel from './TemplateReviewPanel.svelte';
  import type { AdminTemplateItem } from './review/review.types';
  import { filterByPeriod, computeAvailableYears } from '@/lib/utils/format';

  export let allTemplates: AdminTemplateItem[] = [];

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | 'all' = 'all';

  $: availableYears = computeAvailableYears(allTemplates, (t) => t.createdAt);

  $: filteredTemplates = filterByPeriod(
    allTemplates,
    selectedYear,
    selectedMonth,
    (t) => t.createdAt
  );

  $: counts = {
    all: filteredTemplates.length,
    pending: filteredTemplates.filter((t) => t.status === 'pending').length,
    approved: filteredTemplates.filter((t) => t.status === 'approved').length,
    rejected: filteredTemplates.filter((t) => t.status === 'rejected').length,
  };
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Period Filter -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode Kurasi"
    description="Sesuaikan antrean pengajuan dan riwayat kurasi template berdasarkan periode waktu."
  />

  <!-- Reactive Statcards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
    <StatCard
      label="Total Pengajuan"
      value={counts.all}
      rawValue={counts.all}
      icon="palette"
      cardTheme="dark"
      badge="Koleksi"
      footerText="Seluruh template periode ini"
      delayClass="delay-100"
    />
    <StatCard
      label="Disetujui"
      value={counts.approved}
      rawValue={counts.approved}
      icon="check_circle"
      cardTheme="default"
      badge="Aktif"
      footerText="Tersedia di marketplace publik"
      delayClass="delay-150"
    />
    <StatCard
      label="Menunggu Review"
      value={counts.pending}
      rawValue={counts.pending}
      icon="hourglass_top"
      cardTheme="blue"
      badge="Antrean"
      footerText="Memerlukan tindakan kurasi"
      delayClass="delay-200"
    />
    <StatCard
      label="Ditolak / Revisi"
      value={counts.rejected}
      rawValue={counts.rejected}
      icon="cancel"
      cardTheme="orange"
      badge="Revisi"
      footerText="Perlu perbaikan oleh desainer"
      delayClass="delay-250"
    />
  </div>

  <!-- Interactive Review Panel & Table -->
  <div class="animate-fade-in-up delay-300">
    <TemplateReviewPanel initialTemplates={filteredTemplates} />
  </div>
</div>
