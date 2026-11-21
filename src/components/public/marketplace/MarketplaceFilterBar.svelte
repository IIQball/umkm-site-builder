<script lang="ts">
  import { RotateCcw, Search, ChevronDown, ArrowUpDown } from 'lucide-svelte';
  import { SearchableSelect } from '@/components/ui';
  import type { CategoryItem, PublicTemplate } from '../marketplace.types';

  export let searchQuery: string = '';
  export let selectedCategorySlug: string = 'all';
  export let selectedPriceFilter: string = 'all';
  export let selectedSort: string = 'newest';
  export let categories: CategoryItem[] = [];
  export let templates: PublicTemplate[] = [];
  export let onReset: () => void;

  $: categoryOptions = [
    { value: 'all', label: 'Semua Kategori', sublabel: `${templates.length} template` },
    ...categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
      sublabel: `${templates.filter((t) => t.categorySlug === cat.slug).length} template`,
    })),
  ];
</script>

<div class="bg-card rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
  <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
    <!-- Search Bar -->
    <div class="relative flex-1">
      <input
        id="marketplace-search-input"
        type="text"
        bind:value={searchQuery}
        placeholder="Cari tema toko, kuliner, fashion, nama desainer..."
        class="w-full bg-nested/80 rounded-full pl-11 pr-4 py-3 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all shadow-2xs font-sans border-0"
      />
      <Search
        size={18}
        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10 select-none"
        aria-hidden="true"
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

    <!-- Category, Price & Sort Dropdown Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Category Searchable Dropdown -->
      <div class="w-full sm:w-56">
        <SearchableSelect
          id="marketplace-category-select"
          value={selectedCategorySlug}
          options={categoryOptions}
          placeholder="Pilih Kategori..."
          searchPlaceholder="Cari kategori..."
          size="md"
          clearable={false}
          fullWidth={true}
          on:change={(e) => {
            selectedCategorySlug = String(e.detail.value || 'all');
          }}
        />
      </div>

      <!-- Price Filter Dropdown -->
      <div class="relative min-w-[130px] flex-1 sm:flex-initial">
        <select
          id="marketplace-price-filter"
          bind:value={selectedPriceFilter}
          class="w-full bg-nested/80 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-main focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs cursor-pointer appearance-none pr-8 border-0"
        >
          <option value="all">Semua Harga</option>
          <option value="free">Gratis (Rp 0)</option>
          <option value="paid">Berbayar (Semua)</option>
          <option value="under50">&lt; Rp 50.000</option>
          <option value="50to100">Rp 50.000 - Rp 100.000</option>
          <option value="above100">&gt; Rp 100.000</option>
        </select>
        <ChevronDown
          size={14}
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10 select-none"
          aria-hidden="true"
        />
      </div>

      <!-- Sorting Dropdown -->
      <div class="relative min-w-[130px] flex-1 sm:flex-initial">
        <select
          id="marketplace-sort-filter"
          bind:value={selectedSort}
          class="w-full bg-nested/80 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-main focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs cursor-pointer appearance-none pr-8 border-0"
        >
          <option value="newest">Terbaru</option>
          <option value="price_asc">Harga: Terendah</option>
          <option value="price_desc">Harga: Tertinggi</option>
          <option value="name_asc">Nama (A - Z)</option>
        </select>
        <ArrowUpDown
          size={14}
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10 select-none"
          aria-hidden="true"
        />
      </div>

      {#if searchQuery || selectedCategorySlug !== 'all' || selectedPriceFilter !== 'all' || selectedSort !== 'newest'}
        <button
          type="button"
          on:click={onReset}
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-error/10 hover:bg-error/20 text-error text-xs font-bold transition-colors cursor-pointer active:scale-95"
          title="Reset Semua Filter"
        >
          <RotateCcw size={13} />
          <span class="hidden sm:inline">Reset</span>
        </button>
      {/if}
    </div>
  </div>
</div>
