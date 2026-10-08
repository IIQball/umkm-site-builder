<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { Sparkles, ShoppingBag, ShoppingCart } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveProductNodeStyle } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let buyButtonText: string = 'Ambil Paket';
  export let cartButtonText: string = 'Keranjang';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  $: mainProduct = products[0];
  $: secondaryProducts = products.slice(1, 3);
  $: mainStyle = mainProduct ? resolveProductNodeStyle(mainProduct, 0, nodeStyles) : { marginStyle: '', color: '' };

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
    {@const mainPrice = Number(mainProduct.price ?? 0)}
    {@const mainOrigPrice = Number(mainProduct.originalPrice) || (mainProduct.showOriginalPrice === true && mainPrice > 0 ? Math.round(mainPrice * 1.3) : 0)}
    {@const mainHasDiscount = (mainProduct.showOriginalPrice === true || (mainProduct.showOriginalPrice !== false && !!mainProduct.originalPrice && Number(mainProduct.originalPrice) > mainPrice)) && mainOrigPrice > mainPrice}

    <div
      data-node={mainProduct.id || 'product_item_0'}
      data-node-id={mainProduct.id || 'product_item_0'}
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, 0, mainProduct)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, 0, mainProduct); }}
      style={mainStyle.marginStyle}
      class={`cq-bento-primary bg-card text-main border border-light/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-200 cursor-pointer ${
        isMainActive ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-2xl' : 'hover:shadow-xl'
      }`}
    >
      <div class="flex flex-col sm:flex-row gap-6 items-start">
        <div
          data-node="product_image_0"
          data-node-id="product_image_0"
          role="button"
          tabindex="0"
          on:click={(e) => selectImage(e, 0)}
          on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, 0); }}
          class={`w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden bg-nested shrink-0 relative group/img cursor-pointer ${
            isMainImgActive ? 'ring-2 ring-primary' : ''
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
            <div class="w-full h-full flex items-center justify-center text-secondary/60">
              <ShoppingBag size={32} />
            </div>
          {/if}
        </div>

        <div class="flex-1 min-w-0">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-heading font-bold uppercase tracking-wider mb-3 shadow-xs" style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));">
            <Sparkles size={12} />
            <span>{mainProduct.badge || 'PROMO BUNDLE SPESIAL'}</span>
          </div>
          <h3 class="font-heading text-xl sm:text-2xl font-black text-main leading-snug" style={mainStyle.color ? `color: ${mainStyle.color};` : ''}>
            {mainProduct.name}
          </h3>
          {#if mainProduct.description}
            <p class="text-xs sm:text-sm text-secondary mt-2 leading-relaxed">
              {mainProduct.description}
            </p>
          {/if}
        </div>
      </div>

      <div class="flex items-center justify-between pt-6 mt-6 border-t border-light/60">
        <div>
          <span class="text-xs text-secondary block font-mono">Harga Promo</span>
          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="font-heading text-lg sm:text-xl font-black text-[var(--color-primary)]">
              {formatIDR(mainProduct.price)}
            </span>
            {#if mainHasDiscount}
              <span class="text-xs text-secondary line-through font-mono opacity-70">
                {formatIDR(mainOrigPrice)}
              </span>
            {/if}
          </div>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            on:click|stopPropagation={() => onAddToCart(mainProduct, {})}
            class="h-9 px-4 border border-[var(--theme-btn-secondary-border,var(--btn-secondary-border,var(--color-border)))] bg-[var(--color-card-base)] hover:bg-[var(--color-nested-base)] active:scale-[0.98] text-[var(--color-text-main)] text-xs font-heading font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 0.75rem));"
          >
            <ShoppingCart size={13} />
            <span>{cartButtonText || 'Keranjang'}</span>
          </button>
          <button
            type="button"
            on:click|stopPropagation={() => onBuyNow(mainProduct, {})}
            class="h-9 px-5 active:scale-[0.98] text-xs font-heading font-bold transition-all cursor-pointer shadow-xs hover:opacity-90 flex items-center justify-center"
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 0.75rem)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
          >
            {buyButtonText || 'Ambil Paket'}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#each secondaryProducts as product, idx}
    {@const realIdx = idx + 1}
    {@const isSecActive = $canvasStore.selectedNodeId === (product.id || `product_item_${realIdx}`)}
    {@const isSecImgActive = $canvasStore.selectedNodeId === `product_image_${realIdx}`}
    {@const pStyle = resolveProductNodeStyle(product, realIdx, nodeStyles)}
    {@const secPrice = Number(product.price ?? 0)}
    {@const secOrigPrice = Number(product.originalPrice) || (product.showOriginalPrice === true && secPrice > 0 ? Math.round(secPrice * 1.3) : 0)}
    {@const secHasDiscount = (product.showOriginalPrice === true || (product.showOriginalPrice !== false && !!product.originalPrice && Number(product.originalPrice) > secPrice)) && secOrigPrice > secPrice}

    <div
      data-node={product.id || `product_item_${realIdx}`}
      data-node-id={product.id || `product_item_${realIdx}`}
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, realIdx, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, realIdx, product); }}
      style={pStyle.marginStyle}
      class={`cq-bento-secondary bg-card border border-light/80 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
        isSecActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-lg'
          : 'hover:shadow-md hover:border-light hover:shadow-md'
      }`}
    >
      <div>
        <div
          data-node={`product_image_${realIdx}`}
          data-node-id={`product_image_${realIdx}`}
          role="button"
          tabindex="0"
          on:click={(e) => selectImage(e, realIdx)}
          on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, realIdx); }}
          class={`aspect-square rounded-2xl overflow-hidden bg-nested mb-3 relative group/img cursor-pointer ${
            isSecImgActive ? 'ring-2 ring-primary' : ''
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
          {#if product.badge}
            <span
              class="absolute top-2 left-2 text-2xs font-heading font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs z-10"
              style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));"
            >
              {product.badge}
            </span>
          {/if}
        </div>

        <h3 class="font-heading font-bold text-xs text-main line-clamp-2" style={pStyle.color ? `color: ${pStyle.color};` : ''}>
          {product.name}
        </h3>
        <div class="flex items-baseline gap-1.5 flex-wrap mt-1">
          <p class="font-heading font-black text-xs text-[var(--color-primary)]">
            {formatIDR(product.price)}
          </p>
          {#if secHasDiscount}
            <span class="text-[10px] text-secondary line-through font-mono opacity-70">
              {formatIDR(secOrigPrice)}
            </span>
          {/if}
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-light/60 flex gap-2">
        <button
          type="button"
          on:click|stopPropagation={() => onAddToCart(product, {})}
          class="w-9 h-8 border border-[var(--theme-btn-secondary-border,var(--btn-secondary-border,var(--color-border)))] bg-[var(--color-card-base)] hover:bg-[var(--color-nested-base)] active:scale-[0.98] text-[var(--color-text-main)] transition-all flex items-center justify-center cursor-pointer shrink-0"
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 0.75rem));"
          aria-label="Tambah ke Keranjang"
        >
          <ShoppingCart size={13} />
        </button>
        <button
          type="button"
          on:click|stopPropagation={() => onBuyNow(product, {})}
          class="flex-1 h-8 active:scale-[0.98] text-xs font-heading font-bold transition-all cursor-pointer shadow-xs hover:opacity-90 flex items-center justify-center"
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 0.75rem)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
        >
          {buyButtonText && buyButtonText !== 'Ambil Paket' ? buyButtonText : 'Beli'}
        </button>
      </div>
    </div>
  {/each}
</div>
