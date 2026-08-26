<script lang="ts">
  import { toast } from '@/lib/toast';
  import {
    Layers,
    CheckCircle2,
    Hourglass,
    FileEdit,
    AlertOctagon,
    Plus,
    CheckSquare,
    Square,
    Trash2,
    X,
    Filter,
    Store,
  } from 'lucide-svelte';
  import DesignerTemplateCard from './DesignerTemplateCard.svelte';
  import DeleteTemplateModal from './DeleteTemplateModal.svelte';

  interface TemplateItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    thumbnailUrl: string | null;
    status: string;
    rejectionReason: string | null;
    createdAt: Date | string;
    totalSold: number;
  }

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

  // Rejection reason modal state
  let isRejectionModalOpen = false;
  let rejectionTarget: TemplateItem | null = null;

  $: counts = {
    all: templates.length,
    draft: templates.filter((t) => t.status === 'draft').length,
    pending: templates.filter((t) => t.status === 'pending').length,
    approved: templates.filter((t) => t.status === 'approved').length,
    rejected: templates.filter((t) => t.status === 'rejected').length,
  };

  $: filteredTemplates = templates.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.status === activeFilter;
  });

  // Selectable templates in the current view (only draft or rejected can be deleted)
  $: selectableInCurrentView = filteredTemplates.filter(
    (t) => t.status === 'draft' || t.status === 'rejected'
  );

  $: isAllSelectableChosen =
    selectableInCurrentView.length > 0 &&
    selectableInCurrentView.every((t) => selectedIds.has(t.id));

  const toggleSelectionMode = () => {
    isSelectionMode = !isSelectionMode;
    if (!isSelectionMode) {
      selectedIds.clear();
      selectedIds = new Set(selectedIds);
    }
  };

  const handleToggleSelect = (event: CustomEvent<{ templateId: string }>) => {
    const { templateId } = event.detail;
    if (selectedIds.has(templateId)) {
      selectedIds.delete(templateId);
    } else {
      selectedIds.add(templateId);
    }
    selectedIds = new Set(selectedIds);
  };

  const handleSelectAllToggle = () => {
    if (isAllSelectableChosen) {
      // Unselect all in current view
      selectableInCurrentView.forEach((t) => selectedIds.delete(t.id));
    } else {
      // Select all selectable in current view
      selectableInCurrentView.forEach((t) => selectedIds.add(t.id));
    }
    selectedIds = new Set(selectedIds);
  };

  const openSingleDelete = (event: CustomEvent<{ template: TemplateItem }>) => {
    targetSingleTemplate = event.detail.template;
    deleteMode = 'single';
    isDeleteModalOpen = true;
  };

  const openBulkDelete = () => {
    if (selectedIds.size === 0) return;
    deleteMode = 'bulk';
    isDeleteModalOpen = true;
  };

  const handleConfirmDelete = async () => {
    isDeleting = true;
    try {
      if (deleteMode === 'single' && targetSingleTemplate) {
        const res = await fetch(`/api/designer/templates/draft?templateId=${targetSingleTemplate.id}`, {
          method: 'DELETE',
        });
        const result = await res.json();

        if (res.ok && result.success) {
          templates = templates.filter((t) => t.id !== targetSingleTemplate!.id);
          selectedIds.delete(targetSingleTemplate.id);
          selectedIds = new Set(selectedIds);
          toast.success(`Template "${targetSingleTemplate.name}" berhasil dihapus.`);
          isDeleteModalOpen = false;
        } else {
          toast.error(result.error?.message || 'Gagal menghapus template');
        }
      } else if (deleteMode === 'bulk') {
        const idsToDelete = Array.from(selectedIds);
        const res = await fetch('/api/designer/templates/batch-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateIds: idsToDelete }),
        });
        const result = await res.json();

        if (res.ok && result.success) {
          const count = result.data?.count ?? idsToDelete.length;
          templates = templates.filter((t) => !selectedIds.has(t.id));
          selectedIds.clear();
          selectedIds = new Set(selectedIds);
          isSelectionMode = false;
          toast.success(`${count} template berhasil dihapus permanen.`);
          isDeleteModalOpen = false;
        } else {
          toast.error(result.error?.message || 'Gagal menghapus template yang dipilih');
        }
      }
    } catch {
      toast.error('Terjadi gangguan jaringan saat menghapus template');
    } finally {
      isDeleting = false;
    }
  };

  const openRejectionModal = (event: CustomEvent<{ template: TemplateItem }>) => {
    rejectionTarget = event.detail.template;
    isRejectionModalOpen = true;
  };
</script>

<div class="flex flex-col gap-6">
  <!-- Top Stat Cards -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="bg-card border border-light rounded-2xl p-4 shadow-sm border-t-2 border-t-indigo-400 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-secondary">Total Template</span>
        <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
          <Layers size={16} />
        </div>
      </div>
      <div class="mt-3 flex items-baseline justify-between">
        <span class="text-2xl font-black text-main">{counts.all}</span>
        <span class="badge-custom badge-custom-indigo text-[10px]">Koleksi</span>
      </div>
    </div>

    <div class="bg-card border border-light rounded-2xl p-4 shadow-sm border-t-2 border-t-emerald-400 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-secondary">Disetujui</span>
        <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 size={16} />
        </div>
      </div>
      <div class="mt-3 flex items-baseline justify-between">
        <span class="text-2xl font-black text-main">{counts.approved}</span>
        <span class="badge-custom badge-custom-emerald text-[10px]">Aktif</span>
      </div>
    </div>

    <div class="bg-card border border-light rounded-2xl p-4 shadow-sm border-t-2 border-t-amber-400 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-secondary">Menunggu Review</span>
        <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
          <Hourglass size={16} />
        </div>
      </div>
      <div class="mt-3 flex items-baseline justify-between">
        <span class="text-2xl font-black text-main">{counts.pending}</span>
        <span class="badge-custom badge-custom-warning text-[10px]">Antrean</span>
      </div>
    </div>

    <div class="bg-card border border-light rounded-2xl p-4 shadow-sm border-t-2 border-t-slate-400 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-secondary">Draft</span>
        <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
          <FileEdit size={16} />
        </div>
      </div>
      <div class="mt-3 flex items-baseline justify-between">
        <span class="text-2xl font-black text-main">{counts.draft}</span>
        <span class="badge-custom badge-custom-slate text-[10px]">Revisi</span>
      </div>
    </div>
  </div>

  <!-- Filter, Bulk Action Controls, & Template Grid Container -->
  <div class="bg-card border border-light rounded-2xl shadow-sm overflow-hidden">
    <!-- Header with Filter tabs and Bulk selection button -->
    <div class="px-6 py-4 border-b border-light flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-bold text-main flex items-center gap-2">
          <Filter size={15} class="text-primary" />
          <span>Daftar Template Desain</span>
        </h3>
        <p class="text-xs text-secondary mt-0.5">Kelola draf, publikasi, dan hapus template</p>
      </div>

      <div class="flex items-center gap-3 flex-wrap w-full md:w-auto justify-between md:justify-end">
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 bg-nested border border-light rounded-xl p-1 overflow-x-auto flex-shrink-0">
          <button
            type="button"
            on:click={() => (activeFilter = 'all')}
            class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'text-secondary hover:text-main hover:bg-card'
            }`}
          >
            <span>Semua</span>
            <span class={`text-[11px] font-bold rounded-md px-1.5 py-0.5 leading-none ${activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-card text-secondary'}`}>
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            on:click={() => (activeFilter = 'draft')}
            class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'draft'
                ? 'bg-primary text-white shadow-sm'
                : 'text-secondary hover:text-main hover:bg-card'
            }`}
          >
            <span>Draft</span>
            <span class={`text-[11px] font-bold rounded-md px-1.5 py-0.5 leading-none ${activeFilter === 'draft' ? 'bg-white/20 text-white' : 'bg-card text-secondary'}`}>
              {counts.draft}
            </span>
          </button>

          <button
            type="button"
            on:click={() => (activeFilter = 'pending')}
            class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'pending'
                ? 'bg-primary text-white shadow-sm'
                : 'text-secondary hover:text-main hover:bg-card'
            }`}
          >
            <span>Menunggu</span>
            <span class={`text-[11px] font-bold rounded-md px-1.5 py-0.5 leading-none ${activeFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-card text-secondary'}`}>
              {counts.pending}
            </span>
          </button>

          <button
            type="button"
            on:click={() => (activeFilter = 'approved')}
            class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'approved'
                ? 'bg-primary text-white shadow-sm'
                : 'text-secondary hover:text-main hover:bg-card'
            }`}
          >
            <span>Disetujui</span>
            <span class={`text-[11px] font-bold rounded-md px-1.5 py-0.5 leading-none ${activeFilter === 'approved' ? 'bg-white/20 text-white' : 'bg-card text-secondary'}`}>
              {counts.approved}
            </span>
          </button>

          <button
            type="button"
            on:click={() => (activeFilter = 'rejected')}
            class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'rejected'
                ? 'bg-primary text-white shadow-sm'
                : 'text-secondary hover:text-main hover:bg-card'
            }`}
          >
            <span>Ditolak</span>
            <span class={`text-[11px] font-bold rounded-md px-1.5 py-0.5 leading-none ${activeFilter === 'rejected' ? 'bg-white/20 text-white' : 'bg-card text-secondary'}`}>
              {counts.rejected}
            </span>
          </button>
        </div>

        <!-- Bulk Selection Mode Toggle Button -->
        {#if templates.some((t) => t.status === 'draft' || t.status === 'rejected')}
          <div class="flex items-center gap-2">
            <button
              type="button"
              on:click={toggleSelectionMode}
              class={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                isSelectionMode
                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 border-rose-300 dark:border-rose-800 shadow-sm'
                  : 'bg-card text-secondary hover:text-main border-light hover:bg-nested'
              }`}
            >
              {#if isSelectionMode}
                <X size={14} />
                <span>Batal Pilih</span>
              {:else}
                <CheckSquare size={14} />
                <span>Pilih Template</span>
              {/if}
            </button>

            {#if isSelectionMode && selectableInCurrentView.length > 0}
              <button
                type="button"
                on:click={handleSelectAllToggle}
                class="px-3 py-1.5 rounded-xl text-xs font-bold text-secondary hover:text-main border border-light hover:bg-nested transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {#if isAllSelectableChosen}
                  <Square size={13} />
                  <span>Hapus Centang</span>
                {:else}
                  <CheckSquare size={13} />
                  <span>Pilih Semua ({selectableInCurrentView.length})</span>
                {/if}
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <!-- Template Grid / Empty State -->
    <div class="p-6">
      {#if filteredTemplates.length === 0}
        <div class="py-16 flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Store size={28} />
          </div>
          <h3 class="text-sm font-bold text-main">Tidak Ada Template</h3>
          <p class="text-xs text-secondary mt-1 mb-6 max-w-xs mx-auto leading-relaxed">
            {#if activeFilter !== 'all'}
              Tidak ada template dengan status "{activeFilter}".
            {:else}
              Mulai rancang dan publikasikan template toko online UMKM pertama Anda.
            {/if}
          </p>
          {#if activeFilter === 'all'}
            <a
              href="/builder/new"
              class="btn btn-primary text-xs font-bold rounded-xl px-6 py-2.5 flex items-center gap-2"
            >
              <Plus size={15} />
              <span>Buat Template Baru</span>
            </a>
          {/if}
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {#each filteredTemplates as tpl (tpl.id)}
            <DesignerTemplateCard
              template={tpl}
              {isSelectionMode}
              isSelected={selectedIds.has(tpl.id)}
              on:toggleSelect={handleToggleSelect}
              on:deleteSingle={openSingleDelete}
              on:showRejection={openRejectionModal}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Floating Action Bar (Bulk Delete) -->
{#if isSelectionMode && selectedIds.size > 0}
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg p-3 sm:p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-rose-500/40 shadow-2xl flex items-center justify-between gap-4 animate-fade-in">
    <div class="flex items-center gap-2.5 min-w-0">
      <span class="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
        {selectedIds.size}
      </span>
      <p class="text-xs sm:text-sm font-bold text-main truncate">
        Template Terpilih
      </p>
    </div>

    <div class="flex items-center gap-2 flex-shrink-0">
      <button
        type="button"
        on:click={() => { selectedIds.clear(); selectedIds = new Set(); }}
        class="px-3 py-1.5 text-xs font-bold text-secondary hover:text-main rounded-xl border border-light hover:bg-nested transition-all cursor-pointer"
      >
        Batal
      </button>

      <button
        type="button"
        on:click={openBulkDelete}
        class="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <Trash2 size={13} />
        <span>Hapus ({selectedIds.size})</span>
      </button>
    </div>
  </div>
{/if}

<!-- Single & Bulk Delete Confirmation Modal -->
<DeleteTemplateModal
  isOpen={isDeleteModalOpen}
  mode={deleteMode}
  templateName={targetSingleTemplate?.name || ''}
  selectedCount={selectedIds.size}
  {isDeleting}
  on:confirm={handleConfirmDelete}
  on:cancel={() => { isDeleteModalOpen = false; }}
/>

<!-- Rejection Reason Modal -->
{#if isRejectionModalOpen && rejectionTarget}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    on:click={(e) => { if (e.target === e.currentTarget) isRejectionModalOpen = false; }}
    on:keydown={(e) => { if (e.key === 'Escape') isRejectionModalOpen = false; }}
  >
    <div class="bg-card border border-light rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-left">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center flex-shrink-0">
          <AlertOctagon size={18} />
        </div>
        <h3 class="text-sm font-bold text-main">Alasan Penolakan Template</h3>
      </div>

      <p class="text-xs font-bold text-secondary">
        Template: <strong class="text-main">{rejectionTarget.name}</strong>
      </p>

      <div class="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl p-3.5 text-xs font-medium leading-relaxed font-mono">
        <p>{rejectionTarget.rejectionReason || 'Tidak ada catatan alasan penolakan terperinci dari admin.'}</p>
      </div>

      <div class="flex items-center justify-end pt-3 border-t border-light mt-1">
        <button
          type="button"
          on:click={() => (isRejectionModalOpen = false)}
          class="px-4 py-2 text-xs font-bold text-main border border-light hover:bg-nested rounded-xl transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
