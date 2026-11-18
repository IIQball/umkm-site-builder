<script context="module" lang="ts">
  export interface InvoiceTransactionItem {
    id: string;
    externalId: string;
    amount: number;
    adminFee?: number | null;
    status: string;
    paymentChannel?: string | null;
    paymentGatewayRef?: string | null;
    createdAt: string | Date;
  }
</script>

<script lang="ts">
  import { Search, Receipt } from 'lucide-svelte';
  import { Pagination } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import { formatDate } from '@/lib/utils/format';

  export let initialTransactions: InvoiceTransactionItem[] = [];

  let transactions = [...initialTransactions];
  let searchQuery = '';
  let currentPage = 1;
  const pageSize = 10;

  $: filtered = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      tx.externalId.toLowerCase().includes(q) ||
      (tx.paymentChannel && tx.paymentChannel.toLowerCase().includes(q)) ||
      tx.status.toLowerCase().includes(q)
    );
  });

  $: {
    searchQuery;
    currentPage = 1;
  }

  $: paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  $: totalPages = Math.ceil(filtered.length / pageSize) || 1;

  function getStatusMeta(status: string) {
    if (status === 'success') {
      return { label: 'Lunas', class: 'bg-success/10 text-success border-success/20' };
    }
    if (status === 'pending') {
      return { label: 'Menunggu Pembayaran', class: 'bg-warning/10 text-warning border-warning/20' };
    }
    if (status === 'expired') {
      return { label: 'Kedaluwarsa', class: 'bg-nested text-muted border-border' };
    }
    return { label: 'Gagal', class: 'bg-error/10 text-error border-error/20' };
  }
</script>

<div class="rounded-3xl bg-card border border-light shadow-xs overflow-hidden">
  <!-- Table Header Bar matching TemplateCategoryManager -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Receipt size={20} />
      </div>
      <div>
        <h3 class="font-heading font-bold text-heading-md text-main leading-tight">
          Daftar Faktur Pembayaran Kredit
        </h3>
        <p class="text-sm text-secondary mt-0.5">
          Catatan riwayat faktur tagihan resmi dari payment gateway Xendit
        </p>
      </div>
    </div>

    <!-- Search Box -->
    <div class="relative">
      <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari no. invoice / status..."
        class="bg-nested border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-56 sm:w-64"
      />
    </div>
  </div>

  <!-- Table Body -->
  {#if filtered.length === 0}
    <div class="py-14 text-center space-y-2 px-4">
      <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center mx-auto text-muted">
        <Receipt size={22} />
      </div>
      <h4 class="text-sm font-bold text-main font-heading">
        {searchQuery ? 'Tidak Ada Tagihan yang Cocok' : 'Belum Ada Tagihan Invoice'}
      </h4>
      <p class="text-xs text-secondary max-w-sm mx-auto">
        {searchQuery
          ? 'Coba gunakan kata kunci pencarian nomor invoice atau status lain.'
          : 'Invoice pembelian paket kuota AI akan otomatis tercatat dan dapat dipantau di tabel ini.'}
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto w-full">
      <table class="w-full text-xs text-left border-collapse">
        <thead>
          <tr class="bg-nested/60 border-b border-light text-muted uppercase font-heading font-semibold text-[10px] tracking-wider">
            <th class="py-3.5 px-4 sm:px-6">No. Invoice</th>
            <th class="py-3.5 px-4">Tanggal Tagihan</th>
            <th class="py-3.5 px-4">Metode / Channel</th>
            <th class="py-3.5 px-4">Status</th>
            <th class="py-3.5 px-4 sm:px-6 text-right">Total Tagihan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-light">
          {#each paginated as tx (tx.id)}
            {@const statusMeta = getStatusMeta(tx.status)}
            <tr class="hover:bg-nested/40 transition-colors">
              <td class="py-4 px-4 sm:px-6 font-mono font-bold text-main text-xs">
                <span class="text-primary font-mono">{tx.externalId}</span>
              </td>
              <td class="py-4 px-4 text-secondary whitespace-nowrap">
                {formatDate(tx.createdAt)}
              </td>
              <td class="py-4 px-4 text-main uppercase font-medium">
                {tx.paymentChannel || 'Xendit Invoice'}
              </td>
              <td class="py-4 px-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border {statusMeta.class}">
                  {statusMeta.label}
                </span>
              </td>
              <td class="py-4 px-4 sm:px-6 text-right font-mono font-bold text-main text-sm whitespace-nowrap">
                {formatIDR(tx.amount)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if totalPages > 1}
      <div class="p-4 border-t border-light flex justify-center">
        <Pagination
          {currentPage}
          totalItems={filtered.length}
          {pageSize}
          autoUpdateUrl={false}
          on:pageChange={(e) => (currentPage = e.detail)}
        />
      </div>
    {/if}
  {/if}
</div>
