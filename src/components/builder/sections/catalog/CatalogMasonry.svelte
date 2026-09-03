<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  const aspectRatios = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[3/2]'];

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

<div class="cq-masonry-view text-left">
  {#each products as product, index (product.id || product.name + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
    {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}
    {@const aspectClass = aspectRatios[index % aspectRatios.length]}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      class={`bg-card p-3 rounded-2xl border border-light/80 shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        <div
          role="button"
          tabindex="0"
          on:click={(e) => selectImage(e, index)}
          on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
          class={`rounded-xl overflow-hidden bg-nested w-full ${aspectClass} mb-2 relative group/img cursor-pointer ${
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
              <ShoppingBag size={24} />
            </div>
          {/if}

          {#if product.badge}
            <span class="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              {product.badge}
            </span>
          {/if}
        </div>

        <h3 class="font-heading font-bold text-xs text-main line-clamp-2">
          {product.name}
        </h3>
        {#if product.description}
          <p class="text-[11px] text-secondary line-clamp-2 mt-1">
            {product.description}
          </p>
        {/if}
      </div>

      <div class="mt-3 pt-2 border-t border-light/60 flex items-center justify-between">
        <p class="text-primary font-heading font-black text-xs">
          {formatRupiah(product.price)}
        </p>
        <div class="flex gap-1.5">
          <button
            type="button"
            on:click|stopPropagation={() => onAddToCart(product, {})}
            class="h-7 px-2.5 rounded-lg bg-nested hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-main text-[11px] font-semibold transition-all"
          >
            +
          </button>
          <button
            type="button"
            on:click|stopPropagation={() => onBuyNow(product, {})}
            class="h-7 px-3 rounded-lg bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-[11px] font-bold transition-all"
          >
            Beli
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
