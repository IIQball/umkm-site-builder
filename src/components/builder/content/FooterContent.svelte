<script lang="ts">
  import { Sparkles } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: tagline = (section.props?.tagline as string) || (section.props?.description as string) || '';
  $: address = (section.props?.address as string) ?? '';
</script>

<div class="space-y-3">
  <!-- Info sinkronisasi Header -->
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-1">
    <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold text-xs">
      <Sparkles size={13} />
      <span>Sinkronisasi Otomatis</span>
    </div>
    <p class="text-[11px] text-base-content/70">
      Nama toko dan logo di footer otomatis tersinkronisasi dari Header agar identitas toko tetap konsisten.
    </p>
  </div>

  <div>
    <label for="footer-tagline" class="block font-semibold text-base-content/80 mb-1 text-xs">Tagline / Deskripsi Singkat Toko</label>
    <textarea
      id="footer-tagline"
      rows="2"
      value={tagline}
      on:input={(e) => {
        handlePropChange('tagline', e.currentTarget.value);
        handlePropChange('description', e.currentTarget.value);
      }}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y text-xs"
      placeholder="Pelopor kuliner & camilan khas nusantara..."
    />
  </div>

  <div>
    <label for="whatsapp-number" class="block font-semibold text-base-content/80 mb-1 text-xs">Nomor WhatsApp Toko</label>
    <input
      id="whatsapp-number"
      type="text"
      value={section.props?.whatsappNumber ?? ''}
      on:input={(e) => handlePropChange('whatsappNumber', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 font-mono text-xs"
      placeholder="628123456789"
    />
    <p class="text-[11px] text-base-content/50 mt-1">Gunakan format internasional tanpa simbol (contoh: 628123456789).</p>
  </div>

  <div>
    <label for="store-address" class="block font-semibold text-base-content/80 mb-1 text-xs">Alamat Fisik / Lokasi Toko</label>
    <textarea
      id="store-address"
      value={address}
      on:input={(e) => handlePropChange('address', e.currentTarget.value)}
      rows="2"
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y text-xs"
      placeholder="Jl. Merdeka No. 123, Kota Anda"
    />
  </div>

  <div>
    <label for="copyright-text" class="block font-semibold text-base-content/80 mb-1 text-xs">Teks Hak Cipta (Copyright)</label>
    <input
      id="copyright-text"
      type="text"
      value={section.props?.copyrightText ?? ''}
      on:input={(e) => handlePropChange('copyrightText', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 text-xs"
      placeholder="© 2026 Toko Kami. Semua hak dilindungi."
    />
  </div>
</div>
