<script lang="ts">
  import { CheckCircle2, Clock, XCircle, Palette, Receipt, Search } from 'lucide-svelte';
  import { Card, Table, Pagination, Button } from '@/components/ui';
  import TenantOrderRow from './orders/TenantOrderRow.svelte';
  import InvoiceReceiptModal from './orders/InvoiceReceiptModal.svelte';
  import { addToast } from '@/lib/toast';
  import type { OrderTransactionItem } from '@/types/finance';

  export let initialOrders: OrderTransactionItem[] = [];

  export let isAdmin: boolean = false;
  export let isReadOnly: boolean = false;
  export let tableTitle: string = 'Riwayat Tagihan & Pembelian';
  export let tableSubtitle: string = '';
  export let pagination: { currentPage: number; totalItems: number; pageSize: number; totalPages: number } | undefined = undefined;

  let orders = [...initialOrders];
  $: orders = [...initialOrders];

  let searchQuery = '';
  let selectedStatus: 'all' | 'pending' | 'paid' | 'failed' = 'all';
  let currentPage = 1;
  $: if (pagination?.currentPage) currentPage = pagination.currentPage;
  const pageSize = 10;
  let copiedId: string | null = null;
  let selectedInvoiceOrder: (typeof initialOrders)[0] | null = null;
  let isInvoiceModalOpen = false;

  $: hasAdminAssistant = !isAdmin && orders.some((o) => Boolean(o.adminName || o.adminEmail || o.assistedBy));

  $: counts = {
    total: orders.length,
    paid: orders.filter((o) => o.status === 'paid' || o.status === 'success' || o.status === 'completed').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    failed: orders.filter((o) => o.status !== 'paid' && o.status !== 'success' && o.status !== 'completed' && o.status !== 'pending').length,
  };

  $: filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'paid'
        ? order.status === 'paid' || order.status === 'success' || order.status === 'completed'
        : selectedStatus === 'pending'
        ? order.status === 'pending'
        : order.status !== 'paid' && order.status !== 'success' && order.status !== 'completed' && order.status !== 'pending';

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (order.externalId && order.externalId.toLowerCase().includes(q)) ||
      (order.template?.name && order.template.name.toLowerCase().includes(q)) ||
      (order.merchantName && order.merchantName.toLowerCase().includes(q)) ||
      (order.merchantEmail && order.merchantEmail.toLowerCase().includes(q)) ||
      (order.storeName && order.storeName.toLowerCase().includes(q)) ||
      (order.adminName && order.adminName.toLowerCase().includes(q)) ||
      (order.adminEmail && order.adminEmail.toLowerCase().includes(q)) ||
      order.id.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  $: {
    searchQuery;
    selectedStatus;
    if (!pagination) currentPage = 1;
  }

  $: paginatedOrders = pagination
    ? filteredOrders
    : filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  $: totalItems = pagination ? pagination.totalItems : filteredOrders.length;

  const getStatusBadge = (status: string) => {
    if (status === 'paid' || status === 'success' || status === 'completed') return { variant: 'success' as const, label: 'Lunas', icon: CheckCircle2 };
    if (status === 'pending') return { variant: 'orange' as const, label: 'Menunggu', icon: Clock };
    if (status === 'expired') return { variant: 'slate' as const, label: 'Kedaluwarsa', icon: Clock };
    if (status === 'failed') return { variant: 'error' as const, label: 'Gagal', icon: XCircle };
    return { variant: 'slate' as const, label: status, icon: Clock };
  };

  const getPaymentUrl = (order: (typeof orders)[0]) => {
    return order.externalId ? `/checkout/${order.externalId}` : `/checkout/${order.id}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
      addToast({ type: 'success', message: `ID Invoice ${text} berhasil disalin!` });
      setTimeout(() => { copiedId = null; }, 1800);
    } catch {
      // clipboard unavailable
    }
  };

  const handleOpenInvoice = (order: (typeof orders)[0]) => {
    selectedInvoiceOrder = order;
    isInvoiceModalOpen = true;
  };

  $: tableHeaders = [
    { label: '#', align: 'center' as const, width: 'w-12' },
    ...(isAdmin
      ? [
          { label: 'ID Invoice & Waktu' },
          { label: 'Merchant & Toko', width: 'w-80' },
          { label: 'Template Desain', width: 'w-56' },
          { label: 'Rincian Biaya', align: 'right' as const, width: 'w-44' },
          { label: 'Status Tagihan', align: 'center' as const, width: 'w-32' },
          { label: 'Aksi', align: 'right' as const, width: 'w-48' },
        ]
      : hasAdminAssistant
      ? [
          { label: 'ID Invoice & Waktu' },
          { label: 'Template Desain', width: 'w-56' },
          { label: 'Admin Pembeli', width: 'w-48' },
          { label: 'Total Tagihan', align: 'right' as const, width: 'w-36' },
          { label: 'Status Tagihan', align: 'center' as const, width: 'w-32' },
          { label: 'Aksi', align: 'right' as const, width: 'w-44' },
        ]
      : [
          { label: 'ID Invoice & Waktu' },
          { label: 'Template Desain', width: 'w-64' },
          { label: 'Total Tagihan', align: 'right' as const, width: 'w-36' },
          { label: 'Status Tagihan', align: 'center' as const, width: 'w-36' },
          { label: 'Aksi', align: 'right' as const, width: 'w-48' },
        ]),
  ];
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <!-- Table Header & Controls -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Receipt size={20} />
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          {tableTitle}
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          {tableSubtitle || (isAdmin 
            ? 'Daftar transaksi template untuk toko binaan, rincian biaya lisensi, dan fee pendampingan resmi'
            : 'Daftar seluruh invoice pembelian template, status transaksi, dan link pembayaran')}
        </p>
      </div>
    </div>

    <!-- Actions & Filter Pills -->
    <div class="flex flex-wrap items-center gap-2.5">
      <div class="relative">
        <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={isAdmin ? "Cari invoice / merchant / toko..." : "Cari invoice / template..."}
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-48 sm:w-60"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto">
        <Button
          size="xs"
          variant={selectedStatus === 'all' ? 'dark' : 'ghost'}
          class="!rounded-full !px-3.5 font-bold {selectedStatus === 'all' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
          on:click={() => (selectedStatus = 'all')}
        >
          Semua ({counts.total})
        </Button>
        <Button
          size="xs"
          variant={selectedStatus === 'paid' ? 'dark' : 'ghost'}
          class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {selectedStatus === 'paid' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
          on:click={() => (selectedStatus = 'paid')}
        >
          <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
          <span>Lunas ({counts.paid})</span>
        </Button>
        <Button
          size="xs"
          variant={selectedStatus === 'pending' ? 'dark' : 'ghost'}
          class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {selectedStatus === 'pending' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
          on:click={() => (selectedStatus = 'pending')}
        >
          <span class="w-1.5 h-1.5 rounded-full bg-warning"></span>
          <span>Menunggu ({counts.pending})</span>
        </Button>
        {#if counts.failed > 0}
          <Button
            size="xs"
            variant={selectedStatus === 'failed' ? 'dark' : 'ghost'}
            class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {selectedStatus === 'failed' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
            on:click={() => (selectedStatus = 'failed')}
          >
            <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
            <span>Batal/Gagal ({counts.failed})</span>
          </Button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Table Content -->
  {#if filteredOrders.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
        <Receipt size={24} />
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">Tidak Ada Riwayat Transaksi</h4>
      <p class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans">
        {searchQuery || selectedStatus !== 'all'
          ? 'Tidak ada pesanan yang sesuai dengan kata kunci pencarian Anda.'
          : 'Belum ada transaksi pembelian template yang tercatat pada sistem.'}
      </p>
      {#if selectedStatus === 'all' && !searchQuery}
        <div class="mt-5">
          <Button
            href={isAdmin ? "/templates" : "/dashboard/templates"}
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
    <Table headers={tableHeaders} minWidth={isAdmin ? "min-w-[950px]" : "min-w-[800px]"}>
      {#each paginatedOrders as order, i (order.id)}
        {@const statusMeta = getStatusBadge(order.status)}
        {@const displayId = order.externalId || order.id}
        <TenantOrderRow
          {order}
          rowNumber={(currentPage - 1) * pageSize + i + 1}
          {statusMeta}
          {displayId}
          {copiedId}
          {isAdmin}
          {isReadOnly}
          {hasAdminAssistant}
          onCopyId={copyToClipboard}
          {getPaymentUrl}
          onOpenInvoice={handleOpenInvoice}
        />
      {/each}
    </Table>

    <!-- DaisyUI Pagination Footer -->
    <Pagination
      bind:currentPage
      {totalItems}
      {pageSize}
    />
  {/if}
</Card>

<!-- Invoice Receipt / Download Modal -->
<InvoiceReceiptModal
  open={isInvoiceModalOpen}
  order={selectedInvoiceOrder}
  {isAdmin}
  onClose={() => {
    isInvoiceModalOpen = false;
    selectedInvoiceOrder = null;
  }}
/>
