<script lang="ts">
  import { onMount } from 'svelte';
  import { Trophy, RefreshCw, Store, Sparkles, Coins, Zap } from 'lucide-svelte';
  import { Card, Table, Badge, Button } from '@/components/ui';
  import { formatIDR, formatDate, formatNumber } from '@/lib/utils/format';
  import type { TopTenantsAiResponse } from '@/types/admin/ai-top-tenants.types';
  import {
    getRankBadgeInfo,
    getSuccessRateVariant,
    formatCompactTokens,
  } from './topMerchants.helpers';

  export let selectedYear: number | undefined = undefined;
  export let selectedMonth: number | 'all' | undefined = undefined;
  export let limit: number = 10;
  export let initialSortBy: 'cost' | 'generations' = 'cost';

  let sortBy: 'cost' | 'generations' = initialSortBy;
  let data: TopTenantsAiResponse | null = null;
  let loading: boolean = false;
  let errorMsg: string | null = null;

  const tableHeaders = [
    { key: 'rank', label: 'Rank', align: 'center' as const, width: '75px' },
    { key: 'store', label: 'Toko & Pemilik', align: 'left' as const },
    { key: 'generations', label: 'Total Generate', align: 'right' as const },
    { key: 'cost', label: 'Biaya API (IDR)', align: 'right' as const },
    { key: 'tokens', label: 'Konsumsi Token', align: 'right' as const },
    { key: 'credits', label: 'Kredit Dipakai', align: 'right' as const },
    { key: 'lastActive', label: 'Terakhir Aktif', align: 'right' as const },
  ];

  $: tenants = data?.tenants || [];
  $: summary = data?.summary || {
    totalTenants: 0,
    totalCostIdr: 0,
    totalCostUsd: 0,
    totalGenerations: 0,
    totalTokens: 0,
  };

  $: if (selectedYear !== undefined || selectedMonth !== undefined || sortBy || limit) {
    fetchTopTenants();
  }

  onMount(() => {
    fetchTopTenants();
  });

  async function fetchTopTenants() {
    loading = true;
    errorMsg = null;
    try {
      const params = new URLSearchParams();
      params.set('limit', String(limit));
      params.set('sortBy', sortBy);
      if (selectedYear) params.set('year', String(selectedYear));
      if (selectedMonth && selectedMonth !== 'all') params.set('month', String(selectedMonth));

      const res = await fetch(`/api/admin/ai/top-tenants?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal memuat data peringkat toko');
      const json = await res.json();
      if (json.ok && json.data) {
        data = json.data;
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    } finally {
      loading = false;
    }
  }

  function toggleSort(type: 'cost' | 'generations') {
    if (sortBy !== type) {
      sortBy = type;
    }
  }
</script>

<Card class="p-6 md:p-8 space-y-6 !rounded-2xl border border-light bg-card shadow-xs">
  <!-- Header & Controls -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-light">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Trophy size={20} />
        </div>
        <div>
          <h2 class="text-heading-md font-bold text-main tracking-tight font-heading">
            Peringkat Toko Paling Aktif (AI)
          </h2>
          <p class="text-body-sm text-secondary mt-0.5">
            Analitik toko berdasarkan serapan biaya komputasi API dan frekuensi generate model AI.
          </p>
        </div>
      </div>
    </div>

    <!-- Actions & Sort Filters -->
    <div class="flex items-center gap-2 flex-wrap">
      <div class="inline-flex p-1 bg-nested rounded-xl border border-light">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer {sortBy === 'cost' ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
          on:click={() => toggleSort('cost')}
        >
          Biaya Terbesar
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer {sortBy === 'generations' ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
          on:click={() => toggleSort('generations')}
        >
          Generate Terbanyak
        </button>
      </div>

      <Button
        variant="outline"
        size="sm"
        class="!rounded-xl gap-1.5 text-secondary hover:text-main cursor-pointer"
        disabled={loading}
        on:click={fetchTopTenants}
      >
        <RefreshCw size={14} class={loading ? 'animate-spin' : ''} />
        <span class="text-xs">Segarkan</span>
      </Button>
    </div>
  </div>

  <!-- Mini Summary Bar -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div class="p-3.5 rounded-xl bg-nested/60 border border-light">
      <span class="text-2xs uppercase tracking-wider text-muted font-medium font-heading">Toko Aktif</span>
      <div class="text-base font-bold text-main mt-0.5 flex items-center gap-1.5">
        <Store size={15} class="text-primary" />
        <span>{formatNumber(summary.totalTenants)} Toko</span>
      </div>
    </div>
    <div class="p-3.5 rounded-xl bg-nested/60 border border-light">
      <span class="text-2xs uppercase tracking-wider text-muted font-medium font-heading">Total Serapan Biaya</span>
      <div class="text-base font-bold text-main mt-0.5 flex items-center gap-1.5">
        <Coins size={15} class="text-warning" />
        <span>{formatIDR(summary.totalCostIdr)}</span>
      </div>
    </div>
    <div class="p-3.5 rounded-xl bg-nested/60 border border-light">
      <span class="text-2xs uppercase tracking-wider text-muted font-medium font-heading">Total Generasi</span>
      <div class="text-base font-bold text-main mt-0.5 flex items-center gap-1.5">
        <Sparkles size={15} class="text-info" />
        <span>{formatNumber(summary.totalGenerations)} Kali</span>
      </div>
    </div>
    <div class="p-3.5 rounded-xl bg-nested/60 border border-light">
      <span class="text-2xs uppercase tracking-wider text-muted font-medium font-heading">Konsumsi Token</span>
      <div class="text-base font-bold text-main mt-0.5 flex items-center gap-1.5">
        <Zap size={15} class="text-success" />
        <span>{formatCompactTokens(summary.totalTokens)} Tokens</span>
      </div>
    </div>
  </div>

  <!-- Table Container -->
  {#if errorMsg}
    <div class="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
      {errorMsg}
    </div>
  {:else if loading && tenants.length === 0}
    <div class="py-16 flex flex-col items-center justify-center text-center">
      <RefreshCw size={28} class="animate-spin text-primary mb-3" />
      <p class="text-sm text-secondary font-medium">Memuat peringkat toko...</p>
    </div>
  {:else if tenants.length === 0}
    <div class="py-16 flex flex-col items-center justify-center text-center">
      <div class="p-3 rounded-full bg-nested text-muted mb-3 border border-light">
        <Store size={28} />
      </div>
      <h3 class="text-body-base font-semibold text-main font-heading">Belum Ada Aktivitas Generasi Toko</h3>
      <p class="text-body-sm text-secondary max-w-sm mt-1">
        Belum ada riwayat konsumsi API AI oleh merchant pada periode yang dipilih.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-light overflow-hidden">
      <Table headers={tableHeaders} minWidth="min-w-[850px]">
        {#each tenants as item (item.tenantId)}
          {@const rankInfo = getRankBadgeInfo(item.rank)}
          <tr>
            <!-- Rank -->
            <td class="py-3.5 px-4 text-center">
              <Badge variant={rankInfo.variant} size="sm" dot={false} class="font-bold">
                {rankInfo.label}
              </Badge>
            </td>

            <!-- Store & Owner -->
            <td class="py-3.5 px-4">
              <div class="flex flex-col">
                <span class="font-bold text-main leading-snug">{item.storeName}</span>
                <div class="flex items-center gap-1.5 text-2xs text-secondary mt-0.5">
                  <span class="font-mono text-primary font-medium">{item.subdomain}.domain</span>
                  <span>•</span>
                  <span>{item.ownerName}</span>
                </div>
              </div>
            </td>

            <!-- Generations & Success Rate -->
            <td class="py-3.5 px-4 text-right">
              <div class="flex flex-col items-end gap-1">
                <span class="font-bold text-main">{formatNumber(item.totalGenerations)}</span>
                <Badge variant={getSuccessRateVariant(item.successRate)} size="sm" dot={true}>
                  {item.successRate}% sukses
                </Badge>
              </div>
            </td>

            <!-- Cost IDR & USD -->
            <td class="py-3.5 px-4 text-right">
              <div class="flex flex-col items-end">
                <span class="font-bold text-main">{formatIDR(item.totalCostIdr)}</span>
                <span class="text-2xs text-muted font-mono">${item.totalCostUsd.toFixed(2)}</span>
              </div>
            </td>

            <!-- Tokens -->
            <td class="py-3.5 px-4 text-right font-medium">
              {formatNumber(item.totalTokens)}
            </td>

            <!-- Credits Used & Balance -->
            <td class="py-3.5 px-4 text-right">
              <div class="flex flex-col items-end">
                <span class="font-semibold text-main">{formatNumber(item.creditsUsed)} koin</span>
                <span class="text-2xs text-muted">sisa: {formatNumber(item.creditBalance)}</span>
              </div>
            </td>

            <!-- Last Active -->
            <td class="py-3.5 px-4 text-right text-xs text-secondary whitespace-nowrap">
              {item.lastActiveAt ? formatDate(item.lastActiveAt) : '-'}
            </td>
          </tr>
        {/each}
      </Table>
    </div>
  {/if}
</Card>
