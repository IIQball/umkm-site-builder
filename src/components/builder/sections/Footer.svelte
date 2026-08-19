<script lang="ts">
  import { MessageCircle, MapPin } from 'lucide-svelte';
  import type { FooterProps, SectionStyles } from '@/types/builder';

  export let props: FooterProps = {};
  export let styles: SectionStyles = {};

  $: whatsappNumber = props?.whatsappNumber || '';
  $: address = props?.address || '';
  $: copyrightText = props?.copyrightText || '© 2026 Toko Kami. Semua hak dilindungi.';
  $: hasCustomBg = !!styles?.backgroundColor;
  $: hasCustomColor = !!styles?.color;
</script>

<div class={`w-full ${hasCustomBg ? '' : 'text-slate-100'}`}>
  <div class="w-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
      <!-- Kontak WhatsApp -->
      <div>
        <h3 class={`text-xs font-semibold uppercase tracking-wider mb-3 ${hasCustomColor ? 'opacity-70' : 'text-slate-400'}`}>
          Kontak Cepat
        </h3>
        {#if whatsappNumber}
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg"
          >
            <MessageCircle size={14} />
            <span>+{whatsappNumber}</span>
          </a>
        {:else}
          <p class={`text-xs italic ${hasCustomColor ? 'opacity-60' : 'text-slate-500'}`}>
            WhatsApp belum diatur
          </p>
        {/if}
      </div>

      <!-- Alamat -->
      <div>
        <h3 class={`text-xs font-semibold uppercase tracking-wider mb-3 ${hasCustomColor ? 'opacity-70' : 'text-slate-400'}`}>
          Lokasi Toko
        </h3>
        {#if address}
          <div class="flex items-start gap-2 text-xs">
            <MapPin size={14} class="mt-0.5 text-blue-400 flex-shrink-0" />
            <p class="leading-relaxed">{address}</p>
          </div>
        {:else}
          <p class={`text-xs italic ${hasCustomColor ? 'opacity-60' : 'text-slate-500'}`}>
            Alamat belum diatur
          </p>
        {/if}
      </div>

      <!-- Navigasi Footer -->
      <div>
        <h3 class={`text-xs font-semibold uppercase tracking-wider mb-3 ${hasCustomColor ? 'opacity-70' : 'text-slate-400'}`}>
          Informasi
        </h3>
        <ul class="space-y-1.5 text-xs opacity-80">
          <li><span class="hover:opacity-100 transition-opacity cursor-pointer">Tentang Kami</span></li>
          <li><span class="hover:opacity-100 transition-opacity cursor-pointer">Kebijakan Privasi</span></li>
          <li><span class="hover:opacity-100 transition-opacity cursor-pointer">Syarat & Ketentuan</span></li>
        </ul>
      </div>
    </div>

    <!-- Copyright -->
    <div class="pt-6 border-t border-slate-700/40 text-center text-[11px] opacity-70">
      <p>{copyrightText}</p>
    </div>
  </div>
</div>
