<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { ShoppingBag, ShoppingCart } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveProductNodeStyle } from './productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let activePreset: string = 'grid_standard';
  export let buyButtonText: string = 'Beli';
  export let cartButtonText: string = 'Keranjang';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let isLiveStorefront: boolean = false;
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isTablet = viewMode === 'tablet';
  $: gridColsClass = isMobile
    ? 'grid-cols-1'
    : isTablet
    ? 'grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  function selectCard(e: Event, idx: number, prod: ProductItem) {
    e.stopPropagation();
    if (isLiveStorefront) {
      onAddToCart(prod, {});
      return;
    }
    if (sectionId) {
      canvasStore.selectNode(sectionId, prod.id || `product_item_${idx}`);
    }
  }

  function selectImage(e: Event, idx: number, prod?: ProductItem) {
    e.stopPropagation();
    if (isLiveStorefront && prod) {
      onAddToCart(prod, {});
      return;
    }
    if (sectionId) {
      canvasStore.selectNode(sectionId, `product_image_${idx}`);
    }
  }
</script>

<div class={`${activePreset === 'compact_mini_cards' ? 'cq-prod-grid-4' : 'cq-prod-grid-3'} grid ${gridColsClass} w-full`} style="gap: var(--active-gutter, 1.5rem);">
  {#each products as product, index (product.id || product.name + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
    {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}
    {@const displayImg = product.image || product.imageUrl || product.imageUrls?.[0]}
    {@const prodStyle = resolveProductNodeStyle(product, index, nodeStyles)}
    {@const currentPrice = Number(product.basePrice ?? product.price ?? 0)}
    {@const originalPrice = Number(product.originalPrice) || (product.showOriginalPrice === true && currentPrice > 0 ? Math.round(currentPrice * 1.3) : 0)}
    {@const hasDiscount = (product.showOriginalPrice === true || (product.showOriginalPrice !== false && !!product.originalPrice && Number(product.originalPrice) > currentPrice)) && originalPrice > currentPrice}
    
    <div
      data-node={product.id || `product_item_${index}`}
      data-node-id={product.id || `product_item_${index}`}
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      class={`bg-card border border-light/80 rounded-2xl p-4 flex flex-col justify-between relative transition-all duration-200 text-left cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-lg'
          : 'hover:shadow-md hover:border-light'
      }`}
      style="{prodStyle.marginTop ? `margin-top: ${prodStyle.marginTop};` : ''} {prodStyle.marginBottom ? `margin-bottom: ${prodStyle.marginBottom};` : ''}"
    >
      <div>
        <!-- Product Image -->
        <div
          data-node={`product_image_${index}`}
          data-node-id={`product_image_${index}`}
          role="button"
          tabindex="0"
          on:click={(e) => selectImage(e, index, product)}
          on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index, product); }}
          class={`aspect-square rounded-xl overflow-hidden bg-nested mb-3 relative group/img cursor-pointer ${
            isImgActive ? 'ring-2 ring-primary' : ''
          }`}
        >
          {#if displayImg}
            <img
              src={displayImg}
              alt={product.name}
              class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
              loading="lazy"
            />
          {:else}
            <div class="w-full h-full flex flex-col items-center justify-center text-secondary/60">
              <ShoppingBag size={24} />
            </div>
          {/if}

          {#if product.categoryName || product.category?.name}
            <span
              class="absolute top-2 left-2 backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10"
              style="background-color: color-mix(in srgb, var(--theme-secondary, var(--color-secondary)) 15%, transparent); color: var(--theme-secondary, var(--color-secondary)); border: 1px solid color-mix(in srgb, var(--theme-secondary, var(--color-secondary)) 30%, transparent); font-size: var(--theme-text-caption, var(--text-caption-size, 10px)); font-weight: var(--theme-text-caption-weight, var(--text-caption-weight, 700));"
            >
              {product.categoryName || product.category?.name}
            </span>
          {:else if product.badge}
            <span
              class="absolute top-2 left-2 text-2xs font-heading font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10"
              style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main)); font-size: var(--theme-text-caption, var(--text-caption-size, 10px)); font-weight: var(--theme-text-caption-weight, var(--text-caption-weight, 700));"
            >
              {product.badge}
            </span>
          {/if}
        </div>

        <h3
          class="font-heading font-bold text-xs sm:text-sm text-main line-clamp-2"
          style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 600)); {prodStyle.color ? `color: ${prodStyle.color} !important;` : ''}"
        >
          {product.name}
        </h3>
        
        {#if product.description}
          <p class="text-[11px] text-secondary line-clamp-2 mt-1 leading-relaxed" style="font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-weight: var(--theme-text-body-weight, var(--text-body-weight, 400));">
            {product.description}
          </p>
        {/if}
      </div>

      <div class="mt-3 pt-3 border-t border-light/60">
        <div class="flex items-baseline gap-1.5 flex-wrap mb-2">
          <p class="font-heading font-black text-xs sm:text-sm text-[var(--theme-primary,#2563eb)]" style="font-size: var(--theme-text-h3, var(--text-h3-size, 18px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700));">
            {formatIDR(product.basePrice ?? product.price ?? 0)}
          </p>
          {#if hasDiscount}
            <span class="text-[10px] sm:text-xs text-secondary line-through font-normal opacity-70">
              {formatIDR(originalPrice)}
            </span>
          {/if}
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            on:click|stopPropagation={() => onAddToCart(product, {})}
            class="flex-1 h-8 border border-[var(--theme-btn-secondary-border,color-mix(in_srgb,var(--theme-secondary,var(--color-secondary))_25%,var(--color-border)))] bg-[var(--color-card-base)] hover:bg-[color-mix(in_srgb,var(--theme-secondary,var(--color-secondary))_8%,transparent)] active:scale-[0.98] text-[var(--color-text-main)] text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); font-size: var(--theme-text-body, var(--text-body-size, 14px));"
          >
            <ShoppingCart size={13} class="text-[var(--theme-secondary,var(--color-secondary))]" />
            <span>{cartButtonText || 'Keranjang'}</span>
          </button>
          <button
            type="button"
            on:click|stopPropagation={() => onBuyNow(product, {})}
            class="flex-1 h-8 active:scale-[0.98] text-xs font-heading font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs hover:opacity-90"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, #2563eb))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-body, var(--text-body-size, 14px));"
          >
            <span>{buyButtonText || 'Beli'}</span>
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
