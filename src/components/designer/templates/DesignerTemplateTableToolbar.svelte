<script lang="ts">
  import { Button } from '@/components/ui';
  import SearchableSelect from '@/components/ui/SearchableSelect.svelte';

  export let searchQuery: string = '';
  export let activeFilter: 'all' | 'draft' | 'pending' | 'approved' | 'rejected' = 'all';
  export let viewMode: 'table' | 'grid' = 'grid';
  export let categories: Array<{ id: string; name: string; slug: string }> = [];
  export let selectedCategory: string = 'all';
  export let counts: {
    all: number;
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  export let selectedDraftIds: string[] = [];
  export let allVisibleDraftsSelected: boolean = false;
  export let hasDraftSelection: boolean = false;

  export let onToggleSelectAllVisibleDrafts: () => void;
  export let onClearDraftSelection: () => void;
  export let onOpenDeleteBatchModal: () => void;

  $: categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
</script>

<!-- Table Header & Controls -->
<div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
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
        class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-40 sm:w-48"
      />
    </div>

    <!-- Category Filter Dropdown with Search (using existing UI component) -->
    {#if categories.length > 0}
      <div class="w-40 sm:w-48 flex-shrink-0">
        <SearchableSelect
          options={categoryOptions}
          bind:value={selectedCategory}
          placeholder="Pilih Kategori"
          searchPlaceholder="Cari kategori..."
          size="sm"
          clearable={false}
        />
      </div>
    {/if}

    <!-- Segmented Status Filter -->
    <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto">
      <button
        type="button"
        on:click={() => (activeFilter = 'all')}
        class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {activeFilter === 'all'
          ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
          : 'text-muted hover:text-main'}"
      >
        Semua ({counts.all})
      </button>
      <button
        type="button"
        on:click={() => (activeFilter = 'approved')}
        class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'approved'
          ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
          : 'text-muted hover:text-main'}"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
        Aktif ({counts.approved})
      </button>
      <button
        type="button"
        on:click={() => (activeFilter = 'pending')}
        class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'pending'
          ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
          : 'text-muted hover:text-main'}"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-warning"></span>
        Review ({counts.pending})
      </button>
      <button
        type="button"
        on:click={() => (activeFilter = 'draft')}
        class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'draft'
          ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
          : 'text-muted hover:text-main'}"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-muted"></span>
        Draft ({counts.draft})
      </button>
      <button
        type="button"
        on:click={() => (activeFilter = 'rejected')}
        class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'rejected'
          ? 'bg-main text-canvas dark:bg-primary shadow-2xs'
          : 'text-muted hover:text-main'}"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
        Ditolak ({counts.rejected})
      </button>
    </div>

    <!-- Batch Draft Selection Button (if drafts exist) -->
    {#if counts.draft > 0}
      <button
        type="button"
        on:click={onToggleSelectAllVisibleDrafts}
        class={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer active:scale-95 ${
          allVisibleDraftsSelected
            ? 'bg-primary text-white border-primary shadow-xs'
            : hasDraftSelection
            ? 'bg-primary/10 text-primary border-primary/30'
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
  <div class="px-5 sm:px-6 py-3 bg-primary/10 border-b border-primary/20 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
    <div class="flex items-center gap-2.5 text-xs font-bold text-primary">
      <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      <span>{selectedDraftIds.length} draf template dipilih</span>
    </div>
    <div class="flex items-center gap-2">
      <Button
        variant="secondary"
        size="xs"
        className="rounded-xl font-bold"
        on:click={onClearDraftSelection}
      >
        Batalkan Pilihan
      </Button>
      <Button
        variant="destructive"
        size="xs"
        className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
        on:click={onOpenDeleteBatchModal}
      >
        <span class="material-symbols-outlined text-xs">delete_forever</span>
        <span>Hapus Terpilih ({selectedDraftIds.length})</span>
      </Button>
    </div>
  </div>
{/if}
