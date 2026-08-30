<script lang="ts">
  import { formatCurrency } from '@/lib/utils/format';
  import { Card, Badge, Table, Pagination } from '@/components/ui';

  export let mutations: Array<{
    id: string;
    amount: number;
    balanceAfter: number;
    type: 'CREDIT' | 'DEBIT';
    description: string;
    referenceId: string | null;
    createdAt: Date | string;
  }>;

  let copiedId: string | null = null;
  let activeFilter: 'ALL' | 'CREDIT' | 'DEBIT' = 'ALL';
  let searchQuery = '';
  let currentPage = 1;
  const pageSize = 10;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
      setTimeout(() => { copiedId = null; }, 1800);
    } catch {
      // clipboard not available
    }
  };

  const formatDate = (d: Date | string): string =>
    new Date(d).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  $: filteredMutations = (mutations || []).filter(m => {
    const matchesType = activeFilter === 'ALL' || m.type === activeFilter;
    const matchesSearch = !searchQuery.trim() || 
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.referenceId && m.referenceId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  $: {
    // Reset page to 1 whenever search or filter changes
    if (activeFilter || searchQuery) {
      currentPage = 1;
    }
  }

  $: paginatedMutations = filteredMutations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const tableHeaders = [
    { label: 'Transaksi', align: 'left' as const },
    { label: 'Keterangan', align: 'left' as const },
    { label: 'Reference ID', align: 'left' as const },
    { label: 'Tanggal & Waktu', align: 'left' as const },
    { label: 'Nominal', align: 'right' as const },
    { label: 'Saldo Akhir', align: 'right' as const },
  ];
</script>

<Card variant="bordered" padding="none" radius="2xl">
  <!-- Table Header & Controls -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">receipt_long</span>
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Riwayat Mutasi & Transaksi
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Buku besar saldo dompet, komisi penjualan template, dan transfer payout
        </p>
      </div>
    </div>

    <!-- Filter Tabs & Search Box -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Search Input Capsule -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari transaksi / Ref ID..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-blue-500 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Type Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1">
        <button
          type="button"
          on:click={() => activeFilter = 'ALL'}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {activeFilter === 'ALL' ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-2xs' : 'text-muted hover:text-main'}"
        >
          Semua ({mutations.length})
        </button>
        <button
          type="button"
          on:click={() => activeFilter = 'CREDIT'}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'CREDIT' ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-2xs' : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Masuk
        </button>
        <button
          type="button"
          on:click={() => activeFilter = 'DEBIT'}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'DEBIT' ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-orange"></span>
          Keluar
        </button>
      </div>
    </div>
  </div>

  {#if filteredMutations.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mb-4 text-muted">
        <span class="material-symbols-outlined text-3xl">receipt_long</span>
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5">Tidak Ada Mutasi Ditemukan</h4>
      <p class="text-body-sm text-secondary max-w-xs leading-relaxed">
        {searchQuery ? 'Tidak ada transaksi yang cocok dengan kata kunci pencarian Anda.' : 'Mutasi saldo dan komisi penjualan template akan dicatat secara otomatis di sini.'}
      </p>
    </div>
  {:else}
    <Table headers={tableHeaders} minWidth="min-w-[700px]">
      {#each paginatedMutations as mut}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Type Icon + Badge -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs {mut.type === 'CREDIT' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-orange/10 text-orange border border-orange/20'}">
                <span class="material-symbols-outlined text-base">
                  {mut.type === 'CREDIT' ? 'south_west' : 'north_east'}
                </span>
              </div>
              <div>
                <Badge variant={mut.type === 'CREDIT' ? 'emerald' : 'orange'} size="sm">
                  {mut.type === 'CREDIT' ? 'Dana Masuk' : 'Pencairan'}
                </Badge>
              </div>
            </div>
          </td>

          <!-- Description -->
          <td class="px-4 py-4 text-xs font-bold text-main max-w-[220px] whitespace-normal font-sans">
            {mut.description}
          </td>

          <!-- Reference ID -->
          <td class="px-4 py-4">
            {#if mut.referenceId}
              <button
                type="button"
                on:click={() => copyToClipboard(mut.referenceId ?? '')}
                class="inline-flex items-center gap-1.5 font-mono text-2xs font-bold text-secondary bg-nested/80 border border-light hover:border-slate-400 dark:hover:border-slate-500 rounded-xl px-2.5 py-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Salin Reference ID"
              >
                <span class="truncate max-w-[110px]">{mut.referenceId}</span>
                <span class="material-symbols-outlined text-xs flex-shrink-0 {copiedId === mut.referenceId ? 'text-emerald-500' : ''}">
                  {copiedId === mut.referenceId ? 'check' : 'content_copy'}
                </span>
              </button>
            {:else}
              <span class="text-xs text-muted">—</span>
            {/if}
          </td>

          <!-- Date & Time -->
          <td class="px-4 py-4 text-2xs text-secondary font-semibold whitespace-nowrap font-mono">
            {formatDate(mut.createdAt)}
          </td>

          <!-- Amount with High-Contrast Pill -->
          <td class="px-4 py-4 text-right whitespace-nowrap">
            {#if mut.type === 'CREDIT'}
              <span class="inline-flex items-center font-mono text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                +{formatCurrency(mut.amount)}
              </span>
            {:else}
              <span class="inline-flex items-center font-mono text-xs sm:text-sm font-black text-orange bg-orange/10 px-2.5 py-1 rounded-xl border border-orange/20">
                -{formatCurrency(mut.amount)}
              </span>
            {/if}
          </td>

          <!-- Balance After -->
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <span class="font-mono text-xs font-bold text-main bg-nested/80 border border-light px-2.5 py-1 rounded-xl">
              {formatCurrency(mut.balanceAfter)}
            </span>
          </td>
        </tr>
      {/each}
    </Table>

    <!-- Pagination per 10 rows -->
    <Pagination
      bind:currentPage
      totalItems={filteredMutations.length}
      {pageSize}
    />
  {/if}
</Card>

