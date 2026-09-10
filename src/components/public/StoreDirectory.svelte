<script lang="ts">
  import { onMount } from 'svelte';
  import LocationPermissionModal from '@/components/directory/LocationPermissionModal.svelte';
  import DirectoryStoreCard from '@/components/directory/DirectoryStoreCard.svelte';
  import DirectoryMapView from '@/components/directory/DirectoryMapView.svelte';
  import DirectoryHeaderControls from '@/components/directory/DirectoryHeaderControls.svelte';
  import type { DirectoryStore, BusinessCategory, DirectoryMeta } from '@/components/directory/directory.types';

  let stores: DirectoryStore[] = [];
  let meta: DirectoryMeta | null = null;
  let categories: BusinessCategory[] = [];
  let selectedCategory = '';

  let loading = true;
  let error = '';
  let searchQuery = '';
  let page = 1;
  const limit = 12;

  // Geolocation state
  let userLocation: { lat: number; lng: number; label?: string } | null = null;
  let radius = 10;
  let isPermissionModalOpen = false;
  let viewMode: 'list' | 'map' = 'list';

  let searchTimeout: ReturnType<typeof setTimeout>;

  async function fetchCategories() {
    try {
      const res = await fetch('/api/public/business-categories');
      const data = await res.json();
      if (data.ok && Array.isArray(data.data)) {
        categories = data.data;
      }
    } catch (err) {
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
        url.searchParams.set('keyword', searchQuery.trim());
      }
      if (selectedCategory) {
        url.searchParams.set('categoryId', selectedCategory);
      }
      if (userLocation) {
        url.searchParams.set('lat', userLocation.lat.toString());
        url.searchParams.set('lng', userLocation.lng.toString());
        url.searchParams.set('radius', radius.toString());
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok || !data.ok) {
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
    }, 350);
  }

  function selectCategory(slug: string) {
    if (selectedCategory !== slug) {
      selectedCategory = slug;
      fetchStores(true);
    }
  }

  function setRadius(r: number) {
    if (radius !== r) {
      radius = r;
      fetchStores(true);
    }
  }

  function handleLocationGranted(event: CustomEvent<{ lat: number; lng: number; label?: string }>) {
    userLocation = event.detail;
    fetchStores(true);
  }

  function handleLocationSkip() {
    userLocation = null;
    fetchStores(true);
  }

  function disableLocation() {
    userLocation = null;
    try {
      localStorage.removeItem('umkm_geo_permission');
      localStorage.removeItem('umkm_user_location');
    } catch {
      // ignore
    }
    fetchStores(true);
  }

  function openLocationModal() {
    isPermissionModalOpen = true;
  }

  function loadMore() {
    if (meta?.hasMore && !loading) {
      page += 1;
      fetchStores();
    }
  }

  onMount(() => {
    fetchCategories();

    try {
      const savedLoc = localStorage.getItem('umkm_user_location');
      if (savedLoc) {
        const parsed = JSON.parse(savedLoc);
        if (typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number') {
          userLocation = parsed;
          fetchStores(true);
          return;
        }
      }
    } catch {
      // ignore
    }

    fetchStores(true);
  });
</script>

<div class="space-y-6">
  <DirectoryHeaderControls
    bind:searchQuery
    bind:selectedCategory
    {categories}
    {userLocation}
    {radius}
    {viewMode}
    on:searchInput={handleSearchInput}
    on:selectCategory={(e) => selectCategory(e.detail)}
    on:setRadius={(e) => setRadius(e.detail)}
    on:openLocationModal={openLocationModal}
    on:disableLocation={disableLocation}
    on:changeViewMode={(e) => (viewMode = e.detail)}
  />

  {#if error}
    <div class="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs text-center">
      {error}
      <button class="ml-2 font-bold underline" on:click={() => fetchStores(true)}>Coba lagi</button>
    </div>
  {/if}

  {#if viewMode === 'map'}
    <div class="space-y-6">
      <DirectoryMapView {stores} {userLocation} />

      <div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-emerald-600 text-[18px]">store</span>
          <span>Daftar Toko di Area Ini ({stores.length})</span>
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {#each stores as store (store.id)}
            <DirectoryStoreCard {store} />
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {#each stores as store (store.id)}
        <DirectoryStoreCard {store} />
      {/each}

      {#if loading}
        {#each Array.from({ length: stores.length === 0 ? 6 : 3 }) as _}
          <div class="p-5 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3">
            <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
            <div class="space-y-2 mt-2">
              <div class="h-4 w-3/4 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
              <div class="h-3 w-1/2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 animate-pulse"></div>
            </div>
            <div class="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div class="h-5 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    {#if stores.length === 0 && !loading}
      <div class="py-16 flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-400">
          <span class="material-symbols-outlined text-3xl">location_off</span>
        </div>
        <h3 class="text-base font-bold text-zinc-900 dark:text-white mb-1">Tidak Ada UMKM Ditemukan</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          {userLocation ? `Tidak ada UMKM dalam radius ${radius} km dari lokasi Anda. Coba perbesar radius atau cari kata kunci lain.` : 'Tidak ada toko yang cocok dengan pencarian atau filter kategori Anda.'}
        </p>
      </div>
    {/if}

    {#if meta?.hasMore}
      <div class="mt-10 flex justify-center">
        <button
          type="button"
          on:click={loadMore}
          disabled={loading}
          class="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-semibold shadow-sm hover:border-zinc-400 transition-all flex items-center gap-2"
        >
          {#if loading}
            <span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
          {/if}
          <span>{loading ? 'Memuat...' : 'Tampilkan Lebih Banyak'}</span>
        </button>
      </div>
    {/if}
  {/if}
</div>

<LocationPermissionModal
  bind:isOpen={isPermissionModalOpen}
  on:granted={handleLocationGranted}
  on:skip={handleLocationSkip}
  on:dismissed={handleLocationSkip}
/>
