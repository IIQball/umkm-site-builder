<script lang="ts">
  import { Package, ShoppingCart } from 'lucide-svelte';
  import type { ProductItem } from '@/types';
  import ImageFallback from '@/components/ui/ImageFallback.svelte';

  export let product: ProductItem;
  export let index: number;
  export let activePreset: string = 'grid_standard';
  export let isHorizontalLayout: boolean = false;
  export let cardRadiusClass: string = 'rounded-2xl';
  export let cardPresetClass: string = 'bg-white shadow-sm border border-slate-100';
  export let imageAspectClass: string = 'aspect-square w-full h-full object-cover';
  export let badgePosClass: string = 'top-3 left-3';
  export let badgeColorClass: string = 'bg-red-500 text-white';
  export let nameSizeClass: string = 'text-sm font-semibold';
  export let nameWeightClass: string = 'font-semibold';
  export let isInlinePrice: boolean = false;
  export let ctaBtnRadiusClass: string = 'rounded-xl';
  export let isActive: boolean = false;
  export let draggedIdx: number | null = null;
  export let dropTargetIdx: number | null = null;
  export let onDragStart: (e: DragEvent, idx: number) => void = () => {};
  export let onDragOver: (e: DragEvent, idx: number) => void = () => {};
  export let onDrop: (e: DragEvent, idx: number) => void = () => {};
  export let onDragLeave: () => void = () => {};
  export let onAddToCart: (prod: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (prod: ProductItem, selections: Record<string, string>) => void = () => {};

  let selections: Record<string, string> = {};

  $: if (product) {
    if (product.variants && Array.isArray(product.variants) && Object.keys(selections).length === 0) {
      product.variants.forEach((g: any) => {
        const firstAvail = g.options?.find((o: any) => o.isAvailable);
        if (firstAvail) {
          selections[g.groupName] = firstAvail.name;
        } else if (g.options?.[0]) {
          selections[g.groupName] = g.options[0].name;
        }
      });
    }
  }

  const handleVariantChange = (groupName: string, value: string) => {
    selections[groupName] = value;
    selections = { ...selections };
  };

  $: computedPrice = (() => {
    let base = typeof product.price === 'number'
      ? product.price
      : parseFloat(String(product.price || 0).replace(/[^0-9.-]+/g, '')) || 0;
    if (product?.variants && Array.isArray(product.variants)) {
      for (const group of product.variants) {
        if (!group) continue;
        const selectedOptionName = selections[group.groupName];
        if (selectedOptionName && group.options && Array.isArray(group.options)) {
          const opt = group.options.find((o: any) => o?.name === selectedOptionName);
          if (opt && typeof opt.priceAdjustment === 'number') {
            base += opt.priceAdjustment;
          }
        }
      }
    }
    return base;
  })();

</script>

<div
  data-node="product_card"
  role="group"
  aria-label={product.name || 'Kartu Produk'}
  draggable={isActive}
  on:dragstart={(e) => onDragStart(e, index)}
  on:dragover={(e) => onDragOver(e, index)}
  on:dragleave={onDragLeave}
  on:drop={(e) => onDrop(e, index)}
  class="relative overflow-hidden transition-all duration-200 {cardRadiusClass} {cardPresetClass} {
    activePreset === 'carousel_scroll' ? 'min-w-[260px] max-w-[280px] snap-start flex flex-col' : isHorizontalLayout || activePreset === 'list_compact' ? 'flex flex-row items-stretch' : 'flex flex-col'
  } {isActive ? 'cursor-grab active:cursor-grabbing' : ''} {
    dropTargetIdx === index ? 'ring-2 ring-blue-500 shadow-xl' : ''
  } {draggedIdx === index ? 'opacity-30' : ''}"
>
  <!-- Image with Nested Radius -->
  <div
    data-node="product_image"
    class="relative overflow-hidden bg-slate-100 dark:bg-slate-800 {isHorizontalLayout || activePreset === 'list_compact' ? 'w-32 sm:w-44 flex-shrink-0' : 'w-full'}"
  >
    {#if product.imageUrl}
      <ImageFallback
        src={product.imageUrl}
        alt={product.name || 'Produk'}
        className="{imageAspectClass} transition-transform duration-300 hover:scale-105"
        loading="lazy"
        fallbackText="Foto Produk"
      />
    {:else}
      <div
        class="w-full {isHorizontalLayout || activePreset === 'list_compact' ? 'h-full min-h-[140px]' : 'h-48'} flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4"
      >
        <Package size={26} class="text-slate-300 dark:text-slate-600" />
        <span class="text-[10px] font-medium text-slate-400">Foto Produk</span>
      </div>
    {/if}
    {#if product.badge}
      <div data-node="product_badge" class="absolute {badgePosClass} z-10">
        <span class="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider {badgeColorClass}">
          {product.badge}
        </span>
      </div>
    {/if}
  </div>

  <!-- Details -->
  <div class="p-4 flex-1 flex flex-col justify-between {isHorizontalLayout || activePreset === 'list_compact' ? 'min-w-0' : ''}">
    <div>
      <h3
        data-node="product_title"
        class="mb-1 text-[var(--theme-text-primary,#0f172a)] line-clamp-2 {nameSizeClass} {nameWeightClass}"
      >
        {product.name || 'Nama Produk'}
      </h3>
      
      {#if product.description}
        <p class="text-xs text-slate-500 line-clamp-2 mb-3">
          {product.description}
        </p>
      {/if}
    </div>

    <!-- VARIANTS CHIPS -->
    {#if product?.variants && Array.isArray(product.variants) && product.variants.length > 0}
      <div class="mt-2 mb-4 flex flex-col gap-3">
        {#each product.variants as group}
          {#if group && group.options && Array.isArray(group.options)}
            <div class="flex flex-col gap-1.5">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{group.groupName || 'Varian'}:</span>
              <div class="flex flex-wrap gap-2">
                {#each group.options as opt}
                  {#if opt}
                    <button
                      type="button"
                      disabled={!opt.isAvailable}
                      on:click={() => handleVariantChange(group.groupName, opt.name)}
                      class="px-3 py-1 text-[10px] font-semibold rounded-full border transition-all {
                        selections[group.groupName] === opt.name
                          ? 'bg-[var(--theme-primary,#4f00ff)] border-[var(--theme-primary,#4f00ff)] text-white shadow-sm'
                          : 'border-slate-300 text-slate-500 hover:border-slate-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {opt.name} {opt.priceAdjustment ? `(+Rp ${opt.priceAdjustment.toLocaleString('id-ID')})` : ''}
                    </button>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {:else}
      <div class="mb-4"></div>
    {/if}

    {#if isInlinePrice}
      <div class="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div data-node="product_price" class="min-w-0">
          <span class="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block leading-tight">Harga</span>
          <p class="text-sm sm:text-base font-extrabold font-mono text-[var(--theme-primary,#4f00ff)] truncate tracking-tight">
            Rp {computedPrice.toLocaleString('id-ID')}
          </p>
        </div>
        <div data-node="product_cta" class="flex gap-2">
          <button
            type="button"
            on:click={() => { if (!isActive) onAddToCart(product, selections); }}
            class="px-3 py-2 text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer bg-white {ctaBtnRadiusClass}"
          >
            <ShoppingCart size={14} />
          </button>
          <button
            type="button"
            on:click={() => { if (!isActive) onBuyNow(product, selections); }}
            class="px-3.5 py-2 text-xs font-bold shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shrink-0 bg-[var(--theme-primary,#4f00ff)] text-white {ctaBtnRadiusClass}"
          >
            <span>Beli</span>
          </button>
        </div>
      </div>
    {:else}
      <div class="mt-auto flex flex-col items-center">
        <p data-node="product_price" class="text-xl sm:text-2xl font-black font-mono mb-4 tracking-tight text-[var(--theme-primary,#4f00ff)] text-center">
          Rp {computedPrice.toLocaleString('id-ID')}
        </p>
        <div data-node="product_cta" class="w-full flex gap-2">
          <button
            type="button"
            on:click={() => { if (!isActive) onAddToCart(product, selections); }}
            class="px-4 py-2.5 text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer bg-white {ctaBtnRadiusClass}"
          >
            <ShoppingCart size={16} />
          </button>
          <button
            type="button"
            on:click={() => { if (!isActive) onBuyNow(product, selections); }}
            class="flex-1 py-2.5 text-sm font-bold shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer bg-[var(--theme-primary,#4f00ff)] text-white {ctaBtnRadiusClass}"
          >
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
