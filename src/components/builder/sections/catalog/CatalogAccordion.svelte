<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveProductNodeStyle } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let buyButtonText: string = 'Pesan';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  function selectRows(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_price_rows');
    }
  }

  function selectCard(e: Event, idx: number, prod: ProductItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, prod.id || `product_item_${idx}`);
    }
  }
</script>

<div
  role="button"
  aria-label="Daftar Menu Akordeon"
  tabindex="0"
  on:click={selectRows}
  on:keydown={(e) => { if (e.key === 'Enter') selectRows(e); }}
  class={`max-w-2xl mx-auto text-left space-y-2.5 cursor-pointer transition-all ${
    $canvasStore.selectedNodeId === 'catalog_price_rows' ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 rounded-3xl p-2' : ''
  }`}
>
  {#each products as product, idx (product.id || product.name + idx)}
    {@const isItemActive = $canvasStore.selectedNodeId === (product.id || `product_item_${idx}`)}
    {@const prodStyle = resolveProductNodeStyle(product, idx, nodeStyles)}
    {@const currentPrice = Number(product.price ?? 0)}
    {@const originalPrice = Number(product.originalPrice) || (product.showOriginalPrice === true && currentPrice > 0 ? Math.round(currentPrice * 1.3) : 0)}
    {@const hasDiscount = (product.showOriginalPrice === true || (product.showOriginalPrice !== false && !!product.originalPrice && Number(product.originalPrice) > currentPrice)) && originalPrice > currentPrice}

    <div
      data-node={product.id || `product_item_${idx}`}
      data-node-id={product.id || `product_item_${idx}`}
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, idx, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, idx, product); }}
      class={`p-4 rounded-2xl border border-light/80 bg-card shadow-xs flex justify-between items-center transition-all duration-200 cursor-pointer ${
        isItemActive ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100' : 'hover:border-light hover:shadow-md'
      }`}
      style="{prodStyle.marginTop ? `margin-top: ${prodStyle.marginTop};` : ''} {prodStyle.marginBottom ? `margin-bottom: ${prodStyle.marginBottom};` : ''}"
    >
      <div class="min-w-0 pr-3">
        <div class="flex items-center gap-2">
          {#if product.badge}
            <span class="text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0" style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));">
              {product.badge}
            </span>
          {/if}
          <h3
            class="font-heading font-bold text-xs sm:text-sm text-main truncate"
            style={prodStyle.color ? `color: ${prodStyle.color} !important;` : ''}
          >
            {product.name}
          </h3>
        </div>
        {#if product.description}
          <p class="text-[11px] text-secondary truncate mt-0.5">
            {product.description}
          </p>
        {/if}
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <div class="flex items-baseline gap-1.5 flex-wrap">
          <span class="font-heading font-black text-xs sm:text-sm text-[var(--color-primary)]">
            {formatIDR(product.price)}
          </span>
          {#if hasDiscount}
            <span class="text-2xs text-secondary/60 line-through font-mono">
              {formatIDR(originalPrice)}
            </span>
          {/if}
        </div>
        <button
          type="button"
          on:click|stopPropagation={() => onBuyNow(product, {})}
          class="h-8 px-4 shadow-xs hover:opacity-90 active:scale-[0.98] text-xs font-heading font-bold transition-all flex items-center justify-center"
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
        >
          <span>{buyButtonText || 'Pesan'}</span>
        </button>
      </div>
    </div>
  {/each}
</div>
