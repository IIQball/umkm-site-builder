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
  
  let stores: Store[] = [];
  let meta: Meta | null = null;
  let loading = true;
  let error = '';
  let searchQuery = '';
  let page = 1;
  const limit = 12;
  
  let searchTimeout: ReturnType<typeof setTimeout>;
  
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
    } catch (err: any) {
      error = err.message || 'Terjadi kesalahan saat memuat data.';
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
    fetchStores(true);
  });
</script>

<div class="relative max-w-xl mx-auto mb-10">
  <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
  <input
    type="text"
    bind:value={searchQuery}
    on:input={handleSearchInput}
    placeholder="Cari nama toko atau subdomain..."
    class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm transition-all"
  />
</div>

{#if error}
  <div class="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm text-center">
    {error}
    <button class="ml-3 underline font-medium" on:click={() => fetchStores(true)}>Coba lagi</button>
  </div>
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
    {#each stores as store (store.id)}
      <a href={getStoreUrl(store.subdomain)} target="_blank" rel="noopener noreferrer" class="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
        <div class="flex items-start justify-between gap-3">
          <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
            {#if store.logoUrl}
              <img src={store.logoUrl} alt={store.name} class="w-full h-full object-cover" loading="lazy" />
            {:else}
              <span class="material-symbols-outlined text-slate-400 text-[24px]">storefront</span>
            {/if}
          </div>
          <div class="flex flex-col items-end shrink-0">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Kunjungan</span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              {store.totalViews.toLocaleString('id-ID')}
              <span class="material-symbols-outlined text-[12px] text-blue-500">visibility</span>
            </span>
          </div>
        </div>
        
        <div class="space-y-1">
          <h3 class="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {store.name}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">link</span>
            {store.subdomain}
          </p>
        </div>
        
        <div class="mt-auto pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium border border-emerald-100 dark:border-emerald-800/30">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Toko Aktif
          </div>
          <span class="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors text-[20px]">arrow_forward</span>
        </div>
      </a>
    {/each}

    {#if loading}
      {#each Array.from({ length: stores.length === 0 ? 6 : 3 }) as _}
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-pulse">
            <span class="material-symbols-outlined text-slate-300 dark:text-slate-600">storefront</span>
          </div>
          <div class="space-y-2 mt-2">
            <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            <div class="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
          </div>
          <div class="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
            <div class="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
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
        Maaf, tidak ada toko yang cocok dengan kata kunci pencarian Anda. Coba kata kunci lain.
      </p>
    </div>
  {/if}

  {#if meta?.hasMore}
    <div class="mt-10 flex justify-center">
      <button 
        on:click={loadMore} 
        disabled={loading}
        class="px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {#if loading}
          <span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
          Memuat...
        {:else}
          Tampilkan Lebih Banyak
        {/if}
      </button>
    </div>
  {/if}
{/if}
