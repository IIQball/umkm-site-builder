<script lang="ts">
  import { MessageCircle, MapPin, Clock } from 'lucide-svelte';
  import { canvasStore } from '../stores/editorStore';
  import type { FooterProps, SectionStyles } from '@/types';
  import FooterNewsletter from './footer/FooterNewsletter.svelte';
  import FooterSocialShowcase from './footer/FooterSocialShowcase.svelte';

  export let props: FooterProps = {};
  export let styles: SectionStyles = {};
  export let layoutPreset: string = 'multi_column';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'multi_column';
  $: isMobileView = $canvasStore?.viewMode === 'mobile';
  $: whatsappNumber = props?.whatsappNumber || '6281234567890';
  $: address = props?.address || 'Jl. Raya Sudirman No. 123, Jakarta Pusat';
  $: copyrightText = props?.copyrightText || '© 2026 Toko Kami. Semua hak dilindungi.';
  $: tagline = props?.tagline || 'Pusat belanja produk UMKM terpercaya berkualitas tinggi.';
  $: logoText = props?.logoText || 'TOKO KAMI';
  $: storeHours = (props?.storeHours as string) || 'Buka Setiap Hari: 08.00 - 21.00 WIB';
</script>

<footer
  data-node="footer_container"
  class="w-full box-border select-none {activePreset === 'boxed_card_footer' ? 'p-4 sm:p-6' : 'pt-12 pb-6'}"
>
  {#if activePreset === 'boxed_card_footer'}
    <!-- Preset 10: Boxed Card Container Footer -->
    <div class="max-w-6xl mx-auto p-8 rounded-3xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-xl flex flex-col gap-8 text-left">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div class="md:col-span-6 flex flex-col gap-2">
          <h3 class="text-xl font-black text-[var(--theme-text-primary,#0f172a)]">{logoText}</h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] max-w-sm">{tagline}</p>
        </div>
        <div class="md:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
          {#if whatsappNumber}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
              class="inline-flex items-center justify-center px-6 text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              <MessageCircle size={14} class="mr-1.5" />
              <span>Chat WhatsApp</span>
            </a>
          {/if}
        </div>
      </div>
      <div class="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
        <p class="flex items-center gap-1"><MapPin size={12} class="text-[var(--theme-primary,#2563eb)]" /> {address}</p>
      </div>
    </div>

  {:else if activePreset === 'minimal_single_row'}
    <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-base-200 dark:border-slate-800 text-xs">
      <span class="font-black tracking-wider text-[var(--theme-text-primary,#0f172a)]">{logoText}</span>
      <div class="flex items-center gap-6 text-[var(--theme-text-muted,#64748b)]">
        <a href="#products" class="hover:text-[var(--theme-primary,#2563eb)] transition-colors">Katalog</a>
        <a href="#about" class="hover:text-[var(--theme-primary,#2563eb)] transition-colors">Tentang</a>
        <a href="#faq" class="hover:text-[var(--theme-primary,#2563eb)] transition-colors">FAQ</a>
      </div>
      <p class="text-[var(--theme-text-muted,#64748b)]">{copyrightText}</p>
    </div>

  {:else if activePreset === 'giant_wordmark'}
    <div class="w-full flex flex-col items-center text-center gap-8 py-8 overflow-hidden">
      <div class="flex flex-col items-center gap-2 max-w-xl">
        <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)]">{tagline}</p>
        {#if whatsappNumber}
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            class="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 mt-1"
          >
            <MessageCircle size={14} />
            <span>Hubungi kami via WhatsApp: +{whatsappNumber}</span>
          </a>
        {/if}
      </div>

      <div class="w-full select-none pointer-events-none py-4">
        <span class="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-200 dark:text-slate-800/60 uppercase block truncate">
          {logoText}
        </span>
      </div>

      <div class="w-full pt-4 border-t border-base-200 dark:border-slate-800 text-center text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
      </div>
    </div>

  {:else if activePreset === 'newsletter_centric'}
    <FooterNewsletter {logoText} {tagline} {copyrightText} />

  {:else if activePreset === 'social_showcase_footer'}
    <FooterSocialShowcase {logoText} {tagline} {copyrightText} />

  {:else if activePreset === 'centered_brand_column'}
    <div class="w-full flex flex-col items-center text-center gap-4 py-8">
      <span class="font-black text-xl tracking-tight text-[var(--theme-text-primary,#0f172a)]">{logoText}</span>
      <p class="text-xs text-[var(--theme-text-muted,#64748b)] max-w-md">{tagline}</p>
      <div class="flex items-center gap-6 text-xs text-[var(--theme-text-muted,#64748b)] pt-2">
        <a href="#products" class="hover:text-[var(--theme-primary,#2563eb)]">Katalog</a>
        <a href="#about" class="hover:text-[var(--theme-primary,#2563eb)]">Tentang</a>
        <a href="#faq" class="hover:text-[var(--theme-primary,#2563eb)]">FAQ</a>
      </div>
      <p class="text-[11px] text-[var(--theme-text-muted,#64748b)] pt-6 border-t border-base-200 dark:border-slate-800 w-full">
        {copyrightText}
      </p>
    </div>

  {:else}
    <!-- Preset 1 (Default): Multi-Column Footer -->
    <div class="w-full grid {isMobileView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-12'} gap-8 text-left">
      <div class="md:col-span-4 flex flex-col gap-3">
        <h3 class="font-black text-lg text-[var(--theme-text-primary,#0f172a)]">{logoText}</h3>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">{tagline}</p>
      </div>

      <div class="md:col-span-3 flex flex-col gap-2.5">
        <h4 class="font-bold text-xs uppercase tracking-wider text-[var(--theme-text-primary,#0f172a)]">Tautan Cepat</h4>
        <a href="#products" class="text-xs text-[var(--theme-text-muted,#64748b)] hover:text-[var(--theme-primary,#2563eb)]">Katalog Produk</a>
        <a href="#about" class="text-xs text-[var(--theme-text-muted,#64748b)] hover:text-[var(--theme-primary,#2563eb)]">Tentang Kami</a>
        <a href="#faq" class="text-xs text-[var(--theme-text-muted,#64748b)] hover:text-[var(--theme-primary,#2563eb)]">Tanya Jawab (FAQ)</a>
      </div>

      <div class="md:col-span-5 flex flex-col gap-3">
        <h4 class="font-bold text-xs uppercase tracking-wider text-[var(--theme-text-primary,#0f172a)]">Kontak & Lokasi</h4>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] flex items-start gap-2">
          <MapPin size={15} class="text-[var(--theme-primary,#2563eb)] mt-0.5 flex-shrink-0" />
          <span>{address}</span>
        </p>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] flex items-center gap-2">
          <Clock size={15} class="text-[var(--theme-primary,#2563eb)] flex-shrink-0" />
          <span>{storeHours}</span>
        </p>
        {#if whatsappNumber}
          <div class="pt-1">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              style="height: var(--theme-btn-height, 36px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
              class="inline-flex items-center justify-center px-4 font-bold text-xs shadow-sm hover:brightness-105 transition-all"
            >
              <MessageCircle size={14} class="mr-1.5" />
              <span>Hubungi CS WhatsApp</span>
            </a>
          </div>
        {/if}
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-base-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-muted,#64748b)]">
      <p>{copyrightText}</p>
      <div class="flex items-center gap-4">
        <a href="#terms" class="hover:underline">Syarat & Ketentuan</a>
        <a href="#privacy" class="hover:underline">Kebijakan Privasi</a>
      </div>
    </div>
  {/if}
</footer>
