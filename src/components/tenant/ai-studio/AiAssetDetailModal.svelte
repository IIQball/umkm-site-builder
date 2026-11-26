<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { AiAssetItem } from './gallery.constants';
  import {
    downloadAssetImage,
    type ImageDownloadFormat,
  } from './gallery-download.helpers';
  import AiProductAttachCardList from './AiProductAttachCardList.svelte';
  import { toast } from '@/lib/toast';
  import { apiFetch } from '@/lib/api/parse-response';
  import { Button } from '@/components/ui';

  export let open: boolean = false;
  export let asset: AiAssetItem | null = null;
  export let storeId: string = '';

  const dispatch = createEventDispatcher<{
    close: void;
  }>();

  let isDownloading = false;
  let downloadFormat: ImageDownloadFormat | null = null;
  let showFormatMenu = false;
  let showProductPicker = false;
  let showLogoConfirmModal = false;
  let isSettingLogo = false;

  const FORMAT_OPTIONS: Array<{ id: ImageDownloadFormat; label: string; desc: string }> = [
    { id: 'png', label: 'PNG', desc: 'Resolusi penuh tanpa kompresi' },
    { id: 'jpg', label: 'JPG', desc: 'Cocok untuk cetak & web' },
    { id: 'pdf', label: 'PDF', desc: 'Format dokumen siap cetak' },
    { id: 'svg', label: 'SVG', desc: 'Format vektor skalabel' },
  ];

  async function handleDownload(format: ImageDownloadFormat) {
    if (!asset || isDownloading) return;
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

  async function handleConfirmSetLogo() {
    if (!asset || isSettingLogo) return;
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
        handleClose();
      } else {
        toast.error('Terjadi gangguan, silakan coba beberapa saat lagi.');
      }
    } catch {
      toast.error('Terjadi gangguan, silakan coba beberapa saat lagi.');
    } finally {
      isSettingLogo = false;
    }
  }

  function handleClose() {
    open = false;
    showFormatMenu = false;
    showProductPicker = false;
    showLogoConfirmModal = false;
    dispatch('close');
  }

  function handleAttached() {
    showProductPicker = false;
    handleClose();
  }
</script>

{#if open && asset}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    on:keydown={(e) => (e.key === 'Escape') && handleClose()}
    on:click|self={handleClose}
  >
    <div class="relative max-w-4xl w-full flex flex-col items-center justify-center group">
      <!-- Tombol Close (X) yang hanya muncul saat dihover -->
      <button
        type="button"
        class="absolute -top-3 -right-2 sm:top-2 sm:right-2 z-50 w-9 h-9 rounded-full bg-neutral-900/80 text-white/70 hover:text-white hover:bg-neutral-800 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-lg"
        on:click={handleClose}
        aria-label="Tutup pratinjau"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {#if showProductPicker}
        <!-- Tampilan Card-Card Produk untuk Memasang Gambar -->
        <div class="w-full max-w-2xl bg-neutral-900/95 border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200">
          <AiProductAttachCardList
            {storeId}
            imageUrl={asset.cloudinaryUrl}
            featureType={asset.featureType}
            on:attached={handleAttached}
            on:cancel={() => (showProductPicker = false)}
          />
        </div>
      {:else}
        <!-- Tampilan Gambar Utama Bersih Tanpa Header/Footer Clutter -->
        <div class="relative max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl select-none shadow-2xl">
          <img
            src={asset.cloudinaryUrl}
            alt="Perbesar Desain Visual"
            class="max-w-full max-h-[75vh] object-contain rounded-2xl"
            loading="eager"
          />
        </div>

        <!-- Floating Pill Toolbar di Bawah -->
        <div class="relative mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 text-white border border-white/15 shadow-2xl backdrop-blur-md">
          <!-- Tombol Unduh Dropdown -->
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
              on:click={() => (showFormatMenu = !showFormatMenu)}
              disabled={isDownloading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>{isDownloading ? `Mengunduh ${downloadFormat?.toUpperCase()}...` : 'Unduh'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-70">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {#if showFormatMenu}
              <div
                class="absolute left-0 bottom-full mb-2 w-48 bg-neutral-900/95 border border-white/15 rounded-2xl shadow-2xl p-1.5 z-50 space-y-0.5 backdrop-blur-xl animate-in fade-in"
              >
                {#each FORMAT_OPTIONS as opt}
                  <button
                    type="button"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer text-white"
                    on:click={() => handleDownload(opt.id)}
                  >
                    <div>
                      <div class="font-bold">{opt.label}</div>
                      <div class="text-2xs text-white/60">{opt.desc}</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white/40">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <div class="w-px h-4 bg-white/20"></div>

          <!-- Tombol Aksi Kontekstual: Logo Toko vs Pasang ke Produk -->
          {#if asset.featureType === 'logo'}
            <button
              type="button"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
              on:click={() => (showLogoConfirmModal = true)}
              disabled={isSettingLogo}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>{isSettingLogo ? 'Menyimpan...' : 'Jadikan Logo Toko'}</span>
            </button>
          {:else}
            <button
              type="button"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
              on:click={() => (showProductPicker = true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>Pasang ke Produk</span>
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Modal Konfirmasi Jadikan Logo Toko -->
{#if showLogoConfirmModal}
  <div
    class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
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
            <polyline points="9 22 9 12 15 12 15 22"/>
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
          on:click={() => (showLogoConfirmModal = false)}
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
