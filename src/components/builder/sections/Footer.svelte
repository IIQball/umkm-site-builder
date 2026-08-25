<script lang="ts">
  import { MessageCircle, MapPin } from 'lucide-svelte';
  import { canvasStore } from '../stores/editorStore';
  import type { FooterProps, SectionStyles } from '@/types';

  export let props: FooterProps = {};
  export let styles: SectionStyles = {};

  $: isMobileView = $canvasStore?.viewMode === 'mobile';
  $: isTabletView = $canvasStore?.viewMode === 'tablet';
  $: whatsappNumber = props?.whatsappNumber || '';
  $: address = props?.address || '';
  $: copyrightText = props?.copyrightText || '© 2026 Toko Kami. Semua hak dilindungi.';

  const isDarkColor = (color?: unknown): boolean => {
    if (typeof color !== 'string' || !color || color === 'transparent') return true;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16) || 0;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    }
    return true;
  };

  $: isDarkBg = isDarkColor(styles?.backgroundColor || '#1f2937');
</script>

<div class="w-full max-w-6xl mx-auto box-border">
  <div class="w-full">
    <div class={`grid ${isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-6 sm:gap-8 mb-8 text-left`}>
      <!-- Kontak WhatsApp -->
      <div class="min-w-0">
        <h3 class={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkBg ? 'text-slate-300' : 'text-slate-700'}`}>
          Kontak Cepat
        </h3>
        {#if whatsappNumber}
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            class={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition-colors max-w-full truncate ${
              isDarkBg
                ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/60'
                : 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <MessageCircle size={14} class="flex-shrink-0" />
            <span class="truncate">+{whatsappNumber}</span>
          </a>
        {:else}
          <p class={`text-xs italic ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
            WhatsApp belum diatur
          </p>
        {/if}
      </div>

      <!-- Alamat -->
      <div class="min-w-0">
        <h3 class={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkBg ? 'text-slate-300' : 'text-slate-700'}`}>
          Lokasi Toko
        </h3>
        {#if address}
          <div class="flex items-start gap-2 text-xs">
            <MapPin size={14} class="mt-0.5 text-blue-400 flex-shrink-0" />
            <p class={`leading-relaxed break-words ${isDarkBg ? 'text-slate-200' : 'text-slate-600'}`}>{address}</p>
          </div>
        {:else}
          <p class={`text-xs italic ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
            Alamat belum diatur
          </p>
        {/if}
      </div>

      <!-- Navigasi Footer -->
      <div class="min-w-0">
        <h3 class={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkBg ? 'text-slate-300' : 'text-slate-700'}`}>
          Informasi
        </h3>
        <ul class={`space-y-1.5 text-xs ${isDarkBg ? 'text-slate-300' : 'text-slate-600'}`}>
          <li><span class="hover:underline cursor-pointer">Tentang Kami</span></li>
          <li><span class="hover:underline cursor-pointer">Kebijakan Privasi</span></li>
          <li><span class="hover:underline cursor-pointer">Syarat dan Ketentuan</span></li>
        </ul>
      </div>
    </div>

    <!-- Copyright -->
    <div class={`pt-6 border-t text-center text-[11px] sm:text-xs leading-normal ${
      isDarkBg
        ? 'border-slate-700/60 text-slate-400'
        : 'border-slate-200 text-slate-500'
    }`}>
      <p>{copyrightText}</p>
    </div>
  </div>
</div>
