<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
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

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      class={`group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-md transition-all duration-300 text-left cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-2xl'
          : 'hover:shadow-xl'
      }`}
    >
      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectImage(e, index)}
        on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
        class={`absolute inset-0 bg-slate-900 cursor-pointer ${isImgActive ? 'ring-2 ring-blue-500' : ''}`}
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
        <span class="text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold mb-1">
          Look {String(index + 1).padStart(2, '0')}
        </span>
        <h3 class="font-heading font-bold text-sm sm:text-base text-white line-clamp-1">
          {product.name}
        </h3>
        <p class="font-heading font-black text-xs sm:text-sm text-amber-400 mt-1">
          {formatRupiah(product.price)}
        </p>

        <div class="pt-3 mt-3 border-t border-white/20 flex gap-2">
          <button
            type="button"
            on:click|stopPropagation={() => onBuyNow(product, {})}
            class="w-full h-8 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-900 active:scale-[0.98] text-xs font-bold transition-all backdrop-blur-sm"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
