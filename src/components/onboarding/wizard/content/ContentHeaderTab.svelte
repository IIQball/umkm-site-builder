<!--
  =============================================================================
  Kustomisasi Header Toko Tenant
  Menyediakan pengaturan Nama Toko, Announcement Bar, dan Logo Toko (Upload / Galeri Studio AI).
  =============================================================================
-->
<script lang="ts">
  import { Sparkles, Trash2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import ImageUpload from '@/components/ui/ImageUpload.svelte';
  import ProductDesignPickerModal from '@/components/tenant/products/ProductDesignPickerModal.svelte';
  import {
    headerHasRowOrder,
    getHeaderTopBarType,
  } from '@/components/builder/sections/header/headerLayout.helpers';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
  export let hasLogo: boolean = false;
  export let layoutPreset: string = 'default_split';
  export let onUpdate: (() => void) | undefined = undefined;

  let isAiGalleryModalOpen = false;

  $: hasAnnouncement = headerHasRowOrder(layoutPreset) && getHeaderTopBarType(layoutPreset) !== 'none';

  function applyLogoUrl(url: string) {
    customization.header.logoImageUrl = url;
    if (customization.footer) {
      customization.footer.logoImageUrl = url;
    }
    onUpdate?.();
  }

  function handleLogoUpload(urls: string[]) {
    applyLogoUrl(urls[0] || '');
  }

  function handleAiLogoSelect(e: CustomEvent<string>) {
    applyLogoUrl(e.detail);
  }

  function handleRemoveLogo() {
    applyLogoUrl('');
  }
</script>

<div class="space-y-4 text-left">
  <!-- Layout Badge Notice -->
  {#if layoutPreset === 'promo_countdown_banner'}
    <div class="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-sans font-semibold">
      Layout Header Promo: Menampilkan banner hitung mundur promosi di bagian paling atas.
    </div>
  {/if}

  <!-- Nama Brand / Logo Text -->
  <div>
    <label for="header-brand-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Nama Brand / Toko (Header)
    </label>
    <input
      id="header-brand-input"
      type="text"
      bind:value={customization.header.logoText}
      on:input={() => onUpdate?.()}
      placeholder="Nama toko atau brand Anda"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
    />
  </div>

  <!-- Announcement text -->
  {#if hasAnnouncement}
    <div>
      <label for="header-announcement-input" class="block text-xs font-bold text-main font-heading mb-1.5">
        Teks Pengumuman (Announcement Bar)
      </label>
      <input
        id="header-announcement-input"
        type="text"
        bind:value={customization.header.announcementText}
        on:input={() => onUpdate?.()}
        placeholder="Contoh: Promo Spesial: Belanja hemat hari ini!"
        class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
      />
      <p class="text-xs text-secondary mt-1 font-sans">
        Teks pengumuman / promosi yang tampil di baris teratas halaman toko.
      </p>
    </div>
  {/if}

  <!-- Upload logo if template has logo in header -->
  {#if hasLogo || customization.header.logoImageUrl}
    <div class="space-y-3 pt-3 border-t border-light">
      <div class="flex items-center justify-between">
        <span class="block text-xs font-bold text-main font-heading">
          Logo Toko
        </span>
        <div class="flex items-center gap-2">
          {#if customization.header.logoImageUrl}
            <span class="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
              Logo Terpasang
            </span>
            <button
              type="button"
              on:click={handleRemoveLogo}
              class="text-xs text-error hover:underline flex items-center gap-1 cursor-pointer"
              title="Hapus logo saat ini"
            >
              <Trash2 size={12} />
              <span>Hapus</span>
            </button>
          {/if}
        </div>
      </div>

      <p class="text-xs text-secondary font-sans leading-relaxed">
        Template ini mendukung tampilan logo toko. Unggah file logo Anda (PNG, JPG, WebP) atau pilih dari Galeri Studio AI. Logo ini otomatis digunakan pada navbar header dan footer toko.
      </p>

      <!-- Action buttons -->
      <div class="flex items-center gap-2 pb-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          class="flex items-center gap-1.5 text-xs font-semibold"
          on:click={() => (isAiGalleryModalOpen = true)}
        >
          <Sparkles size={14} class="text-primary" />
          <span>Pilih dari Galeri Studio AI</span>
        </Button>
      </div>

      <ImageUpload
        folder="stores"
        maxFiles={1}
        maxSizeMB={5}
        existingUrls={customization.header.logoImageUrl ? [customization.header.logoImageUrl] : []}
        onUpload={handleLogoUpload}
      />

      <ProductDesignPickerModal
        bind:open={isAiGalleryModalOpen}
        filterType="logo"
        title="Pilih Logo dari Galeri Studio AI"
        description="Pilih salah satu logo hasil generasi AI Studio khusus logo untuk diterapkan sebagai logo toko."
        on:select={handleAiLogoSelect}
        on:close={() => (isAiGalleryModalOpen = false)}
      />
    </div>
  {/if}
</div>
