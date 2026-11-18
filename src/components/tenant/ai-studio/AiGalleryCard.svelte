<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Card, Button } from '@/components/ui';
  import type { AiAssetItem } from './gallery.constants';
  import {
    downloadAssetImage,
    type ImageDownloadFormat,
  } from './gallery-download.helpers';
  import { toast } from '@/lib/toast';
  import { apiFetch } from '@/lib/api/parse-response';

  export let asset: AiAssetItem;
  export let storeId: string = '';

  const dispatch = createEventDispatcher<{
    openDetail: AiAssetItem;
    attach: AiAssetItem;
  }>();

  let isDownloading = false;
  let downloadFormat: ImageDownloadFormat | null = null;
  let showFormatMenu = false;
  let showLogoConfirmModal = false;
  let isSettingLogo = false;

  const FORMAT_OPTIONS: Array<{ id: ImageDownloadFormat; label: string }> = [
    { id: 'png', label: 'PNG' },
    { id: 'jpg', label: 'JPG' },
    { id: 'pdf', label: 'PDF' },
    { id: 'svg', label: 'SVG' },
  ];

  async function handleDownload(
    format: ImageDownloadFormat,
    event?: CustomEvent<MouseEvent> | MouseEvent
  ) {
    event?.stopPropagation();
    if (isDownloading) return;

    showFormatMenu = false;
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

  function handleAttachClick(e: Event) {
    e.stopPropagation();
    dispatch('attach', asset);
  }

  function handleLogoClick(e: Event) {
    e.stopPropagation();
    showLogoConfirmModal = true;
  }

  async function handleConfirmSetLogo(e: Event) {
    e.stopPropagation();
    if (isSettingLogo) return;
    isSettingLogo = true;
    try {
      const res = await apiFetch('/api/tenant/store/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl: asset.cloudinaryUrl,
          storeId: storeId || undefined,
        }),
      });
      if (res.success) {
        toast.success('Logo toko berhasil diperbarui!');
        showLogoConfirmModal = false;
      } else {
        toast.error('Terjadi gangguan, silakan coba beberapa saat lagi.');
      }
    } catch {
      toast.error('Terjadi gangguan, silakan coba beberapa saat lagi.');
    } finally {
      isSettingLogo = false;
    }
  }
</script>

<div class="text-left group flex flex-col h-full relative">
  <Card
    variant="bordered"
    padding="none"
    radius="xl"
    class="overflow-hidden bg-card transition-all duration-200 group-hover:shadow-md group-hover:border-primary/50 flex flex-col h-full"
  >
    <!-- Thumbnail Gambar & Aksi Klik untuk Perbesar -->
    <div
      role="button"
      tabindex="0"
      class="aspect-square bg-nested relative overflow-hidden flex items-center justify-center cursor-pointer select-none group/img focus:outline-none"
      on:click={() => dispatch('openDetail', asset)}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch('openDetail', asset)}
      title="Klik untuk perbesar"
    >
      <img
        src={asset.cloudinaryUrl}
        alt="Hasil Desain Visual AI"
        class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
        loading="lazy"
      />
      <!-- Hover Overlay: Klik untuk Perbesar -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
          Klik untuk perbesar
        </span>
      </div>
    </div>

    <!-- Tombol Aksi: Unduh & Pasang / Jadikan Logo -->
    <div class="p-3 space-y-2 border-t border-light mt-auto">
      <div class="relative">
        <Button
          variant="secondary"
          size="xs"
          fullWidth
          disabled={isDownloading}
          on:click={(e) => {
            e.stopPropagation();
            showFormatMenu = !showFormatMenu;
          }}
          title="Unduh berkas gambar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>{isDownloading ? `Mengunduh ${downloadFormat?.toUpperCase()}...` : 'Unduh'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-70 ml-0.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </Button>

        {#if showFormatMenu}
          <!-- Backdrop click outside closer -->
          <button
            type="button"
            class="fixed inset-0 z-40 bg-transparent cursor-default"
            on:click={(e) => {
              e.stopPropagation();
              showFormatMenu = false;
            }}
            aria-label="Tutup menu format"
          ></button>

          <div class="absolute left-0 bottom-full mb-1.5 w-full bg-card border border-light rounded-xl shadow-xl p-1 z-50 space-y-0.5">
            {#each FORMAT_OPTIONS as opt}
              <button
                type="button"
                class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-main hover:bg-nested flex items-center justify-between transition-colors cursor-pointer"
                on:click={(e) => handleDownload(opt.id, e)}
              >
                <span>{opt.label}</span>
                <span class="material-symbols-outlined text-xs text-muted">download</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      {#if asset.featureType === 'logo'}
        <Button
          variant="primary"
          size="xs"
          fullWidth
          disabled={isDownloading}
          on:click={handleLogoClick}
          title="Jadikan sebagai logo resmi toko"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Jadikan Logo Toko</span>
        </Button>
      {:else}
        <Button
          variant="primary"
          size="xs"
          fullWidth
          disabled={isDownloading}
          on:click={handleAttachClick}
          title="Pasang gambar ke katalog produk"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Pasang ke Produk</span>
        </Button>
      {/if}
    </div>
  </Card>
</div>

<!-- Modal Konfirmasi Jadikan Logo Toko -->
{#if showLogoConfirmModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    on:keydown={(e) => (e.key === 'Escape') && (showLogoConfirmModal = false)}
  >
    <div class="bg-card border border-light rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-main text-left animate-in zoom-in-95">
      <div class="flex items-start gap-3.5">
        <div class="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
        </div>
        <div>
          <h4 class="font-heading font-bold text-base text-main">Jadikan Logo Toko?</h4>
          <p class="text-xs text-secondary mt-1 leading-relaxed">
            Gunakan desain ini sebagai logo resmi toko Anda?
          </p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-light">
        <Button
          type="button"
          variant="outline"
          size="sm"
          on:click={(e) => {
            e.stopPropagation();
            showLogoConfirmModal = false;
          }}
          disabled={isSettingLogo}
        >
          Batal
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          on:click={handleConfirmSetLogo}
          loading={isSettingLogo}
          disabled={isSettingLogo}
        >
          Ya, Jadikan Logo
        </Button>
      </div>
    </div>
  </div>
{/if}
