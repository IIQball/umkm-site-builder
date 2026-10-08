<script lang="ts">
  import ImageUpload from '@/components/shared/ImageUpload.svelte';
  import { HERO_IMAGE_PRESETS } from './contentCustomization.helpers';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
  export let onUpdate: (() => void) | undefined = undefined;

  function handleHeroUpload(urls: string[]) {
    customization.hero.imageUrl = urls[0] || '';
    onUpdate?.();
  }
</script>

<div class="space-y-4 text-left">
  <!-- Badge Teks -->
  <div>
    <label for="hero-badge-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Teks Badge Promosi
    </label>
    <input
      id="hero-badge-input"
      type="text"
      bind:value={customization.hero.badgeText}
      on:input={() => onUpdate?.()}
      placeholder="Contoh: Koleksi Resmi 2026 / Promo Terbatas"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
    />
  </div>

  <!-- Judul Hero -->
  <div>
    <label for="hero-title-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Judul Utama Banner Hero
    </label>
    <input
      id="hero-title-input"
      type="text"
      bind:value={customization.hero.title}
      on:input={() => onUpdate?.()}
      placeholder="Nama toko atau slogan utama"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
    />
  </div>

  <!-- Subjudul / Deskripsi Hero -->
  <div>
    <label for="hero-subtitle-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Deskripsi & Penjelasan Singkat
    </label>
    <textarea
      id="hero-subtitle-input"
      bind:value={customization.hero.subtitle}
      on:input={() => onUpdate?.()}
      rows="2"
      placeholder="Jelaskan produk atau keunggulan toko Anda..."
      class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
    ></textarea>
  </div>

  <!-- Teks Tombol CTA -->
  <div>
    <label for="hero-cta-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Teks Tombol Aksi (CTA)
    </label>
    <input
      id="hero-cta-input"
      type="text"
      bind:value={customization.hero.ctaText}
      on:input={() => onUpdate?.()}
      placeholder="Contoh: Pesan Sekarang / Hubungi Penjual"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
    />
  </div>

  <!-- Gambar Banner Hero -->
  <div class="space-y-2 pt-2 border-t border-light">
    <div class="flex items-center justify-between">
      <span class="block text-xs font-bold text-main font-heading">
        Gambar Banner Hero
      </span>
      {#if customization.hero.imageUrl}
        <span class="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
          Gambar Terpasang
        </span>
      {/if}
    </div>

    <!-- Presets -->
    <div class="grid grid-cols-2 gap-2 mb-2">
      {#each HERO_IMAGE_PRESETS as preset}
        <button
          type="button"
          on:click={() => {
            customization.hero.imageUrl = preset.url;
            onUpdate?.();
          }}
          class="flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer {customization.hero.imageUrl === preset.url
            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
            : 'border-light bg-card hover:bg-nested/40'}"
        >
          <img
            src={preset.url}
            alt={preset.name}
            class="w-9 h-7 rounded object-cover shrink-0"
          />
          <span class="text-xs font-semibold text-main truncate font-sans">{preset.name}</span>
        </button>
      {/each}
    </div>

    <!-- Direct Component Upload -->
    <div class="pt-1">
      <p class="text-xs text-secondary mb-1.5 font-sans">
        Atau unggah foto banner sendiri (PNG, JPG, atau WebP):
      </p>
      <ImageUpload
        folder="stores"
        maxFiles={1}
        maxSizeMB={5}
        existingUrls={customization.hero.imageUrl ? [customization.hero.imageUrl] : []}
        onUpload={handleHeroUpload}
      />
    </div>
  </div>
</div>
