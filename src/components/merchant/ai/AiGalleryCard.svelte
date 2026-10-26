<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Card, Badge, Button } from '@/components/ui';
  import {
    getFeatureTypeBadgeConfig,
    type AiAssetItem,
  } from './gallery.constants';
  import { formatDate } from '@/lib/utils/format';
  import {
    downloadAssetImage,
    type ImageDownloadFormat,
  } from './gallery-download.helpers';

  export let asset: AiAssetItem;

  const dispatch = createEventDispatcher<{
    openDetail: AiAssetItem;
    attach: AiAssetItem;
  }>();

  let isDownloading = false;
  let downloadFormat: ImageDownloadFormat | null = null;

  async function handleDownload(
    format: ImageDownloadFormat,
    event?: CustomEvent<MouseEvent> | MouseEvent
  ) {
    event?.stopPropagation();
    if (isDownloading) return;

    isDownloading = true;
    downloadFormat = format;

    try {
      await downloadAssetImage(
        asset.cloudinaryUrl,
        asset.featureType,
        asset.id,
        format
      );
    } finally {
      isDownloading = false;
      downloadFormat = null;
    }
  }

  function handleAttachClick(e: MouseEvent) {
    e.stopPropagation();
    dispatch('attach', asset);
  }

  $: badge = getFeatureTypeBadgeConfig(asset.featureType);
</script>

<div
  role="button"
  tabindex="0"
  class="text-left group cursor-pointer focus:outline-none flex flex-col h-full"
  on:click={() => dispatch('openDetail', asset)}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch('openDetail', asset)}
>
  <Card
    variant="bordered"
    padding="none"
    radius="xl"
    class="overflow-hidden bg-card transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-primary/50 flex flex-col h-full"
  >
    <!-- Thumbnail Gambar -->
    <div class="aspect-square bg-nested relative overflow-hidden flex items-center justify-center">
      <img
        src={asset.cloudinaryUrl}
        alt="Hasil Desain Visual AI"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div class="absolute top-2.5 left-2.5">
        <Badge variant={badge.variant} size="sm" dot={true}>
          {badge.label}
        </Badge>
      </div>
      {#if asset.sizeRatio}
        <div class="absolute top-2.5 right-2.5">
          <Badge variant="slate" size="sm" dot={false}>
            {asset.sizeRatio === '2:3' ? '2:3 Vertikal' : '1:1 Persegi'}
          </Badge>
        </div>
      {/if}
    </div>

    <!-- Informasi Kartu -->
    <div class="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
      <div class="space-y-1">
        <div class="flex items-center justify-between text-2xs text-muted">
          <span>{formatDate(asset.createdAt)}</span>
          <span class="text-primary font-medium">Klik untuk perbesar</span>
        </div>
        <p class="font-heading font-semibold text-xs text-main line-clamp-1">
          {badge.label}
        </p>
      </div>

      <!-- Tombol Aksi: Unduh & Pasang ke Produk -->
      <div class="pt-2 border-t border-light space-y-2">
        <div class="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="xs"
            fullWidth
            disabled={isDownloading}
            on:click={(e) => handleDownload('png', e)}
            title="Unduh berkas gambar PNG kualitas tinggi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>{isDownloading && downloadFormat === 'png' ? '...' : 'Unduh PNG'}</span>
          </Button>

          <Button
            variant="secondary"
            size="xs"
            fullWidth
            disabled={isDownloading}
            on:click={(e) => handleDownload('jpg', e)}
            title="Unduh berkas gambar JPG"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>{isDownloading && downloadFormat === 'jpg' ? '...' : 'Unduh JPG'}</span>
          </Button>
        </div>

        <Button
          variant="primary"
          size="xs"
          fullWidth
          disabled={isDownloading}
          on:click={handleAttachClick}
          title="Pasang langsung ke produk tanpa download"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Pasang ke Produk</span>
        </Button>
      </div>
    </div>
  </Card>
</div>
