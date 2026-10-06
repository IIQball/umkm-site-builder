<script lang="ts">
  import { Card, Table, Pagination } from '@/components/ui';
  import DesignerTemplateCard from './DesignerTemplateCard.svelte';
  import DesignerTemplateRow from './templates/DesignerTemplateRow.svelte';
  import DesignerRejectionModal from './templates/DesignerRejectionModal.svelte';
  import DesignerDeleteDraftModal from './templates/DesignerDeleteDraftModal.svelte';
  import { addToast } from '@/lib/toast';
  import { formatDate } from '@/lib/utils/format';
  import type { PaginatedResult } from '@/types/common';

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
  export let pagination: PaginatedResult<any> | undefined = undefined;

  let searchQuery = '';
  let activeFilter: 'all' | 'draft' | 'pending' | 'approved' | 'rejected' = 'all';
  // Default tampilan card/grid sesuai permintaan user
  let viewMode: 'table' | 'grid' = 'grid';
  let selectedRejection: { name: string; reason: string } | null = null;
  let copiedId: string | null = null;
  let currentPage = 1;
  $: if (pagination?.currentPage) currentPage = pagination.currentPage;
  const pageSize = 10;

  $: activePage = pagination ? pagination.currentPage : currentPage;
  $: activePageSize = pagination ? pagination.pageSize : pageSize;
  $: activeTotalItems = pagination ? pagination.totalItems : filteredTemplates.length;

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
    if (!pagination) currentPage = 1;
  }

  $: paginatedTemplates = pagination
    ? templates
    : filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    { label: '#', align: 'center' as const, width: 'w-10' },
    { label: 'Template Desain', align: 'left' as const },
    { label: 'Harga Jual', align: 'left' as const, width: 'w-32' },
    { label: 'Penjualan', align: 'left' as const, width: 'w-28' },
    { label: 'Status Kurasi', align: 'left' as const, width: 'w-36' },
    { label: 'Tanggal Dibuat', align: 'left' as const, width: 'w-36' },
    { label: 'Aksi', align: 'right' as const, width: 'w-44' },
  ];
  import DesignerTemplateTableToolbar from './templates/DesignerTemplateTableToolbar.svelte';
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <DesignerTemplateTableToolbar
    bind:searchQuery
    bind:activeFilter
    bind:viewMode
    {counts}
    {selectedDraftIds}
    {allVisibleDraftsSelected}
    {hasDraftSelection}
    onToggleSelectAllVisibleDrafts={toggleSelectAllVisibleDrafts}
    onClearDraftSelection={clearDraftSelection}
    onOpenDeleteBatchModal={openDeleteModalForBatch}
  />

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
      {#each paginatedTemplates as tpl, idx (tpl.id)}
        {@const badge = getStatusBadge(tpl.status)}
        <DesignerTemplateRow
          rowNumber={(activePage - 1) * activePageSize + idx + 1}
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
      {#each paginatedTemplates as tpl, idx (tpl.id)}
        <DesignerTemplateCard
          rowNumber={(activePage - 1) * activePageSize + idx + 1}
          template={tpl}
          isSelected={selectedDraftIds.includes(tpl.id)}
          onToggleSelect={toggleDraftSelect}
          onDeleteDraft={openDeleteModalForSingle}
        />
      {/each}
    </div>
  {/if}

  {#if activeTotalItems > 0}
    <Pagination
      bind:currentPage={currentPage}
      totalItems={activeTotalItems}
      pageSize={activePageSize}
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
