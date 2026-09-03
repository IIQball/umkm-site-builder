<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let categories: { id: string; name: string; slug: string }[] = [];
  export let activeCategoryId: string = 'all';
  export let onCategorySelect: (id: string) => void = (id: string) => { activeCategoryId = id; };
  export let onAddToCart: (p: ProductItem, s: Record<string, string>) => void = () => {};
  export let onBuyNow: (p: ProductItem, s: Record<string, string>) => void = () => {};

  $: fallbackCategories = [
    { id: 'all', name: 'Semua Produk', slug: 'all' },
    { id: '1', name: 'Makanan & Snack', slug: 'makanan' },
    { id: '2', name: 'Minuman Segar', slug: 'minuman' },
    { id: '3', name: 'Kriya & Oleh-Oleh', slug: 'kriya' },
  ];

  $: displayCategories = categories.length > 0 ? [{ id: 'all', name: 'Semua Produk', slug: 'all' }, ...categories] : fallbackCategories;

  $: filteredProducts = activeCategoryId === 'all'
    ? products
    : products.filter(p => (p as any).categoryId === activeCategoryId || (p as any).category === activeCategoryId);

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

  function selectSidebar(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_sidebar');
    }
  }
</script>

<div class="cq-prod-split-view text-left">
  <!-- Sidebar Categories -->
  <div
    role="button"
    aria-label="Filter Kategori"
    tabindex="0"
    on:click={selectSidebar}
    on:keydown={(e) => { if (e.key === 'Enter') selectSidebar(e); }}
    class={`bg-card p-5 rounded-3xl border border-light/80 shadow-xs self-start w-full cursor-pointer transition-all duration-200 ${
      $canvasStore.selectedNodeId === 'catalog_sidebar' ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:border-slate-300 dark:hover:border-slate-700'
    }`}
  >
    <h3 class="font-heading font-bold text-xs text-main uppercase tracking-wider mb-3 px-1">
      Kategori Produk
    </h3>
    <div class="flex flex-col gap-1.5 text-xs">
      {#each displayCategories as cat}
        <button
          type="button"
          on:click|stopPropagation={() => onCategorySelect(cat.id)}
          class={`text-left font-bold px-3 py-2 rounded-xl transition-all ${
            activeCategoryId === cat.id ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-main hover:bg-nested'
          }`}
        >
          {cat.name}
        </button>
      {/each}
    </div>
  </div>

  <!-- Product Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {#each (filteredProducts.length > 0 ? filteredProducts : products) as product, index (product.id || product.name + index)}
      {@const isCardActive = $canvasStore.selectedNodeId === (product.id || `product_item_${index}`)}
      {@const isImgActive = $canvasStore.selectedNodeId === `product_image_${index}`}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectCard(e, index, product)}
        on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, product); }}
        class={`bg-card p-4 rounded-2xl border border-light/80 shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer ${
          isCardActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-lg'
            : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div>
          <div
            role="button"
            tabindex="0"
            on:click={(e) => selectImage(e, index)}
            on:keydown={(e) => { if (e.key === 'Enter') selectImage(e, index); }}
            class={`aspect-square rounded-xl overflow-hidden bg-nested mb-3 relative group/img cursor-pointer ${
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

            {#if product.badge}
              <span class="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                {product.badge}
              </span>
            {/if}
          </div>

          <h3 class="font-heading font-bold text-xs sm:text-sm text-main line-clamp-2">
            {product.name}
          </h3>
          {#if product.description}
            <p class="text-[11px] text-secondary line-clamp-2 mt-1">
              {product.description}
            </p>
          {/if}
        </div>

        <div class="flex justify-between items-center mt-4 pt-3 border-t border-light/60">
          <span class="font-heading font-black text-primary text-xs sm:text-sm">
            {formatRupiah(product.price)}
          </span>
          <div class="flex gap-1.5">
            <button
              type="button"
              on:click|stopPropagation={() => onAddToCart(product, {})}
              class="h-8 px-2.5 rounded-xl bg-nested hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-main text-xs font-semibold transition-all"
            >
              +
            </button>
            <button
              type="button"
              on:click|stopPropagation={() => onBuyNow(product, {})}
              class="h-8 px-3 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-bold transition-all"
            >
              Beli
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
