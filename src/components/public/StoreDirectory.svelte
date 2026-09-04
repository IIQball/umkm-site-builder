<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Store {
    id: string;
    name: string;
    subdomain: string;
    totalViews: number;
    totalWaClicks: number;
    logoUrl: string | null;
  }
  
  interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  }

  interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  }
  
  let stores: Store[] = [];
  let meta: Meta | null = null;
  let categories: Category[] = [];
  let selectedCategory = '';

  let loading = true;
  let error = '';
  let searchQuery = '';
  let page = 1;
  const limit = 12;
  
  let searchTimeout: ReturnType<typeof setTimeout>;

  async function fetchCategories() {
    try {
      const res = await fetch('/api/public/template-categories');
      const data = await res.json();
      if (data.success) {
        categories = data.data;
      }
    } catch (err: unknown) {
      console.error('Failed to fetch categories:', err);
    }
  }
  
  async function fetchStores(reset = false) {
    if (reset) {
      page = 1;
      stores = [];
    }
    
    loading = true;
    error = '';
    
    try {
      const url = new URL('/api/directory/search', window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', limit.toString());
      if (searchQuery.trim()) {
        url.searchParams.set('q', searchQuery.trim());
      }
      if (selectedCategory) {
        url.searchParams.set('category', selectedCategory);
      }
      
      const res = await fetch(url.toString());
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Gagal memuat data direktori');
      }
      
      if (reset) {
        stores = data.data;
      } else {
        stores = [...stores, ...data.data];
      }
      meta = data.meta;
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.';
    } finally {
      loading = false;
    }
  }
  
  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetchStores(true);
    }, 400);
  }

  function selectCategory(slug: string) {
    if (selectedCategory !== slug) {
      selectedCategory = slug;
      fetchStores(true);
    }
  }
  
  function loadMore() {
    if (meta?.hasMore && !loading) {
      page += 1;
      fetchStores();
    }
  }
  
  function getStoreUrl(subdomain: string) {
    if (typeof window === 'undefined') return '#';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // For local testing with Astro default port 4321
    const baseHost = isLocal ? 'localhost:4321' : window.location.host.replace(/^www\./, '');
    return `${window.location.protocol}//${subdomain}.${baseHost}`;
  }
  
  onMount(() => {
    fetchCategories();
    fetchStores(true);
  });
</script>

<div class="relative max-w-xl mx-auto mb-8 transition-[transform] duration-200 ease-out focus-within:scale-[1.01]">
  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px] z-10 pointer-events-none">search</span>
  <input
    type="text"
    bind:value={searchQuery}
    on:input={handleSearchInput}
    placeholder="Cari nama toko atau subdomain..."
    class="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-0 focus:border-zinc-400 dark:focus:border-zinc-600 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-[border-color,box-shadow] duration-200"
  />
</div>

{#if categories.length > 0}
  <div class="flex flex-wrap items-center justify-center gap-1.5 mb-12">
    <button
      on:click={() => selectCategory('')}
      class="px-4 py-2 rounded-full text-[13px] font-medium transition-[transform,background-color,color,box-shadow] duration-200 ease-out active:scale-[0.96] {selectedCategory === '' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800/50'}"
    >
      Semua
    </button>
    {#each categories as category (category.id)}
      <button
        on:click={() => selectCategory(category.slug)}
        class="px-4 py-2 rounded-full text-[13px] font-medium transition-[transform,background-color,color,box-shadow] duration-200 ease-out active:scale-[0.96] flex items-center gap-1.5 {selectedCategory === category.slug ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800/50'}"
      >
        {#if category.icon}
          <span class="material-symbols-outlined text-[14px] leading-none">{category.icon}</span>
        {/if}
        {category.name}
      </button>
    {/each}
  </div>
{/if}

{#if error}
  <div class="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm text-center">
    {error}
    <button class="ml-3 underline font-medium" on:click={() => fetchStores(true)}>Coba lagi</button>
  </div>
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {#each stores as store (store.id)}
      <a href={getStoreUrl(store.subdomain)} target="_blank" rel="noopener noreferrer" class="group p-5 rounded-[20px] bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col gap-3 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-[2px] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]">
        <div class="flex items-start justify-between gap-3">
          <div class="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
            {#if store.logoUrl}
              <img src={store.logoUrl} alt={store.name} class="w-full h-full object-cover" loading="lazy" />
            {:else}
              <span class="material-symbols-outlined text-zinc-300 dark:text-zinc-600 text-[20px]">storefront</span>
            {/if}
          </div>
          <div class="flex flex-col items-end shrink-0">
            <span class="text-[9px] font-bold uppercase tracking-[0.06em] text-zinc-400 dark:text-zinc-500">Kunjungan</span>
            <span class="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              {store.totalViews.toLocaleString('id-ID')}
              <span class="material-symbols-outlined text-[14px] text-zinc-400">visibility</span>
            </span>
          </div>
        </div>
        
        <div class="space-y-0.5 mt-1">
          <h3 class="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            {store.name}
          </h3>
          <p class="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-1 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">link</span>
            {store.subdomain}
          </p>
        </div>
        
        <div class="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80">
          <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium border border-zinc-200/50 dark:border-zinc-700/50">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Toko Aktif
          </div>
          <span class="material-symbols-outlined text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300 ease-out text-[18px]">arrow_forward</span>
        </div>
      </a>
    {/each}

    {#if loading}
      {#each Array.from({ length: stores.length === 0 ? 6 : 3 }) as _}
        <div class="p-5 rounded-[20px] bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col gap-3">
          <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center animate-pulse"></div>
          <div class="space-y-2 mt-3">
            <div class="h-4 w-2/3 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
            <div class="h-3 w-1/2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 animate-pulse"></div>
          </div>
          <div class="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <div class="h-6 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  {#if stores.length === 0 && !loading}
    <div class="py-16 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
        <span class="material-symbols-outlined text-3xl">search_off</span>
      </div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Toko tidak ditemukan</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Maaf, tidak ada toko yang cocok dengan pencarian atau filter Anda.
      </p>
    </div>
  {/if}

  {#if meta?.hasMore}
    <div class="mt-12 flex justify-center">
      <button 
        on:click={loadMore} 
        disabled={loading}
        class="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-[13px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-zinc-300 dark:hover:border-zinc-700 transition-[transform,box-shadow,border-color] duration-200 ease-out active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
      >
        {#if loading}
          <span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
        {/if}
        {loading ? 'Memuat...' : 'Tampilkan Lebih Banyak'}
      </button>
    </div>
  {/if}
{/if}
