<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Modal, Button, Badge } from '@/components/ui';
  import {
    getFeatureTypeBadgeConfig,
    type AiAssetItem,
  } from './gallery.constants';
  import { formatDate } from '@/lib/utils/format';
  import {
    downloadAssetImage,
    type ImageDownloadFormat,
  } from './gallery-download.helpers';

  export let open: boolean = false;
  export let asset: AiAssetItem | null = null;

  const dispatch = createEventDispatcher<{
    close: void;
  }>();

  let isDownloading = false;
  let downloadFormat: ImageDownloadFormat | null = null;

  async function handleDownload(format: ImageDownloadFormat) {
    if (!asset || isDownloading) return;

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

  function handleClose() {
    open = false;
    dispatch('close');
  }

  $: badgeConfig = asset ? getFeatureTypeBadgeConfig(asset.featureType) : { label: '', variant: 'slate' as const };
  $: sizeLabel = asset?.sizeRatio === '2:3' ? 'Format Vertikal (2:3)' : 'Format Persegi (1:1)';
</script>

<Modal
  {open}
  title={asset ? `Pratinjau Desain: ${badgeConfig.label}` : 'Pratinjau Desain'}
  description={asset ? `Dibuat pada ${formatDate(asset.createdAt)} • ${sizeLabel}` : ''}
  size="lg"
  on:close={handleClose}
>
  {#if asset}
    <div class="space-y-4">
      <!-- Pratinjau Gambar Penuh -->
      <div class="relative w-full aspect-square sm:aspect-[4/3] bg-nested rounded-2xl overflow-hidden border border-light flex items-center justify-center p-2">
        <img
          src={asset.cloudinaryUrl}
          alt="Pratinjau Visual Penuh"
          class="max-w-full max-h-full object-contain rounded-xl"
          loading="lazy"
        />
        <div class="absolute top-3 right-3 flex items-center gap-1.5">
          <Badge variant={badgeConfig.variant} size="sm" dot={true}>
            {badgeConfig.label}
          </Badge>
          <Badge variant="slate" size="sm" dot={false}>
            {sizeLabel}
          </Badge>
        </div>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <div class="flex flex-wrap items-center justify-between gap-3 w-full">
      <div class="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={isDownloading}
          on:click={() => handleDownload('png')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>{isDownloading && downloadFormat === 'png' ? 'Mengunduh...' : 'Unduh PNG'}</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          disabled={isDownloading}
          on:click={() => handleDownload('jpg')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>{isDownloading && downloadFormat === 'jpg' ? 'Mengunduh...' : 'Unduh JPG'}</span>
        </Button>
      </div>

      <Button variant="primary" size="sm" on:click={handleClose}>
        Selesai & Tutup
      </Button>
    </div>
  </svelte:fragment>
</Modal>
