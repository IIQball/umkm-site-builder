<script lang="ts">
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import SuperadminKeyMetrics from './SuperadminKeyMetrics.svelte';
  import SuperadminUserGrowthChart from './SuperadminUserGrowthChart.svelte';
  import SuperadminRevenueChart from './SuperadminRevenueChart.svelte';
  import AdminLocationMap from '@/components/admin/AdminLocationMap.svelte';
  import { calculateCountGrowth, calculateAmountGrowth } from './superadminGrowth.helpers';
  import { computeAvailableYears, filterByPeriod, formatDate } from '@/lib/utils/format';
  import { Card } from '@/components/ui';

  export let allUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string | Date;
  }> = [];

  export let allTransactions: Array<{
    id: string;
    amount: number;
    adminFee: number | null;
    status: string;
    createdAt: string | Date;
  }> = [];

  export let pendingTemplatesCount: number = 0;
  export let recentActivities: Array<{
    id: string;
    action: string;
    userName?: string | null;
    createdAt: string | Date;
  }> = [];
  export let userCreatedYear: number = new Date().getFullYear();

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | 'all' = 'all';

  $: availableYears = computeAvailableYears(
    [...allUsers, ...allTransactions],
    (i) => i.createdAt,
    userCreatedYear
  );

  $: filteredUsers = filterByPeriod(
    allUsers,
    selectedYear,
    selectedMonth,
    (u) => u.createdAt
  );

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

  $: paidTransactions = filteredTransactions.filter((t) => isPaid(t.status));
  $: totalRevenue = paidTransactions.reduce((sum, t) => sum + Number(t.adminFee || 0), 0);
  $: totalVolume = paidTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  $: userGrowthData = calculateCountGrowth(
    allUsers,
    { year: selectedYear, month: selectedMonth }
  );

  $: revenueGrowthData = calculateAmountGrowth(
    allTransactions
      .filter((t) => isPaid(t.status))
      .map((t) => ({ amount: Number(t.adminFee || 0), createdAt: t.createdAt })),
    { year: selectedYear, month: selectedMonth }
  );

  function formatActionText(action: string) {
    const text = action.replace(/_/g, ' ').toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
</script>

<div class="space-y-8">
  <!-- Baris 0: Filter Periode -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title="Filter Periode"
    description="Filter statistik dan grafik berdasarkan kurun waktu."
  />

  <!-- Baris 1: Key Metrics StatCards -->
  <SuperadminKeyMetrics
    {totalRevenue}
    {totalVolume}
    totalUsers={filteredUsers.length}
    {pendingTemplatesCount}
  />

  <!-- Baris 2: Map & Direktori Quick Card -->
  <div class="bg-card-base border border-light/60 rounded-3xl p-5 shadow-xs flex flex-col lg:flex-row gap-6">
    <div class="w-full lg:w-2/3 rounded-2xl overflow-hidden relative shadow-inner group">
      <AdminLocationMap />
    </div>
    <div class="w-full lg:w-1/3 flex flex-col justify-center gap-3">
      <h3 class="text-lg font-bold text-main font-heading flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        Peta & Titik UMKM
      </h3>
      <p class="text-sm text-secondary leading-relaxed">
        Pantau sebaran lokasi UMKM binaan di seluruh Indonesia secara interaktif. Titik menyorot lokasi UMKM aktif.
      </p>
      <div class="mt-3 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
        <a href="/umkm" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary/20 hover:scale-105 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
          Buka Direktori Publik
        </a>
      </div>
    </div>
  </div>

  <!-- Baris 3: Dua Grafik Analitik Pertumbuhan Pengguna & Pendapatan Fee Platform (Harmonis dengan Admin & Designer) -->
  <div class="space-y-6">
    <SuperadminUserGrowthChart growthData={userGrowthData} />
    <SuperadminRevenueChart growthData={revenueGrowthData} />
  </div>

  <!-- Baris 4: Log Aktivitas Terkini & Quick Actions -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card class="lg:col-span-2" padding="md">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[20px]">history</span>
          <h4 class="font-bold text-main">Aktivitas Sistem Terkini</h4>
        </div>
        <a href="/admin/audit-logs" class="text-xs font-bold text-primary hover:underline">
          Lihat Audit Log &rarr;
        </a>
      </div>

      <div class="space-y-4">
        {#if recentActivities.length === 0}
          <p class="text-sm text-secondary italic py-4">Belum ada aktivitas terekam.</p>
        {:else}
          {#each recentActivities.slice(0, 3) as log}
            <div class="flex gap-3 items-start p-2.5 rounded-xl hover:bg-nested/40 transition-colors">
              <div class="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
              <div class="flex-1">
                <p class="text-sm text-main"><span class="font-semibold">{log.userName || 'Sistem'}</span> {formatActionText(log.action)}</p>
                <p class="text-xs text-secondary mt-0.5">{formatDate(log.createdAt)}</p>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </Card>

    <div class="space-y-4">
      <a href="/superadmin/templates" class="block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl">
        <Card hoverable padding="md" variant={pendingTemplatesCount > 0 ? 'bordered' : 'flat'} class="h-full flex items-center justify-between group {pendingTemplatesCount > 0 ? 'border-warning/50 bg-warning/5' : 'bg-card'}">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl {pendingTemplatesCount > 0 ? 'bg-warning text-white shadow-md shadow-warning/20' : 'bg-nested text-muted'} flex items-center justify-center transition-transform group-hover:scale-110">
              <span class="material-symbols-outlined text-[24px]">palette</span>
            </div>
            <div>
              <h4 class="font-bold text-main">Kurasi Template</h4>
              <p class="text-sm {pendingTemplatesCount > 0 ? 'text-warning font-medium' : 'text-secondary'}">
                {pendingTemplatesCount} menanti kurasi
              </p>
            </div>
          </div>
          <span class="material-symbols-outlined text-muted group-hover:text-main transition-colors group-hover:translate-x-1">arrow_forward</span>
        </Card>
      </a>

      <a href="/superadmin/settings" class="block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl">
        <Card hoverable padding="md" class="h-full flex items-center justify-between group bg-card border border-light">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-nested text-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <span class="material-symbols-outlined text-[24px]">tune</span>
            </div>
            <div>
              <h4 class="font-bold text-main">Pengaturan Platform</h4>
              <p class="text-sm text-secondary">
                Fee komisi & pencairan
              </p>
            </div>
          </div>
          <span class="material-symbols-outlined text-muted group-hover:text-main transition-colors group-hover:translate-x-1">arrow_forward</span>
        </Card>
      </a>
    </div>
  </div>
</div>
