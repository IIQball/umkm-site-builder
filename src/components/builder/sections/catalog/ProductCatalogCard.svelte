<script lang="ts">
  import { Package } from 'lucide-svelte';
  import WhatsAppIcon from '../../../ui/WhatsAppIcon.svelte';
  import type { ProductItem } from '@/types';

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
  export let ctaBtnColor: string = '#2563eb';
  export let ctaBtnTextColor: string = '#ffffff';
  export let ctaBtnRadiusClass: string = 'rounded-xl';
  export let ctaWidthClass: string = 'w-full';
  export let showWhatsAppIcon: boolean = true;
  export let isActive: boolean = false;
  export let draggedIdx: number | null = null;
  export let dropTargetIdx: number | null = null;
  export let onDragStart: (e: DragEvent, idx: number) => void = () => {};
  export let onDragOver: (e: DragEvent, idx: number) => void = () => {};
  export let onDrop: (e: DragEvent, idx: number) => void = () => {};
  export let onDragLeave: () => void = () => {};
  export let onOpenQuickView: (prod: ProductItem) => void = () => {};
</script>

<div
  role="group"
  aria-label={product.name || 'Kartu Produk'}
  draggable={isActive}
  on:dragstart={(e) => onDragStart(e, index)}
  on:dragover={(e) => onDragOver(e, index)}
  on:dragleave={onDragLeave}
  on:drop={(e) => onDrop(e, index)}
  class={`relative overflow-hidden transition-all duration-200 ${cardRadiusClass} ${cardPresetClass} ${
    activePreset === 'carousel_scroll' ? 'min-w-[260px] max-w-[280px] snap-start flex flex-col' : isHorizontalLayout || activePreset === 'list_compact' ? 'flex flex-row items-stretch' : 'flex flex-col'
  } ${isActive ? 'cursor-grab active:cursor-grabbing' : ''} ${
    dropTargetIdx === index ? 'ring-2 ring-blue-500 shadow-xl' : ''
  } ${draggedIdx === index ? 'opacity-30' : ''}`}
>
  <!-- Image with Nested Radius -->
  <div
    data-node="product_image"
    class={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${isHorizontalLayout || activePreset === 'list_compact' ? 'w-32 sm:w-44 flex-shrink-0' : 'w-full'}`}
  >
    {#if product.imageUrl}
      <img
        src={product.imageUrl}
        alt={product.name || 'Produk'}
        class={`${imageAspectClass} transition-transform duration-300 hover:scale-105`}
        loading="lazy"
      />
    {:else}
      <div
        class={`w-full ${isHorizontalLayout || activePreset === 'list_compact' ? 'h-full min-h-[140px]' : 'h-48'} flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4`}
      >
        <Package size={26} class="text-slate-300 dark:text-slate-600" />
        <span class="text-[10px] font-medium text-slate-400">Foto Produk</span>
      </div>
    {/if}
    {#if product.badge}
      <div data-node="product_badge" class={`absolute ${badgePosClass} z-10`}>
        <span class={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${badgeColorClass}`}>
          {product.badge}
        </span>
      </div>
    {/if}
  </div>

  <!-- Details -->
  <div class={`p-4 flex-1 flex flex-col justify-between ${isHorizontalLayout || activePreset === 'list_compact' ? 'min-w-0' : ''}`}>
    <div>
      <h3
        data-node="product_title"
        class={`mb-1.5 text-[var(--theme-text-primary,#0f172a)] line-clamp-2 ${nameSizeClass} ${nameWeightClass}`}
      >
        {product.name || 'Nama Produk'}
      </h3>
    </div>

    {#if isInlinePrice}
      <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div data-node="product_price" class="min-w-0">
          <span class="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block leading-tight">Harga</span>
          <p class="text-sm sm:text-base font-extrabold text-[var(--theme-primary,#2563eb)] font-mono truncate">
            Rp {typeof product.price === 'number'
              ? product.price.toLocaleString('id-ID')
              : product.price || '0'}
          </p>
        </div>
        <div data-node="product_cta">
          <button
            type="button"
            on:click={() => {
              if (!isActive) onOpenQuickView(product);
            }}
            style={`background-color: ${ctaBtnColor}; color: ${ctaBtnTextColor};`}
            class={`px-3.5 py-2 text-xs font-semibold shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${ctaBtnRadiusClass}`}
          >
            {#if showWhatsAppIcon}<WhatsAppIcon size={14} />{/if}
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>
    {:else}
      <div class="mt-2">
        <p data-node="product_price" class="text-base sm:text-lg font-extrabold text-[var(--theme-primary,#2563eb)] mb-3 font-mono">
          Rp {typeof product.price === 'number'
            ? product.price.toLocaleString('id-ID')
            : product.price || '0'}
        </p>
        <div data-node="product_cta">
          <button
            type="button"
            on:click={() => {
              if (!isActive) onOpenQuickView(product);
            }}
            style={`background-color: ${ctaBtnColor}; color: ${ctaBtnTextColor};`}
            class={`${ctaWidthClass} text-xs font-semibold shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${ctaBtnRadiusClass}`}
          >
            {#if showWhatsAppIcon}<WhatsAppIcon size={14} />{/if}
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
