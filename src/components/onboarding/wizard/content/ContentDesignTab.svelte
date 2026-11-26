<!--
  =============================================================================
  Kustomisasi Warna Brand Toko Tenant
  Menyediakan opsi palet warna utama toko dan input warna heksadesimal / native picker.
  =============================================================================
-->
<script lang="ts">
  import { Sparkles } from 'lucide-svelte';
  import { COLOR_PALETTES } from './contentCustomization.helpers';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
  export let onUpdate: (() => void) | undefined = undefined;
</script>

<div class="space-y-4 text-left">
  <!-- Primary Color Palette -->
  <div class="p-3.5 bg-card rounded-xl border border-light space-y-3 shadow-2xs">
    <div>
      <label for="custom-hex-input" class="block text-xs font-bold text-main font-heading mb-1">
        Pilihan Warna Brand Utama
      </label>
      <p class="text-xs text-secondary font-sans leading-relaxed">
        Pilih warna identitas toko Anda atau masukkan kode HEX kustom.
      </p>
    </div>

    <!-- Color Palettes -->
    <div class="flex items-center gap-2 flex-wrap">
      {#each COLOR_PALETTES as pal}
        <button
          type="button"
          on:click={() => {
            customization.theme.primaryColor = pal.hex;
            onUpdate?.();
          }}
          class="w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer {customization.theme.primaryColor.toLowerCase() === pal.hex.toLowerCase()
            ? 'scale-110 border-main shadow-xs ring-2 ring-primary/30'
            : 'border-transparent hover:scale-105'}"
          style="background-color: {pal.hex};"
          title={pal.name}
        ></button>
      {/each}
    </div>

    <!-- Hex Input & Native Color Picker -->
    <div class="flex items-center gap-2 pt-1 border-t border-light/60">
      <input
        type="color"
        bind:value={customization.theme.primaryColor}
        on:input={() => onUpdate?.()}
        class="w-9 h-9 rounded-lg border border-light bg-card cursor-pointer p-0.5 shrink-0"
        title="Pilih warna bebas"
      />
      <div class="flex-1 relative">
        <input
          id="custom-hex-input"
          type="text"
          bind:value={customization.theme.primaryColor}
          on:input={() => onUpdate?.()}
          placeholder="#2563eb"
          maxlength="7"
          class="w-full bg-nested text-main border border-light rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold uppercase"
        />
      </div>
    </div>
  </div>

  <!-- Live Mini Demo of Selected Theme Color -->
  <div class="p-3.5 bg-card rounded-xl border border-light space-y-2.5 shadow-2xs">
    <div class="flex items-center gap-1.5 text-xs font-bold text-main font-heading">
      <Sparkles size={13} class="text-primary" />
      <span>Simulasi Tampilan Warna Brand</span>
    </div>
    <p class="text-xs text-secondary font-sans leading-relaxed">
      Warna brand ini otomatis diterapkan ke seluruh tombol, badge, dan aksen visual toko Anda:
    </p>

    <!-- Simulated Elements -->
    <div class="pt-1 space-y-2">
      <div class="p-2.5 bg-nested rounded-lg border border-light/80 space-y-1">
        <span class="text-2xs text-secondary font-sans font-medium">Contoh Tombol Aksi:</span>
        <div class="flex items-center gap-2 pt-1">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs transition-all pointer-events-none"
            style="background-color: {customization.theme.primaryColor};"
          >
            Beli Sekarang
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-card border border-light shadow-2xs transition-all pointer-events-none"
            style="color: {customization.theme.primaryColor}; border-color: {customization.theme.primaryColor}40;"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
