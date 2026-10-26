<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Card, Pagination } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';
  import type { CreditMutationItem } from './credit-gauge.types';

  export let mutations: CreditMutationItem[] = [];
  export let loading: boolean = false;
  export let isRefreshing: boolean = false;

  const dispatch = createEventDispatcher<{
    refresh: void;
  }>();

  let searchQuery = '';
  let activeFilter: 'ALL' | 'CREDIT' | 'DEBIT' = 'ALL';
  let currentPage = 1;
  const pageSize = 8;
  let copiedId: string | null = null;

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
      setTimeout(() => {
        copiedId = null;
      }, 1800);
    } catch {
      // Abaikan jika browser membatasi akses clipboard
    }
  }

  $: filteredMutations = (mutations || []).filter((m) => {
    const matchesType = activeFilter === 'ALL' || m.type === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.referenceId && m.referenceId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  $: {
    if (activeFilter || searchQuery) {
      currentPage = 1;
    }
  }

  $: totalItems = filteredMutations.length;
  $: paginatedMutations = filteredMutations.slice((currentPage - 1) * pageSize, currentPage * pageSize);
</script>

<Card variant="bordered" padding="none" radius="3xl" class="overflow-hidden bg-card border-light shadow-xs">
  <!-- Header Tabel & Filter Controls -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <h3 class="text-heading-sm font-bold text-main font-heading">
        Riwayat Mutasi Kuota
      </h3>
      <p class="text-body-sm text-secondary mt-0.5">
        Catatan penambahan paket kredit, bonus toko, dan pengurangan untuk pembuatan desain AI
      </p>
    </div>

    <!-- Filter Tools: Search, Filter Tabs, Refresh Button -->
    <div class="flex flex-wrap items-center gap-2">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari transaksi / Ref ID..."
          class="bg-nested border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary transition-all w-40 sm:w-48"
        />
      </div>

      <div class="flex items-center gap-1 bg-nested border border-light rounded-full p-1">
        <button
          type="button"
          on:click={() => (activeFilter = 'ALL')}
          class="px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer {activeFilter === 'ALL' ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
        >
          Semua
        </button>
        <button
          type="button"
          on:click={() => (activeFilter = 'CREDIT')}
          class="px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer {activeFilter === 'CREDIT' ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
        >
          Kredit Masuk (+)
        </button>
        <button
          type="button"
          on:click={() => (activeFilter = 'DEBIT')}
          class="px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer {activeFilter === 'DEBIT' ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
        >
          Pemakaian (-)
        </button>
      </div>

      <button
        type="button"
        on:click={() => dispatch('refresh')}
        disabled={isRefreshing}
        aria-label="Muat ulang mutasi"
        class="p-2 rounded-full border border-light bg-nested text-secondary hover:text-main hover:bg-light/40 transition-all cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={isRefreshing ? 'animate-spin' : ''}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
      </button>
    </div>
  </div>

  <!-- Table Body / Empty / Loading -->
  {#if loading}
    <div class="py-14 text-center space-y-3">
      <div class="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-secondary">Memuat riwayat mutasi...</p>
    </div>
  {:else if filteredMutations.length === 0}
    <div class="py-14 text-center space-y-2 px-4">
      <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center mx-auto text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      </div>
      <h4 class="text-sm font-bold text-main">Belum Ada Catatan Mutasi</h4>
      <p class="text-xs text-secondary max-w-sm mx-auto">
        {searchQuery ? 'Tidak ada data transaksi yang cocok dengan kata kunci pencarian.' : 'Seluruh penambahan kredit dan riwayat pemakaian desain AI akan tercatat otomatis di sini.'}
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto w-full">
      <table class="w-full text-xs text-left border-collapse">
        <thead>
          <tr class="bg-nested/60 border-b border-light text-muted uppercase font-heading font-semibold text-[10px] tracking-wider">
            <th class="py-3 px-4 sm:px-6">Transaksi</th>
            <th class="py-3 px-4">Kategori</th>
            <th class="py-3 px-4 hidden md:table-cell">ID Referensi</th>
            <th class="py-3 px-4 sm:px-6 text-right">Mutasi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-light">
          {#each paginatedMutations as item (item.id)}
            <tr class="hover:bg-nested/40 transition-colors">
              <td class="py-3.5 px-4 sm:px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 {item.type === 'CREDIT' ? 'bg-success/10 text-success' : 'bg-nested text-secondary'}">
                    {#if item.type === 'CREDIT'}
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    {/if}
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-main truncate leading-tight">
                      {item.description}
                    </p>
                    <p class="text-[11px] text-muted mt-0.5">
                      {formatDate(item.createdAt)} WIB
                    </p>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-4">
                {#if item.category === 'TOP_UP'}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    Isi Ulang
                  </span>
                {:else if item.category === 'BONUS'}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-light">
                    Bonus Awal
                  </span>
                {:else}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-nested text-secondary border border-light">
                    Pemakaian AI
                  </span>
                {/if}
              </td>

              <td class="py-3.5 px-4 hidden md:table-cell">
                {#if item.referenceId}
                  <button
                    type="button"
                    on:click={() => copyToClipboard(item.referenceId || '')}
                    class="inline-flex items-center gap-1 font-mono text-[11px] text-muted hover:text-main cursor-pointer"
                    title="Klik untuk menyalin"
                  >
                    <span class="truncate max-w-[120px]">{item.referenceId}</span>
                    {#if copiedId === item.referenceId}
                      <span class="text-success text-[10px]">Tersalin!</span>
                    {:else}
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    {/if}
                  </button>
                {:else}
                  <span class="text-muted text-[11px]">-</span>
                {/if}
              </td>

              <td class="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                {#if item.type === 'CREDIT'}
                  <span class="font-bold text-success">
                    +{item.amount} Kredit
                  </span>
                {:else}
                  <span class="font-bold text-error">
                    -{item.amount} Kredit
                  </span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if totalItems > pageSize}
      <div class="px-5 py-4 border-t border-light flex items-center justify-between">
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          autoUpdateUrl={false}
          on:pageChange={(e) => (currentPage = e.detail)}
        />
      </div>
    {/if}
  {/if}
</Card>
