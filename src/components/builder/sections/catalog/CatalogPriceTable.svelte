<script lang="ts">
  import type { ProductItem } from '@/types';

  export let products: ProductItem[] = [];
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void;
</script>

<div class="w-full overflow-x-auto rounded-2xl border border-base-200 dark:border-slate-800 shadow-sm bg-[var(--theme-surface,#f8fafc)] text-left">
  <table class="w-full text-xs text-left">
    <thead class="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
      <tr>
        <th class="p-4">Produk</th>
        <th class="p-4 hidden sm:table-cell">Deskripsi</th>
        <th class="p-4">Harga</th>
        <th class="p-4 text-right">Aksi</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
      {#each products as product}
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="p-4 font-bold text-[var(--theme-text-primary,#0f172a)] flex items-center gap-3">
            {#if product.imageUrl}
              <img src={product.imageUrl} alt={product.name} class="w-10 h-10 rounded-lg object-cover" />
            {/if}
            <span>{product.name}</span>
          </td>
          <td class="p-4 text-slate-500 max-w-xs truncate hidden sm:table-cell">{product.description || "-"}</td>
          <td class="p-4 font-mono font-bold text-[var(--theme-primary,#2563eb)]">
            Rp {typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : product.price}
          </td>
          <td class="p-4 text-right">
            <button
              type="button"
              on:click={() => onBuyNow(product, {})}
              class="px-4 py-1.5 rounded-lg bg-[var(--theme-primary,#2563eb)] text-white font-bold text-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              Beli
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
