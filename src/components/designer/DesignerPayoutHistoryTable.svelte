<script lang="ts">
  import { formatCurrency, formatDate } from '@/lib/utils/format';
  import type { PayoutHistoryItem } from '@/types';
  import { Card, Badge, Table, Pagination, Button } from '@/components/ui';
  import {
    Landmark,
    Search,
    CheckCircle2,
    RefreshCw,
    XCircle,
    Check,
    Copy,
  } from 'lucide-svelte';

  export let payoutHistory: PayoutHistoryItem[] = [];
  export let isLoading = false;

  let copiedId: string | null = null;
  let activeFilter: 'ALL' | 'processing' | 'completed' | 'rejected' = 'ALL';
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

  $: {
    if (activeFilter || searchQuery) {
      currentPage = 1;
    }
  }

  $: paginatedPayouts = filteredPayouts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const tableHeaders = [
    { label: 'Pencairan', align: 'left' as const },
    { label: 'Keterangan', align: 'left' as const },
    { label: 'Reference / Payout ID', align: 'left' as const },
    { label: 'Tanggal & Waktu', align: 'left' as const },
    { label: 'Nominal', align: 'right' as const },
  ];
</script>

<Card variant="bordered" padding="none" radius="2xl" className="mt-6">
  <!-- Table Header & Controls -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Landmark size={20} />
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Riwayat Penarikan Dana
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Status transfer pencairan saldo dompet ke rekening bank terdaftar
        </p>
      </div>
    </div>

    <!-- Filter Tabs & Search Box -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Search Input Capsule -->
      <div class="relative">
        <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari keterangan / Ref ID..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1">
        <Button
          size="xs"
          variant={activeFilter === 'ALL' ? 'dark' : 'ghost'}
          class="!rounded-full !px-3.5 font-bold {activeFilter === 'ALL' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
          on:click={() => activeFilter = 'ALL'}
        >
          Semua ({payoutHistory.length})
        </Button>
        <Button
          size="xs"
          variant={activeFilter === 'completed' ? 'dark' : 'ghost'}
          class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {activeFilter === 'completed' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
          on:click={() => activeFilter = 'completed'}
        >
          <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
          <span>Selesai</span>
        </Button>
        <Button
          size="xs"
          variant={activeFilter === 'processing' ? 'dark' : 'ghost'}
          class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {activeFilter === 'processing' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
          on:click={() => activeFilter = 'processing'}
        >
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          <span>Diproses</span>
        </Button>
        <Button
          size="xs"
          variant={activeFilter === 'rejected' ? 'dark' : 'ghost'}
          class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {activeFilter === 'rejected' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
          on:click={() => activeFilter = 'rejected'}
        >
          <span class="w-1.5 h-1.5 rounded-full bg-warning"></span>
          <span>Ditolak</span>
        </Button>
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
        <Landmark size={32} />
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">Tidak Ada Riwayat Penarikan</h4>
      <p class="text-body-sm text-secondary max-w-xs leading-relaxed font-sans">
        {searchQuery ? 'Tidak ada penarikan dana yang cocok dengan kata kunci pencarian Anda.' : 'Pengajuan penarikan dana ke rekening bank akan tercatat secara otomatis di sini.'}
      </p>
    </div>
  {:else}
    <Table headers={tableHeaders} minWidth="min-w-[700px]">
      {#each paginatedPayouts as payout}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Status Icon + Badge -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs {payout.status === 'completed' ? 'bg-success/10 text-success border border-success/20' : payout.status === 'processing' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-error/10 text-error border border-error/20'}">
                {#if payout.status === 'completed'}
                  <CheckCircle2 size={18} />
                {:else if payout.status === 'processing'}
                  <RefreshCw size={18} class="animate-spin" />
                {:else}
                  <XCircle size={18} />
                {/if}
              </div>
              <div>
                {#if payout.status === 'processing'}
                  <Badge variant="primary" dot pulse size="sm">
                    Diproses
                  </Badge>
                {:else if payout.status === 'completed'}
                  <Badge variant="success" dot size="sm">
                    Selesai
                  </Badge>
                {:else if payout.status === 'rejected'}
                  <Badge variant="error" dot size="sm">
                    Ditolak
                  </Badge>
                {:else}
                  <Badge variant="slate" size="sm">
                    {payout.status}
                  </Badge>
                {/if}
              </div>
            </div>
          </td>

          <!-- Description -->
          <td class="px-4 py-4 text-xs font-bold text-main max-w-[220px] whitespace-normal font-sans">
            {payout.gatewayMessage || (payout.status === 'processing' ? 'Sedang diproses transfer ke rekening' : payout.status === 'completed' ? 'Pencairan dana berhasil ditransfer' : 'Pengajuan penarikan dana ditolak')}
          </td>

          <!-- Reference ID -->
          <td class="px-4 py-4">
            {#if payout.xenditPayoutId || payout.gatewayReference || payout.id}
              {@const refText = payout.xenditPayoutId || payout.gatewayReference || payout.id || ''}
              <button
                type="button"
                on:click={() => copyToClipboard(refText)}
                class="inline-flex items-center gap-1.5 font-mono text-2xs font-bold text-secondary bg-nested/80 border border-light hover:border-border rounded-xl px-2.5 py-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Salin Payout Reference"
              >
                <span class="inline-block truncate max-w-[110px] align-middle">{refText}</span>
                {#if copiedId === refText}
                  <Check size={12} class="text-success shrink-0" />
                {:else}
                  <Copy size={12} class="text-muted shrink-0" />
                {/if}
              </button>
            {:else}
              <span class="text-xs text-muted font-mono">—</span>
            {/if}
          </td>

          <!-- Date & Time -->
          <td class="px-4 py-4 text-2xs text-secondary font-semibold whitespace-nowrap font-mono">
            {formatDate(payout.createdAt)}
          </td>

          <!-- Amount with Vibrant Orange / Red Pill -->
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <span class="inline-flex items-center font-mono text-xs sm:text-sm font-black text-orange bg-orange/10 px-2.5 py-1 rounded-xl border border-orange/20">
              -{formatCurrency(payout.amount)}
            </span>
          </td>
        </tr>
      {/each}
    </Table>

    <!-- Pagination per 10 rows -->
    <Pagination
      bind:currentPage
      totalItems={filteredPayouts.length}
      {pageSize}
    />
  {/if}
</Card>

