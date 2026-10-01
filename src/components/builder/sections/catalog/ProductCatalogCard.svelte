<script lang="ts">
  import { Package, ShoppingCart } from 'lucide-svelte';
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import ImageFallback from '@/components/ui/ImageFallback.svelte';

  export let product: ProductItem;
  export let index: number;
  export let activePreset: string = 'grid_standard';
  export let isHorizontalLayout: boolean = false;
  export let cardRadiusClass: string = 'rounded-2xl';
  export let cardPresetClass: string = 'bg-[var(--color-card-base)] shadow-sm border border-[var(--color-border)]';
  export let imageAspectClass: string = 'aspect-square w-full h-full object-cover';
  export let badgePosClass: string = 'top-3 left-3';
  export let badgeColorClass: string = 'bg-[var(--color-primary)] text-white';
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
  export let buyButtonText: string = '';
  export let cartButtonText: string = 'Keranjang';
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
    let base = typeof product.basePrice === 'number'
      ? product.basePrice
      : typeof product.price === 'number'
      ? product.price
      : parseFloat(String(product.basePrice ?? product.price ?? 0).replace(/[^0-9.-]+/g, '')) || 0;
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

  // Multi-field image fallback
  $: displayImage = product.image
    || product.imageUrl
    || product.imageUrls?.[0]
    || null;

  // Category badge
  $: categoryLabel = product.categoryName || product.category?.name || null;
</script>

<div
  data-node={`product_item_${index}`}
  data-node-id={`product_item_${index}`}
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
    dropTargetIdx === index ? 'ring-2 ring-[var(--color-primary)] shadow-xl' : ''
  } {draggedIdx === index ? 'opacity-30' : ''}"
>
  <!-- Image with Nested Radius -->
  <div
    data-node={`product_image_${index}`}
    data-node-id={`product_image_${index}`}
    class="relative overflow-hidden bg-[var(--color-nested-base)] {isHorizontalLayout || activePreset === 'list_compact' ? 'w-32 sm:w-44 flex-shrink-0' : 'w-full'}"
  >
    {#if displayImage}
      <ImageFallback
        src={displayImage}
        alt={product.name || 'Produk'}
        className="{imageAspectClass} transition-transform duration-300 hover:scale-105"
        loading="lazy"
        fallbackText="Foto Produk"
        width={isHorizontalLayout || activePreset === 'list_compact' ? 176 : '100%'}
        height={isHorizontalLayout || activePreset === 'list_compact' ? 176 : 192}
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
        <span
          class="px-2.5 py-1 text-2xs font-heading font-semibold rounded-full uppercase tracking-wider shadow-xs {badgeColorClass}"
          style="background-color: var(--color-primary); color: #ffffff;"
        >
          {product.badge}
        </span>
      </div>
    {/if}
  </div>

  <!-- Details -->
  <div class="p-4 flex-1 flex flex-col justify-between {isHorizontalLayout || activePreset === 'list_compact' ? 'min-w-0' : ''}">
    <div>
      {#if categoryLabel}
        <span class="inline-block mb-1.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-[var(--color-nested-base)] text-[var(--color-text-secondary)]">{categoryLabel}</span>
      {/if}
      <h3
        data-node="product_title"
        class="mb-1 text-[var(--color-text-main)] line-clamp-2 {nameSizeClass} {nameWeightClass}"
      >
        {product.name || 'Nama Produk'}
      </h3>
      
      {#if product.description}
        <p class="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-3">
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
                      class="px-3 py-1 text-2xs font-heading font-semibold rounded-full border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={selections[group.groupName] === opt.name
                        ? 'background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); border-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white));'
                        : 'border-color: var(--color-border); color: var(--color-text-secondary); background-color: transparent;'}
                    >
                      {opt.name} {opt.priceAdjustment ? `(+${formatIDR(opt.priceAdjustment)})` : ''}
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
      <div class="mt-auto pt-2 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2">
        <div data-node="product_price" class="min-w-0">
          <span class="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block leading-tight">Harga</span>
          <p class="text-sm sm:text-base font-extrabold font-mono text-[var(--color-primary)] truncate tracking-tight">
            {formatIDR(computedPrice)}
          </p>
        </div>
        <div data-node="product_cta" class="flex gap-2">
          <button
            type="button"
            on:click={() => { if (!isActive) onAddToCart(product, selections); }}
            class="px-3 py-2 text-xs font-heading font-bold border border-[var(--theme-btn-secondary-border,var(--btn-secondary-border,var(--color-border)))] text-[var(--color-text-main)] hover:bg-[var(--color-nested-base)] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[var(--color-card-base)] {ctaBtnRadiusClass}"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px));"
          >
            <ShoppingCart size={14} />
            <span class="hidden sm:inline">{cartButtonText || 'Keranjang'}</span>
          </button>
          <button
            type="button"
            on:click={() => { if (!isActive) onBuyNow(product, selections); }}
            class="px-3.5 py-2 text-xs font-heading font-bold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shrink-0 {ctaBtnRadiusClass}"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
          >
            <span>{buyButtonText || 'Beli'}</span>
          </button>
        </div>
      </div>
    {:else}
      <div class="mt-auto flex flex-col items-center">
        <p data-node="product_price" class="text-xl sm:text-2xl font-black font-mono mb-4 tracking-tight text-[var(--color-primary)] text-center">
          {formatIDR(computedPrice)}
        </p>
        <div data-node="product_cta" class="w-full flex gap-2">
          <button
            type="button"
            on:click={() => { if (!isActive) onAddToCart(product, selections); }}
            class="px-4 py-2.5 text-sm font-heading font-bold border border-[var(--theme-btn-secondary-border,var(--btn-secondary-border,var(--color-border)))] text-[var(--color-text-main)] hover:bg-[var(--color-nested-base)] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[var(--color-card-base)] {ctaBtnRadiusClass}"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px));"
          >
            <ShoppingCart size={16} />
            <span>{cartButtonText || 'Keranjang'}</span>
          </button>
          <button
            type="button"
            on:click={() => { if (!isActive) onBuyNow(product, selections); }}
            class="flex-1 py-2.5 text-sm font-heading font-bold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer {ctaBtnRadiusClass}"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
          >
            <span>{buyButtonText || 'Beli Sekarang'}</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
