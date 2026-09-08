<script lang="ts">
  import { X, ChevronDown, MessageCircle, Clock, MapPin } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let isOpen: boolean = false;
  export let onClose: () => void;
  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let activePreset: string = 'default_split';
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
  export let storeHours: string = 'Buka: 08.00 - 21.00 WIB';
  export let address: string = 'Jakarta, Indonesia';
  export let storeStatus: string = 'Toko Buka';
  export let categories: Array<{ name: string; desc?: string; description?: string; href?: string }> = [];

  $: navLinks = Array.isArray(props?.navLinks) && props.navLinks.length > 0
    ? props.navLinks
    : ['Beranda', 'Produk', 'Tentang', 'Kontak'];

  let isCategoriesOpen = false;

  $: defaultCategories = [
    { name: 'Makanan & Kuliner', desc: 'Aneka snack & kuliner khas', href: '#products' },
    { name: 'Fashion & Pakaian', desc: 'Batik & busana muslim', href: '#products' },
    { name: 'Kerajinan Tangan', desc: 'Karya seni handmade lokal', href: '#products' },
    { name: 'Minuman Segar', desc: 'Kopi & minuman herbal', href: '#products' },
  ];

  $: displayCategories = (Array.isArray(categories) && categories.length > 0)
    ? categories
    : ((props?.categories as any[]) || defaultCategories);

  $: waUrl = generateWhatsAppLink(waNumber);
</script>

{#if isOpen}
  <!-- Backdrop Overlay -->
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
    on:click|stopPropagation={onClose}
    aria-label="Tutup Menu"></div>

  <!-- Drawer Panel: True overlay dropping down right below navbar, internal scroll, NO parent resize -->
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="absolute inset-x-0 top-full z-50 bg-[var(--theme-surface,white)] text-[var(--theme-text-primary,#0f172a)] border-b border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-200 ease-out max-h-[80vh] overflow-y-auto"
    style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); padding-top: 16px; padding-bottom: 24px;"
    on:click|stopPropagation
  >
    <!-- Drawer Header with Logo & Close Button (min 44x44px) -->
    <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <button
        type="button"
        on:click|stopPropagation={onClose}
        class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        aria-label="Tutup Menu"
      >
        <X size={20} />
      </button>
    </div>

    <!-- Top Bar / Badges Info for Presets -->
    {#if activePreset === 'top_contact_bar'}
      <div class="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {storeStatus}
          </span>
          <span class="text-slate-500 text-[11px] flex items-center gap-1">
            <Clock size={12} class="text-emerald-500" /> {storeHours}
          </span>
        </div>
        <div class="text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
          <MapPin size={12} class="text-blue-500 flex-shrink-0" />
          <span class="truncate">{address}</span>
        </div>
      </div>
    {:else if activePreset === 'store_badge_highlight'}
      <div class="mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2">
        <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold border border-emerald-200/70 text-[11px]">
          {props.bpomText || '✓ BPOM'}
        </span>
        <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold border border-blue-200/70 text-[11px]">
          {props.halalText || '✓ Halal MUI'}
        </span>
      </div>
    {:else if activePreset === 'delivery_order_cta'}
      <div class="mb-4 p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/60 text-xs text-orange-900 dark:text-orange-200 space-y-1">
        <div class="font-semibold text-[11px] flex items-center gap-1">
          <span>{props.deliveryText || '🛵 Siap Kirim Instan: Estimasi 30 Menit'}</span>
        </div>
        <div class="text-[10px] text-orange-700 dark:text-orange-400">
          {props.deliveryPartners || 'Tersedia GrabFood & GoFood'}
        </div>
      </div>
    {:else if activePreset === 'promo_countdown_banner'}
      <div class="mb-4 p-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs space-y-1">
        <div class="font-bold text-[11px] flex items-center justify-between">
          <span>{props.promoTitle || '⚡ FLASH SALE'}</span>
          <span class="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded">
            {props.promoHours || '04 Jam'} {props.promoMinutes || '28 Mnt'} {props.promoSeconds || '15 Dtk'}
          </span>
        </div>
      </div>
    {/if}

    <!-- Navigation Links -->
    <nav class="flex flex-col space-y-1 py-1">
      {#each navLinks as link}
        <a
          href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
          on:click={onClose}
          class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--theme-primary,#2563eb)] transition-colors"
        >
          <span>{link}</span>
        </a>
      {/each}

      <!-- Mega Menu Product Category Accordion -->
      {#if activePreset === 'mega_menu_dropdown'}
        <div class="pt-1">
          <button
            type="button"
            on:click={() => (isCategoriesOpen = !isCategoriesOpen)}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Kategori Produk</span>
            <ChevronDown size={16} class={`transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
          </button>

          {#if isCategoriesOpen}
            <div class="pl-3 pr-1 py-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {#each displayCategories as cat}
                <a
                  href={cat.href || '#products'}
                  on:click={onClose}
                  class="flex flex-col px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-800/60 transition-colors"
                >
                  <span class="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</span>
                  {#if cat.desc || cat.description}
                    <span class="text-[10px] text-slate-500 dark:text-slate-400">{cat.desc || cat.description}</span>
                  {/if}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </nav>

    <!-- WhatsApp Action Button (CTA) -->
    <div class="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        style="height: 44px; border-radius: var(--theme-btn-radius, 10px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
        class="w-full inline-flex items-center justify-center gap-2 font-bold text-xs shadow-md active:scale-[0.98] transition-transform"
      >
        <MessageCircle size={16} />
        <span>{ctaText}</span>
      </a>
    </div>
  </div>
{/if}
