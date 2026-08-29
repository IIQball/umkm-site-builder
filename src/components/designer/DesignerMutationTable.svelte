<script lang="ts">
  import { formatCurrency } from '@/lib/utils/format';
  import { Card, Badge, Table } from '@/components/ui';

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

  const tableHeaders = [
    { label: 'Transaksi', align: 'left' as const },
    { label: 'Keterangan', align: 'left' as const },
    { label: 'Reference ID', align: 'left' as const },
    { label: 'Tanggal & Waktu', align: 'left' as const },
    { label: 'Nominal', align: 'right' as const },
    { label: 'Saldo Akhir', align: 'right' as const },
  ];
</script>

<Card variant="bordered" padding="none" radius="xl" topBeam="violet-500">
  <!-- Table Header & Controls -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-base">receipt_long</span>
        </div>
        <h3 class="text-heading-md text-main font-bold">Riwayat Mutasi & Transaksi</h3>
      </div>
      <p class="text-body-sm text-secondary mt-0.5 ml-10.5">Buku besar saldo dompet, komisi penjualan template, dan transfer payout</p>
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
          class="bg-nested/80 border border-light rounded-xl pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Type Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-xl p-1">
        <button
          type="button"
          on:click={() => activeFilter = 'ALL'}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer {activeFilter === 'ALL' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
        >
          Semua ({mutations.length})
        </button>
        <button
          type="button"
          on:click={() => activeFilter = 'CREDIT'}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {activeFilter === 'CREDIT' ? 'bg-emerald-500 text-white shadow-2xs' : 'text-muted hover:text-success'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Masuk
        </button>
        <button
          type="button"
          on:click={() => activeFilter = 'DEBIT'}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {activeFilter === 'DEBIT' ? 'bg-rose-500 text-white shadow-2xs' : 'text-muted hover:text-error'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
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
      {#each filteredMutations as mut}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Type Icon + Badge -->
          <td class="px-6 py-3.5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs {mut.type === 'CREDIT' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'}">
                <span class="material-symbols-outlined text-sm">
                  {mut.type === 'CREDIT' ? 'south_west' : 'north_east'}
                </span>
              </div>
              <div>
                <Badge variant={mut.type === 'CREDIT' ? 'emerald' : 'rose'} size="sm">
                  {mut.type === 'CREDIT' ? 'Kredit' : 'Debit'}
                </Badge>
                <span class="text-[10px] text-muted leading-tight block mt-1 font-sans">
                  {mut.type === 'CREDIT' ? 'Komisi Penjualan' : 'Penarikan Dana'}
                </span>
              </div>
            </div>
          </td>

          <!-- Description -->
          <td class="px-4 py-4 text-xs font-semibold text-main max-w-[220px] whitespace-normal font-sans">
            {mut.description}
          </td>

          <!-- Reference ID -->
          <td class="px-4 py-4">
            {#if mut.referenceId}
              <button
                type="button"
                on:click={() => copyToClipboard(mut.referenceId ?? '')}
                class="inline-flex items-center gap-1.5 font-mono text-2xs font-bold text-secondary bg-nested/80 border border-light hover:border-primary hover:text-primary rounded-lg px-2.5 py-1 transition-all cursor-pointer shadow-2xs"
                title="Salin Reference ID"
              >
                <span class="truncate max-w-[110px]">{mut.referenceId}</span>
                <span class="material-symbols-outlined text-xs flex-shrink-0">
                  {copiedId === mut.referenceId ? 'check' : 'content_copy'}
                </span>
              </button>
            {:else}
              <span class="text-xs text-muted">—</span>
            {/if}
          </td>

          <!-- Date & Time -->
          <td class="px-4 py-4 text-2xs text-secondary font-medium whitespace-nowrap font-mono">
            {formatDate(mut.createdAt)}
          </td>

          <!-- Amount -->
          <td
            class="px-4 py-4 text-right font-mono text-sm font-extrabold whitespace-nowrap"
            class:text-success={mut.type === 'CREDIT'}
            class:text-error={mut.type === 'DEBIT'}
          >
            {mut.type === 'CREDIT' ? '+' : '-'}{formatCurrency(mut.amount)}
          </td>

          <!-- Balance After -->
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <span class="font-mono text-xs font-bold text-main bg-nested/80 border border-light px-2.5 py-1 rounded-lg">
              {formatCurrency(mut.balanceAfter)}
            </span>
          </td>
        </tr>
      {/each}
    </Table>
  {/if}
</Card>

