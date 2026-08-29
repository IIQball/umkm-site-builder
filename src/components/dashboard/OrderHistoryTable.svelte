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
  import { Card, Badge } from '@/components/ui';
  import { formatCurrency, formatDate } from '@/lib/utils';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'success':
      case 'completed':
        return { variant: 'emerald' as const, label: 'Lunas', icon: CheckCircle2 };
      case 'pending':
        return { variant: 'amber' as const, label: 'Menunggu Pembayaran', icon: Clock };
      case 'expired':
        return { variant: 'slate' as const, label: 'Kedaluwarsa', icon: Clock };
      case 'failed':
        return { variant: 'rose' as const, label: 'Gagal', icon: XCircle };
      default:
        return { variant: 'slate' as const, label: status, icon: Clock };
    }
  };

  const getPaymentUrl = (order: typeof orders[0]) => {
    if (order.externalId) {
      return `/checkout/${order.externalId}`;
    }
    return `/checkout/${order.id}`;
  };
</script>

<Card variant="bordered" padding="none" radius="xl" topBeam="indigo-500">
  <!-- Table Header & Controls (matching DesignerMutationTable style) -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-base">receipt_long</span>
        </div>
        <h3 class="text-heading-md text-main font-bold">Riwayat Transaksi & Invoice</h3>
      </div>
      <p class="text-body-sm text-secondary mt-0.5 ml-10.5">
        Daftar pesanan template toko online, status pembayaran, dan link penerapan tema
      </p>
    </div>

    <!-- Filter Tabs & Search Box -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Search Input Capsule -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari invoice / template..."
          class="bg-nested/80 border border-light rounded-xl pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-xl p-1">
        <button
          type="button"
          on:click={() => (selectedStatus = 'all')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer {selectedStatus === 'all'
            ? 'bg-card text-main shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          Semua ({orders.length})
        </button>
        <button
          type="button"
          on:click={() => (selectedStatus = 'pending')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {selectedStatus === 'pending'
            ? 'bg-amber-500 text-white shadow-2xs'
            : 'text-muted hover:text-amber-500'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Menunggu ({orders.filter((o) => o.status === 'pending').length})
        </button>
        <button
          type="button"
          on:click={() => (selectedStatus = 'paid')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {selectedStatus === 'paid'
            ? 'bg-emerald-500 text-white shadow-2xs'
            : 'text-muted hover:text-success'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Lunas ({orders.filter((o) => o.status === 'paid' || o.status === 'success' || o.status === 'completed').length})
        </button>
        <button
          type="button"
          on:click={() => (selectedStatus = 'expired')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {selectedStatus === 'expired'
            ? 'bg-card text-main shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          Kedaluwarsa ({orders.filter((o) => o.status === 'expired').length})
        </button>
      </div>
    </div>
  </div>

  <!-- Orders Table Content -->
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-light bg-nested/50 text-2xs uppercase tracking-wider text-muted font-heading font-bold">
          <th class="px-6 py-4">Invoice & Waktu</th>
          <th class="px-6 py-4">Item Template</th>
          <th class="px-6 py-4 text-right">Nominal Tagihan</th>
          <th class="px-6 py-4 text-center">Status Pembayaran</th>
          <th class="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[var(--color-border-light)] text-sm">
        {#if filteredOrders.length === 0}
          <tr>
            <td colspan="5" class="px-6 py-16 text-center text-muted">
              <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
                <Receipt size={24} />
              </div>
              <p class="font-bold text-main text-sm font-heading">Tidak Ada Riwayat Transaksi</p>
              <p class="text-xs text-secondary mt-1 max-w-sm mx-auto font-sans">
                {searchQuery || selectedStatus !== 'all'
                  ? 'Tidak ada pesanan yang sesuai dengan filter pencarian Anda.'
                  : 'Anda belum pernah melakukan pemesanan template. Pilih tema impian Anda di Galeri Template.'}
              </p>
              {#if selectedStatus === 'all' && !searchQuery}
                <div class="mt-4">
                  <a
                    href="/dashboard/templates"
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:shadow-primary/20 transition-all"
                  >
                    <Palette size={14} />
                    <span>Jelajahi Template Toko</span>
                  </a>
                </div>
              {/if}
            </td>
          </tr>
        {:else}
          {#each filteredOrders as order (order.id)}
            {@const statusMeta = getStatusBadge(order.status)}
            <tr class="hover:bg-nested/30 transition-colors group">
              <!-- Invoice ID & Created At -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-card border border-light text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <span class="material-symbols-outlined text-base">receipt</span>
                  </div>
                  <div>
                    <span class="font-bold font-mono text-xs text-main block">
                      {order.externalId || order.id}
                    </span>
                    <span class="text-3xs text-secondary mt-0.5 block font-sans">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Template Details -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  {#if order.template?.thumbnailUrl}
                    <img
                      src={order.template.thumbnailUrl}
                      alt={order.template.name}
                      class="w-10 h-8 rounded-lg object-cover border border-light flex-shrink-0"
                    />
                  {:else}
                    <div class="w-10 h-8 rounded-lg bg-nested border border-light flex items-center justify-center text-muted flex-shrink-0">
                      <Palette size={15} />
                    </div>
                  {/if}
                  <div class="min-w-0 max-w-xs">
                    <span class="font-bold text-xs text-main block truncate">
                      {order.template?.name || 'Template Desain Toko'}
                    </span>
                    <span class="text-3xs text-muted block uppercase font-mono">
                      {order.type === 'template_purchase' ? 'Beli Template' : 'Pendaftaran Toko'}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Amount -->
              <td class="px-6 py-4 text-right font-mono font-bold text-xs text-main">
                {formatCurrency(order.amount)}
              </td>

              <!-- Status Badge -->
              <td class="px-6 py-4 text-center">
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
                    <a
                      href={getPaymentUrl(order)}
                      class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-xs hover:shadow-md hover:shadow-amber-500/20 transition-all whitespace-nowrap cursor-pointer"
                    >
                      <CreditCard size={14} class="stroke-[2.5]" />
                      <span>Bayar Sekarang</span>
                    </a>
                  {:else if order.status === 'paid' || order.status === 'success' || order.status === 'completed'}
                    <a
                      href="/dashboard/templates"
                      class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary via-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white font-bold text-xs shadow-xs hover:shadow-md hover:shadow-primary/20 transition-all whitespace-nowrap cursor-pointer"
                    >
                      <Palette size={14} class="stroke-[2.5]" />
                      <span>Terapkan ke Toko</span>
                    </a>
                  {:else}
                    <a
                      href="/templates"
                      class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card hover:bg-nested border border-light text-main hover:border-primary/40 font-bold text-xs shadow-2xs hover:shadow-xs transition-all whitespace-nowrap cursor-pointer"
                    >
                      <ShoppingBag size={14} />
                      <span>Beli Ulang</span>
                    </a>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</Card>
