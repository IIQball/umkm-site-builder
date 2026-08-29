<script lang="ts">
  import {
    Palette,
    User,
    Clock,
    CheckCircle2,
    XCircle,
    ShoppingBag,
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
    user?: {
      id: string;
      name?: string | null;
      email: string;
      image?: string | null;
    } | null;
    commission?: {
      id: string;
      totalAmount?: number | null;
      designerAmount?: number | null;
      platformFee?: number | null;
    } | null;
  }> = [];

  let orders = [...initialOrders];
  let searchQuery = '';
  let selectedStatus: 'all' | 'paid' | 'pending' | 'failed' = 'all';

  $: filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'paid'
        ? order.status === 'paid' || order.status === 'success' || order.status === 'completed'
        : selectedStatus === 'pending'
        ? order.status === 'pending'
        : order.status === 'failed' || order.status === 'expired';

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (order.externalId && order.externalId.toLowerCase().includes(q)) ||
      (order.template?.name && order.template.name.toLowerCase().includes(q)) ||
      (order.user?.name && order.user.name.toLowerCase().includes(q)) ||
      (order.user?.email && order.user.email.toLowerCase().includes(q)) ||
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
        return { variant: 'amber' as const, label: 'Menunggu', icon: Clock };
      case 'expired':
        return { variant: 'slate' as const, label: 'Kedaluwarsa', icon: Clock };
      case 'failed':
        return { variant: 'rose' as const, label: 'Gagal', icon: XCircle };
      default:
        return { variant: 'slate' as const, label: status, icon: Clock };
    }
  };
</script>

<Card variant="bordered" padding="none" radius="xl" topBeam="indigo-500">
  <!-- Table Header & Controls (matching DesignerMutationTable style) -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-base">shopping_bag</span>
        </div>
        <h3 class="text-heading-md text-main font-bold">Daftar Transaksi Pesanan Masuk</h3>
      </div>
      <p class="text-body-sm text-secondary mt-0.5 ml-10.5">
        Rincian pembeli tenant, nominal kotor, dan hak komisi bersih per transaksi
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
          placeholder="Cari invoice / pembeli..."
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
          on:click={() => (selectedStatus = 'failed')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {selectedStatus === 'failed'
            ? 'bg-rose-500 text-white shadow-2xs'
            : 'text-muted hover:text-rose-500'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Batal ({orders.filter((o) => o.status === 'failed' || o.status === 'expired').length})
        </button>
      </div>
    </div>
  </div>

  <!-- Table Content -->
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-light bg-nested/50 text-2xs uppercase tracking-wider text-muted font-heading font-bold">
          <th class="px-6 py-4">Invoice & Waktu</th>
          <th class="px-6 py-4">Template Terpesan</th>
          <th class="px-6 py-4">Pembeli (Tenant)</th>
          <th class="px-6 py-4 text-right">Harga Jual</th>
          <th class="px-6 py-4 text-right">Komisi Desainer</th>
          <th class="px-6 py-4 text-center">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[var(--color-border-light)] text-sm">
        {#if filteredOrders.length === 0}
          <tr>
            <td colspan="6" class="px-6 py-16 text-center text-muted">
              <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
                <ShoppingBag size={24} />
              </div>
              <p class="font-bold text-main text-sm font-heading">Belum Ada Pesanan Masuk</p>
              <p class="text-xs text-secondary mt-1 max-w-sm mx-auto font-sans">
                {searchQuery || selectedStatus !== 'all'
                  ? 'Tidak ada transaksi masuk yang cocok dengan kriteria pencarian.'
                  : 'Belum ada transaksi pembelian template oleh tenant saat ini.'}
              </p>
            </td>
          </tr>
        {:else}
          {#each filteredOrders as order (order.id)}
            {@const statusMeta = getStatusBadge(order.status)}
            {@const designerShare = order.commission?.designerAmount ?? Math.round(order.amount * 0.7)}
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
                      {order.template?.name || 'Template Desain'}
                    </span>
                    <span class="text-3xs font-mono text-muted block">
                      ID: #{order.templateId?.slice(-6) || '-'}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Tenant Details -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2.5">
                  {#if order.user?.image}
                    <img
                      src={order.user.image}
                      alt={order.user.name || 'Tenant'}
                      class="w-7 h-7 rounded-full object-cover border border-light flex-shrink-0"
                    />
                  {:else}
                    <div class="w-7 h-7 rounded-full bg-nested border border-light flex items-center justify-center text-secondary flex-shrink-0">
                      <User size={13} />
                    </div>
                  {/if}
                  <div class="min-w-0 max-w-xs">
                    <span class="font-bold text-xs text-main block truncate">
                      {order.user?.name || 'Tenant UMKM'}
                    </span>
                    <span class="text-3xs text-secondary block truncate font-mono">
                      {order.user?.email || '-'}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Gross Amount -->
              <td class="px-6 py-4 text-right font-mono text-xs text-secondary">
                {formatCurrency(order.amount)}
              </td>

              <!-- Net Designer Share -->
              <td class="px-6 py-4 text-right">
                <span class="font-mono font-bold text-xs text-success block">
                  {formatCurrency(designerShare)}
                </span>
                <span class="text-[10px] text-muted font-normal block font-sans mt-0.5 tracking-tight">
                  (Hak 70%)
                </span>
              </td>

              <!-- Status Badge -->
              <td class="px-6 py-4 text-center">
                <div class="inline-flex items-center justify-center">
                  <Badge variant={statusMeta.variant} size="sm" dot>
                    {statusMeta.label}
                  </Badge>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</Card>
