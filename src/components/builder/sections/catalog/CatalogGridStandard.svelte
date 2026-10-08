<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { ShoppingBag, Flame, Plus, Minus, ShoppingCart } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { buildWhatsAppOrderLink, resolveProductNodeStyle } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let activePreset: string = 'grid_standard';
  export let waNumber: string = '';
  export let buyButtonText: string = 'Beli';
  export let cartButtonText: string = 'Keranjang';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  let activeTab: string = 'all';
  let quantities: Record<number, number> = {};

  $: categories = ['all', ...Array.from(new Set(products.map(p => (p as any).category).filter(Boolean)))];

  $: filteredProducts = activeTab === 'all'
    ? products
    : products.filter(p => (p as any).category === activeTab);

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isTablet = viewMode === 'tablet';
  $: gridColsClass = isMobile
    ? 'grid-cols-1'
    : isTablet
    ? 'grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

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
      $canvasStore.selectedNodeId === 'catalog_categories' ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    {#each categories as cat}
      <button
        type="button"
        on:click={() => (activeTab = cat)}
        class={`px-4 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
          activeTab === cat ? 'shadow-xs' : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-nested-base)]'
        }`}
        style={activeTab === cat
          ? 'background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white));'
          : 'background-color: var(--color-card-base);'}
      >
        {cat === 'all' ? 'Semua Produk' : cat}
      </button>
    {/each}
  </div>
{/if}

<div class={`${activePreset === 'compact_mini_cards' ? 'cq-prod-grid-4' : 'cq-prod-grid-3'} grid ${gridColsClass} w-full`} style="gap: var(--active-gutter, 1.5rem);">
  {#each filteredProducts as product, index (product.id || product.name + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
    {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}
    {@const displayImg = product.image || product.imageUrl || product.imageUrls?.[0]}
    {@const prodStyle = resolveProductNodeStyle(product, index, nodeStyles)}
    {@const currentPrice = Number(product.basePrice ?? product.price ?? 0)}
    {@const originalPrice = Number(product.originalPrice) || (product.showOriginalPrice === true && currentPrice > 0 ? Math.round(currentPrice * 1.3) : 0)}
    {@const hasDiscount = (product.showOriginalPrice === true || (product.showOriginalPrice !== false && !!product.originalPrice && Number(product.originalPrice) > currentPrice)) && originalPrice > currentPrice}
    
    <div
      data-node={product.id || `product_item_${index}`}
      data-node-id={product.id || `product_item_${index}`}
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      class={`bg-card border border-light/80 rounded-2xl p-4 flex flex-col justify-between relative transition-all duration-200 text-left cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-lg'
          : 'hover:shadow-md hover:border-light hover:shadow-md'
      }`}
      style="{prodStyle.marginTop ? `margin-top: ${prodStyle.marginTop};` : ''} {prodStyle.marginBottom ? `margin-bottom: ${prodStyle.marginBottom};` : ''}"
    >
      <div>
        <!-- Product Image -->
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
            <span
              class="absolute top-2 left-2 text-2xs font-heading font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10"
              style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));"
            >
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

        <h3
          class="font-heading font-bold text-xs sm:text-sm text-main line-clamp-2"
          style={prodStyle.color ? `color: ${prodStyle.color} !important;` : ''}
        >
          {product.name}
        </h3>
        
        {#if product.description}
          <p class="text-[11px] text-secondary line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        {/if}
      </div>

      <div class="mt-3 pt-3 border-t border-light/60">
        <div class="flex items-baseline gap-1.5 flex-wrap mb-2">
          <p class="font-heading font-black text-xs sm:text-sm text-primary">
            {formatIDR(product.basePrice ?? product.price ?? 0)}
          </p>
          {#if hasDiscount}
            <span class="text-[10px] sm:text-xs text-secondary line-through font-normal opacity-70">
              {formatIDR(originalPrice)}
            </span>
          {/if}
        </div>

        {#if activePreset === 'quick_buy_whatsapp_direct'}
          <div class="flex gap-2 items-center">
            <div class="flex items-center border border-[var(--color-border)] rounded-[var(--theme-btn-radius,var(--btn-radius,8px))] bg-[var(--color-nested-base)] overflow-hidden">
              <button
                type="button"
                on:click|stopPropagation={() => adjustQty(index, -1)}
                class="w-7 h-8 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)] cursor-pointer"
              >
                <Minus size={12} />
              </button>
              <span class="w-6 text-center text-xs font-bold font-mono">{getQty(index)}</span>
              <button
                type="button"
                on:click|stopPropagation={() => adjustQty(index, 1)}
                class="w-7 h-8 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)] cursor-pointer"
              >
                <Plus size={12} />
              </button>
            </div>
            <button
              type="button"
              on:click|stopPropagation={() => handleWaDirectBuy(product, index)}
              class="flex-1 h-8 active:scale-[0.98] text-xs font-heading font-bold transition-all shadow-xs hover:opacity-90 cursor-pointer"
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
            >
              Pesan WA
            </button>
          </div>
        {:else}
          <div class="flex gap-2">
            <button
              type="button"
              on:click|stopPropagation={() => onAddToCart(product, {})}
              class="flex-1 h-8 border border-[var(--theme-btn-secondary-border,var(--btn-secondary-border,var(--color-border)))] bg-[var(--color-card-base)] hover:bg-[var(--color-nested-base)] active:scale-[0.98] text-[var(--color-text-main)] text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px));"
            >
              <ShoppingCart size={13} />
              <span>{cartButtonText || 'Keranjang'}</span>
            </button>
            <button
              type="button"
              on:click|stopPropagation={() => onBuyNow(product, {})}
              class="flex-1 h-8 active:scale-[0.98] text-xs font-heading font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs hover:opacity-90"
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
            >
              <span>{buyButtonText || 'Beli'}</span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
