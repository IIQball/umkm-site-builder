<script lang="ts">
  import {
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle,
    Palette,
    ShoppingBag,
    Receipt,
  } from 'lucide-svelte';
  import { Card, Badge, Table, Pagination, Button } from '@/components/ui';
  import { formatCurrency, formatDate } from '@/lib/utils';
  import { addToast } from '@/lib/toast';

  export let initialOrders: Array<{
    id: string;
    userId: string;
    type: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'expired' | string;
    storeId?: string | null;
    templateId?: string | null;
    externalId?: string | null;
    paymentGatewayRef?: string | null;
    paymentChannel?: string | null;
    createdAt: string | Date;
    template?: {
      id: string;
      name: string;
      thumbnailUrl?: string | null;
      price: number;
    } | null;
  }> = [];

  let orders = [...initialOrders];
  let searchQuery = '';
  let selectedStatus: 'all' | 'pending' | 'paid' | 'expired' = 'all';
  let currentPage = 1;
  const pageSize = 10;
  let copiedId: string | null = null;

  $: filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'paid'
        ? order.status === 'paid' || order.status === 'success' || order.status === 'completed'
        : order.status === selectedStatus;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (order.externalId && order.externalId.toLowerCase().includes(q)) ||
      (order.template?.name && order.template.name.toLowerCase().includes(q)) ||
      order.id.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  $: {
    searchQuery;
    selectedStatus;
    currentPage = 1;
  }

  $: paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'success':
      case 'completed':
        return { variant: 'emerald' as const, label: 'Lunas', icon: CheckCircle2 };
      case 'pending':
        return { variant: 'orange' as const, label: 'Menunggu', icon: Clock };
      case 'expired':
        return { variant: 'slate' as const, label: 'Kedaluwarsa', icon: Clock };
      case 'failed':
        return { variant: 'rose' as const, label: 'Gagal', icon: XCircle };
      default:
        return { variant: 'slate' as const, label: status, icon: Clock };
    }
  };

  const getPaymentUrl = (order: (typeof orders)[0]) => {
    if (order.externalId) {
      return `/checkout/${order.externalId}`;
    }
    return `/checkout/${order.id}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
      addToast({
        type: 'success',
        message: `ID Invoice ${text} berhasil disalin!`,
      });
      setTimeout(() => {
        if (copiedId === text) copiedId = null;
      }, 2500);
    } catch {
      addToast({
        type: 'error',
        message: 'Gagal menyalin ke clipboard',
      });
    }
  };

  const tableHeaders = [
    { label: 'Invoice & Waktu', width: 'w-48' },
    { label: 'Item Template Desain' },
    { label: 'Total Nominal', align: 'right' as const, width: 'w-36' },
    { label: 'Status Tagihan', align: 'center' as const, width: 'w-36' },
    { label: 'Aksi', align: 'right' as const, width: 'w-44' },
  ];
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <!-- Table Header & Controls -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Receipt size={18} />
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Riwayat Pesanan & Tagihan
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Daftar invoice pesanan template, status pembayaran, dan link penerapan toko
        </p>
      </div>
    </div>

    <!-- Filter Tabs & Search Box -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Search Input Capsule -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
          search
        </span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari invoice / template..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-blue-500 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1">
        <button
          type="button"
          on:click={() => (selectedStatus = 'all')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {selectedStatus === 'all'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          Semua ({orders.length})
        </button>
        <button
          type="button"
          on:click={() => (selectedStatus = 'pending')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {selectedStatus === 'pending'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-orange"></span>
          Menunggu
        </button>
        <button
          type="button"
          on:click={() => (selectedStatus = 'paid')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {selectedStatus === 'paid'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Lunas
        </button>
        <button
          type="button"
          on:click={() => (selectedStatus = 'expired')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {selectedStatus === 'expired'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          Kedaluwarsa
        </button>
      </div>
    </div>
  </div>

  <!-- Orders Table Content -->
  {#if filteredOrders.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
        <Receipt size={24} />
      </div>
      <h4 class="font-bold text-main text-base font-heading mb-1">Tidak Ada Riwayat Transaksi</h4>
      <p class="text-xs text-secondary max-w-sm mx-auto font-sans leading-relaxed">
        {searchQuery || selectedStatus !== 'all'
          ? 'Tidak ada pesanan yang sesuai dengan kata kunci pencarian Anda.'
          : 'Anda belum pernah melakukan pemesanan template. Pilih tema impian Anda di Galeri Template.'}
      </p>
      {#if selectedStatus === 'all' && !searchQuery}
        <div class="mt-5">
          <Button
            href="/dashboard/templates"
            variant="primary"
            size="sm"
          >
            <Palette size={15} />
            <span>Jelajahi Template Toko</span>
          </Button>
        </div>
      {/if}
    </div>
  {:else}
    <Table headers={tableHeaders} minWidth="min-w-[700px]">
      {#each paginatedOrders as order (order.id)}
        {@const statusMeta = getStatusBadge(order.status)}
        {@const displayId = order.externalId || order.id}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Invoice ID & Created At -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <button
                type="button"
                on:click={() => copyToClipboard(displayId)}
                class="inline-flex items-center gap-1.5 font-mono text-2xs font-bold text-main bg-nested/80 border border-light hover:border-slate-400 dark:hover:border-slate-500 rounded-xl px-2.5 py-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Salin ID Invoice"
              >
                <span class="truncate max-w-[120px]">{displayId}</span>
                <span class="material-symbols-outlined text-xs flex-shrink-0 {copiedId === displayId ? 'text-emerald-500' : 'text-muted'}">
                  {copiedId === displayId ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
            <span class="text-3xs text-secondary mt-1 block font-mono">
              {formatDate(order.createdAt)}
            </span>
          </td>

          <!-- Template Details -->
          <td class="px-4 py-4">
            <div class="flex items-center gap-3">
              {#if order.template?.thumbnailUrl}
                <img
                  src={order.template.thumbnailUrl}
                  alt={order.template.name}
                  class="w-12 h-9 rounded-xl object-cover border border-light flex-shrink-0 shadow-2xs"
                />
              {:else}
                <div class="w-12 h-9 rounded-xl bg-nested border border-light flex items-center justify-center text-muted flex-shrink-0 shadow-2xs">
                  <Palette size={16} />
                </div>
              {/if}
              <div class="min-w-0 max-w-xs">
                <span class="font-bold text-xs text-main block truncate font-sans">
                  {order.template?.name || 'Template Desain Toko'}
                </span>
                <span class="text-3xs text-muted block uppercase font-mono mt-0.5">
                  ID: #{order.template?.id ? order.template.id.slice(0, 8) : '—'}
                </span>
              </div>
            </div>
          </td>

          <!-- Amount with Vibrant Pill -->
          <td class="px-4 py-4 text-right whitespace-nowrap">
            <span class="inline-flex items-center font-mono text-xs sm:text-sm font-black text-main bg-nested/90 px-2.5 py-1 rounded-xl border border-light">
              {formatCurrency(order.amount)}
            </span>
          </td>

          <!-- Status Badge -->
          <td class="px-4 py-4 text-center">
            <div class="inline-flex items-center justify-center">
              <Badge variant={statusMeta.variant} size="sm" dot>
                {statusMeta.label}
              </Badge>
            </div>
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-2">
              {#if order.status === 'pending'}
                <Button
                  href={getPaymentUrl(order)}
                  variant="orange"
                  size="sm"
                  className="font-bold"
                >
                  <CreditCard size={14} />
                  <span>Bayar Sekarang</span>
                </Button>
              {:else if order.status === 'paid' || order.status === 'success' || order.status === 'completed'}
                <Button
                  href="/dashboard/templates"
                  variant="dark"
                  size="sm"
                  className="font-bold"
                >
                  <Palette size={14} />
                  <span>Terapkan</span>
                </Button>
              {:else}
                <Button
                  href="/templates"
                  variant="secondary"
                  size="sm"
                  className="font-bold"
                >
                  <ShoppingBag size={14} />
                  <span>Beli Ulang</span>
                </Button>
              {/if}
            </div>
          </td>
        </tr>
      {/each}
    </Table>

    <!-- DaisyUI Pagination Footer -->
    <Pagination
      bind:currentPage
      totalItems={filteredOrders.length}
      {pageSize}
    />
  {/if}
</Card>
