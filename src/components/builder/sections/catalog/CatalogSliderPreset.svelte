<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag } from 'lucide-svelte';
  import { getBadgeColorClass } from '../productCatalog.helpers';

  export let products: ProductItem[];
  export let cardBorderRadius: string;
  export let onOrderWhatsApp: (prod: ProductItem) => void;
</script>

<div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
  {#each products as prod}
    <div
      class="snap-start flex-shrink-0 w-64 flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl group"
      style="border-radius: {cardBorderRadius}; background-color: var(--theme-surface); border: 1px solid var(--theme-border, rgba(0,0,0,0.08));"
    >
      <div class="relative aspect-square w-full overflow-hidden bg-base-200/50">
        <img
          src={prod.imageUrl || prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'}
          alt={prod.name}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {#if prod.badge}
          <span class="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md shadow-sm {getBadgeColorClass(prod.badge)}">
            {prod.badge}
          </span>
        {/if}
      </div>

      <div class="flex flex-1 flex-col justify-between p-4 gap-3">
        <div>
          <h3 class="font-bold text-sm text-base-content line-clamp-1 group-hover:text-primary transition-colors">
            {prod.name}
          </h3>
          <p class="font-extrabold text-sm text-primary mt-1">
            Rp {(Number(prod.price) || 0).toLocaleString('id-ID')}
          </p>
        </div>

        <button
          type="button"
          on:click={() => onOrderWhatsApp(prod)}
          class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
          style:background-color="var(--theme-primary)"
        >
          <ShoppingBag size={14} />
          <span>Beli</span>
        </button>
      </div>
    </div>
  {/each}
</div>
