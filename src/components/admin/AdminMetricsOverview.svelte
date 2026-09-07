<script lang="ts">
  import { onMount } from 'svelte';
  import { StatCard, Card, Button } from '@/components/ui';
  import { formatIDR, formatDate } from '@/lib/utils/format';
  import { toast } from '@/lib/toast';

  let loading = true;
  let metrics = {
    totalTransactions: 0,
    totalRevenue: 0,
    totalActivityLogs: 0,
    uniqueActiveUsers: 0,
    pendingTemplates: 0,
    pendingPayouts: 0,
    recentTransactions: [] as any[],
    recentActivities: [] as any[],
  };

  onMount(async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const json = await res.json();
      if (res.ok && json.ok) {
        metrics = json.data;
      } else {
        toast.error(json.error?.message || 'Gagal memuat metrik admin');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem saat memuat metrik');
    } finally {
      loading = false;
    }
  });

  $: transactionCard = {
    label: 'Total Transaksi',
    value: `${metrics.totalTransactions}`,
    rawValue: metrics.totalTransactions,
    badge: 'Seluruh Waktu',
    icon: 'receipt_long',
    cardTheme: 'dark' as const,
    footerText: 'Total transaksi tercatat',
    delayClass: 'delay-100',
  };

  $: revenueCard = {
    label: 'Total Pendapatan',
    value: formatIDR(metrics.totalRevenue),
    rawValue: metrics.totalRevenue,
    badge: 'Transaksi Sukses',
    icon: 'account_balance_wallet',
    cardTheme: 'orange' as const,
    footerText: 'Akumulasi transaksi berhasil',
    delayClass: 'delay-150',
  };

  $: activityCard = {
    label: 'Log Aktivitas',
    value: `${metrics.totalActivityLogs}`,
    rawValue: metrics.totalActivityLogs,
    badge: 'Seluruh Sistem',
    icon: 'local_activity',
    cardTheme: 'blue' as const,
    footerText: 'Aktivitas terekam di sistem',
    delayClass: 'delay-200',
  };

  $: userCard = {
    label: 'Pengguna Aktif',
    value: `${metrics.uniqueActiveUsers}`,
    rawValue: metrics.uniqueActiveUsers,
    badge: 'Unik',
    icon: 'group',
    cardTheme: 'default' as const,
    footerText: 'Pengguna yang melakukan aktivitas',
    delayClass: 'delay-250',
  };

  // Helper to format action text elegantly
  function formatActionText(action: string) {
    const text = action.replace(/_/g, ' ').toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
</script>

<div class="space-y-8">
  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {#each Array(4) as _}
        <div class="w-full h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
      {/each}
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="w-full h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse lg:col-span-2"></div>
      <div class="w-full h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
    </div>
  {:else}
    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div class="w-full h-full">
        <StatCard {...transactionCard} />
      </div>
      <div class="w-full h-full">
        <StatCard {...revenueCard} />
      </div>
      <div class="w-full h-full">
        <StatCard {...activityCard} />
      </div>
      <div class="w-full h-full">
        <StatCard {...userCard} />
      </div>
    </div>

    <!-- Bento Grid Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Removed Transactions List to keep dashboard cleaner -->
      <div class="lg:col-span-2 space-y-6">
        <div class="w-full h-full rounded-3xl bg-nested/50 border border-dashed border-light flex flex-col items-center justify-center p-12 text-center">
          <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-[32px]">monitoring</span>
          </div>
          <h3 class="font-bold text-main mb-2">Grafik Mutasi Transaksi</h3>
          <p class="text-sm text-secondary max-w-sm mb-6">Area ini dipersiapkan untuk integrasi grafik analitik mutasi dan pendapatan platform di masa depan.</p>
          <Button variant="primary" href="/admin/transactions">
            Lihat Detail Mutasi
          </Button>
        </div>
      </div>

      <!-- Right Column: Quick Actions & Alerts -->
      <div class="space-y-6">
        
        <!-- Action: Pending Templates -->
        <a href="/admin/templates" class="block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl animate-fade-in-up delay-400">
          <Card hoverable padding="md" variant={metrics.pendingTemplates > 0 ? 'bordered' : 'flat'} class="h-full flex items-center justify-between group {metrics.pendingTemplates > 0 ? 'border-warning/50 bg-warning/5' : 'bg-card'}">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl {metrics.pendingTemplates > 0 ? 'bg-warning text-white shadow-md shadow-warning/20' : 'bg-nested text-muted'} flex items-center justify-center transition-transform group-hover:scale-110">
                <span class="material-symbols-outlined text-[24px]">palette</span>
              </div>
              <div>
                <h4 class="font-bold text-main">Review Template</h4>
                <p class="text-sm {metrics.pendingTemplates > 0 ? 'text-warning font-medium' : 'text-secondary'}">
                  {metrics.pendingTemplates} menunggu kurasi
                </p>
              </div>
            </div>
            <span class="material-symbols-outlined text-muted group-hover:text-main transition-colors group-hover:translate-x-1">arrow_forward</span>
          </Card>
        </a>

        <!-- Action: Pending Payouts -->
        <a href="/admin/payouts" class="block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl animate-fade-in-up delay-500">
          <Card hoverable padding="md" variant={metrics.pendingPayouts > 0 ? 'bordered' : 'flat'} class="h-full flex items-center justify-between group {metrics.pendingPayouts > 0 ? 'border-primary/50 bg-primary/5' : 'bg-card'}">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl {metrics.pendingPayouts > 0 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-nested text-muted'} flex items-center justify-center transition-transform group-hover:scale-110">
                <span class="material-symbols-outlined text-[24px]">account_balance</span>
              </div>
              <div>
                <h4 class="font-bold text-main">Proses Payout</h4>
                <p class="text-sm {metrics.pendingPayouts > 0 ? 'text-primary font-medium' : 'text-secondary'}">
                  {metrics.pendingPayouts} antrean pencairan
                </p>
              </div>
            </div>
            <span class="material-symbols-outlined text-muted group-hover:text-main transition-colors group-hover:translate-x-1">arrow_forward</span>
          </Card>
        </a>

        <!-- Recent Activity Mini Feed -->
        <Card class="animate-fade-in-up delay-600" padding="md">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-muted text-[18px]">history</span>
            <h4 class="font-bold text-sm uppercase tracking-wider text-muted">Aktivitas Terkini</h4>
          </div>
          
          <div class="space-y-4">
            {#if metrics.recentActivities.length === 0}
              <p class="text-sm text-secondary italic">Belum ada aktivitas terekam.</p>
            {:else}
              {#each metrics.recentActivities as log}
                <div class="flex gap-3 items-start">
                  <div class="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <div>
                    <p class="text-sm text-main"><span class="font-semibold">{log.userName || 'Sistem'}</span> {formatActionText(log.action)}</p>
                    <p class="text-xs text-secondary">{formatDate(log.createdAt)}</p>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </Card>

      </div>
    </div>
  {/if}
</div>
