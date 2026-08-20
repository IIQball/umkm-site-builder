<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
</script>

<div class="space-y-3">
  <div>
    <label for="whatsapp-number" class="block font-semibold text-base-content/80 mb-1">Nomor WhatsApp Toko</label>
    <input
      id="whatsapp-number"
      type="text"
      value={section.props?.whatsappNumber ?? ''}
      on:input={(e) => handlePropChange('whatsappNumber', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 font-mono"
      placeholder="628123456789"
    />
    <p class="text-[11px] text-base-content/50 mt-1">Gunakan format internasional tanpa simbol (contoh: 628123456789).</p>
  </div>

  <div>
    <label for="store-address" class="block font-semibold text-base-content/80 mb-1">Alamat Fisik / Lokasi Toko</label>
    <textarea
      id="store-address"
      value={section.props?.address ?? ''}
      on:input={(e) => handlePropChange('address', e.currentTarget.value)}
      rows="3"
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y"
      placeholder="Jl. Merdeka No. 123, Kota Anda"
    />
  </div>

  <div>
    <label for="copyright-text" class="block font-semibold text-base-content/80 mb-1">Teks Hak Cipta (Copyright)</label>
    <input
      id="copyright-text"
      type="text"
      value={section.props?.copyrightText ?? ''}
      on:input={(e) => handlePropChange('copyrightText', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
      placeholder="© 2026 Toko Kami. Semua hak dilindungi."
    />
  </div>
</div>
