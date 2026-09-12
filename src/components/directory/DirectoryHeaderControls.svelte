<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { BusinessCategory } from './directory.types';

  export let searchQuery = '';
  export let selectedCategory = '';
  export let categories: BusinessCategory[] = [];
  export let userLocation: { lat: number; lng: number; label?: string } | null = null;
  export let radius = 10;
  export let viewMode: 'list' | 'map' = 'list';

  const dispatch = createEventDispatcher<{
    searchInput: void;
    selectCategory: string;
    setRadius: number;
    openLocationModal: void;
    disableLocation: void;
    changeViewMode: 'list' | 'map';
  }>();
</script>

<div class="space-y-4">
  <!-- Top Search & View Switcher Bar -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
    <!-- Search Input -->
    <div class="relative flex-1">
      <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[20px] pointer-events-none">search</span>
      <input
        type="text"
        bind:value={searchQuery}
        on:input={() => dispatch('searchInput')}
        placeholder="Cari toko, kategori, atau produk (mis: Batik, Warung, Kopi)..."
        class="w-full pl-11 pr-28 py-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
      />
      <!-- Near Me Button in Search Bar -->
      <div class="absolute right-2 top-1/2 -translate-y-1/2">
        {#if userLocation}
          <div class="inline-flex items-center gap-0.5 p-0.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shadow-xs">
            <button
              type="button"
              on:click={() => dispatch('openLocationModal')}
              title="Klik untuk ubah kecamatan / lokasi"
              class="px-2 py-1 text-xs font-semibold flex items-center gap-1 hover:text-emerald-950 dark:hover:text-emerald-100 transition-colors"
            >
              <span class="material-symbols-outlined text-[14px]">near_me</span>
              <span class="max-w-[100px] truncate">{userLocation.label || 'Terdekat'}</span>
            </button>
            <button
              type="button"
              on:click={() => dispatch('disableLocation')}
              title="Hapus filter lokasi"
              class="p-1 rounded-lg hover:bg-emerald-200/70 dark:hover:bg-emerald-800 text-emerald-700 dark:text-emerald-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center"
            >
              <span class="material-symbols-outlined text-[13px]">close</span>
            </button>
          </div>
        {:else}
          <button
            type="button"
            on:click={() => dispatch('openLocationModal')}
            class="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-medium flex items-center gap-1 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <span class="material-symbols-outlined text-[15px]">my_location</span>
            <span class="hidden sm:inline">Terdekat</span>
          </button>
        {/if}
      </div>
    </div>

    <!-- View Mode Switcher -->
    <div class="inline-flex rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 p-1 border border-zinc-200/60 dark:border-zinc-700/60 self-center sm:self-auto shrink-0">
      <button
        type="button"
        on:click={() => dispatch('changeViewMode', 'list')}
        class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all {viewMode === 'list' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}"
      >
        <span class="material-symbols-outlined text-[16px]">grid_view</span>
        <span>Daftar</span>
      </button>
      <button
        type="button"
        on:click={() => dispatch('changeViewMode', 'map')}
        class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all {viewMode === 'map' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}"
      >
        <span class="material-symbols-outlined text-[16px]">map</span>
        <span>Peta</span>
      </button>
    </div>
  </div>

  <!-- Radius Selector (visible when location is active) -->
  {#if userLocation}
    <div class="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 overflow-x-auto pb-1">
      <span class="font-medium shrink-0 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <span class="material-symbols-outlined text-[15px]">radar</span>
        Radius ({userLocation.label || 'Lokasi'}):
      </span>
      {#each [5, 10, 25, 50] as r}
        <button
          type="button"
          on:click={() => dispatch('setRadius', r)}
          class="px-3 py-1 rounded-full text-xs font-medium transition-all {radius === r ? 'bg-emerald-600 text-white shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'}"
        >
          {r} km
        </button>
      {/each}
    </div>
  {/if}

  <!-- Category Pills -->
  {#if categories.length > 0}
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        type="button"
        on:click={() => dispatch('selectCategory', '')}
        class="px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all {selectedCategory === '' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}"
      >
        Semua
      </button>
      {#each categories as category (category.id)}
        <button
          type="button"
          on:click={() => dispatch('selectCategory', category.slug)}
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all {selectedCategory === category.slug ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}"
        >
          {#if category.icon}
            <span class="material-symbols-outlined text-[14px]">{category.icon}</span>
          {/if}
          <span>{category.name}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
