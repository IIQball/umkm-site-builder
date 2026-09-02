<script lang="ts">
  import type { ProductItem } from '@/types';
  import ProductCatalogCard from './ProductCatalogCard.svelte';

  export let activePreset: string = 'horizontal_carousel';
  export let products: ProductItem[] = [];
  export let cardRadiusClass: string = 'rounded-xl';
  export let cardPresetClass: string = 'bg-white shadow-sm border border-slate-100';
  export let imageAspectClass: string = 'aspect-square';
  export let badgePosClass: string = 'top-3 left-3';
  export let badgeColorClass: string = 'bg-red-500 text-white';
  export let nameSizeClass: string = 'text-sm';
  export let nameWeightClass: string = 'font-bold';
  export let ctaBtnRadiusClass: string = 'rounded-lg';
  export let isHorizontalLayout: boolean = false;
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};
</script>

{#if activePreset === 'horizontal_carousel'}
  <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin px-1">
    {#each products as product, index (product.id)}
      <div class="w-64 sm:w-72 shrink-0 snap-start">
        <ProductCatalogCard
          {product}
          {index}
          {activePreset}
          {cardRadiusClass}
          {cardPresetClass}
          {imageAspectClass}
          {badgePosClass}
          {badgeColorClass}
          {nameSizeClass}
          {nameWeightClass}
          {ctaBtnRadiusClass}
          {isHorizontalLayout}
          {onAddToCart}
          {onBuyNow}
        />
      </div>
    {/each}
  </div>
{:else if activePreset === 'masonry_dynamic'}
  <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
    {#each products as product, index (product.id)}
      <div class="break-inside-avoid">
        <ProductCatalogCard
          {product}
          {index}
          {activePreset}
          {cardRadiusClass}
          {cardPresetClass}
          {imageAspectClass}
          {badgePosClass}
          {badgeColorClass}
          {nameSizeClass}
          {nameWeightClass}
          {ctaBtnRadiusClass}
          {isHorizontalLayout}
          {onAddToCart}
          {onBuyNow}
        />
      </div>
    {/each}
  </div>
{:else if activePreset === 'grid_3_wide'}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each products as product, index (product.id)}
      <ProductCatalogCard
        {product}
        {index}
        {activePreset}
        {cardRadiusClass}
        {cardPresetClass}
        {imageAspectClass}
        {badgePosClass}
        {badgeColorClass}
        {nameSizeClass}
        {nameWeightClass}
        {ctaBtnRadiusClass}
        {isHorizontalLayout}
        {onAddToCart}
        {onBuyNow}
      />
    {/each}
  </div>
{/if}
