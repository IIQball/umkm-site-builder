<script lang="ts">
  import type { ProductItem } from '@/types';
  import ProductCatalogCard from './ProductCatalogCard.svelte';

  export let products: ProductItem[] = [];
  export let activePreset: string = 'bento_product_spotlight';
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
  export let onDragStart: (e: DragEvent, idx: number) => void = () => {};
  export let onDragOver: (e: DragEvent, idx: number) => void = () => {};
  export let onDrop: (e: DragEvent, idx: number) => void = () => {};
  export let onDragLeave: () => void = () => {};
  export let onAddToCart: (p: ProductItem, s: Record<string, string>) => void = () => {};
  export let onBuyNow: (p: ProductItem, s: Record<string, string>) => void = () => {};
</script>

<div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch text-left">
  {#if products[0]}
    <!-- Spotlight Main Card (Spans 6 cols) -->
    <div class="md:col-span-6 p-6 rounded-3xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-xl flex flex-col justify-between gap-6">
      <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
        {#if products[0].imageUrl}
          <img src={products[0].imageUrl} alt={products[0].name} class="w-full h-full object-cover" />
        {/if}
        <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-[var(--theme-primary,#2563eb)] text-white text-xs font-bold shadow">
          ⭐ Produk Paling Laris
        </span>
      </div>
      <div class="flex flex-col gap-2">
        <h3 class="text-xl font-black text-[var(--theme-text-primary,#0f172a)]">{products[0].name}</h3>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">{products[0].description}</p>
        <div class="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <span class="text-xl font-black font-mono text-[var(--theme-primary,#2563eb)]">
            Rp {typeof products[0].price === 'number' ? products[0].price.toLocaleString('id-ID') : products[0].price}
          </span>
          <button
            type="button"
            on:click={() => onBuyNow(products[0], {})}
            class="px-6 py-2 rounded-xl bg-[var(--theme-primary,#2563eb)] text-white font-bold text-xs shadow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Secondary Grid (Spans 6 cols, 2x2 cards) -->
  <div class="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {#each products.slice(1, 5) as product, idx}
      <ProductCatalogCard
        {product}
        index={idx + 1}
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
