<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '@/components/ui';
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

<div class="space-y-8">
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
    <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs text-center flex items-center justify-center gap-2">
      <span>{error}</span>
      <button class="font-bold underline cursor-pointer hover:text-red-700 dark:hover:text-red-300 transition-colors" on:click={() => fetchStores(true)}>Coba lagi</button>
    </div>
  {/if}

  {#if viewMode === 'map'}
    <div class="space-y-6">
      <DirectoryMapView {stores} {userLocation} />

      <div>
        <h3 class="text-sm sm:text-base font-bold text-main font-heading mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-orange"></span>
          <span>Daftar Toko di Area Ini ({stores.length})</span>
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each stores as store (store.id)}
            <DirectoryStoreCard {store} />
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each stores as store (store.id)}
        <DirectoryStoreCard {store} />
      {/each}

      {#if loading}
        {#each Array.from({ length: stores.length === 0 ? 6 : 3 }) as _}
          <div class="p-6 rounded-3xl bg-card border border-border flex flex-col gap-3.5 shadow-xs">
            <div class="w-12 h-12 rounded-2xl bg-nested animate-pulse"></div>
            <div class="space-y-2 mt-2">
              <div class="h-4 w-3/4 rounded-md bg-nested animate-pulse"></div>
              <div class="h-3 w-1/2 rounded-md bg-nested/60 animate-pulse"></div>
            </div>
            <div class="mt-auto pt-4 border-t border-border">
              <div class="h-5 w-24 rounded-full bg-nested animate-pulse"></div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    {#if stores.length === 0 && !loading}
      <div class="py-16 sm:py-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-card border border-border">
        <div class="w-16 h-16 rounded-2xl bg-nested text-muted flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-3xl">location_off</span>
        </div>
        <h3 class="text-lg font-bold text-main font-heading mb-1.5">Tidak Ada Toko UMKM Ditemukan</h3>
        <p class="text-xs sm:text-sm text-secondary max-w-md font-sans">
          {userLocation ? `Tidak ada UMKM dalam radius ${radius} km dari lokasi Anda. Coba perbesar radius atau cari kata kunci lain.` : 'Tidak ada toko yang cocok dengan pencarian atau filter kategori yang dipilih.'}
        </p>
      </div>
    {/if}

    {#if meta?.hasMore}
      <div class="mt-12 flex justify-center">
        <Button
          variant="secondary"
          size="sm"
          on:click={loadMore}
          disabled={loading}
          class="rounded-full uppercase tracking-wider"
        >
          {#if loading}
            <span class="material-symbols-outlined animate-spin text-[16px] text-orange">progress_activity</span>
          {/if}
          <span>{loading ? 'Memuat...' : 'Tampilkan Lebih Banyak'}</span>
        </Button>
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
