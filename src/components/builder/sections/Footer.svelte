<script lang="ts">
  import { MessageCircle, MapPin, Send, ShieldCheck, Home, ShoppingBag } from 'lucide-svelte';
  import { canvasStore } from '../stores/editorStore';
  import type { FooterProps, SectionStyles } from '@/types';

  export let props: FooterProps = {};
  export let styles: SectionStyles = {};
  export let layoutPreset: string = 'multi_column';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'multi_column';
  $: isMobileView = $canvasStore?.viewMode === 'mobile';
  $: whatsappNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '628123456789';
  $: address = props?.address || 'Jl. Raya Jember No.KM 13, Labanasem, Kab. Banyuwangi, Jawa Timur 68461';
  $: copyrightText = props?.copyrightText || '© 2026 Toko Kami. Semua hak dilindungi.';
  $: tagline = props?.tagline || 'Pusat belanja produk UMKM terpercaya berkualitas tinggi.';
  $: logoText = props?.logoText || 'TOKO KAMI';
</script>

<footer
  data-node="footer_container"
  class="w-full box-border pt-12 pb-6 select-none"
>
  {#if activePreset === 'minimal_stacked'}
    <!-- Preset A: Minimal Stacked (Logo atas -> Link tengah -> Copyright bawah, py-12, gap-4) -->
    <div class="flex flex-col items-center text-center gap-6 py-6 max-w-2xl mx-auto">
      <div data-node="footer_info">
        <h3 class="text-xl font-black tracking-wider text-[var(--theme-text-primary,#0f172a)]">{logoText}</h3>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] mt-1">{tagline}</p>
      </div>

      <nav data-node="footer_links" class="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--theme-text-muted,#64748b)]">
        <span class="hover:text-[var(--theme-primary,#2563eb)] cursor-pointer transition-colors">Beranda</span>
        <span class="hover:text-[var(--theme-primary,#2563eb)] cursor-pointer transition-colors">Katalog Produk</span>
        <span class="hover:text-[var(--theme-primary,#2563eb)] cursor-pointer transition-colors">Tentang Toko</span>
        <span class="hover:text-[var(--theme-primary,#2563eb)] cursor-pointer transition-colors">Syarat & Ketentuan</span>
        <span class="hover:text-[var(--theme-primary,#2563eb)] cursor-pointer transition-colors">Bantuan</span>
      </nav>

      <div data-node="footer_copyright" class="pt-4 border-t border-base-200 dark:border-slate-800 w-full text-center text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
      </div>
    </div>

  {:else if activePreset === 'newsletter_footer'}
    <!-- Preset B: Newsletter Footer (Subscription box atas + 3 kolom bawah) -->
    <div class="flex flex-col gap-8 w-full">
      <!-- Subscription Box Top -->
      <div class="p-6 sm:p-8 rounded-3xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div class="max-w-md">
          <h3 class="text-lg sm:text-xl font-black text-[var(--theme-text-primary,#0f172a)]">Dapatkan Promo & Diskon Spesial</h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] mt-1">Daftarkan nomor WhatsApp / Email Anda untuk info penawaran menarik pertama.</p>
        </div>
        <div class="w-full sm:w-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Nomor WhatsApp Anda..."
            class="h-11 px-4 rounded-xl bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-700 text-xs text-base-content focus:outline-none focus:border-[var(--theme-primary,#2563eb)] w-full sm:w-64"
          />
          <button
            type="button"
            style="background-color: var(--theme-primary, #2563eb); color: #ffffff;"
            class="h-11 px-5 rounded-xl text-xs font-bold shadow hover:brightness-105 flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <Send size={14} />
            <span>Gabung</span>
          </button>
        </div>
      </div>

      <!-- 3 Columns Navigation -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div data-node="footer_info" class="flex flex-col gap-2">
          <h4 class="text-base font-black text-[var(--theme-text-primary,#0f172a)]">{logoText}</h4>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">{tagline}</p>
        </div>
        <div data-node="footer_links" class="flex flex-col gap-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-primary,#0f172a)] mb-1">Navigasi Cepat</h4>
          <ul class="space-y-1.5 text-xs text-[var(--theme-text-muted,#64748b)]">
            <li><span class="hover:underline cursor-pointer">Katalog Lengkap</span></li>
            <li><span class="hover:underline cursor-pointer">Promo Bulan Ini</span></li>
            <li><span class="hover:underline cursor-pointer">Cara Belanja</span></li>
          </ul>
        </div>
        <div data-node="footer_links" class="flex flex-col gap-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-primary,#0f172a)] mb-1">Kontak Resmi</h4>
          {#if whatsappNumber}
            <p class="text-xs text-emerald-600 font-semibold">WhatsApp: +{whatsappNumber}</p>
          {/if}
          {#if address}
            <p class="text-xs text-[var(--theme-text-muted,#64748b)]">{address}</p>
          {/if}
        </div>
      </div>

      <div data-node="footer_copyright" class="pt-6 border-t border-base-200 dark:border-slate-800 text-center text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
      </div>
    </div>

  {:else if activePreset === 'two_column_clean'}
    <!-- Preset C: Two Column Clean (Left: Logo, bio, copy; Right: Links & WA button) -->
    <div class="w-full flex flex-col gap-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
        <div data-node="footer_info" class="flex flex-col gap-3">
          <h3 class="text-xl font-black tracking-wider text-[var(--theme-text-primary,#0f172a)]">{logoText}</h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] max-w-sm leading-relaxed">{tagline}</p>
          {#if address}
            <p class="text-xs text-[var(--theme-text-muted,#64748b)] flex items-center gap-1.5 mt-1">
              <MapPin size={14} class="text-[var(--theme-primary,#2563eb)]" /> {address}
            </p>
          {/if}
        </div>

        <div data-node="footer_links" class="flex flex-col md:items-end gap-4">
          <div class="flex flex-wrap gap-4 text-xs font-semibold text-[var(--theme-text-muted,#64748b)]">
            <span class="hover:underline cursor-pointer">Beranda</span>
            <span class="hover:underline cursor-pointer">Produk</span>
            <span class="hover:underline cursor-pointer">Tentang</span>
            <span class="hover:underline cursor-pointer">Privasi</span>
          </div>
          {#if whatsappNumber}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              style="height: 40px; border-radius: 8px; background-color: var(--theme-primary, #2563eb); color: #ffffff;"
              class="px-5 text-xs font-bold shadow-md inline-flex items-center gap-2 hover:brightness-105 transition-all"
            >
              <MessageCircle size={16} />
              <span>Hubungi CS WhatsApp</span>
            </a>
          {/if}
        </div>
      </div>

      <div data-node="footer_copyright" class="pt-4 border-t border-base-200 dark:border-slate-800 text-center text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
      </div>
    </div>

  {:else if activePreset === 'floating_bottom_bar'}
    <!-- Preset D: Floating Bottom Bar (Footer standar + sticky floating action bar) -->
    <div class="w-full pb-14">
      <div class="flex flex-col items-center text-center gap-4 py-4">
        <h3 class="text-lg font-black text-[var(--theme-text-primary,#0f172a)]">{logoText}</h3>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] max-w-md">{tagline}</p>
        <div data-node="footer_copyright" class="text-xs text-[var(--theme-text-muted,#64748b)]">
          <p>{copyrightText}</p>
        </div>
      </div>

      <!-- Sticky Floating Bottom Navigation Bar -->
      <div class="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-base-200 dark:border-slate-800 shadow-2xl flex items-center justify-around max-w-lg mx-auto sm:rounded-t-2xl">
        <a href="#home" class="flex flex-col items-center text-xs font-bold text-base-content/70 hover:text-[var(--theme-primary,#2563eb)]">
          <Home size={18} />
          <span class="text-[10px] mt-0.5">Beranda</span>
        </a>
        <a href="#products" class="flex flex-col items-center text-xs font-bold text-base-content/70 hover:text-[var(--theme-primary,#2563eb)]">
          <ShoppingBag size={18} />
          <span class="text-[10px] mt-0.5">Produk</span>
        </a>
        {#if whatsappNumber}
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <MessageCircle size={16} />
            <span>Pesan WA</span>
          </a>
        {/if}
      </div>
    </div>

  {:else if activePreset === 'app_store_style_footer'}
    <!-- Preset E: App Store Style Footer (Dark footer with verified badges & payment icons) -->
    <div class="w-full flex flex-col gap-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-start">
        <div data-node="footer_info" class="md:col-span-6 flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-black tracking-wider text-[var(--theme-text-primary,#0f172a)]">{logoText}</h3>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <ShieldCheck size={12} /> UMKM Terverifikasi
            </span>
          </div>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] max-w-sm leading-relaxed">{tagline}</p>
        </div>

        <div data-node="footer_links" class="md:col-span-6 flex flex-col gap-3 md:items-end">
          <p class="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-primary,#0f172a)]">Metode Pembayaran Resmi</p>
          <div class="flex flex-wrap gap-2 text-xs font-bold">
            <span class="px-3 py-1 rounded-lg bg-base-200 dark:bg-slate-800 text-base-content border border-base-300 dark:border-slate-700">QRIS</span>
            <span class="px-3 py-1 rounded-lg bg-base-200 dark:bg-slate-800 text-base-content border border-base-300 dark:border-slate-700">BCA</span>
            <span class="px-3 py-1 rounded-lg bg-base-200 dark:bg-slate-800 text-base-content border border-base-300 dark:border-slate-700">Mandiri</span>
            <span class="px-3 py-1 rounded-lg bg-base-200 dark:bg-slate-800 text-base-content border border-base-300 dark:border-slate-700">GoPay</span>
            <span class="px-3 py-1 rounded-lg bg-base-200 dark:bg-slate-800 text-base-content border border-base-300 dark:border-slate-700">OVO</span>
          </div>
        </div>
      </div>

      <div data-node="footer_copyright" class="pt-6 border-t border-base-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--theme-text-muted,#64748b)] gap-2">
        <p>{copyrightText}</p>
        <div class="flex items-center gap-4 text-[11px]">
          <span class="hover:underline cursor-pointer">Privasi</span>
          <span class="hover:underline cursor-pointer">Syarat Ketentuan</span>
          <span class="hover:underline cursor-pointer">Sitemap</span>
        </div>
      </div>
    </div>

  {:else if activePreset === 'cta_focused'}
    <!-- Preset 3: CTA Focused (Floating Banner Card on Top) -->
    <div class="relative w-full flex flex-col gap-8">
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
        <div data-node="footer_info" class="min-w-0 flex flex-col gap-2">
          <h3 class="text-base font-black tracking-wider text-[var(--theme-text-primary,#0f172a)]">
            {logoText}
          </h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">
            {tagline}
          </p>
        </div>

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

      <div data-node="footer_copyright" class="pt-6 border-t border-base-200 dark:border-slate-800 text-center text-xs text-[var(--theme-text-muted,#64748b)]">
        <p>{copyrightText}</p>
      </div>
    </div>
  {/if}
</footer>
