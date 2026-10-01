<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { ShoppingBag, ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveProductNodeStyle } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let buyButtonText: string = 'Beli';
  export let cartButtonText: string = 'Keranjang';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  let carouselRef: HTMLElement;

  function scroll(direction: 'left' | 'right') {
    if (carouselRef) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function selectCard(e: Event, idx: number, prod: ProductItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, prod.id || `product_item_${idx}`);
    }
  }

  function selectImage(e: Event, idx: number) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, `product_image_${idx}`);
    }
  }
</script>

<div class="relative group/carousel">
  <button
    type="button"
    aria-label="Scroll ke kiri"
    on:click={() => scroll('left')}
    class="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card/90 border border-light shadow-md flex items-center justify-center text-main opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-nested"
  >
    <ChevronLeft size={16} />
  </button>
  <button
    type="button"
    aria-label="Scroll ke kanan"
    on:click={() => scroll('right')}
    class="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card/90 border border-light shadow-md flex items-center justify-center text-main opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-nested"
  >
    <ChevronRight size={16} />
  </button>

  <div
    bind:this={carouselRef}
    class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-1"
  >
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
        class={`w-64 sm:w-72 shrink-0 snap-start bg-card border border-light/80 rounded-2xl p-4 flex flex-col justify-between relative transition-all duration-200 text-left cursor-pointer ${
          isCardActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-lg'
            : 'hover:shadow-md hover:border-light hover:shadow-md'
        }`}
        style="{prodStyle.marginTop ? `margin-top: ${prodStyle.marginTop};` : ''} {prodStyle.marginBottom ? `margin-bottom: ${prodStyle.marginBottom};` : ''}"
      >
        <div>
          <div
            data-node={`product_image_${index}`}
            data-node-id={`product_image_${index}`}
            role="button"
            tabindex="0"
            on:click={(e) => selectImage(e, index)}
            on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
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
              <span class="absolute top-2 left-2 bg-[var(--color-bg-surface)] text-[var(--color-text-main)] border border-[var(--color-border-subtle)] text-2xs font-heading font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10">
                {product.categoryName || product.category?.name}
              </span>
            {:else if product.badge}
              <span
                class="absolute top-2 left-2 text-2xs font-heading font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10"
                style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));"
              >
                {product.badge}
              </span>
            {/if}
          </div>

          <h3
            class="font-heading font-bold text-xs sm:text-sm text-main line-clamp-2"
            style={prodStyle.color ? `color: ${prodStyle.color} !important;` : ''}
          >
            {product.name}
          </h3>

          {#if product.description}
            <p class="text-[11px] text-secondary line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          {/if}
        </div>

        <div class="mt-3 pt-3 border-t border-light/60">
          <div class="flex items-baseline gap-1.5 flex-wrap mb-2">
            <p class="font-heading font-black text-xs sm:text-sm text-[var(--color-primary)]">
              {formatIDR(product.basePrice ?? product.price ?? 0)}
            </p>
            {#if hasDiscount}
              <span class="text-2xs text-secondary/60 line-through font-mono">
                {formatIDR(originalPrice)}
              </span>
            {/if}
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              on:click|stopPropagation={() => onAddToCart(product, {})}
              class="flex-1 h-8 border border-[var(--theme-btn-secondary-border,var(--btn-secondary-border,var(--color-border)))] bg-[var(--color-card-base)] hover:bg-[var(--color-nested-base)] active:scale-[0.98] text-[var(--color-text-main)] text-xs font-heading font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 0.75rem));"
            >
              <ShoppingCart size={13} />
              <span>{cartButtonText || 'Keranjang'}</span>
            </button>
            <button
              type="button"
              on:click|stopPropagation={() => onBuyNow(product, {})}
              class="flex-1 h-8 active:scale-[0.98] text-xs font-heading font-bold transition-all cursor-pointer shadow-xs hover:opacity-90 flex items-center justify-center"
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 0.75rem)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
            >
              {buyButtonText || 'Beli'}
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
