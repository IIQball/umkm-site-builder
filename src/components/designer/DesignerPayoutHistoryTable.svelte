<script lang="ts">
  import { formatCurrency } from '@/lib/utils/format';
  import type { PayoutHistoryItem } from '@/types';
  import { Card, Badge, Table } from '@/components/ui';

  export let payoutHistory: PayoutHistoryItem[] = [];
  export let isLoading = false;

  let copiedId: string | null = null;
  let activeFilter: 'ALL' | 'processing' | 'completed' | 'rejected' = 'ALL';
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

  $: filteredPayouts = (payoutHistory || []).filter(p => {
    const matchesFilter = activeFilter === 'ALL' || p.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (p.gatewayMessage && p.gatewayMessage.toLowerCase().includes(q)) || 
      (p.xenditPayoutId && p.xenditPayoutId.toLowerCase().includes(q)) ||
      (p.gatewayReference && p.gatewayReference.toLowerCase().includes(q)) ||
      (p.status && p.status.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const tableHeaders = [
    { label: 'Pencairan', align: 'left' as const },
    { label: 'Keterangan', align: 'left' as const },
    { label: 'Reference / Payout ID', align: 'left' as const },
    { label: 'Tanggal & Waktu', align: 'left' as const },
    { label: 'Nominal', align: 'right' as const },
  ];
</script>

<Card variant="bordered" padding="none" radius="xl" topBeam="emerald-500" className="mt-6">
  <!-- Table Header & Controls -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-base">account_balance</span>
        </div>
        <h3 class="text-heading-md text-main font-bold">Riwayat Penarikan Dana</h3>
      </div>
      <p class="text-body-sm text-secondary mt-0.5 ml-10.5">Status transfer pencairan saldo dompet ke rekening bank terdaftar</p>
    </div>

    <!-- Filter Tabs & Search Box -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Search Input Capsule -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari keterangan / Ref ID..."
          class="bg-nested/80 border border-light rounded-xl pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-xl p-1">
        <button
          type="button"
          on:click={() => activeFilter = 'ALL'}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer {activeFilter === 'ALL' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
        >
          Semua ({payoutHistory.length})
        </button>
        <button
          type="button"
          on:click={() => activeFilter = 'completed'}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {activeFilter === 'completed' ? 'bg-emerald-500 text-white shadow-2xs' : 'text-muted hover:text-success'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Selesai
        </button>
        <button
          type="button"
          on:click={() => activeFilter = 'processing'}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {activeFilter === 'processing' ? 'bg-primary text-white shadow-2xs' : 'text-muted hover:text-primary'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Diproses
        </button>
        <button
          type="button"
          on:click={() => activeFilter = 'rejected'}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {activeFilter === 'rejected' ? 'bg-rose-500 text-white shadow-2xs' : 'text-muted hover:text-error'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Ditolak
        </button>
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="space-y-3 p-6">
      <div class="h-12 bg-nested rounded-2xl animate-pulse"></div>
      <div class="h-12 bg-nested rounded-2xl animate-pulse"></div>
    </div>
  {:else if filteredPayouts.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mb-4 text-muted">
        <span class="material-symbols-outlined text-3xl">account_balance</span>
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5">Tidak Ada Riwayat Penarikan</h4>
      <p class="text-body-sm text-secondary max-w-xs leading-relaxed">
        {searchQuery ? 'Tidak ada penarikan dana yang cocok dengan kata kunci pencarian Anda.' : 'Pengajuan penarikan dana ke rekening bank akan tercatat secara otomatis di sini.'}
      </p>
    </div>
  {:else}
    <Table headers={tableHeaders} minWidth="min-w-[700px]">
      {#each filteredPayouts as payout}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Status Icon + Badge -->
          <td class="px-6 py-3.5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs {payout.status === 'completed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : payout.status === 'processing' ? 'bg-primary/15 text-primary border border-primary/20' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'}">
                <span class="material-symbols-outlined text-sm">
                  {payout.status === 'completed' ? 'check_circle' : payout.status === 'processing' ? 'sync' : 'cancel'}
                </span>
              </div>
              <div>
                {#if payout.status === 'processing'}
                  <Badge variant="primary" dot pulse size="sm">
                    Diproses
                  </Badge>
                {:else if payout.status === 'completed'}
                  <Badge variant="emerald" dot size="sm">
                    Selesai
                  </Badge>
                {:else if payout.status === 'rejected'}
                  <Badge variant="rose" dot size="sm">
                    Ditolak
                  </Badge>
                {:else}
                  <Badge variant="amber" size="sm">
                    {payout.status}
                  </Badge>
                {/if}
              </div>
            </div>
          </td>

          <!-- Description -->
          <td class="px-4 py-4 text-xs font-semibold text-main max-w-[220px] whitespace-normal font-sans">
            {payout.gatewayMessage || (payout.status === 'processing' ? 'Sedang diproses oleh payment gateway' : payout.status === 'completed' ? 'Pencairan dana berhasil ditransfer' : 'Pengajuan penarikan dana ditolak')}
          </td>

          <!-- Reference ID -->
          <td class="px-4 py-4">
            {#if payout.xenditPayoutId || payout.gatewayReference}
              {@const refText = payout.xenditPayoutId || payout.gatewayReference || ''}
              <button
                type="button"
                on:click={() => copyToClipboard(refText)}
                class="inline-flex items-center gap-1.5 font-mono text-2xs font-bold text-secondary bg-nested/80 border border-light hover:border-primary hover:text-primary rounded-lg px-2.5 py-1 transition-all cursor-pointer shadow-2xs"
                title="Salin Payout Reference"
              >
                <span class="truncate max-w-[110px]">{refText}</span>
                <span class="material-symbols-outlined text-xs flex-shrink-0">
                  {copiedId === refText ? 'check' : 'content_copy'}
                </span>
              </button>
            {:else}
              <span class="text-xs text-muted font-mono">—</span>
            {/if}
          </td>

          <!-- Date & Time -->
          <td class="px-4 py-4 text-2xs text-secondary font-medium whitespace-nowrap font-mono">
            {formatDate(payout.createdAt)}
          </td>

          <!-- Amount -->
          <td class="px-6 py-4 text-right font-mono text-sm font-extrabold whitespace-nowrap text-error">
            -{formatCurrency(payout.amount)}
          </td>
        </tr>
      {/each}
    </Table>
  {/if}
</Card>

