<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveProductNodeStyle } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let buyButtonText: string = 'Lihat Detail';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

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

<div class="cq-lookbook-grid">
  {#each products as product, index (product.id || product.name + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
    {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}
    {@const pStyle = resolveProductNodeStyle(product, index, nodeStyles)}
    {@const currentPrice = Number(product.price ?? 0)}
    {@const originalPrice = Number(product.originalPrice) || (product.showOriginalPrice === true && currentPrice > 0 ? Math.round(currentPrice * 1.3) : 0)}
    {@const hasDiscount = (product.showOriginalPrice === true || (product.showOriginalPrice !== false && !!product.originalPrice && Number(product.originalPrice) > currentPrice)) && originalPrice > currentPrice}

    <div
      data-node={product.id || `product_item_${index}`}
      data-node-id={product.id || `product_item_${index}`}
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      style={pStyle.marginStyle}
      class={`group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-md transition-all duration-300 text-left cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-2xl'
          : 'hover:shadow-xl'
      }`}
    >
      <div
        data-node={`product_image_${index}`}
        data-node-id={`product_image_${index}`}
        role="button"
        tabindex="0"
        on:click={(e) => selectImage(e, index)}
        on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
        class={`absolute inset-0 bg-slate-900 cursor-pointer ${isImgActive ? 'ring-2 ring-primary' : ''}`}
      >
        {#if product.imageUrl}
          <img
            src={product.imageUrl}
            alt={product.name}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-slate-500">
            <ShoppingBag size={32} />
          </div>
        {/if}
      </div>

      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
        {#if product.badge}
          <span
            class="absolute top-3 left-3 text-2xs font-heading font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10"
            style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));"
          >
            {product.badge}
          </span>
        {/if}
        <span class="text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold mb-1">
          Look {String(index + 1).padStart(2, '0')}
        </span>
        <h3 class="font-heading font-bold text-sm sm:text-base text-white line-clamp-1" style={pStyle.color ? `color: ${pStyle.color};` : ''}>
          {product.name}
        </h3>
        <div class="flex items-baseline gap-2 flex-wrap mt-1">
          <p class="font-heading font-black text-xs sm:text-sm text-amber-400">
            {formatIDR(product.price)}
          </p>
          {#if hasDiscount}
            <span class="text-[11px] text-white/70 line-through font-mono">
              {formatIDR(originalPrice)}
            </span>
          {/if}
        </div>

        <div class="pt-3 mt-3 border-t border-white/20 flex gap-2">
          <button
            type="button"
            on:click|stopPropagation={() => onBuyNow(product, {})}
            class="w-full h-8 bg-white/20 hover:bg-[var(--theme-btn-primary-bg,var(--theme-primary,var(--color-primary)))] text-white hover:text-white border border-white/30 hover:border-transparent active:scale-[0.98] text-xs font-heading font-bold transition-all backdrop-blur-sm cursor-pointer shadow-xs"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
          >
            {buyButtonText || 'Lihat Detail'}
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
