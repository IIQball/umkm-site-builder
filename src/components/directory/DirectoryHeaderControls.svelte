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
      <input
        id="directory-store-search"
        type="text"
        bind:value={searchQuery}
        on:input={() => dispatch('searchInput')}
        placeholder="Cari toko, kategori, atau produk (mis: Batik, Warung, Kopi)..."
        class="w-full pl-11 pr-28 py-3.5 rounded-2xl border border-border bg-card text-sm text-main placeholder:text-muted focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 shadow-xs transition-all"
      />
      <label for="directory-store-search" class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted text-[20px] cursor-text z-10 select-none" aria-hidden="true">
        search
      </label>
      <!-- Near Me Button in Search Bar -->
      <div class="absolute right-2 top-1/2 -translate-y-1/2 z-20">
        {#if userLocation}
          <div class="inline-flex items-center gap-1 p-0.5 rounded-xl bg-orange/10 border border-orange/20 text-orange dark:text-orange-400 shadow-2xs">
            <button
              type="button"
              on:click={() => dispatch('openLocationModal')}
              title="Klik untuk ubah kecamatan / lokasi"
              class="px-2.5 py-1 text-xs font-semibold flex items-center gap-1 hover:text-orange-dark transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[14px]">near_me</span>
              <span class="max-w-[100px] truncate">{userLocation.label || 'Terdekat'}</span>
            </button>
            <button
              type="button"
              on:click={() => dispatch('disableLocation')}
              title="Hapus filter lokasi"
              class="p-1 rounded-lg hover:bg-orange/20 text-orange hover:text-red-500 transition-colors flex items-center cursor-pointer"
            >
              <span class="material-symbols-outlined text-[13px]">close</span>
            </button>
          </div>
        {:else}
          <button
            type="button"
            on:click={() => dispatch('openLocationModal')}
            class="px-3 py-1.5 rounded-xl bg-nested hover:bg-card border border-border text-secondary hover:text-main text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <span class="material-symbols-outlined text-[15px] text-orange">my_location</span>
            <span class="hidden sm:inline">Terdekat</span>
          </button>
        {/if}
      </div>
    </div>

    <!-- View Mode Switcher -->
    <div class="inline-flex rounded-2xl bg-nested p-1 border border-border self-center sm:self-auto shrink-0 shadow-2xs">
      <button
        type="button"
        on:click={() => dispatch('changeViewMode', 'list')}
        class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer {viewMode === 'list' ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
      >
        <span class="material-symbols-outlined text-[16px] {viewMode === 'list' ? 'text-orange' : ''}">grid_view</span>
        <span>Daftar</span>
      </button>
      <button
        type="button"
        on:click={() => dispatch('changeViewMode', 'map')}
        class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer {viewMode === 'map' ? 'bg-card text-main shadow-xs' : 'text-secondary hover:text-main'}"
      >
        <span class="material-symbols-outlined text-[16px] {viewMode === 'map' ? 'text-orange' : ''}">map</span>
        <span>Peta</span>
      </button>
    </div>
  </div>

  <!-- Radius Selector (visible when location is active) -->
  {#if userLocation}
    <div class="flex items-center gap-2 text-xs text-secondary overflow-x-auto pb-1">
      <span class="font-semibold shrink-0 flex items-center gap-1 text-orange">
        <span class="material-symbols-outlined text-[15px]">radar</span>
        Radius ({userLocation.label || 'Lokasi'}):
      </span>
      {#each [5, 10, 25, 50] as r}
        <button
          type="button"
          on:click={() => dispatch('setRadius', r)}
          class="px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer {radius === r ? 'bg-orange text-white border border-orange shadow-xs' : 'bg-card hover:bg-nested border border-border text-secondary hover:text-main'}"
        >
          {r} km
        </button>
      {/each}
    </div>
  {/if}

  <!-- Category Pills -->
  {#if categories.length > 0}
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        type="button"
        on:click={() => dispatch('selectCategory', '')}
        class="px-4 py-2 rounded-full text-xs shrink-0 transition-all cursor-pointer {selectedCategory === '' ? 'bg-main text-canvas dark:bg-white dark:text-slate-950 font-bold shadow-xs' : 'bg-card hover:bg-nested text-secondary hover:text-main border border-border font-medium'}"
      >
        Semua
      </button>
      {#each categories as category (category.id)}
        <button
          type="button"
          on:click={() => dispatch('selectCategory', category.slug)}
          class="px-4 py-2 rounded-full text-xs shrink-0 flex items-center gap-1.5 transition-all cursor-pointer {selectedCategory === category.slug ? 'bg-main text-canvas dark:bg-white dark:text-slate-950 font-bold shadow-xs' : 'bg-card hover:bg-nested text-secondary hover:text-main border border-border font-medium'}"
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
