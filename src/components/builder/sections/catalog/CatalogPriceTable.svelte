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
  aria-label="Tabel Daftar Harga"
  tabindex="0"
  on:click={selectRows}
  on:keydown={(e) => { if (e.key === 'Enter') selectRows(e); }}
  class={`w-full overflow-x-auto rounded-3xl border border-light/80 shadow-xs bg-card text-left transition-all duration-200 cursor-pointer ${
    $canvasStore.selectedNodeId === 'catalog_price_rows' ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''
  }`}
>
  <table class="w-full text-xs text-left">
    <thead class="bg-nested/80 text-secondary uppercase tracking-wider font-heading font-bold border-b border-light">
      <tr>
        <th class="p-4">Daftar Produk</th>
        <th class="p-4">Keterangan / Min. Order</th>
        <th class="p-4">Harga Satuan</th>
        <th class="p-4 text-right">Aksi</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-light">
      {#each products as product, idx (product.id || product.name + idx)}
        {@const isItemActive = $canvasStore.selectedNodeId === (product.id || `product_item_${idx}`)}
        <tr
          tabindex="0"
          on:click={(e) => selectCard(e, idx, product)}
          on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, idx, product); }}
          class={`hover:bg-nested/40 transition-colors cursor-pointer ${isItemActive ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''}`}
        >
          <td class="p-4 font-heading font-bold text-main">
            {product.name}
          </td>
          <td class="p-4 text-secondary max-w-xs truncate">
            {product.description || (product.badge ? `${product.badge}` : 'Stok Tersedia')}
          </td>
          <td class="p-4 font-heading font-black text-primary">
            {formatRupiah(product.price)}
          </td>
          <td class="p-4 text-right">
            <button
              type="button"
              on:click|stopPropagation={() => onBuyNow(product, {})}
              class="h-8 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold text-xs transition-all"
            >
              Pesan
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
