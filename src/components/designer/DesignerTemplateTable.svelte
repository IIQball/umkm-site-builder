<script lang="ts">
  import { Card, Table, Pagination, Button } from '@/components/ui';
  import DesignerTemplateCard from './DesignerTemplateCard.svelte';
  import DesignerTemplateRow from './templates/DesignerTemplateRow.svelte';
  import DesignerRejectionModal from './templates/DesignerRejectionModal.svelte';
  import DesignerDeleteDraftModal from './templates/DesignerDeleteDraftModal.svelte';
  import { addToast } from '@/lib/toast';
  import { formatDate } from '@/lib/utils/format';

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
  // Default tampilan card/grid sesuai permintaan user
  let viewMode: 'table' | 'grid' = 'grid';
  let selectedRejection: { name: string; reason: string } | null = null;
  let copiedId: string | null = null;
  let currentPage = 1;
  const pageSize = 10;

  // Batch Selection & Hard Delete Modal State
  let selectedDraftIds: string[] = [];
  let deleteModalOpen = false;
  let targetsToDelete: Array<{ id: string; name: string }> = [];
  let isDeletingDraft = false;

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

  // Draft Selection Helpers
  $: visibleDraftTemplates = paginatedTemplates.filter(t => t.status === 'draft');
  $: allVisibleDraftsSelected = visibleDraftTemplates.length > 0 && visibleDraftTemplates.every(t => selectedDraftIds.includes(t.id));
  $: hasDraftSelection = selectedDraftIds.length > 0;

  const toggleDraftSelect = (id: string) => {
    if (selectedDraftIds.includes(id)) {
      selectedDraftIds = selectedDraftIds.filter(item => item !== id);
    } else {
      selectedDraftIds = [...selectedDraftIds, id];
    }
  };

  const toggleSelectAllVisibleDrafts = () => {
    if (allVisibleDraftsSelected) {
      const visibleIds = new Set(visibleDraftTemplates.map(t => t.id));
      selectedDraftIds = selectedDraftIds.filter(id => !visibleIds.has(id));
    } else {
      const newIds = new Set([...selectedDraftIds, ...visibleDraftTemplates.map(t => t.id)]);
      selectedDraftIds = Array.from(newIds);
    }
  };

  const clearDraftSelection = () => {
    selectedDraftIds = [];
  };

  const openDeleteModalForSingle = (tpl: any) => {
    targetsToDelete = [{ id: tpl.id, name: tpl.name }];
    deleteModalOpen = true;
  };

  const openDeleteModalForBatch = () => {
    const targets = templates
      .filter(t => selectedDraftIds.includes(t.id))
      .map(t => ({ id: t.id, name: t.name }));
    if (targets.length === 0) return;
    targetsToDelete = targets;
    deleteModalOpen = true;
  };

  const handleConfirmDelete = async () => {
    if (targetsToDelete.length === 0) return;
    try {
      isDeletingDraft = true;
      const ids = targetsToDelete.map(t => t.id);

      const res = await fetch('/api/designer/templates/draft', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateIds: ids }),
      });
      const result = await res.json();

      if (res.ok) {
        const deletedSet = new Set(ids);
        templates = templates.filter(t => !deletedSet.has(t.id));
        selectedDraftIds = selectedDraftIds.filter(id => !deletedSet.has(id));
        deleteModalOpen = false;
        targetsToDelete = [];

        addToast({
          type: 'success',
          message: ids.length > 1
            ? `${ids.length} draf template berhasil dihapus permanen!`
            : 'Draf template berhasil dihapus permanen!',
        });
      } else {
        addToast({
          type: 'error',
          message: result.error?.message || 'Gagal menghapus draf template',
        });
      }
    } catch {
      addToast({
        type: 'error',
        message: 'Terjadi kesalahan koneksi saat menghapus draf',
      });
    } finally {
      isDeletingDraft = false;
    }
  };

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

  $: tableHeaders = [
    { label: '', align: 'center' as const, width: 'w-10' },
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

      <!-- Batch Draft Selection Button (if drafts exist) -->
      {#if counts.draft > 0}
        <button
          type="button"
          on:click={toggleSelectAllVisibleDrafts}
          class={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer active:scale-95 ${
            allVisibleDraftsSelected
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : hasDraftSelection
              ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
              : 'bg-nested/80 border-light text-secondary hover:text-main'
          }`}
          title="Pilih draf template di halaman ini"
        >
          <span class="material-symbols-outlined text-sm">
            {allVisibleDraftsSelected ? 'check_box' : hasDraftSelection ? 'indeterminate_check_box' : 'checklist'}
          </span>
          <span class="hidden sm:inline">{allVisibleDraftsSelected ? 'Lepas Pilihan' : hasDraftSelection ? `${selectedDraftIds.length} Dipilih` : 'Pilih Draf'}</span>
        </button>
      {/if}

      <!-- Toggle Table / Grid -->
      <div class="flex items-center p-1 bg-nested/80 border border-light rounded-full shadow-2xs">
        <button
          type="button"
          on:click={() => (viewMode = 'grid')}
          class="p-1 rounded-full text-xs transition-all {viewMode === 'grid' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
          title="Tampilan Card"
        >
          <span class="material-symbols-outlined text-sm block">grid_view</span>
        </button>
        <button
          type="button"
          on:click={() => (viewMode = 'table')}
          class="p-1 rounded-full text-xs transition-all {viewMode === 'table' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
          title="Tampilan Tabel"
        >
          <span class="material-symbols-outlined text-sm block">table_rows</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Batch Action Bar (Displayed when 1 or more drafts are selected) -->
  {#if hasDraftSelection}
    <div class="px-5 sm:px-6 py-3 bg-blue-50/80 dark:bg-blue-950/50 border-b border-blue-200/80 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
      <div class="flex items-center gap-2.5 text-xs font-bold text-blue-900 dark:text-blue-200">
        <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
        <span>{selectedDraftIds.length} draf template dipilih</span>
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="secondary"
          size="xs"
          className="rounded-xl font-bold"
          on:click={clearDraftSelection}
        >
          Batalkan Pilihan
        </Button>
        <Button
          variant="destructive"
          size="xs"
          className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
          on:click={openDeleteModalForBatch}
        >
          <span class="material-symbols-outlined text-xs">delete_forever</span>
          <span>Hapus Terpilih ({selectedDraftIds.length})</span>
        </Button>
      </div>
    </div>
  {/if}

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
    <Table headers={tableHeaders} minWidth="min-w-[840px]">
      {#each paginatedTemplates as tpl (tpl.id)}
        {@const badge = getStatusBadge(tpl.status)}
        <DesignerTemplateRow
          {tpl}
          {copiedId}
          {badge}
          {formatDate}
          isSelected={selectedDraftIds.includes(tpl.id)}
          onToggleSelect={toggleDraftSelect}
          onDeleteDraft={openDeleteModalForSingle}
          onCopyId={copyToClipboard}
          onShowRejection={(t) => selectedRejection = { name: t.name, reason: t.rejectionReason || 'Tidak ada alasan terperinci.' }}
        />
      {/each}
    </Table>
  {:else}
    <!-- Grid / Card Mode (Default View) -->
    <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each paginatedTemplates as tpl (tpl.id)}
        <DesignerTemplateCard
          template={tpl}
          isSelected={selectedDraftIds.includes(tpl.id)}
          onToggleSelect={toggleDraftSelect}
          onDeleteDraft={openDeleteModalForSingle}
        />
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

<!-- Delete Draft Confirmation Modal -->
<DesignerDeleteDraftModal
  open={deleteModalOpen}
  targetTemplates={targetsToDelete}
  isDeleting={isDeletingDraft}
  onConfirm={handleConfirmDelete}
  onClose={() => {
    if (!isDeletingDraft) {
      deleteModalOpen = false;
      targetsToDelete = [];
    }
  }}
/>
