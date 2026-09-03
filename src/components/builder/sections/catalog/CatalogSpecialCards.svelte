<script lang="ts">
  import type { ProductItem } from '@/types';
  import { Gift, Star, Download, FileText, ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah, buildWhatsAppOrderLink } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let activePreset: string = 'seasonal_hampers_gift';
  export let waNumber: string = '';
  export let onAddToCart: (product: ProductItem, selections: Record<string, string>) => void = () => {};
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

  function handleOrder(product: ProductItem) {
    const link = buildWhatsAppOrderLink(waNumber, product.name, product.price);
    if (typeof window !== 'undefined') window.open(link, '_blank');
  }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
  {#each products as product, index (product.id || product.name + index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
    {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
      class={`bg-card border border-light/80 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-xl'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {#if activePreset === 'before_after_product_effect'}
          <!-- 17. Before-After Split Image -->
          <div
            role="button"
            tabindex="0"
            on:click={(e) => selectImage(e, index)}
            on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
            class={`grid grid-cols-2 gap-2 mb-3 cursor-pointer ${isImgActive ? 'ring-2 ring-blue-500 rounded-2xl p-1' : ''}`}
          >
            <div class="relative rounded-xl overflow-hidden aspect-square bg-nested">
              <img src={product.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'} alt="Sebelum" class="w-full h-full object-cover grayscale" />
              <span class="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded">Sebelum</span>
            </div>
            <div class="relative rounded-xl overflow-hidden aspect-square bg-nested">
              <img src={product.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'} alt="Sesudah" class="w-full h-full object-cover" />
              <span class="absolute bottom-1.5 left-1.5 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">14 Hari</span>
            </div>
          </div>
        {:else if activePreset === 'digital_download_catalog'}
          <!-- 18. Digital Download Tags -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FileText size={10} />
              <span>{index % 2 === 0 ? 'PDF RESEP' : 'EXCEL TEMPLATE'}</span>
            </span>
            <span class="text-[10px] text-secondary font-mono">Instant Download</span>
          </div>
        {:else}
          <!-- 16 & 19: Seasonal Hampers / Review Paired -->
          <div
            role="button"
            tabindex="0"
            on:click={(e) => selectImage(e, index)}
            on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
            class={`aspect-video rounded-2xl bg-nested overflow-hidden mb-3 relative group/img cursor-pointer ${
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

            {#if activePreset === 'seasonal_hampers_gift'}
              <span class="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Gift size={11} />
                <span>HAMPERS EDISI SPESIAL</span>
              </span>
            {/if}
          </div>
        {/if}

        <h3 class="font-heading font-bold text-xs sm:text-sm text-main line-clamp-1">
          {product.name}
        </h3>

        {#if activePreset === 'customer_review_paired_card'}
          <!-- 19. Customer Rating & Quote -->
          <div class="flex items-center gap-1 my-1.5 text-amber-400 text-xs">
            {#each Array(5) as _}
              <Star size={11} class="fill-amber-400 text-amber-400" />
            {/each}
            <span class="text-secondary text-[10px] font-mono ml-1">({450 + index * 30} ulasan)</span>
          </div>
          <p class="text-[11px] text-secondary italic bg-nested/50 p-2.5 rounded-xl border border-light/60 my-2 leading-relaxed">
            "{product.description || 'Kualitas premium, rasa otentik dan kemasan rapi aman sampai tujuan!'}"
          </p>
        {:else if product.description}
          <p class="text-[11px] text-secondary line-clamp-2 my-1.5 leading-relaxed">
            {product.description}
          </p>
        {/if}
      </div>

      <div class="flex justify-between items-center pt-3 border-t border-light/60 mt-3">
        <span class="font-heading font-black text-xs sm:text-sm text-primary">
          {formatRupiah(product.price)}
        </span>
        <div class="flex gap-2">
          {#if activePreset === 'digital_download_catalog'}
            <button
              type="button"
              on:click|stopPropagation={() => handleOrder(product)}
              class="h-8 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Download</span>
            </button>
          {:else}
            <button
              type="button"
              on:click|stopPropagation={() => onAddToCart(product, {})}
              class="h-8 px-3 rounded-xl bg-nested hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-main text-xs font-semibold transition-all"
            >
              +
            </button>
            <button
              type="button"
              on:click|stopPropagation={() => onBuyNow(product, {})}
              class="h-8 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-bold transition-all"
            >
              Pesan
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/each}
</div>
