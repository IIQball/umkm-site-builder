<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag, ShoppingCart } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let buyButtonText: string = 'Pesan';
  export let cartButtonText: string = 'Keranjang';
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  $: isMobile = $canvasStore?.viewMode === 'mobile';

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

<div class="max-w-4xl mx-auto flex flex-col gap-3">
  {#each products as product, index (product.id || product.name + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
    {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}

    <div
      data-node={product.id || `product_item_${index}`}
      data-node-id={product.id || `product_item_${index}`}
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      class={`p-4 rounded-2xl border border-light/80 bg-card cq-compact-row text-left transition-all duration-200 cursor-pointer flex ${
        isMobile
          ? 'flex-col gap-3'
          : 'flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
      } ${
        isCardActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-md'
          : 'hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div
          data-node={`product_image_${index}`}
          data-node-id={`product_image_${index}`}
          role="button"
          tabindex="0"
          on:click={(e) => selectImage(e, index)}
          on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
          class={`w-14 h-14 rounded-xl overflow-hidden bg-nested shrink-0 relative group/img cursor-pointer ${
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
              <ShoppingBag size={18} />
            </div>
          {/if}
        </div>
        <div class="min-w-0">
          <h3 class="font-heading font-bold text-xs sm:text-sm text-main truncate">
            {product.name}
          </h3>
          {#if product.description}
            <p class="text-[11px] text-secondary truncate mt-0.5">
              {product.description}
            </p>
          {/if}
        </div>
      </div>

      <div
        class={`cq-compact-action flex items-center ${
          isMobile
            ? 'justify-between gap-4 pt-2 border-t border-light/60 w-full'
            : 'justify-between sm:justify-end gap-5 shrink-0'
        }`}
      >
        <span class="font-heading font-black text-xs sm:text-sm text-[var(--color-primary)]">
          {formatRupiah(product.price)}
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            on:click|stopPropagation={() => onAddToCart(product, {})}
            class="h-8 px-3 border border-[var(--theme-btn-secondary-border,var(--btn-secondary-border,var(--color-border)))] bg-[var(--color-card-base)] hover:bg-[var(--color-nested-base)] active:scale-[0.98] text-[var(--color-text-main)] text-xs font-heading font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 0.75rem));"
          >
            <ShoppingCart size={13} />
            <span>{cartButtonText || 'Keranjang'}</span>
          </button>
          <button
            type="button"
            on:click|stopPropagation={() => onBuyNow(product, {})}
            class="h-8 px-4 active:scale-[0.98] text-xs font-heading font-bold transition-all cursor-pointer shadow-xs hover:opacity-90 flex items-center justify-center"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 0.75rem)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
          >
            {buyButtonText || 'Pesan'}
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
