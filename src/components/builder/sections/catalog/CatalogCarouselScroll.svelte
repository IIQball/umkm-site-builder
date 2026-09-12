<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
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

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectCard(e, index, product)}
        on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
        class={`w-64 sm:w-72 shrink-0 snap-start bg-card border border-light/80 rounded-2xl p-4 flex flex-col justify-between relative transition-all duration-200 text-left cursor-pointer ${
          isCardActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-lg'
            : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div>
          <div
            role="button"
            tabindex="0"
            on:click={(e) => selectImage(e, index)}
            on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
            class={`aspect-square rounded-xl overflow-hidden bg-nested mb-3 relative group/img cursor-pointer ${
              isImgActive ? 'ring-2 ring-blue-500' : ''
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
              <span class="absolute top-2 left-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs text-slate-700 dark:text-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10">
                {product.categoryName || product.category?.name}
              </span>
            {:else if product.badge}
              <span class="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10">
                {product.badge}
              </span>
            {/if}
          </div>

          <h3 class="font-heading font-bold text-xs sm:text-sm text-main line-clamp-2">
            {product.name}
          </h3>

          {#if product.description}
            <p class="text-[11px] text-secondary line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          {/if}
        </div>

        <div class="mt-3 pt-3 border-t border-light/60">
          <p class="font-heading font-black text-xs sm:text-sm text-primary mb-2">
            {formatRupiah(product.basePrice ?? product.price ?? 0)}
          </p>

          <div class="flex gap-2">
            <button
              type="button"
              on:click|stopPropagation={() => onAddToCart(product, {})}
              class="flex-1 h-8 rounded-xl bg-nested hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-main text-xs font-semibold transition-all"
            >
              Keranjang
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
      </div>
    {/each}
  </div>
</div>
