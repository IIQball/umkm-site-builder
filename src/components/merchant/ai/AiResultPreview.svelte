<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Badge, Card } from '@/components/ui';
  import type { AiFeatureType, AiQualityTier } from '@/types/ai';
  import {
    downloadAssetImage,
    type ImageDownloadFormat,
  } from './gallery-download.helpers';

  export let imageUrl: string = '';
  export let featureType: AiFeatureType = 'logo';
  export let modelUsed: string = 'gpt-image-2.5-sunburst';
  export let qualityTier: AiQualityTier = 'high';
  export let executionTimeMs: number = 0;
  export let logId: string = '';
  export let isGenerating: boolean = false;
  export let canApply: boolean = true;
  export let applyLabel: string = '';

  const dispatch = createEventDispatcher<{
    regenerate: void;
    apply: { imageUrl: string; featureType: AiFeatureType; logId: string };
    close: void;
  }>();

  let isDownloading = false;
  let downloadFormat: ImageDownloadFormat = 'png';

  $: defaultApplyLabel =
    applyLabel ||
    (featureType === 'logo'
      ? 'Jadikan Logo Toko'
      : featureType === 'packaging_mockup'
        ? 'Pasang ke Foto Produk'
        : 'Gunakan Desain Poster');

  $: featureLabel =
    featureType === 'logo'
      ? 'Logo Toko'
      : featureType === 'packaging_mockup'
        ? 'Mockup Kemasan'
        : 'Poster Produk';

  $: qualityLabel = qualityTier === 'high' || qualityTier === 'hd' ? 'Kualitas HD' : 'Kualitas Standar';

  $: executionTimeFormatted =
    executionTimeMs > 0
      ? executionTimeMs >= 1000
        ? `${(executionTimeMs / 1000).toFixed(1)} dtk`
        : `${executionTimeMs} ms`
      : '';

  async function handleDownload(format: ImageDownloadFormat = 'png') {
    if (!imageUrl || isDownloading) return;
    isDownloading = true;
    downloadFormat = format;

    try {
      await downloadAssetImage(
        imageUrl,
        featureType,
        logId || String(Date.now()),
        format
      );
    } catch {
      // Fallback unduhan langsung jika Cloudinary helpers gagal
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${featureType}_${Date.now()}.${format}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      isDownloading = false;
    }
  }

  function handleApply() {
    if (!imageUrl || isGenerating) return;
    dispatch('apply', { imageUrl, featureType, logId });
  }

  function handleRegenerate() {
    if (isGenerating) return;
    dispatch('regenerate');
  }
</script>

<div class="space-y-5 animate-in fade-in duration-300">
  <!-- Card Wadah Gambar Pratinjau -->
  <Card variant="bordered" padding="sm" class="overflow-hidden border border-light/80 shadow-soft">
    <div
      class="relative w-full aspect-square sm:aspect-[4/3] bg-nested/80 rounded-xl overflow-hidden flex items-center justify-center p-3 select-none"
    >
      {#if imageUrl}
        <img
          src={imageUrl}
          alt={`Pratinjau Hasil ${featureLabel}`}
          class="max-w-full max-h-full object-contain rounded-lg shadow-sm transition-transform hover:scale-102 duration-300"
          loading="eager"
        />
      {:else}
        <div class="flex flex-col items-center justify-center text-secondary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <span class="text-xs text-muted">Gambar pratinjau belum tersedia</span>
        </div>
      {/if}

      <!-- Badge Overlay Pojok Kanan Atas -->
      <div class="absolute top-3 right-3 flex flex-wrap items-center justify-end gap-1.5 max-w-[80%]">
        <Badge variant={qualityTier === 'high' || qualityTier === 'hd' ? 'indigo' : 'slate'} size="sm" dot={true}>
          {qualityLabel}
        </Badge>
        <Badge variant="info" size="sm">
          {featureLabel}
        </Badge>
      </div>

      <!-- Badge Overlay Pojok Kiri Bawah (Model & Waktu) -->
      <div class="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
        {#if modelUsed}
          <span class="px-2 py-0.5 text-2xs font-mono font-medium rounded-md bg-card/90 text-main border border-light/60 backdrop-blur-sm shadow-2xs">
            {modelUsed}
          </span>
        {/if}
        {#if executionTimeFormatted}
          <span class="inline-flex items-center px-2 py-0.5 text-2xs font-mono text-secondary rounded-md bg-card/90 border border-light/60 backdrop-blur-sm shadow-2xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 text-muted shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{executionTimeFormatted}</span>
          </span>
        {/if}
      </div>
    </div>
  </Card>

  <!-- Baris Tombol Aksi -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
    <!-- Tombol Regenerasi & Unduh -->
    <div class="flex items-center gap-2">
      <Button
        variant="secondary"
        size="md"
        on:click={handleRegenerate}
        disabled={isGenerating}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={isGenerating ? 'animate-spin' : ''}>
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
          <path d="M16 16h5v5"/>
        </svg>
        <span>Generate Ulang</span>
      </Button>

      <Button
        variant="ghost"
        size="md"
        on:click={() => handleDownload('png')}
        disabled={!imageUrl || isDownloading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>{isDownloading && downloadFormat === 'png' ? 'Mengunduh...' : 'Unduh PNG'}</span>
      </Button>
    </div>

    <!-- Tombol Terapkan Aset / Callback Apply -->
    {#if canApply}
      <div class="flex items-center gap-2 justify-end">
        <Button
          variant="primary"
          size="md"
          on:click={handleApply}
          disabled={!imageUrl || isGenerating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{defaultApplyLabel}</span>
        </Button>
      </div>
    {/if}
  </div>
</div>
