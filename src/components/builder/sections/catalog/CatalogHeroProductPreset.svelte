<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag, Star } from 'lucide-svelte';
  import { getBadgeColorClass } from '../productCatalog.helpers';

  export let products: ProductItem[];
  export let cardBorderRadius: string;
  export let onOrderWhatsApp: (prod: ProductItem) => void;

  $: featured = products[0];
  $: others = products.slice(1);
</script>

<div class="space-y-8">
  {#if featured}
    <div
      class="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-3xl shadow-xl items-center overflow-hidden"
      style="border-radius: {cardBorderRadius}; background-color: var(--theme-surface); border: 1px solid var(--theme-border, rgba(0,0,0,0.08));"
    >
      <div class="md:col-span-6 aspect-4/3 overflow-hidden rounded-2xl">
        <img
          src={featured.imageUrl || featured.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
          alt={featured.name}
          class="w-full h-full object-cover"
        />
      </div>
      <div class="md:col-span-6 flex flex-col gap-4 text-left">
        {#if featured.badge}
          <span class="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-lg w-fit {getBadgeColorClass(featured.badge)}">
            <Star size={12} /> {featured.badge}
          </span>
        {/if}
        <h3 class="text-2xl md:text-3xl font-extrabold text-base-content leading-tight">
          {featured.name}
        </h3>
        <p class="text-2xl font-black text-primary">
          Rp {(Number(featured.price) || 0).toLocaleString('id-ID')}
        </p>
        <button
          type="button"
          on:click={() => onOrderWhatsApp(featured)}
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg cursor-pointer w-fit"
          style:background-color="var(--theme-primary)"
        >
          <ShoppingBag size={16} />
          <span>Beli Produk Unggulan</span>
        </button>
      </div>
    </div>
  {/if}

  {#if others.length > 0}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {#each others as prod}
        <div
          class="flex flex-col overflow-hidden rounded-xl transition-all hover:shadow-lg group"
          style="background-color: var(--theme-surface); border: 1px solid var(--theme-border, rgba(0,0,0,0.08));"
        >
          <div class="aspect-square w-full overflow-hidden bg-base-200/50">
            <img
              src={prod.imageUrl || prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
              alt={prod.name}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div class="p-3 flex flex-col justify-between flex-1 gap-2">
            <h4 class="font-bold text-xs text-base-content line-clamp-1">{prod.name}</h4>
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs text-primary">Rp {(Number(prod.price) || 0).toLocaleString('id-ID')}</span>
              <button
                type="button"
                on:click={() => onOrderWhatsApp(prod)}
                class="p-1 rounded-md text-white cursor-pointer"
                style:background-color="var(--theme-primary)"
              >
                <ShoppingBag size={12} />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
