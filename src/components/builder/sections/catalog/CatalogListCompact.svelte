<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
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

<div class="max-w-4xl mx-auto flex flex-col gap-3">
  {#each products as product, index (product.id || product.name + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
    {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      class={`p-4 rounded-2xl border border-light/80 bg-card cq-compact-row text-left transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="flex items-center gap-3 min-w-0">
        <div
          role="button"
          tabindex="0"
          on:click={(e) => selectImage(e, index)}
          on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
          class={`w-14 h-14 rounded-xl overflow-hidden bg-nested shrink-0 relative group/img cursor-pointer ${
            isImgActive ? 'ring-2 ring-blue-500' : ''
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

      <div class="cq-compact-action">
        <span class="font-heading font-black text-xs sm:text-sm text-primary">
          {formatRupiah(product.price)}
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            on:click|stopPropagation={() => onAddToCart(product, {})}
            class="h-8 px-3 rounded-xl bg-nested hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-main text-xs font-semibold transition-all"
          >
            Keranjang
          </button>
          <button
            type="button"
            on:click|stopPropagation={() => onBuyNow(product, {})}
            class="h-8 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-bold transition-all"
          >
            Pesan
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
