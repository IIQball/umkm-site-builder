<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag, Flame, Plus, Minus, ShoppingCart } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah, buildWhatsAppOrderLink } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let activePreset: string = 'grid_standard';
  export let waNumber: string = '';
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  let activeTab: string = 'all';
  let quantities: Record<number, number> = {};

  $: categories = ['all', ...Array.from(new Set(products.map(p => (p as any).category).filter(Boolean)))];

  $: filteredProducts = activeTab === 'all'
    ? products
    : products.filter(p => (p as any).category === activeTab);

  function getQty(idx: number): number {
    return quantities[idx] || 1;
  }

  function adjustQty(idx: number, delta: number) {
    const current = getQty(idx);
    const next = Math.max(1, current + delta);
    quantities = { ...quantities, [idx]: next };
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

  function selectCategories(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_categories');
    }
  }

  function handleWaDirectBuy(product: ProductItem, idx: number) {
    if (product.variants && product.variants.length > 0) {
      onBuyNow(product, {});
      return;
    }
    const qty = getQty(idx);
    const itemPrice = typeof (product.basePrice ?? product.price) === 'number'
      ? Number(product.basePrice ?? product.price)
      : parseFloat(String(product.basePrice ?? product.price ?? 0).replace(/[^0-9.-]+/g, '')) || 0;
    const totalPrice = itemPrice * qty;
    const orderText = qty > 1 ? `${product.name} (x${qty})` : product.name;
    const link = buildWhatsAppOrderLink(waNumber, orderText, totalPrice);
    if (typeof window !== 'undefined') window.open(link, '_blank');
  }
</script>

{#if activePreset === 'interactive_filter_tabs'}
  <div
    role="tablist"
    tabindex="0"
    on:click={selectCategories}
    on:keydown={(e) => { if (e.key === 'Enter') selectCategories(e); }}
    class={`flex flex-wrap justify-center gap-2 mb-6 cursor-pointer p-2 rounded-2xl transition-all ${
      $canvasStore.selectedNodeId === 'catalog_categories' ? 'ring-2 ring-blue-500 ring-offset-2' : ''
    }`}
  >
    {#each categories as cat}
      <button
        type="button"
        on:click={() => (activeTab = cat)}
        class={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          activeTab === cat ? 'bg-primary text-white shadow-xs' : 'bg-nested border border-light text-secondary hover:text-main'
        }`}
      >
        {cat === 'all' ? 'Semua Produk' : cat}
      </button>
    {/each}
  </div>
{/if}

<div class={activePreset === 'compact_mini_cards' ? 'cq-prod-grid-4' : 'cq-prod-grid-3'}>
  {#each filteredProducts as product, index (product.id || product.name + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
    {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}
    {@const displayImg = product.image || product.imageUrl || product.imageUrls?.[0]}
    
    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      class={`bg-card border border-light/80 rounded-2xl p-4 flex flex-col justify-between relative transition-all duration-200 text-left cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-lg'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        <!-- Product Image -->
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

          {#if activePreset === 'badge_stock_scarcity'}
            <div class="absolute bottom-2 left-2 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs z-10">
              <Flame size={11} class="text-rose-600" />
              <span>Sisa {((index + 1) * 3)} slot!</span>
            </div>
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

        {#if activePreset === 'quick_buy_whatsapp_direct'}
          <div class="flex gap-2 items-center">
            <div class="flex items-center border border-light rounded-xl bg-nested/50 overflow-hidden">
              <button
                type="button"
                on:click|stopPropagation={() => adjustQty(index, -1)}
                class="w-7 h-8 flex items-center justify-center text-secondary hover:text-main"
              >
                <Minus size={12} />
              </button>
              <span class="w-6 text-center text-xs font-bold font-mono">{getQty(index)}</span>
              <button
                type="button"
                on:click|stopPropagation={() => adjustQty(index, 1)}
                class="w-7 h-8 flex items-center justify-center text-secondary hover:text-main"
              >
                <Plus size={12} />
              </button>
            </div>
            <button
              type="button"
              on:click|stopPropagation={() => handleWaDirectBuy(product, index)}
              class="flex-1 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold transition-all"
            >
              Pesan WA
            </button>
          </div>
        {:else}
          <div class="flex gap-2">
            <button
              type="button"
              on:click|stopPropagation={() => onAddToCart(product, {})}
              class="flex-1 h-8 rounded-xl bg-nested hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-main text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ShoppingCart size={13} />
              <span>+ Keranjang</span>
            </button>
            <button
              type="button"
              on:click|stopPropagation={() => onBuyNow(product, {})}
              class="flex-1 h-8 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Beli</span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
