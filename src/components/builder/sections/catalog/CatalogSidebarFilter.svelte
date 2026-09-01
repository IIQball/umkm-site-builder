<script lang="ts">
  import type { ProductItem } from '@/types';
  import ProductCatalogCard from './ProductCatalogCard.svelte';

  export let products: ProductItem[] = [];
  export let categories: { id: string; name: string; slug: string }[] = [];
  export let activeCategoryId: string = 'all';
  export let activePreset: string = 'split_category_sidebar';
  export let isHorizontalLayout: boolean = false;
  export let cardRadiusClass: string = '';
  export let cardPresetClass: string = '';
  export let imageAspectClass: string = '';
  export let badgePosClass: string = '';
  export let badgeColorClass: string = '';
  export let nameSizeClass: string = '';
  export let nameWeightClass: string = '';
  export let isInlinePrice: boolean = false;
  export let ctaBtnRadiusClass: string = '';
  export let isActive: boolean = false;
  export let draggedIdx: number | null = null;
  export let dropTargetIdx: number | null = null;
  export let onCategorySelect: (id: string) => void = () => {};
  export let onDragStart: (e: DragEvent, idx: number) => void = () => {};
  export let onDragOver: (e: DragEvent, idx: number) => void = () => {};
  export let onDrop: (e: DragEvent, idx: number) => void = () => {};
  export let onDragLeave: () => void = () => {};
  export let onAddToCart: (p: ProductItem, s: Record<string, string>) => void = () => {};
  export let onBuyNow: (p: ProductItem, s: Record<string, string>) => void = () => {};
</script>

<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
  <!-- Sidebar Categories -->
  <div class="md:col-span-3 p-4 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col gap-1.5">
    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Kategori</h4>
    <button
      type="button"
      on:click={() => onCategorySelect("all")}
      class={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
        activeCategoryId === "all" ? "bg-[var(--theme-primary,#2563eb)] text-white" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
      }`}
    >
      Semua Produk
    </button>
    {#each (categories.length > 0 ? categories : [{ id: '1', name: 'Makanan & Minuman', slug: 'makanan' }, { id: '2', name: 'Fashion & Pakaian', slug: 'fashion' }, { id: '3', name: 'Aksesoris', slug: 'aksesoris' }]) as cat}
      <button
        type="button"
        on:click={() => onCategorySelect(cat.id)}
        class={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
          activeCategoryId === cat.id ? "bg-[var(--theme-primary,#2563eb)] text-white" : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
        }`}
      >
        {cat.name}
      </button>
    {/each}
  </div>

  <!-- Product Grid in remaining 9 cols -->
  <div class="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each products as product, index (product.name + index)}
      <ProductCatalogCard
        {product}
        {index}
        {activePreset}
        {isHorizontalLayout}
        {cardRadiusClass}
        {cardPresetClass}
        {imageAspectClass}
        {badgePosClass}
        {badgeColorClass}
        {nameSizeClass}
        {nameWeightClass}
        {isInlinePrice}
        {ctaBtnRadiusClass}
        {isActive}
        {draggedIdx}
        {dropTargetIdx}
        {onDragStart}
        {onDragOver}
        {onDrop}
        {onDragLeave}
        {onAddToCart}
        {onBuyNow}
      />
    {/each}
  </div>
</div>
