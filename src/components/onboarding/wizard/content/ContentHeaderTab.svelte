<script lang="ts">
  import ImageUpload from '@/components/shared/ImageUpload.svelte';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
  export let hasLogo: boolean = false;
  export let onUpdate: (() => void) | undefined = undefined;

  function handleLogoUpload(urls: string[]) {
    const url = urls[0] || '';
    customization.header.logoImageUrl = url;
    if (customization.footer) {
      customization.footer.logoImageUrl = url;
    }
    onUpdate?.();
  }
</script>

<div class="space-y-4 text-left">
  <!-- Announcement text -->
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
    <p class="text-3xs text-secondary mt-1 font-sans">
      Teks pengumuman / promosi yang tampil di baris teratas halaman toko.
    </p>
  </div>

  <!-- Upload logo if template has logo in header -->
  {#if hasLogo}
    <div class="space-y-2 pt-3 border-t border-light">
      <div class="flex items-center justify-between">
        <span class="block text-xs font-bold text-main font-heading">
          Logo Toko
        </span>
        {#if customization.header.logoImageUrl}
          <span class="text-3xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
            Logo Terpasang
          </span>
        {/if}
      </div>
      <p class="text-3xs text-secondary font-sans leading-relaxed">
        Template ini mendukung tampilan logo toko. Unggah file logo Anda (PNG, JPG, atau WebP). Logo ini otomatis digunakan pada navbar header dan footer toko.
      </p>
      <ImageUpload
        folder="stores"
        maxFiles={1}
        maxSizeMB={5}
        existingUrls={customization.header.logoImageUrl ? [customization.header.logoImageUrl] : []}
        onUpload={handleLogoUpload}
      />
    </div>
  {/if}
</div>
