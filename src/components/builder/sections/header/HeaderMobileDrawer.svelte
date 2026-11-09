<script lang="ts">
  import { onMount } from 'svelte';
  import { ChevronDown, MessageCircle, Clock, MapPin, Bike, ShieldCheck, CheckCircle2, Zap } from 'lucide-svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import { stripEmoji } from './headerIcons';
  import {
    navigateToSection,
    resolveNavFontSize,
    resolveColorTokenMatch,
    NAV_COLOR_TOKENS,
    NAV_HOVER_COLOR_TOKENS,
  } from './headerNav.helpers';

  export let isOpen: boolean = false;
  export let onClose: () => void;
  export let props: HeaderAnnouncementProps = {};
  export let activePreset: string = 'default_split';
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
  export let storeHours: string = 'Buka: 08.00 - 21.00 WIB';
  export let address: string = 'Jakarta, Indonesia';
  export let storeStatus: string = 'Toko Buka';
  export let categories: Array<{ id?: string; name: string; slug?: string; description?: string; desc?: string; href?: string }> = [];

  $: navLinks = Array.isArray(props?.navLinks) && props.navLinks.length > 0
    ? props.navLinks
    : ['Beranda', 'Produk', 'Tentang', 'Kontak'];

  $: navColorVal = (props?.navColor as string) || NAV_COLOR_TOKENS[0].value;
  $: navHoverColorVal = (props?.navHoverColor as string) || NAV_HOVER_COLOR_TOKENS[0].value;
  $: activeNavColor = resolveColorTokenMatch(navColorVal, NAV_COLOR_TOKENS, NAV_COLOR_TOKENS[0].value);
  $: activeNavHoverColor = resolveColorTokenMatch(navHoverColorVal, NAV_HOVER_COLOR_TOKENS, NAV_HOVER_COLOR_TOKENS[0].value);
  $: activeFontSize = resolveNavFontSize(props?.navTypographyToken as string);
  $: activeTextTransform = props?.navTextTransform || 'none';

  let isCategoriesOpen = false;

  $: defaultCategories = [
    { name: 'Makanan & Kuliner', desc: 'Aneka snack & kuliner khas', href: '#produk' },
    { name: 'Fashion & Pakaian', desc: 'Batik & busana muslim', href: '#produk' },
    { name: 'Kerajinan Tangan', desc: 'Karya seni handmade lokal', href: '#produk' },
    { name: 'Minuman Segar', desc: 'Kopi & minuman herbal', href: '#produk' },
  ];

  // Kategori toko tenant otomatis didahulukan; desainer builder menggunakan props.categories
  $: displayCategories = (Array.isArray(categories) && categories.length > 0)
    ? categories
    : ((Array.isArray(props?.categories) && props.categories.length > 0)
        ? props.categories
        : defaultCategories);

  $: waUrl = generateWhatsAppLink(waNumber, (props?.whatsappTemplate as string) || '');

  // Safe countdown timer tanpa bug NaN
  let countdownSecs = 14400;
  let timerInterval: any = null;

  $: {
    const rawH = Number(props?.promoDurationHours);
    const validH = (Number.isFinite(rawH) && rawH > 0) ? rawH : 4;
    countdownSecs = validH * 3600;
  }

  onMount(() => {
    timerInterval = setInterval(() => {
      if (countdownSecs > 0) countdownSecs--;
    }, 1000);
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });

  $: timerHours = Math.floor(countdownSecs / 3600);
  $: timerMinutes = Math.floor((countdownSecs % 3600) / 60);
  $: timerSeconds = countdownSecs % 60;
  $: formattedCountdown = `${String(timerHours).padStart(2, '0')} Jam ${String(timerMinutes).padStart(2, '0')} Mnt ${String(timerSeconds).padStart(2, '0')} Dtk`;
</script>

<!-- Drawer Panel: Drops down flush directly below navbar as 1 unified surface with shadow -->
<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
  id="header-mobile-drawer"
  class={`header-mobile-drawer absolute inset-x-0 top-full z-40 shadow-2xl transition-all duration-200 ease-out max-h-[calc(100vh-80px)] overflow-y-auto ${
    isOpen ? 'block' : 'hidden'
  }`}
    style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); padding-top: 16px; padding-bottom: 20px; background-color: var(--theme-surface, var(--color-card-base, white)); color: var(--theme-text-primary, var(--color-text-main)); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
    on:click|stopPropagation
  >
    <!-- Top Bar / Badges Info for Presets -->
    {#if activePreset === 'top_contact_bar'}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--color-nested-base); border: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
        class="mb-3 p-3 text-xs space-y-2"
      >
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success">
            <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            {storeStatus}
          </span>
          <span style="color: var(--theme-text-muted, var(--color-text-muted)); font-size: calc(var(--theme-text-caption, 12px) * 0.9);" class="flex items-center gap-1">
            <Clock size={12} class="text-success" /> {storeHours}
          </span>
        </div>
        <div
          style="border-top: 1px solid var(--color-border); color: var(--theme-text-muted, var(--color-text-muted)); font-size: calc(var(--theme-text-caption, 12px) * 0.9);"
          class="flex items-center gap-1.5 pt-1.5"
        >
          <MapPin size={12} class="text-[var(--theme-primary,var(--color-primary))] flex-shrink-0" />
          <span class="truncate">{address}</span>
        </div>
      </div>
    {:else if activePreset === 'store_badge_highlight'}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--color-nested-base); border: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
        class="mb-3 p-2.5 text-xs flex items-center gap-2"
      >
        <span
          style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 12px)) * 0.75); background-color: color-mix(in srgb, var(--theme-primary, var(--color-primary)) 12%, transparent); color: var(--theme-primary, var(--color-primary)); border: 1px solid color-mix(in srgb, var(--theme-primary, var(--color-primary)) 30%, transparent); font-size: calc(var(--theme-text-caption, 12px) * 0.9);"
          class="inline-flex items-center gap-1 px-2 py-0.5 font-semibold"
        >
          <ShieldCheck size={12} class="flex-shrink-0" />
          <span>{stripEmoji(props.bpomText) || 'BPOM Terdaftar'}</span>
        </span>
        <span
          style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 12px)) * 0.75); background-color: color-mix(in srgb, var(--theme-secondary, var(--color-secondary)) 12%, transparent); color: var(--theme-secondary, var(--color-secondary)); border: 1px solid color-mix(in srgb, var(--theme-secondary, var(--color-secondary)) 30%, transparent); font-size: calc(var(--theme-text-caption, 12px) * 0.9);"
          class="inline-flex items-center gap-1 px-2 py-0.5 font-semibold"
        >
          <CheckCircle2 size={12} class="flex-shrink-0" />
          <span>{stripEmoji(props.halalText) || 'Halal MUI'}</span>
        </span>
      </div>
    {:else if activePreset === 'delivery_order_cta'}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: color-mix(in srgb, var(--theme-secondary, var(--color-secondary)) 10%, transparent); border: 1px solid color-mix(in srgb, var(--theme-secondary, var(--color-secondary)) 25%, transparent); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
        class="mb-3 p-2.5 text-xs space-y-1"
      >
        <div style="color: var(--theme-secondary, var(--color-secondary)); font-size: calc(var(--theme-text-caption, 12px) * 0.9);" class="font-semibold flex items-center gap-1.5">
          <Bike size={14} class="flex-shrink-0" style="color: var(--theme-secondary, var(--color-secondary));" />
          <span>{stripEmoji(props.deliveryText) || 'Siap Kirim Instan: Estimasi 30 Menit'}</span>
        </div>
        <div class="text-[10px] opacity-80 pl-5">
          {stripEmoji(props.deliveryPartners) || 'Tersedia GrabFood & GoFood'}
        </div>
      </div>
    {:else if activePreset === 'promo_countdown_banner'}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background: linear-gradient(90deg, var(--theme-secondary, var(--color-secondary)), var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, var(--color-card-base, #ffffff))); font-family: var(--theme-font-body, inherit);"
        class="mb-3 p-2.5 text-xs space-y-1 shadow-xs"
      >
        <div class="font-bold text-[11px] flex items-center justify-between">
          <span class="inline-flex items-center gap-1.5">
            <Zap size={13} class="fill-current text-warning" />
            <span>{stripEmoji(props.promoTitle) || 'FLASH SALE'}</span>
          </span>
          <span
            style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 12px)) * 0.5);"
            class="text-[10px] font-mono bg-black/30 px-2 py-0.5"
          >
            {formattedCountdown}
          </span>
        </div>
      </div>
    {/if}

    <!-- Navigation Links Grouped in Unified Nested Card (like Public Navbar) -->
    <div
      style="border-radius: var(--theme-btn-radius, var(--btn-radius, 14px)); background-color: var(--color-nested-base); border: 1px solid var(--color-border);"
      class="p-1.5 space-y-1 overflow-hidden"
    >
      {#each navLinks as link}
        <a
          href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
          on:click={(e) => {
            onClose();
            navigateToSection(e, link);
          }}
          style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 14px)) * 0.75); --nav-item-color: {activeNavColor}; --nav-item-hover-color: {activeNavHoverColor}; --nav-item-size: {activeFontSize}; --nav-item-transform: {activeTextTransform};"
          class="builder-header-nav-link flex items-center justify-between px-3.5 py-2.5 hover:bg-[var(--theme-surface,var(--color-card-base,white))] transition-colors cursor-pointer"
        >
          <span class="font-medium text-sm">{link}</span>
          <svg class="w-4 h-4 opacity-40 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      {/each}

      <!-- Mega Menu Product Category Accordion -->
      {#if activePreset === 'mega_menu_dropdown'}
        <div class="pt-0.5">
          <button
            type="button"
            on:click={() => (isCategoriesOpen = !isCategoriesOpen)}
            style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 14px)) * 0.75); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit); font-size: var(--theme-text-body, var(--text-body-size, 14px)); font-weight: var(--text-body-weight, 500);"
            class="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-[var(--theme-surface,var(--color-card-base,white))] transition-colors cursor-pointer"
          >
            <span>Kategori Produk</span>
            <ChevronDown size={16} class={`transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180 text-[var(--theme-primary,var(--color-primary))]' : 'opacity-40'}`} />
          </button>

          {#if isCategoriesOpen}
            <div class="pl-2 pr-1 py-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {#each displayCategories as cat}
                <a
                  href={cat.href || '#produk'}
                  on:click={(e) => {
                    onClose();
                    navigateToSection(e, cat.href || '#produk');
                  }}
                  style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 14px)) * 0.6); background-color: var(--theme-surface, var(--color-card-base, white)); border: 1px solid var(--color-border);"
                  class="flex flex-col px-3 py-2 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span
                    style="font-family: var(--theme-font-heading, inherit); color: var(--theme-text-primary, var(--color-text-main)); font-size: var(--theme-text-caption, 12px); font-weight: var(--text-h3-weight, 600);"
                    class="block"
                  >{cat.name}</span>
                  {#if cat.desc || cat.description}
                    <span
                      style="color: var(--theme-text-muted, var(--color-text-muted)); font-size: calc(var(--theme-text-caption, 12px) * 0.85);"
                      class="block"
                    >{cat.desc || cat.description}</span>
                  {/if}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- WhatsApp Action Button (CTA) -->
    <div class="pt-2">
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        style="height: var(--theme-btn-height, 44px); border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, var(--color-card-base, #ffffff))); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); border: none;"
        class="w-full inline-flex items-center justify-center gap-2 font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
      >
        <MessageCircle size={16} />
        <span>{ctaText}</span>
      </a>
    </div>
  </div>

<style>
  .builder-header-nav-link {
    color: var(--nav-item-color);
    font-size: var(--nav-item-size);
    font-weight: var(--text-body-weight, 500);
    font-family: var(--theme-font-body, var(--font-family, inherit));
    text-transform: var(--nav-item-transform, none);
    transition: color 0.15s ease, opacity 0.15s ease;
  }
  .builder-header-nav-link:hover {
    color: var(--nav-item-hover-color) !important;
  }
</style>
