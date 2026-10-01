<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { Zap, ShoppingBag, ShoppingCart } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveProductNodeStyle } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let buyButtonText: string = 'Beli Kilat';
  export let cartButtonText: string = 'Keranjang';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  function selectTimer(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_timer');
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

<div>
  <!-- Countdown Timer Banner -->
  <div
    role="button"
    aria-label="Timer Flash Sale"
    tabindex="0"
    on:click={selectTimer}
    on:keydown={(e) => { if (e.key === 'Enter') selectTimer(e); }}
    class={`bg-rose-600 text-white p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-3 mb-8 cursor-pointer transition-all duration-200 ${
      $canvasStore.selectedNodeId === 'catalog_timer' ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-xl' : 'hover:brightness-105'
    }`}
  >
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <Zap size={18} class="text-white fill-white animate-pulse" />
      </div>
      <span class="font-heading font-black text-xs sm:text-sm tracking-wide">
        FLASH SALE SPESIAL HARI INI
      </span>
    </div>

    <div class="flex items-center gap-1.5 font-mono text-xs">
      <div class="px-2.5 py-1 bg-black/30 rounded-lg font-bold">02 Jam</div>
      <span class="font-bold">:</span>
      <div class="px-2.5 py-1 bg-black/30 rounded-lg font-bold">45 Mnt</div>
      <span class="font-bold">:</span>
      <div class="px-2.5 py-1 bg-black/30 rounded-lg font-bold">12 Dtk</div>
    </div>
  </div>

  <!-- Product Grid -->
  <div class="cq-prod-grid-3 text-left">
    {#each products as product, index (product.id || product.name + index)}
      {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
      {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}
      {@const pStyle = resolveProductNodeStyle(product, index, nodeStyles)}
      {@const currentPrice = Number(product.price ?? 0)}
      {@const originalPrice = Number(product.originalPrice) || (product.showOriginalPrice !== false && currentPrice > 0 ? Math.round(currentPrice * 1.35) : 0)}
      {@const hasDiscount = product.showOriginalPrice !== false && originalPrice > currentPrice}

      <div
        data-node={product.id || `product_item_${index}`}
        data-node-id={product.id || `product_item_${index}`}
        role="button"
        tabindex="0"
        on:click={(e) => selectCard(e, index, product)}
        on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
        style={pStyle.marginStyle}
        class={`bg-card p-4 rounded-2xl border border-light/80 shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer ${
          isCardActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-lg'
            : 'hover:shadow-md hover:border-light hover:shadow-md'
        }`}
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
            {#if product.imageUrl}
              <img
                src={product.imageUrl}
                alt={product.name}
                class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                loading="lazy"
              />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-secondary/60">
                <ShoppingBag size={24} />
              </div>
            {/if}
            {#if product.badge}
              <span
                class="absolute top-2 left-2 text-2xs font-heading font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs"
                style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));"
              >
                {product.badge}
              </span>
            {:else if hasDiscount}
              <span
                class="absolute top-2 left-2 text-2xs font-heading font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs"
                style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));"
              >
                HEMAT 35%
              </span>
            {/if}
          </div>

          <h3 class="font-heading font-bold text-xs sm:text-sm text-main line-clamp-2" style={pStyle.color ? `color: ${pStyle.color};` : ''}>
            {product.name}
          </h3>
        </div>

        <div class="mt-3 pt-3 border-t border-light/60">
          <div class="flex items-baseline gap-2 mb-2">
            <span class="font-heading font-black text-xs sm:text-sm text-primary">
              {formatIDR(product.price)}
            </span>
            {#if hasDiscount && originalPrice > 0}
              <span class="text-[11px] text-secondary/60 line-through font-mono">
                {formatIDR(originalPrice)}
              </span>
            {/if}
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              on:click|stopPropagation={() => onAddToCart(product, {})}
              class="flex-1 h-8 rounded-[var(--theme-btn-radius,var(--btn-radius,8px))] border border-[var(--theme-btn-secondary-border,var(--btn-secondary-border,var(--color-border)))] bg-[var(--color-card-base)] hover:bg-[var(--color-nested-base)] active:scale-[0.98] text-[var(--color-text-main)] text-xs font-heading font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <ShoppingCart size={13} />
              <span>{cartButtonText || 'Keranjang'}</span>
            </button>
            <button
              type="button"
              on:click|stopPropagation={() => onBuyNow(product, {})}
              class="flex-1 h-8 rounded-[var(--theme-btn-radius,var(--btn-radius,8px))] active:scale-[0.98] text-xs font-heading font-bold transition-all cursor-pointer shadow-xs hover:opacity-90 flex items-center justify-center"
              style="background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
            >
              {buyButtonText || 'Beli Kilat'}
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
