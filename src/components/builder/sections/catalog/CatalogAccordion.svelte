<script lang="ts">
  import type { ProductItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  function selectRows(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_price_rows');
    }
  }

  function selectCard(e: Event, idx: number, prod: ProductItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, prod.id || `product_item_${idx}`);
    }
  }
</script>

<div
  role="button"
  aria-label="Daftar Menu Akordeon"
  tabindex="0"
  on:click={selectRows}
  on:keydown={(e) => { if (e.key === 'Enter') selectRows(e); }}
  class={`max-w-2xl mx-auto text-left space-y-2.5 cursor-pointer transition-all ${
    $canvasStore.selectedNodeId === 'catalog_price_rows' ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 rounded-3xl p-2' : ''
  }`}
>
  {#each products as product, idx (product.id || product.name + idx)}
    {@const isItemActive = $canvasStore.selectedNodeId === (product.id || `product_item_${idx}`)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, idx, product)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, idx, product); }}
      class={`p-4 rounded-2xl border border-light/80 bg-card shadow-xs flex justify-between items-center transition-all duration-200 cursor-pointer ${
        isItemActive ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="min-w-0 pr-3">
        <h3 class="font-heading font-bold text-xs sm:text-sm text-main truncate">
          {product.name}
        </h3>
        {#if product.description}
          <p class="text-[11px] text-secondary truncate mt-0.5">
            {product.description}
          </p>
        {/if}
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <span class="font-heading font-black text-xs sm:text-sm text-primary">
          {formatRupiah(product.price)}
        </span>
        <button
          type="button"
          on:click|stopPropagation={() => onBuyNow(product, {})}
          class="h-8 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-heading font-semibold text-xs transition-all shadow-xs"
        >
          Pesan
        </button>
      </div>
    </div>
  {/each}
</div>
