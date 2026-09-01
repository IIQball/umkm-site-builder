<script lang="ts">
  import type { ProductItem } from '@/types';
  import ProductCatalogCard from './ProductCatalogCard.svelte';

  export let products: ProductItem[] = [];
  export let activePreset: string = 'list_compact';
  export let cardRadiusClass: string = 'rounded-xl';
  export let cardPresetClass: string = 'bg-white shadow-sm border border-slate-100';
  export let imageAspectClass: string = 'aspect-square';
  export let badgePosClass: string = 'top-3 left-3';
  export let badgeColorClass: string = 'bg-red-500 text-white';
  export let nameSizeClass: string = 'text-sm';
  export let nameWeightClass: string = 'font-bold';
  export let ctaBtnRadiusClass: string = 'rounded-lg';
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};
</script>

<div class="max-w-4xl mx-auto flex flex-col gap-3">
  {#each products as product, index (product.id)}
    <ProductCatalogCard
      {product}
      {index}
      {activePreset}
      isHorizontalLayout={true}
      {cardRadiusClass}
      {cardPresetClass}
      {imageAspectClass}
      {badgePosClass}
      {badgeColorClass}
      {nameSizeClass}
      {nameWeightClass}
      {ctaBtnRadiusClass}
      {onAddToCart}
      {onBuyNow}
    />
  {/each}
</div>
