<script lang="ts">
  import { HERO_IMAGE_PRESETS } from './contentCustomization.helpers';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
</script>

<div class="space-y-4">
  <!-- Badge Teks -->
  <div>
    <label for="hero-badge-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Teks Badge Promosi
    </label>
    <input
      id="hero-badge-input"
      type="text"
      bind:value={customization.hero.badgeText}
      placeholder="Contoh: Koleksi Resmi 2026 / Promo Terbatas"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
      rows="2"
      placeholder="Jelaskan produk atau keunggulan toko Anda..."
      class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
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
      placeholder="Contoh: Pesan Sekarang / Hubungi Penjual"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
    />
  </div>

  <!-- Gambar Banner Hero -->
  <div>
    <label for="hero-image-url-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Gambar Banner Hero
    </label>

    <!-- Presets -->
    <div class="grid grid-cols-2 gap-2 mb-2">
      {#each HERO_IMAGE_PRESETS as preset}
        <button
          type="button"
          on:click={() => (customization.hero.imageUrl = preset.url)}
          class="flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all {customization.hero.imageUrl === preset.url
            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
            : 'border-light bg-card hover:bg-nested/40'}"
        >
          <img
            src={preset.url}
            alt={preset.name}
            class="w-9 h-7 rounded object-cover shrink-0"
          />
          <span class="text-3xs font-semibold text-main truncate font-sans">{preset.name}</span>
        </button>
      {/each}
    </div>

    <!-- Custom URL Input -->
    <input
      id="hero-image-url-input"
      type="url"
      bind:value={customization.hero.imageUrl}
      placeholder="Atau tempel URL gambar kustom (https://...)"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
    />
  </div>
</div>
