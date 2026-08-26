<script lang="ts">
  import { MessageCircle, MapPin } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: tagline = (section.props?.tagline as string) ?? '';
  $: logoText = (section.props?.logoText as string) ?? '';
  $: copyrightText = (section.props?.copyrightText as string) ?? '';
</script>

<div class="space-y-4">
  <!-- Dynamic Store WhatsApp Binding Badge -->
  <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 shadow-sm">
    <MessageCircle size={16} class="flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
    <div>
      <p class="font-bold text-xs">Nomor WhatsApp: Mengikuti data profil toko otomatis</p>
      <p class="text-[11px] opacity-80 mt-0.5">Tautan chat dan nomor CS terhubung otomatis ke nomor WA tenant.</p>
    </div>
  </div>

  <!-- Dynamic Store Location Binding Badge -->
  <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-800 dark:text-blue-300 text-xs flex items-center gap-2.5 shadow-sm">
    <MapPin size={16} class="flex-shrink-0 text-blue-600 dark:text-blue-400" />
    <div>
      <p class="font-bold text-xs">Lokasi & Alamat Toko: Mengikuti data profil toko otomatis</p>
      <p class="text-[11px] opacity-80 mt-0.5">Alamat fisik disinkronkan secara langsung dari profil toko tenant.</p>
    </div>
  </div>

  <div class="pt-2 border-t border-base-200 dark:border-slate-800 space-y-3">
    <div>
      <label for="footer-logo-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
        Teks Logo / Nama Toko di Footer
      </label>
      <input
        id="footer-logo-text"
        type="text"
        value={logoText}
        on:input={(e) => handlePropChange('logoText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="TOKO KAMI"
      />
    </div>

    <div>
      <label for="footer-tagline" class="block font-medium text-[11px] text-base-content/70 mb-1">
        Deskripsi Singkat / Tagline Footer
      </label>
      <textarea
        id="footer-tagline"
        value={tagline}
        on:input={(e) => handlePropChange('tagline', e.currentTarget.value)}
        rows="2"
        class="w-full px-3 py-2 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y"
        placeholder="Pusat belanja produk UMKM terpercaya berkualitas tinggi."
      />
    </div>

    <div>
      <label for="copyright-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
        Teks Hak Cipta (Copyright)
      </label>
      <input
        id="copyright-text"
        type="text"
        value={copyrightText}
        on:input={(e) => handlePropChange('copyrightText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="© 2026 Toko Kami. Semua hak dilindungi."
      />
    </div>
  </div>
</div>
