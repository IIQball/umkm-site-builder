<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Button, Badge } from '@/components/ui';
  import CreditRadialMeter from './CreditRadialMeter.svelte';
  import CreditMutationTable from './CreditMutationTable.svelte';
  import type {
    CreditQuotaData,
    CreditMutationItem,
    CreditHistoryResponse,
  } from './credit-gauge.types';

  export let initialData: CreditHistoryResponse | null = null;

  let quota: CreditQuotaData = initialData?.quota ?? {
    balance: 0,
    totalUsed: 0,
    totalPurchased: 0,
    initialBonus: 2,
    totalQuota: 2,
    percentage: 100,
    status: 'plenty',
  };

  let mutations: CreditMutationItem[] = initialData?.mutations ?? [];
  let loading = !initialData;
  let isRefreshing = false;
  let errorMessage = '';

  async function loadData() {
    errorMessage = '';
    try {
      const res = await fetch('/api/tenant/ai/credit-history');
      if (!res.ok) {
        throw new Error('Gagal memuat rincian kuota kredit');
      }
      const json = await res.json();
      if (json.ok && json.data) {
        quota = json.data.quota;
        mutations = json.data.mutations || [];
      }
    } catch (err: unknown) {
      errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    } finally {
      loading = false;
      isRefreshing = false;
    }
  }

  function handleRefresh() {
    isRefreshing = true;
    loadData();
  }

  onMount(() => {
    if (!initialData) {
      loadData();
    }
  });
</script>

<div class="space-y-6">
  <!-- Top Panel: Gauge & Quota Overview Card -->
  <Card variant="bordered" padding="none" radius="3xl" class="overflow-hidden bg-card border-light shadow-xs">
    <div class="p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
      <!-- Sisi Kiri: Visual Radial Gauge -->
      <div class="flex-shrink-0 flex items-center justify-center">
        <CreditRadialMeter
          balance={quota.balance}
          percentage={quota.percentage}
          status={quota.status}
          size={144}
          strokeWidth={10}
        />
      </div>

      <!-- Sisi Tengah: Metrik Statistik & Progress Bar Kuota -->
      <div class="flex-1 w-full space-y-4 text-center sm:text-left">
        <div>
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 class="text-heading-md font-bold text-main font-heading">
              Sisa Kuota Kredit AI
            </h2>
            {#if quota.status === 'critical'}
              <Badge variant="error" size="sm">Kritis</Badge>
            {:else if quota.status === 'low'}
              <Badge variant="warning" size="sm">Menipis</Badge>
            {:else if quota.status === 'empty'}
              <Badge variant="slate" size="sm">Habis</Badge>
            {:else}
              <Badge variant="success" size="sm">Tersedia</Badge>
            {/if}
          </div>
          <p class="text-body-sm text-secondary mt-1">
            Gunakan saldo kredit untuk generasi logo, visual mockup kemasan produk, dan poster promosi UMKM Anda.
          </p>
        </div>

        <!-- Linear Bar Visual Kuota -->
        <div class="space-y-1.5 max-w-xl">
          <div class="flex items-center justify-between text-xs font-semibold text-secondary">
            <span>Pemakaian: {quota.totalUsed} kredit</span>
            <span class="text-main font-bold">{quota.balance} / {quota.totalQuota} kredit</span>
          </div>
          <div class="h-2 w-full bg-nested rounded-full overflow-hidden border border-light">
            <div
              class="h-full bg-primary rounded-full transition-all duration-700 ease-out"
              style="width: {Math.max(4, Math.min(100, quota.percentage))}%;"
            ></div>
          </div>
        </div>

        <!-- Quick Info Chips -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 max-w-xl">
          <div class="p-3 bg-nested/70 rounded-2xl border border-light/60">
            <span class="block text-[11px] font-semibold text-muted uppercase tracking-wider">Tersedia</span>
            <span class="text-lg font-heading font-bold text-main mt-0.5 block">{quota.balance}</span>
          </div>
          <div class="p-3 bg-nested/70 rounded-2xl border border-light/60">
            <span class="block text-[11px] font-semibold text-muted uppercase tracking-wider">Terpakai</span>
            <span class="text-lg font-heading font-bold text-secondary mt-0.5 block">{quota.totalUsed}</span>
          </div>
          <div class="p-3 bg-nested/70 rounded-2xl border border-light/60 col-span-2 sm:col-span-1">
            <span class="block text-[11px] font-semibold text-muted uppercase tracking-wider">Total Kuota</span>
            <span class="text-lg font-heading font-bold text-main mt-0.5 block">{quota.totalQuota}</span>
          </div>
        </div>
      </div>

      <!-- Sisi Kanan: Call to Action -->
      <div class="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto lg:w-48">
        <Button variant="primary" size="md" href="/dashboard/credits/buy" class="w-full justify-center shadow-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>Beli Kredit</span>
        </Button>
        <Button variant="outline" size="md" href="/dashboard/ai" class="w-full justify-center">
          <span>Buka Studio AI</span>
        </Button>
        <p class="text-[11px] text-muted text-center leading-tight pt-1">
          1 kredit = 1 kali generasi visual AI siap cetak
        </p>
      </div>
    </div>
  </Card>

  <!-- Error Alert State -->
  {#if errorMessage}
    <div class="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{errorMessage}</span>
      </div>
      <Button variant="ghost" size="xs" on:click={loadData}>Coba Lagi</Button>
    </div>
  {/if}

  <!-- Bottom Panel: Riwayat Mutasi Kredit Toko (Modular Sub-Component) -->
  <CreditMutationTable
    {mutations}
    {loading}
    {isRefreshing}
    on:refresh={handleRefresh}
  />
</div>
