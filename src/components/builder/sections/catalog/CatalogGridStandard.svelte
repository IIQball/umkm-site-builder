<script lang="ts">
  import type { ProductItem } from '@/types';
  import ProductCatalogCard from './ProductCatalogCard.svelte';

  export let products: ProductItem[] = [];
  export let activePreset: string = 'grid_standard';
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
  export let gridColumnsClass: string = '';
  export let gridGapClass: string = '';
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

<div
  class={`grid w-full ${
    isHorizontalLayout
      ? "grid-cols-1 md:grid-cols-2 gap-4"
      : activePreset === "compact_mini_cards"
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
      : activePreset === "lookbook_gallery"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      : `${gridColumnsClass} ${gridGapClass}`
  }`}
>
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
