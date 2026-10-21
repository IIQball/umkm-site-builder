<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Card, Button } from '@/components/ui';
  import AiAssetDetailModal from './AiAssetDetailModal.svelte';
  import AiGalleryCard from './AiGalleryCard.svelte';
  import {
    GALLERY_CATEGORY_TABS,
    type AiAssetItem,
  } from './gallery.constants';

  export let assets: AiAssetItem[] = [];
  export let loading: boolean = false;

  const dispatch = createEventDispatcher<{
    create: void;
    refresh: void;
  }>();

  let activeCategory: string = 'all';
  let selectedAsset: AiAssetItem | null = null;
  let isDetailOpen = false;

  $: filteredAssets = assets.filter((asset) => {
    if (activeCategory === 'all') return true;
    return asset.featureType === activeCategory;
  });

  function handleOpenDetail(asset: AiAssetItem) {
    selectedAsset = asset;
    isDetailOpen = true;
  }
</script>

<div class="space-y-6">
  <!-- Header Filter Tab & Refresh -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <!-- Tab Kategori -->
    <div class="flex flex-wrap items-center gap-1.5 p-1 bg-nested rounded-2xl border border-light">
      {#each GALLERY_CATEGORY_TABS as tab}
        {@const isActive = activeCategory === tab.id}
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer {isActive
            ? 'bg-card text-main shadow-xs border border-light'
            : 'text-secondary hover:text-main'}"
          on:click={() => (activeCategory = tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <!-- Tombol Muat Ulang -->
    <div class="flex items-center gap-2">
      <Button
        variant="secondary"
        size="xs"
        on:click={() => dispatch('refresh')}
        disabled={loading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={loading ? 'animate-spin' : ''}>
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        Segarkan
      </Button>
    </div>
  </div>

  <!-- Loading Skeleton -->
  {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each [1, 2, 3, 4] as _}
        <Card variant="bordered" padding="none" radius="xl" class="overflow-hidden bg-card animate-pulse">
          <div class="aspect-square bg-nested"></div>
          <div class="p-3.5 space-y-2">
            <div class="h-3 bg-nested rounded w-1/2"></div>
            <div class="h-2 bg-nested rounded w-3/4"></div>
          </div>
        </Card>
      {/each}
    </div>
  {:else if filteredAssets.length === 0}
    <!-- Empty State -->
    <Card variant="bordered" padding="lg" radius="2xl" class="text-center py-12 bg-card">
      <div class="w-16 h-16 rounded-full bg-nested border border-light flex items-center justify-center mx-auto mb-4 text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>
      <h4 class="font-heading font-bold text-base text-main mb-1">
        Belum Ada Aset Visual
      </h4>
      <p class="text-xs text-secondary max-w-sm mx-auto mb-5 leading-relaxed">
        {activeCategory === 'all'
          ? 'Toko Anda belum memiliki riwayat desain AI. Buat logo toko, mockup kemasan, atau poster promosi pertama Anda.'
          : 'Belum ada aset visual pada kategori ini. Silakan buat desain baru melalui Studio Desain.'}
      </p>
      <Button variant="primary" size="sm" on:click={() => dispatch('create')}>
        Mulai Buat Desain Sekarang
      </Button>
    </Card>
  {:else}
    <!-- Galeri Grid Gambar -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each filteredAssets as asset (asset.id)}
        <AiGalleryCard
          {asset}
          on:openDetail={(e) => handleOpenDetail(e.detail)}
        />
      {/each}
    </div>
  {/if}

  <!-- Detail Modal -->
  <AiAssetDetailModal
    open={isDetailOpen}
    asset={selectedAsset}
    on:close={() => (isDetailOpen = false)}
  />
</div>
