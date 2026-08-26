<script lang="ts">
  import { MessageCircle, MapPin } from 'lucide-svelte';
  import { canvasStore } from '../stores/editorStore';
  import type { FooterProps, SectionStyles } from '@/types';

  export let props: FooterProps = {};
  export let styles: SectionStyles = {};
  export let layoutPreset: string = 'multi_column';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'multi_column';
  $: isMobileView = $canvasStore?.viewMode === 'mobile';
  $: whatsappNumber = props?.whatsappNumber || '';
  $: address = props?.address || '';
  $: copyrightText = props?.copyrightText || '© 2026 Toko Kami. Semua hak dilindungi.';
  $: tagline = props?.tagline || 'Pusat belanja produk UMKM terpercaya berkualitas tinggi.';
  $: logoText = props?.logoText || 'TOKO KAMI';
</script>

<footer
  data-node="footer_container"
  class="w-full box-border pt-12 pb-6 select-none"
>
  {#if activePreset === 'cta_focused'}
    <!-- Preset 3: CTA Focused (Floating Banner Card on Top) -->
    <div class="relative w-full flex flex-col gap-8">
      <!-- Floating WA CTA Banner: Concentric nested radius -->
      {#if whatsappNumber}
        <div class="-mt-16 p-6 sm:p-8 rounded-2xl bg-[var(--theme-primary,#2563eb)] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div class="flex flex-col gap-1">
            <h3 class="text-xl sm:text-2xl font-black">Punya Pertanyaan atau Ingin Pesan Custom?</h3>
            <p class="text-xs sm:text-sm text-blue-100">Hubungi langsung via WhatsApp untuk respon instan dan penawaran terbaik.</p>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px);"
            class="px-6 bg-white text-[var(--theme-primary,#2563eb)] font-bold text-sm shadow-md hover:bg-slate-50 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <MessageCircle size={18} />
            <span>Chat Sekarang</span>
          </a>
        </div>
      {/if}

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        <div data-node="footer_info" class="md:col-span-6 flex flex-col gap-2">
          <h3 class="text-lg font-black tracking-wider text-[var(--theme-text-primary,#0f172a)]">{logoText}</h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] max-w-sm leading-relaxed">{tagline}</p>
        </div>
        <div data-node="footer_links" class="md:col-span-6 flex flex-col items-start md:items-end justify-center">
          {#if address}
            <div class="flex items-center gap-2 text-xs text-[var(--theme-text-muted,#64748b)]">
              <MapPin size={14} class="text-[var(--theme-primary,#2563eb)] flex-shrink-0" />
              <span>{address}</span>
            </div>
          {/if}
        </div>
      </div>

      <div data-node="footer_copyright" class="pt-6 border-t border-base-200 dark:border-slate-800 text-center text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
      </div>
    </div>

  {:else if activePreset === 'centered_simple'}
    <!-- Preset 2: Centered Simple (Logo, Socials, Copyright) -->
    <div class="flex flex-col items-center text-center gap-6">
      <div data-node="footer_info" class="flex flex-col items-center gap-2">
        <h3 class="text-xl font-black tracking-wider text-[var(--theme-text-primary,#0f172a)]">{logoText}</h3>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] max-w-md">{tagline}</p>
      </div>

      <div data-node="footer_links" class="flex items-center gap-4">
        {#if whatsappNumber}
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 hover:scale-105 transition-transform"
          >
            <MessageCircle size={18} />
          </a>
        {/if}
      </div>

      <div data-node="footer_copyright" class="pt-6 border-t border-base-200 dark:border-slate-800 w-full text-center text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
      </div>
    </div>

  {:else}
    <!-- Preset 1 (Default): Multi Column (3-4 Columns, gap-8 = 32px) -->
    <div class="w-full">
      <div class={`grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-8 mb-8 text-left`}>
        <!-- Kolom 1: Profil Toko -->
        <div data-node="footer_info" class="min-w-0 flex flex-col gap-2">
          <h3 class="text-base font-black tracking-wider text-[var(--theme-text-primary,#0f172a)]">
            {logoText}
          </h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">
            {tagline}
          </p>
        </div>

        <!-- Kolom 2: Kontak Cepat -->
        <div data-node="footer_links" class="min-w-0">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-primary,#0f172a)] mb-3">
            Kontak Layanan
          </h4>
          <div class="flex flex-col gap-2 text-xs text-[var(--theme-text-muted,#64748b)]">
            {#if whatsappNumber}
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-2 text-emerald-600 hover:underline"
              >
                <MessageCircle size={14} class="flex-shrink-0" />
                <span>+{whatsappNumber}</span>
              </a>
            {/if}
            {#if address}
              <div class="flex items-start gap-2">
                <MapPin size={14} class="mt-0.5 text-[var(--theme-primary,#2563eb)] flex-shrink-0" />
                <p class="leading-relaxed break-words">{address}</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Kolom 3: Informasi Menu -->
        <div data-node="footer_links" class="min-w-0">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-primary,#0f172a)] mb-3">
            Informasi
          </h4>
          <ul class="space-y-2 text-xs text-[var(--theme-text-muted,#64748b)]">
            <li><span class="hover:underline cursor-pointer">Tentang Toko</span></li>
            <li><span class="hover:underline cursor-pointer">Kebijakan Privasi</span></li>
            <li><span class="hover:underline cursor-pointer">Syarat & Ketentuan</span></li>
          </ul>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div data-node="footer_copyright" class="pt-6 border-t border-base-200 dark:border-slate-800 text-center text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
      </div>
    </div>
  {/if}
</footer>

