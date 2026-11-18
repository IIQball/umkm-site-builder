<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Badge, Card, Modal } from '@/components/ui';
  import { apiFetch } from '@/lib/api/parse-response';
  import { toast } from '@/lib/toast';
  import AiProductAttachCardList from './AiProductAttachCardList.svelte';
  import type { AiFeatureType, AiQualityTier } from '@/types/ai';
  import {
    downloadAssetImage,
    type ImageDownloadFormat,
  } from './gallery-download.helpers';

  export let imageUrl: string = '';
  export let featureType: AiFeatureType = 'logo';
  export let modelUsed: string = ''; // kept for interface compatibility, never rendered
  $: void modelUsed;
  export let qualityTier: AiQualityTier = 'high';
  export let executionTimeMs: number = 0;
  export let logId: string = '';
  export let isGenerating: boolean = false;
  export let canApply: boolean = true;
  export let applyLabel: string = '';
  export let storeId: string = '';

  const dispatch = createEventDispatcher<{
    regenerate: void;
    apply: { imageUrl: string; featureType: AiFeatureType; logId: string };
    close: void;
  }>();

  let isDownloading = false, downloadFormat: ImageDownloadFormat | null = null, showDownloadMenu = false;
  let showLogoConfirmModal = false, showAttachModal = false, isSettingLogo = false;

  const FORMAT_OPTIONS: Array<{ id: ImageDownloadFormat; label: string; desc: string }> = [
    { id: 'png', label: 'PNG', desc: 'Resolusi penuh tanpa kompresi' },
    { id: 'jpg', label: 'JPG', desc: 'Cocok untuk cetak & web' },
    { id: 'pdf', label: 'PDF', desc: 'Format dokumen siap cetak' },
    { id: 'svg', label: 'SVG', desc: 'Vektor skalabel grafis' },
  ];

  $: defaultApplyLabel = applyLabel || (featureType === 'logo' ? 'Jadikan Logo Toko' : 'Pasang ke Produk');
  $: featureLabel = featureType === 'logo' ? 'Logo Toko' : featureType === 'packaging_mockup' ? 'Mockup Kemasan' : 'Poster Produk';
  $: qualityLabel = qualityTier === 'high' || qualityTier === 'hd' ? 'Kualitas HD' : 'Kualitas Standar';
  $: executionTimeFormatted = executionTimeMs > 0 ? (executionTimeMs >= 1000 ? `${(executionTimeMs / 1000).toFixed(1)} dtk` : `${executionTimeMs} ms`) : '';

  async function handleDownload(format: ImageDownloadFormat) {
    if (!imageUrl || isDownloading) return;
    showDownloadMenu = false;
    isDownloading = true;
    downloadFormat = format;

    try {
      await downloadAssetImage(
        imageUrl,
        featureType,
        logId || String(Date.now()),
        format
      );
    } finally {
      isDownloading = false;
      downloadFormat = null;
    }
  }

  function handleActionClick() {
    if (!imageUrl || isGenerating) return;
    if (featureType === 'logo') {
      showLogoConfirmModal = true;
    } else {
      showAttachModal = true;
    }
  }

  async function handleConfirmSetLogo() {
    isSettingLogo = true;
    try {
      const res = await apiFetch('/api/tenant/store/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: imageUrl, storeId: storeId || undefined }),
      });
      if (res.success) {
        toast.success('Logo toko berhasil diperbarui!');
        showLogoConfirmModal = false;
        dispatch('apply', { imageUrl, featureType, logId });
      } else {
        toast.error('Terjadi gangguan, silakan coba beberapa saat lagi.');
      }
    } catch {
      toast.error('Terjadi gangguan, silakan coba beberapa saat lagi.');
    } finally {
      isSettingLogo = false;
    }
  }

  function handleAttachedProduct() {
    showAttachModal = false;
    dispatch('apply', { imageUrl, featureType, logId });
  }

  function handleRegenerate() {
    if (isGenerating) return;
    dispatch('regenerate');
  }
</script>

<div class="space-y-5 animate-in fade-in duration-300">
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

      <!-- Badge Overlay Pojok Kiri Bawah (Waktu Proses) -->
      {#if executionTimeFormatted}
        <div class="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span class="inline-flex items-center px-2 py-0.5 text-2xs font-mono text-secondary rounded-md bg-card/90 border border-light/60 backdrop-blur-sm shadow-2xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 text-muted shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{executionTimeFormatted}</span>
          </span>
        </div>
      {/if}
    </div>
  </Card>

  <!-- Baris Tombol Aksi -->
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
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
        <span>Buat Desain Baru</span>
      </Button>

      <!-- Unduh Dropdown Button -->
      <div class="relative">
        <Button
          variant="secondary"
          size="md"
          on:click={() => (showDownloadMenu = !showDownloadMenu)}
          disabled={!imageUrl || isDownloading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>{isDownloading ? `Mengunduh ${downloadFormat?.toUpperCase()}...` : 'Unduh'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </Button>

        {#if showDownloadMenu}
          <div
            class="absolute left-0 bottom-full mb-1.5 w-52 bg-card border border-light rounded-2xl shadow-xl p-1.5 z-30 space-y-0.5 animate-in fade-in"
          >
            {#each FORMAT_OPTIONS as opt}
              <button
                type="button"
                class="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-nested flex items-center justify-between transition-colors cursor-pointer"
                on:click={() => handleDownload(opt.id)}
              >
                <div>
                  <div class="font-bold text-main">{opt.label}</div>
                  <div class="text-2xs text-muted">{opt.desc}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Tombol Aksi Pasang -->
    {#if canApply}
      <div class="flex items-center gap-2 justify-end">
        <Button
          variant="primary"
          size="md"
          on:click={handleActionClick}
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

  <!-- Modal Konfirmasi Logo Toko -->
  {#if showLogoConfirmModal}
    <Modal
      open={showLogoConfirmModal}
      title="Jadikan Sebagai Logo Toko?"
      size="sm"
      on:close={() => (showLogoConfirmModal = false)}
    >
      <div class="space-y-4">
        <p class="text-xs text-secondary leading-relaxed">
          Apakah Anda yakin ingin menggunakan desain logo ini sebagai logo resmi toko Anda? Logo akan langsung diperbarui di header dan footer toko.
        </p>
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-light">
          <Button
            size="sm"
            variant="ghost"
            disabled={isSettingLogo}
            on:click={() => (showLogoConfirmModal = false)}
          >
            Batal
          </Button>
          <Button
            size="sm"
            variant="primary"
            loading={isSettingLogo}
            disabled={isSettingLogo}
            on:click={handleConfirmSetLogo}
          >
            Ya, Jadikan Logo
          </Button>
        </div>
      </div>
    </Modal>
  {/if}

  <!-- Modal Pemilih Produk untuk Mockup / Poster -->
  {#if showAttachModal}
    <Modal
      open={showAttachModal}
      title="Pasang Desain ke Produk"
      size="lg"
      on:close={() => (showAttachModal = false)}
    >
      <AiProductAttachCardList
        {storeId}
        {imageUrl}
        {featureType}
        on:attached={handleAttachedProduct}
        on:cancel={() => (showAttachModal = false)}
      />
    </Modal>
  {/if}
</div>
