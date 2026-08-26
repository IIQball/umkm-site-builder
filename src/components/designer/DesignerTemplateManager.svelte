<script lang="ts">
  import { toast } from '@/lib/toast';
  import { Plus, Store } from 'lucide-svelte';
  import type { TemplateItem } from '@/types/templates';
  import DesignerTemplateCard from './DesignerTemplateCard.svelte';
  import DeleteTemplateModal from './DeleteTemplateModal.svelte';
  import TemplateFilterTabs from './templates/TemplateFilterTabs.svelte';
  import TemplateBulkToolbar from './templates/TemplateBulkToolbar.svelte';
  import TemplateRejectionModal from './templates/TemplateRejectionModal.svelte';

  export let initialTemplates: TemplateItem[] = [];

  let templates: TemplateItem[] = [...initialTemplates];
  let activeFilter: 'all' | 'draft' | 'pending' | 'approved' | 'rejected' = 'all';

  // Selection & Bulk delete state
  let isSelectionMode = false;
  let selectedIds = new Set<string>();

  // Modal State
  let isDeleteModalOpen = false;
  let deleteMode: 'single' | 'bulk' = 'single';
  let targetSingleTemplate: TemplateItem | null = null;
  let isDeleting = false;

  // Rejection modal state
  let isRejectionModalOpen = false;
  let rejectionTarget: TemplateItem | null = null;

  $: counts = {
    all: templates.length,
    draft: templates.filter((t) => t.status === 'draft').length,
    pending: templates.filter((t) => t.status === 'pending_review' || t.status === 'pending').length,
    approved: templates.filter((t) => t.status === 'approved').length,
    rejected: templates.filter((t) => t.status === 'rejected').length,
  };

  $: filteredTemplates = templates.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return t.status === 'pending_review' || t.status === 'pending';
    return t.status === activeFilter;
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.has(id)) {
      selectedIds.delete(id);
    } else {
      selectedIds.add(id);
    }
    selectedIds = new Set(selectedIds);
  };

  const selectAll = () => {
    selectedIds = new Set(filteredTemplates.map((t) => t.id));
  };

  const clearSelection = () => {
    selectedIds = new Set();
  };

  const openDeleteModal = (template: TemplateItem) => {
    targetSingleTemplate = template;
    deleteMode = 'single';
    isDeleteModalOpen = true;
  };

  const openBulkDeleteModal = () => {
    if (selectedIds.size === 0) return;
    deleteMode = 'bulk';
    isDeleteModalOpen = true;
  };

  const openRejectionModal = (template: TemplateItem) => {
    rejectionTarget = template;
    isRejectionModalOpen = true;
  };

  const handleConfirmDelete = async () => {
    isDeleting = true;
    try {
      if (deleteMode === 'single' && targetSingleTemplate) {
        const res = await fetch(`/api/designer/templates/draft?id=${targetSingleTemplate.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus template');
        templates = templates.filter((t) => t.id !== targetSingleTemplate!.id);
        toast.success('Template berhasil dihapus secara permanen.');
      } else if (deleteMode === 'bulk' && selectedIds.size > 0) {
        const res = await fetch('/api/designer/templates/batch-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateIds: Array.from(selectedIds) }),
        });
        if (!res.ok) throw new Error('Gagal menghapus beberapa template');
        templates = templates.filter((t) => !selectedIds.has(t.id));
        toast.success(`${selectedIds.size} template berhasil dihapus secara permanen.`);
        clearSelection();
        isSelectionMode = false;
      }
      isDeleteModalOpen = false;
    } catch (e: any) {
      toast.error(e.message || 'Terjadi kesalahan saat menghapus template');
    } finally {
      isDeleting = false;
    }
  };
</script>

<div class="space-y-6">
  <!-- Top Bar: Filter tabs & Actions -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <TemplateFilterTabs
      {activeFilter}
      {counts}
      onSelectFilter={(f) => { activeFilter = f; clearSelection(); }}
    />

    <div class="flex items-center gap-3">
      <TemplateBulkToolbar
        {isSelectionMode}
        selectedCount={selectedIds.size}
        totalCount={filteredTemplates.length}
        onToggleSelectionMode={() => { isSelectionMode = !isSelectionMode; clearSelection(); }}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onDeleteSelected={openBulkDeleteModal}
      />
    </div>
  </div>

  <!-- Template Grid -->
  {#if filteredTemplates.length === 0}
    <div class="py-16 text-center border border-dashed border-light rounded-3xl space-y-3 bg-card/60">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mx-auto text-muted">
        <Store size={28} />
      </div>
      <div class="space-y-1">
        <h4 class="font-bold text-sm text-main">Tidak Ada Template Ditemukan</h4>
        <p class="text-xs text-secondary max-w-sm mx-auto">
          {#if activeFilter !== 'all'}
            Tidak ada template dengan status "{activeFilter}". Coba pilih filter lainnya.
          {:else}
            Mulai rancang desain visual pertama Anda menggunakan Visual Builder.
          {/if}
        </p>
      </div>
      {#if activeFilter === 'all'}
        <a
          href="/builder/new"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={14} />
          <span>Buat Template Sekarang</span>
        </a>
      {/if}
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredTemplates as template (template.id)}
        <DesignerTemplateCard
          {template}
          {isSelectionMode}
          isSelected={selectedIds.has(template.id)}
          onToggleSelect={() => toggleSelect(template.id)}
          onDelete={() => openDeleteModal(template)}
          onViewRejection={() => openRejectionModal(template)}
        />
      {/each}
    </div>
  {/if}

  <!-- Delete Modal -->
  <DeleteTemplateModal
    isOpen={isDeleteModalOpen}
    mode={deleteMode}
    targetTemplate={targetSingleTemplate}
    selectedCount={selectedIds.size}
    {isDeleting}
    onClose={() => (isDeleteModalOpen = false)}
    onConfirm={handleConfirmDelete}
  />

  <!-- Rejection Modal -->
  <TemplateRejectionModal
    isOpen={isRejectionModalOpen}
    template={rejectionTarget}
    onClose={() => (isRejectionModalOpen = false)}
  />
</div>
