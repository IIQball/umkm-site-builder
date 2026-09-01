<script lang="ts">
  import { Card, Table, Pagination } from '@/components/ui';
  import DesignerTemplateCard from './DesignerTemplateCard.svelte';
  import DesignerTemplateRow from './templates/DesignerTemplateRow.svelte';
  import DesignerRejectionModal from './templates/DesignerRejectionModal.svelte';
  import { addToast } from '@/lib/toast';

  export let templates: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    thumbnailUrl: string | null;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | string;
    rejectionReason: string | null;
    createdAt: Date | string;
    totalSold: number;
  }> = [];

  let searchQuery = '';
  let activeFilter: 'all' | 'draft' | 'pending' | 'approved' | 'rejected' = 'all';
  let viewMode: 'table' | 'grid' = 'table';
  let selectedRejection: { name: string; reason: string } | null = null;
  let copiedId: string | null = null;
  let currentPage = 1;
  const pageSize = 10;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
      addToast({
        type: 'success',
        message: `ID Template #${text.slice(0, 8)} disalin!`,
      });
      setTimeout(() => { copiedId = null; }, 1800);
    } catch {
      // clipboard unavailable
    }
  };

  const formatDate = (d: Date | string): string =>
    new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  $: counts = {
    all: templates.length,
    draft: templates.filter(t => t.status === 'draft').length,
    pending: templates.filter(t => t.status === 'pending').length,
    approved: templates.filter(t => t.status === 'approved').length,
    rejected: templates.filter(t => t.status === 'rejected').length,
  };

  $: filteredTemplates = templates.filter(t => {
    const matchesFilter = activeFilter === 'all' || t.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      t.name.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  $: {
    searchQuery;
    activeFilter;
    currentPage = 1;
  }

  $: paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Disetujui', variant: 'emerald' as const, dot: true, pulse: false };
      case 'pending':
        return { label: 'Menunggu Review', variant: 'orange' as const, dot: true, pulse: true };
      default:
        return { label: 'Draft', variant: 'slate' as const, dot: true, pulse: false };
    }
  };

  const tableHeaders = [
    { label: 'Template Desain', align: 'left' as const },
    { label: 'Harga Jual', align: 'left' as const, width: 'w-32' },
    { label: 'Penjualan', align: 'left' as const, width: 'w-28' },
    { label: 'Status Kurasi', align: 'left' as const, width: 'w-36' },
    { label: 'Tanggal Dibuat', align: 'left' as const, width: 'w-36' },
    { label: 'Aksi', align: 'right' as const, width: 'w-44' },
  ];
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <!-- Table Header & Controls -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">dashboard</span>
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Katalog Desain Saya
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Daftar seluruh template, status kurasi admin, dan statistik penjualan
        </p>
      </div>
    </div>

    <!-- Actions & Filter Pills -->
    <div class="flex flex-wrap items-center gap-2.5">
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari template / ID..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-blue-500 focus:bg-card transition-all w-44 sm:w-52"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto">
        <button
          type="button"
          on:click={() => (activeFilter = 'all')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {activeFilter === 'all'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          Semua ({counts.all})
        </button>
        <button
          type="button"
          on:click={() => (activeFilter = 'approved')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'approved'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Aktif ({counts.approved})
        </button>
        <button
          type="button"
          on:click={() => (activeFilter = 'pending')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'pending'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-orange"></span>
          Review ({counts.pending})
        </button>
        <button
          type="button"
          on:click={() => (activeFilter = 'draft')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'draft'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Draft ({counts.draft})
        </button>
      </div>

      <!-- Toggle Table / Grid -->
      <div class="flex items-center p-1 bg-nested/80 border border-light rounded-full shadow-2xs">
        <button
          type="button"
          on:click={() => (viewMode = 'table')}
          class="p-1 rounded-full text-xs transition-all {viewMode === 'table' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
          title="Tampilan Tabel"
        >
          <span class="material-symbols-outlined text-sm block">table_rows</span>
        </button>
        <button
          type="button"
          on:click={() => (viewMode = 'grid')}
          class="p-1 rounded-full text-xs transition-all {viewMode === 'grid' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
          title="Tampilan Grid"
        >
          <span class="material-symbols-outlined text-sm block">grid_view</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Content -->
  {#if filteredTemplates.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
        <span class="material-symbols-outlined text-2xl">style</span>
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">Tidak Ada Template Ditemukan</h4>
      <p class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans">
        {searchQuery ? 'Tidak ada template yang cocok dengan kata kunci pencarian Anda.' : 'Mulai buat tema toko online UMKM pertama Anda dengan visual builder.'}
      </p>
      {#if !searchQuery}
        <a
          href="/builder/new"
          class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-2xl px-5 py-2.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          Buat Template Sekarang
        </a>
      {/if}
    </div>
  {:else if viewMode === 'table'}
    <Table headers={tableHeaders} minWidth="min-w-[820px]">
      {#each paginatedTemplates as tpl}
        {@const badge = getStatusBadge(tpl.status)}
        <DesignerTemplateRow
          {tpl}
          {copiedId}
          {badge}
          {formatDate}
          onCopyId={copyToClipboard}
          onShowRejection={(t) => selectedRejection = { name: t.name, reason: t.rejectionReason || 'Tidak ada alasan terperinci.' }}
        />
      {/each}
    </Table>
  {:else}
    <!-- Grid Mode -->
    <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each paginatedTemplates as tpl (tpl.id)}
        <DesignerTemplateCard template={tpl} />
      {/each}
    </div>
  {/if}

  {#if filteredTemplates.length > 0}
    <Pagination
      bind:currentPage
      totalItems={filteredTemplates.length}
      {pageSize}
    />
  {/if}
</Card>

<!-- Rejection Reason Modal -->
<DesignerRejectionModal
  {selectedRejection}
  onClose={() => (selectedRejection = null)}
/>
