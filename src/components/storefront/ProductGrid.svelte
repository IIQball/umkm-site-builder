<script lang="ts">
  import type { InferSelectModel } from 'drizzle-orm';
  import type { products, storeCategories } from '@/db/schema';
  import { formatCurrency } from '@/lib/utils/format';

  export let storeProducts: (InferSelectModel<typeof products> & { category: InferSelectModel<typeof storeCategories> })[] = [];
  export let categories: InferSelectModel<typeof storeCategories>[] = [];

  let activeCategory = 'all';
  let loadedImages = new Set<string>();

  $: filteredProducts = activeCategory === 'all' 
    ? storeProducts 
    : storeProducts.filter(p => p.categoryId === activeCategory);

  function handleImageLoad(productId: string) {
    loadedImages.add(productId);
    loadedImages = loadedImages;
  }
</script>

<div class="py-12 bg-white">
  <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-slate-900">Katalog Produk</h2>
      
      <!-- Category Tabs -->
      {#if categories.length > 0}
        <div class="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 mt-4 md:mt-0 hide-scrollbar">
          <button 
            class="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors {activeCategory === 'all' ? 'bg-primary text-primary-content' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
            on:click={() => activeCategory = 'all'}
          >
            Semua Produk
          </button>
          {#each categories as category}
            <button 
              class="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors {activeCategory === category.id ? 'bg-primary text-primary-content' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
              on:click={() => activeCategory = category.id}
            >
              {category.name}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Product Grid -->
    {#if filteredProducts.length === 0}
      <div class="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Belum ada produk</h3>
        <p class="text-slate-500 max-w-sm mx-auto">Kategori ini belum memiliki produk aktif yang tersedia.</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
         {#each filteredProducts as product (product.id)}
           <div class="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
             <!-- Image Container — fixed aspect ratio prevents CLS -->
             <div class="relative w-full" style="aspect-ratio: 1 / 1; overflow: hidden; background-color: #f1f5f9;">
               {#if Array.isArray(product.imageUrls) && product.imageUrls.length > 0}
                 {#if !loadedImages.has(product.id)}
                   <!-- Skeleton loader — smooth loading state -->
                   <div class="absolute inset-0 skeleton" />
                 {/if}
                 <img 
                   src={product.imageUrls[0]} 
                   alt={product.name}
                   loading="lazy"
                   decoding="async"
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                   on:load={() => handleImageLoad(product.id)}
                 />
               {:else}
                 <div class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                 </div>
               {/if}
               
               <!-- Badges — fixed position prevents CLS -->
               <div class="absolute top-2 left-2 flex gap-1">
                 <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-md shadow-sm">
                   {product.category.name}
                 </span>
               </div>
             </div>
             
             <!-- Content — reserved height prevents CLS -->
             <div class="p-4 min-h-28">
               <h3 class="font-semibold text-slate-900 line-clamp-2 mb-2 h-14" title={product.name}>{product.name}</h3>
               <p class="text-primary font-bold mb-4">{formatCurrency(product.basePrice)}</p>
               
               <button class="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                 Beli Sekarang
               </button>
             </div>
           </div>
         {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
