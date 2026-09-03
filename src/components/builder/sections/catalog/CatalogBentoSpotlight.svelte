<script lang="ts">
  import type { ProductItem } from '@/types';
  import { Sparkles, ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  $: mainProduct = products[0];
  $: secondaryProducts = products.slice(1, 3);

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

<div class="cq-prod-bento-grid text-left">
  {#if mainProduct}
    {@const isMainActive = $canvasStore.selectedNodeId === (mainProduct.id || 'product_item_0')}
    {@const isMainImgActive = $canvasStore.selectedNodeId === 'product_image_0'}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, 0, mainProduct)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, 0, mainProduct); }}
      class={`cq-bento-primary bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-200 cursor-pointer ${
        isMainActive ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-2xl' : 'hover:shadow-xl'
      }`}
    >
      <div class="flex flex-col sm:flex-row gap-6 items-start">
        <div
          role="button"
          tabindex="0"
          on:click={(e) => selectImage(e, 0)}
          on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, 0); }}
          class={`w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden bg-slate-800 shrink-0 relative group/img cursor-pointer ${
            isMainImgActive ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          {#if mainProduct.imageUrl}
            <img
              src={mainProduct.imageUrl}
              alt={mainProduct.name}
              class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
              loading="lazy"
            />
          {:else}
            <div class="w-full h-full flex items-center justify-center text-slate-500">
              <ShoppingBag size={32} />
            </div>
          {/if}
        </div>

        <div class="flex-1 min-w-0">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-400 border border-amber-400/30 mb-3">
            <Sparkles size={12} />
            <span>PROMO BUNDLE SPESIAL</span>
          </div>
          <h3 class="font-heading text-xl sm:text-2xl font-black text-white leading-snug">
            {mainProduct.name}
          </h3>
          {#if mainProduct.description}
            <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {mainProduct.description}
            </p>
          {/if}
        </div>
      </div>

      <div class="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
        <div>
          <span class="text-xs text-slate-400 block font-mono">Harga Promo</span>
          <span class="font-heading text-lg sm:text-xl font-black text-amber-400">
            {formatRupiah(mainProduct.price)}
          </span>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            on:click|stopPropagation={() => onAddToCart(mainProduct, {})}
            class="h-9 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white text-xs font-semibold transition-all"
          >
            Keranjang
          </button>
          <button
            type="button"
            on:click|stopPropagation={() => onBuyNow(mainProduct, {})}
            class="h-9 px-5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-bold transition-all"
          >
            Ambil Paket
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#each secondaryProducts as product, idx}
    {@const realIdx = idx + 1}
    {@const isSecActive = $canvasStore.selectedNodeId === (product.id || `product_item_${realIdx}`)}
    {@const isSecImgActive = $canvasStore.selectedNodeId === `product_image_${realIdx}`}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, realIdx, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, realIdx, product); }}
      class={`cq-bento-secondary bg-card border border-light/80 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
        isSecActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-lg'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        <div
          role="button"
          tabindex="0"
          on:click={(e) => selectImage(e, realIdx)}
          on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, realIdx); }}
          class={`aspect-square rounded-2xl overflow-hidden bg-nested mb-3 relative group/img cursor-pointer ${
            isSecImgActive ? 'ring-2 ring-blue-500' : ''
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
              <ShoppingBag size={22} />
            </div>
          {/if}
        </div>

        <h3 class="font-heading font-bold text-xs text-main line-clamp-2">
          {product.name}
        </h3>
        <p class="font-heading font-black text-xs text-primary mt-1">
          {formatRupiah(product.price)}
        </p>
      </div>

      <div class="mt-4 pt-3 border-t border-light/60 flex gap-2">
        <button
          type="button"
          on:click|stopPropagation={() => onAddToCart(product, {})}
          class="flex-1 h-8 rounded-xl bg-nested hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-main text-xs font-semibold transition-all"
        >
          +
        </button>
        <button
          type="button"
          on:click|stopPropagation={() => onBuyNow(product, {})}
          class="flex-1 h-8 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-bold transition-all"
        >
          Beli
        </button>
      </div>
    </div>
  {/each}
</div>
