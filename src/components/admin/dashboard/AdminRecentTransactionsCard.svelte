<script lang="ts">
  import { ArrowUpRight, Palette, Store, User } from 'lucide-svelte';
  import { Card, Table, Badge, Pagination } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import { formatDate } from '@/lib/utils/format';

  export let transactions: Array<{
    id: string;
    externalId?: string | null;
    amount: number;
    adminFee?: number | null;
    status: string;
    createdAt: string | Date;
    templateId?: string | null;
    templateName?: string | null;
    templateThumbnailUrl?: string | null;
    merchantName?: string | null;
    storeName?: string | null;
  }> = [];
  export let currentPage: number = 1;
  export let totalItems: number = transactions.length;
  export let pageSize: number = 10;
  export let pageParam: string = 'txPage';

  let copiedId: string | null = null;

  async function copyToClipboard(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      copiedId = id;
      setTimeout(() => {
        if (copiedId === id) copiedId = null;
      }, 2000);
    } catch {
      // Clipboard fallback
    }
  }

  function getStatusMeta(status: string) {
    const s = (status || '').toLowerCase().trim();
    if (s === 'paid' || s === 'success' || s === 'completed') {
      return { variant: 'success' as const, label: 'Lunas' };
    }
    if (s === 'pending') {
      return { variant: 'warning' as const, label: 'Menunggu' };
    }
    if (s === 'failed' || s === 'expired') {
      return { variant: 'error' as const, label: s === 'expired' ? 'Kedaluwarsa' : 'Gagal' };
    }
    return { variant: 'slate' as const, label: status };
  }

  const tableHeaders = [
    { label: '#', align: 'center' as const, width: '40px' },
    { label: 'Invoice & Tanggal', align: 'left' as const, width: '24%' },
    { label: 'Merchant & Toko', align: 'left' as const, width: '24%' },
    { label: 'Template Toko', align: 'left' as const, width: '24%' },
    { label: 'Fee Diterima', align: 'right' as const, width: '16%' },
    { label: 'Status', align: 'center' as const, width: '10%' },
  ];
</script>

<Card
  variant="bordered"
  padding="none"
  radius="2xl"
  class="shadow-xs overflow-hidden h-full flex flex-col justify-between"
>
  <!-- Card Header -->
  <div class="p-5 sm:p-6 border-b border-light flex items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">receipt_long</span>
      </div>
      <div>
        <h3 class="text-heading-sm text-main font-bold font-heading leading-tight">
          Transaksi Template Terbaru
        </h3>
        <p class="text-2xs text-secondary mt-0.5 font-sans">
          5 pembelian lisensi terkini oleh merchant binaan
        </p>
      </div>
    </div>

    <a
      href="/admin/transactions"
      class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-focus transition-colors cursor-pointer"
    >
      <span>Lihat Semua Faktur</span>
      <ArrowUpRight size={14} />
    </a>
  </div>

  <!-- Content Table using canonical Table.svelte -->
  <div class="flex-1 overflow-x-auto">
    {#if transactions.length === 0}
      <div class="py-12 px-6 flex flex-col items-center text-center">
        <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-2 shadow-2xs">
          <span class="material-symbols-outlined text-xl">receipt_long</span>
        </div>
        <p class="text-xs font-bold text-main font-heading">Belum Ada Transaksi</p>
        <p class="text-2xs text-secondary mt-0.5 font-sans">
          Belum ada transaksi pembelian template yang tercatat.
        </p>
      </div>
    {:else}
      <Table headers={tableHeaders} minWidth="min-w-[650px]" dense>
        {#each transactions as trx, idx (trx.id)}
          {@const displayId = trx.externalId || trx.id}
          {@const statusMeta = getStatusMeta(trx.status)}
          <tr class="hover:bg-nested/40 transition-colors group">
            <!-- Sequence Number (#) -->
            <td class="px-3 py-3.5 text-center font-mono text-2xs text-secondary font-bold">
              {(currentPage - 1) * pageSize + idx + 1}
            </td>
            <!-- Invoice ID & Tanggal -->
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  on:click={() => copyToClipboard(displayId)}
                  class="inline-flex items-center gap-1.5 font-mono text-2xs font-bold text-main bg-nested/80 border border-light hover:border-border rounded-xl px-2 py-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Salin ID Invoice"
                >
                  <span class="truncate max-w-[100px]">{displayId}</span>
                  <span class="material-symbols-outlined text-xs flex-shrink-0 {copiedId === displayId ? 'text-success' : 'text-muted'}">
                    {copiedId === displayId ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
              <span class="text-3xs text-secondary mt-1 block font-mono">
                {formatDate(trx.createdAt)}
              </span>
            </td>

            <!-- Merchant & Toko -->
            <td class="px-4 py-3.5">
              <div class="space-y-0.5">
                <div class="flex items-center gap-1.5 font-bold text-xs text-main">
                  <User size={13} class="text-primary flex-shrink-0" />
                  <span class="truncate max-w-[130px] font-sans">{trx.merchantName || 'Merchant'}</span>
                </div>
                <div class="flex items-center gap-1.5 text-3xs text-secondary">
                  <Store size={12} class="flex-shrink-0" />
                  <span class="truncate max-w-[130px] font-sans">{trx.storeName || 'Toko UMKM'}</span>
                </div>
              </div>
            </td>

            <!-- Template Details -->
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2.5">
                {#if trx.templateThumbnailUrl}
                  <img
                    src={trx.templateThumbnailUrl}
                    alt={trx.templateName || 'Template'}
                    class="w-10 h-8 rounded-lg object-cover border border-light flex-shrink-0 shadow-2xs"
                  />
                {:else}
                  <div class="w-10 h-8 rounded-lg bg-nested border border-light flex items-center justify-center text-muted flex-shrink-0 shadow-2xs">
                    <Palette size={14} />
                  </div>
                {/if}
                <div class="min-w-0 max-w-[140px]">
                  <span class="font-bold text-xs text-main block truncate font-sans">
                    {trx.templateName || 'Template Desain'}
                  </span>
                  <span class="text-3xs text-muted block uppercase font-mono mt-0.5">
                    ID: #{trx.templateId ? trx.templateId.slice(0, 8) : '—'}
                  </span>
                </div>
              </div>
            </td>

            <!-- Fee Diterima & Total Nominal -->
            <td class="px-4 py-3.5 text-right whitespace-nowrap">
              <div class="space-y-0.5">
                <span class="font-mono text-xs font-black text-success block">
                  +{formatIDR(Number(trx.adminFee || 0))}
                </span>
                <span class="text-3xs text-muted block font-mono">
                  Total {formatIDR(Number(trx.amount || 0))}
                </span>
              </div>
            </td>

            <!-- Status Badge -->
            <td class="px-4 py-3.5 text-center whitespace-nowrap">
              <Badge variant={statusMeta.variant} size="sm" dot>
                {statusMeta.label}
              </Badge>
            </td>
          </tr>
        {/each}
      </Table>
    {/if}
  </div>

  {#if totalItems > pageSize}
    <Pagination
      bind:currentPage
      {totalItems}
      {pageSize}
      {pageParam}
      size="xs"
      showInfo={false}
      class="px-4 py-2.5"
    />
  {/if}

  <!-- Card Footer -->
  <div class="px-5 py-3 sm:px-6 bg-nested/50 border-t border-light flex items-center justify-between text-2xs text-secondary">
    <span>Diperbarui otomatis saat transaksi lunas</span>
    <span class="font-mono font-bold text-main">{totalItems} Total Transaksi</span>
  </div>
</Card>
