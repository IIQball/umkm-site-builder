<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag } from 'lucide-svelte';
  import { getBadgeColorClass } from '../productCatalog.helpers';

  export let products: ProductItem[];
  export let activePreset: string;
  export let cardBorderRadius: string;
  export let onOrderWhatsApp: (prod: ProductItem) => void;
</script>

{#if activePreset === 'catalog_table_menu'}
  <div class="overflow-x-auto rounded-2xl border border-base-200 dark:border-slate-800 bg-base-100 dark:bg-slate-900">
    <table class="table w-full text-xs">
      <thead>
        <tr class="border-b border-base-200 dark:border-slate-800 text-base-content/60">
          <th class="py-3 px-4">Produk</th>
          <th class="py-3 px-4">Harga</th>
          <th class="py-3 px-4 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each products as prod}
          <tr class="border-b border-base-200/50 dark:border-slate-800/50 hover:bg-base-200/30">
            <td class="py-3 px-4 flex items-center gap-3">
              <img
                src={prod.imageUrl || prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                alt={prod.name}
                class="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
              <span class="font-bold text-base-content">{prod.name}</span>
            </td>
            <td class="py-3 px-4 font-bold text-primary">
              Rp {(Number(prod.price) || 0).toLocaleString('id-ID')}
            </td>
            <td class="py-3 px-4 text-right">
              <button
                type="button"
                on:click={() => onOrderWhatsApp(prod)}
                class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
                style:background-color="var(--theme-primary)"
              >
                Pesan
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <!-- list_compact -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each products as prod}
      <div
        class="flex items-center gap-4 p-3 rounded-2xl transition-all hover:shadow-md group"
        style="border-radius: {cardBorderRadius}; background-color: var(--theme-surface); border: 1px solid var(--theme-border, rgba(0,0,0,0.08));"
      >
        <img
          src={prod.imageUrl || prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'}
          alt={prod.name}
          class="w-20 h-20 rounded-xl object-cover flex-shrink-0"
        />
        <div class="flex-1 flex flex-col justify-between h-20 py-0.5">
          <div>
            {#if prod.badge}
              <span class="inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase rounded mb-0.5 {getBadgeColorClass(prod.badge)}">
                {prod.badge}
              </span>
            {/if}
            <h3 class="font-bold text-xs text-base-content line-clamp-1 group-hover:text-primary transition-colors">
              {prod.name}
            </h3>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-primary">
              Rp {(Number(prod.price) || 0).toLocaleString('id-ID')}
            </span>
            <button
              type="button"
              on:click={() => onOrderWhatsApp(prod)}
              class="p-1.5 rounded-lg text-white cursor-pointer"
              style:background-color="var(--theme-primary)"
              title="Beli Sekarang"
            >
              <ShoppingBag size={13} />
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
