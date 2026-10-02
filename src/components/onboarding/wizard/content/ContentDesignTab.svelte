<script lang="ts">
  import {
    FONT_HEADING_OPTIONS,
    FONT_BODY_OPTIONS,
    COLOR_PALETTES,
  } from './contentCustomization.helpers';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
</script>

<div class="space-y-4">
  <!-- Heading Font -->
  <div>
    <label for="heading-font-select" class="block text-xs font-bold text-main font-heading mb-1.5">
      Font Judul (Heading)
    </label>
    <select
      id="heading-font-select"
      bind:value={customization.theme.typography.headingFont}
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
    >
      {#each FONT_HEADING_OPTIONS as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
    <p class="text-3xs text-secondary mt-1 font-sans">
      Digunakan untuk judul utama, banner hero, dan judul seksi halaman toko.
    </p>
  </div>

  <!-- Body Font -->
  <div>
    <label for="body-font-select" class="block text-xs font-bold text-main font-heading mb-1.5">
      Font Konten & Deskripsi (Body)
    </label>
    <select
      id="body-font-select"
      bind:value={customization.theme.typography.bodyFont}
      on:change={() => {
        customization.theme.fontFamily = customization.theme.typography.bodyFont;
      }}
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
    >
      {#each FONT_BODY_OPTIONS as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
    <p class="text-3xs text-secondary mt-1 font-sans">
      Digunakan untuk paragraf, ulasan, FAQ, spesifikasi, dan tombol.
    </p>
  </div>

  <!-- Primary Color Palette -->
  <div>
    <label for="custom-hex-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Warna Brand Utama
    </label>
    <div class="flex items-center gap-2 mb-2 flex-wrap">
      {#each COLOR_PALETTES as pal}
        <button
          type="button"
          on:click={() => (customization.theme.primaryColor = pal.hex)}
          class="w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center {customization.theme.primaryColor.toLowerCase() === pal.hex.toLowerCase()
            ? 'scale-110 border-main shadow-xs ring-2 ring-primary/30'
            : 'border-transparent hover:scale-105'}"
          style="background-color: {pal.hex};"
          title={pal.name}
        ></button>
      {/each}
    </div>

    <!-- Hex Input & Color Picker -->
    <div class="flex items-center gap-2">
      <input
        type="color"
        bind:value={customization.theme.primaryColor}
        class="w-9 h-9 rounded-lg border border-light bg-card cursor-pointer p-0.5"
        title="Pilih warna bebas"
      />
      <input
        id="custom-hex-input"
        type="text"
        bind:value={customization.theme.primaryColor}
        placeholder="#0ea5e9"
        maxlength="7"
        class="flex-1 bg-card text-main border border-light rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
    <p class="text-3xs text-secondary mt-1 font-sans">
      Akan otomatis diterapkan ke tombol belanja, lencana status, dan aksen navigasi.
    </p>
  </div>
</div>
