<script lang="ts">
  import { RotateCcw } from 'lucide-svelte';
  import type { CategoryItem, PublicTemplate } from '../marketplace.types';

  export let searchQuery: string = '';
  export let selectedCategorySlug: string = 'all';
  export let selectedPriceFilter: string = 'all';
  export let selectedSort: string = 'newest';
  export let categories: CategoryItem[] = [];
  export let templates: PublicTemplate[] = [];
  export let onReset: () => void;
</script>

<div class="bg-card border border-light rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
  <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
    <!-- Search Bar -->
    <div class="relative flex-1">
      <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-lg pointer-events-none">
        search
      </span>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari tema toko, kuliner, fashion, nama desainer..."
        class="w-full bg-nested/70 border border-light rounded-full pl-11 pr-4 py-3 text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all shadow-2xs font-sans"
      />
      {#if searchQuery}
        <button
          type="button"
          on:click={() => (searchQuery = '')}
          class="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-main text-xs bg-nested px-2.5 py-1 rounded-full cursor-pointer"
        >
          Hapus
        </button>
      {/if}
    </div>

    <!-- Price & Sort Dropdown Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Price Filter Dropdown -->
      <div class="relative min-w-[140px]">
        <select
          bind:value={selectedPriceFilter}
          class="w-full bg-nested/70 border border-light rounded-2xl px-3.5 py-2.5 text-xs font-bold text-main focus:outline-none focus:border-primary transition-all shadow-2xs cursor-pointer appearance-none pr-8"
        >
          <option value="all">Semua Harga</option>
          <option value="free">Gratis (Rp 0)</option>
          <option value="paid">Berbayar (Semua)</option>
          <option value="under50">&lt; Rp 50.000</option>
          <option value="50to100">Rp 50.000 - Rp 100.000</option>
          <option value="above100">&gt; Rp 100.000</option>
        </select>
        <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
          expand_more
        </span>
      </div>

      <!-- Sorting Dropdown -->
      <div class="relative min-w-[150px]">
        <select
          bind:value={selectedSort}
          class="w-full bg-nested/70 border border-light rounded-2xl px-3.5 py-2.5 text-xs font-bold text-main focus:outline-none focus:border-primary transition-all shadow-2xs cursor-pointer appearance-none pr-8"
        >
          <option value="newest">Terbaru</option>
          <option value="price_asc">Harga: Terendah</option>
          <option value="price_desc">Harga: Tertinggi</option>
          <option value="name_asc">Nama (A - Z)</option>
        </select>
        <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
          sort
        </span>
      </div>

      {#if searchQuery || selectedCategorySlug !== 'all' || selectedPriceFilter !== 'all' || selectedSort !== 'newest'}
        <button
          type="button"
          on:click={onReset}
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer active:scale-95"
          title="Reset Semua Filter"
        >
          <RotateCcw size={13} />
          <span class="hidden sm:inline">Reset</span>
        </button>
      {/if}
    </div>
  </div>

  <!-- Category Pills Rail -->
  <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-light/60">
    <button
      type="button"
      on:click={() => (selectedCategorySlug = 'all')}
      class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer {selectedCategorySlug === 'all'
        ? 'bg-slate-900 text-white dark:bg-primary dark:text-white shadow-2xs'
        : 'bg-nested/80 hover:bg-card border border-light text-secondary hover:text-main'}"
    >
      <span class="material-symbols-outlined text-sm">grid_view</span>
      <span>Semua Kategori</span>
      <span class="text-3xs opacity-80 bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded-full font-mono">
        {templates.length}
      </span>
    </button>

    {#each categories as cat (cat.id)}
      {@const count = templates.filter((t) => t.categorySlug === cat.slug).length}
      <button
        type="button"
        on:click={() => (selectedCategorySlug = cat.slug)}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer {selectedCategorySlug === cat.slug
          ? 'bg-slate-900 text-white dark:bg-primary dark:text-white shadow-2xs'
          : 'bg-nested/80 hover:bg-card border border-light text-secondary hover:text-main'}"
      >
        <span class="material-symbols-outlined text-sm">{cat.icon || 'folder'}</span>
        <span>{cat.name}</span>
        {#if count > 0}
          <span class="text-3xs opacity-80 bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded-full font-mono">
            {count}
          </span>
        {/if}
      </button>
    {/each}
  </div>
</div>
