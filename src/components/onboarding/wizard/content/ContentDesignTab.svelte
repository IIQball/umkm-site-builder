<script lang="ts">
  import { CheckCircle2, MessageCircle, Sparkles } from 'lucide-svelte';
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
          placeholder="#0ea5e9"
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
      <span>Simulasi Tampilan Warna di Halaman</span>
    </div>
    <p class="text-xs text-secondary font-sans leading-relaxed">
      Warna ini otomatis diselaraskan ke berbagai elemen visual landing page:
    </p>

    <!-- Simulated UI Chips -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
      <div
        class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-white text-xs font-bold font-sans shadow-2xs transition-all"
        style="background-color: {customization.theme.primaryColor};"
      >
        <MessageCircle size={13} />
        <span>Tombol WhatsApp</span>
      </div>

      <div
        class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold font-sans transition-all border"
        style="background-color: color-mix(in srgb, {customization.theme.primaryColor} 12%, transparent); color: {customization.theme.primaryColor}; border-color: color-mix(in srgb, {customization.theme.primaryColor} 30%, transparent);"
      >
        <CheckCircle2 size={13} />
        <span>Lencana Promo 2026</span>
      </div>
    </div>
  </div>
</div>
