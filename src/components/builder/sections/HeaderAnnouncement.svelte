<script lang="ts">
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types';
  import AnnouncementBar from './header/AnnouncementBar.svelte';
  import HeaderLogo from './header/HeaderLogo.svelte';
  import HeaderNav from './header/HeaderNav.svelte';
  import HeaderDefaultSplit from './header/HeaderDefaultSplit.svelte';
  import HeaderSplitNavCenteredLogo from './header/HeaderSplitNavCenteredLogo.svelte';
  import HeaderPillIsland from './header/HeaderPillIsland.svelte';
  import HeaderCommandSearch from './header/HeaderCommandSearch.svelte';
  import HeaderMegaMenu from './header/HeaderMegaMenu.svelte';
  import HeaderMobileDrawer from './header/HeaderMobileDrawer.svelte';
  import HeaderDeliveryOrder from './header/HeaderDeliveryOrder.svelte';
  import HeaderStoreBadge from './header/HeaderStoreBadge.svelte';
  import HeaderPromoCountdown from './header/HeaderPromoCountdown.svelte';
  import { Clock, MapPin, Menu } from 'lucide-svelte';
  import { canvasStore } from '../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import {
    getDefaultHeaderRowOrder,
    getDefaultHeaderNavbarOrder,
    headerHasRowOrder,
  } from './header/headerLayout.helpers';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'default_split';
  export let categories: Array<{ id?: string; name: string; slug?: string; description?: string; href?: string }> = [];

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'default_split';
  $: hasCustomBg = !!styles?.backgroundColor;
  $: waNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '';
  $: ctaText = (props?.ctaText as string) || 'Chat WA';
  $: address = (props?.address as string) || 'Jakarta, Indonesia';
  $: storeHours = (props?.storeHours as string) || 'Buka: 08.00 - 21.00 WIB';
  $: storeStatus = (props?.storeStatus as string) || 'Toko Buka';

  $: navLinks = Array.isArray(props?.navLinks) && props.navLinks.length > 0
    ? props.navLinks
    : ['Beranda', 'Produk', 'Tentang', 'Kontak'];

  $: waUrl = generateWhatsAppLink(waNumber, (props?.whatsappTemplate as string) || '');

  // Group 1: Posisi Baris (Vertikal: Atas - Bawah)
  $: validRowSlots = getDefaultHeaderRowOrder(activePreset);
  $: hasRowSlots = headerHasRowOrder(activePreset);
  $: rowOrder = (Array.isArray(props?.rowOrder) && props.rowOrder.length > 0
    ? props.rowOrder
    : validRowSlots) as string[];
  $: hasAnnouncementRow = !hasRowSlots || rowOrder.includes('announcement_bar');
  $: announcementBarOrder = rowOrder.indexOf('announcement_bar') !== -1 ? rowOrder.indexOf('announcement_bar') : 0;
  $: navbarContainerOrder = rowOrder.indexOf('navbar') !== -1 ? rowOrder.indexOf('navbar') : 1;

  // Group 2: Elemen Bilah Navigasi (Horizontal atau Vertikal jika stacked)
  $: defaultNavbarOrder = getDefaultHeaderNavbarOrder(activePreset);
  $: navbarOrder = (Array.isArray(props?.navbarOrder) && props.navbarOrder.length > 0
    ? props.navbarOrder
    : Array.isArray(props?.elementOrder) && props.elementOrder.length > 0
      ? props.elementOrder
      : defaultNavbarOrder).filter((s: string) => defaultNavbarOrder.includes(s)) as string[];

  let isMobileMenuOpen = false;

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
  };
</script>

<header
  data-node="header_container"
  class={`w-full flex flex-col box-border select-none transition-colors relative z-30 overflow-visible ${
    activePreset === 'transparent_glass_header'
      ? 'backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 text-[var(--theme-text-primary, var(--color-text-main))]'
      : hasCustomBg
      ? ''
      : 'bg-[var(--theme-surface,white)] text-[var(--theme-text-primary, var(--color-text-main))]'
  }`}
>
  <!-- Bar Pengumuman / Baris Atas Tambahan -->
  {#if activePreset === 'top_contact_bar'}
    {#if hasAnnouncementRow}
      <div style="order: {announcementBarOrder};" class="w-full bg-slate-900 text-slate-200 text-xs py-2 border-b border-slate-800">
        <div
          class="w-full mx-auto flex items-center justify-between gap-4 box-border"
          style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
        >
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5"><Clock size={13} class="text-[var(--color-success)]" /> {storeHours}</span>
            {#if !isMobile}
              <span class="flex items-center gap-1.5"><MapPin size={13} class="text-[var(--color-primary)]" /> {address}</span>
            {/if}
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-success)]">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse"></span>
              {storeStatus}
            </span>
          </div>
        </div>
      </div>
    {/if}
  {:else if hasAnnouncementRow && props?.showAnnouncement !== false && !['compact_inline', 'floating_pill_island', 'transparent_glass_header', 'delivery_order_cta', 'store_badge_highlight', 'promo_countdown_banner'].includes(activePreset)}
    <div data-node="announcement_bar" style="order: {announcementBarOrder};" class="w-full">
      <AnnouncementBar {props} {sectionId} {isActive} />
    </div>
  {/if}

  <!-- Header Nav Layout Variants -->
  {#if activePreset === 'floating_pill_island'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderPillIsland
        {props}
        {sectionId}
        {isActive}
        {navbarOrder}
        {waNumber}
        {ctaText}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'delivery_order_cta'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderDeliveryOrder
        {props}
        {sectionId}
        {isActive}
        {hasAnnouncementRow}
        {announcementBarOrder}
        {navbarContainerOrder}
        {navbarOrder}
        {waNumber}
        {ctaText}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'store_badge_highlight'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderStoreBadge
        {props}
        {sectionId}
        {isActive}
        {navbarOrder}
        {waNumber}
        {ctaText}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'promo_countdown_banner'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderPromoCountdown
        {props}
        {sectionId}
        {isActive}
        {hasAnnouncementRow}
        {announcementBarOrder}
        {navbarContainerOrder}
        {navbarOrder}
        {waNumber}
        {ctaText}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'split_nav_centered_logo'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderSplitNavCenteredLogo
        {props}
        {sectionId}
        {isActive}
        {navbarOrder}
        {navLinks}
        {waUrl}
        {ctaText}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'command_search_bar'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderCommandSearch
        {props}
        {sectionId}
        {isActive}
        {navbarOrder}
        {waNumber}
        {ctaText}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'mega_menu_dropdown'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderMegaMenu
        {props}
        {sectionId}
        {isActive}
        {navbarOrder}
        {waNumber}
        {ctaText}
        {categories}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'centered_stacked'}
    {#if isDesktop}
      <!-- Desktop Stacked (Logo vs Nav Links in custom order) -->
      <div
        id={`section-header-nav-${sectionId}`}
        class="header-nav-container w-full mx-auto flex flex-col items-center justify-center py-4 gap-3 border-b border-base-200 dark:border-slate-800 box-border overflow-visible"
        style="order: {navbarContainerOrder}; padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
      >
        {#each navbarOrder as slot}
          {#if slot === 'logo'}
            <div data-node="logo" class="flex items-center justify-center">
              <HeaderLogo {props} {sectionId} {isActive} />
            </div>
          {:else if slot === 'nav_links'}
            <div data-node="nav_links" class="flex items-center justify-center gap-6">
              <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
            </div>
          {/if}
        {/each}
      </div>
    {:else}
      <!-- Tablet & Mobile Single-Row Collapse (Logo Leftmost, Hamburger Rightmost) -->
      <div
        class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border overflow-visible"
        style="order: {navbarContainerOrder}; padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px;"
      >
        <div data-node="logo" class="flex items-center flex-shrink-0">
          <HeaderLogo {props} {sectionId} {isActive} />
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 ml-auto">
          {#if viewMode === 'tablet'}
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, white);"
              class="inline-flex items-center justify-center px-3 font-bold text-xs shadow-sm"
            >
              <span>{ctaText}</span>
            </a>
          {/if}
          <!-- 44x44px Hamburger Button -->
          <button
            type="button"
            on:click={toggleMobileMenu}
            class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-colors cursor-pointer shadow-xs ml-auto"
            aria-label="Buka menu navigasi"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    {/if}

  {:else}
    <!-- Default Split, Compact Inline, Transparent Glass, Top Contact Bar Main Navbar -->
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderDefaultSplit
        {props}
        {sectionId}
        {isActive}
        {activePreset}
        {navbarOrder}
        {waUrl}
        {ctaText}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </div>
  {/if}

  <!-- Universal Mobile Drawer Overlay -->
  <HeaderMobileDrawer
    isOpen={isMobileMenuOpen}
    onClose={() => (isMobileMenuOpen = false)}
    {props}
    {sectionId}
    {isActive}
    {activePreset}
    {waNumber}
    {ctaText}
    {storeHours}
    {address}
    {storeStatus}
    {categories}
  />
</header>