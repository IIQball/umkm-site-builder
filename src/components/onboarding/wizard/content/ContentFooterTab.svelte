<script lang="ts">
  import { Info } from 'lucide-svelte';
  import type { StoreContentCustomization } from '../../onboarding.types';

  export let customization: StoreContentCustomization;
  export let onUpdate: (() => void) | undefined = undefined;
</script>

<div class="space-y-4 text-left">
  <!-- Tagline Toko -->
  <div>
    <label for="footer-tagline-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Tagline / Slogan Footer
    </label>
    <textarea
      id="footer-tagline-input"
      bind:value={customization.footer.tagline}
      on:input={() => onUpdate?.()}
      rows="2"
      placeholder="Slogan atau deskripsi singkat toko di bagian footer..."
      class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
    ></textarea>
  </div>

  <!-- Jam Operasional -->
  <div>
    <label for="footer-hours-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Jam Operasional Toko
    </label>
    <input
      id="footer-hours-input"
      type="text"
      bind:value={customization.footer.storeHours}
      on:input={() => onUpdate?.()}
      placeholder="Contoh: Buka Setiap Hari (08.00 - 21.00 WIB)"
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
    />
  </div>

  <!-- Hak Cipta -->
  <div>
    <label for="footer-copyright-input" class="block text-xs font-bold text-main font-heading mb-1.5">
      Teks Hak Cipta (Copyright)
    </label>
    <input
      id="footer-copyright-input"
      type="text"
      bind:value={customization.footer.copyrightText}
      on:input={() => onUpdate?.()}
      placeholder="Contoh: © 2026 Toko Anda. Hak Cipta Dilindungi."
      class="w-full bg-card text-main border border-light rounded-xl px-3 py-2 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
    />
  </div>

  <!-- Info Note Otomatis Data Toko -->
  <div class="p-3 rounded-xl bg-nested/80 border border-light text-2xs text-secondary flex items-start gap-2">
    <Info size={14} class="shrink-0 text-primary mt-0.5" />
    <span class="leading-relaxed">
      Nama toko, alamat, dan nomor WhatsApp pada footer otomatis diambil dari profil toko Anda di Langkah 2.
    </span>
  </div>
</div>
