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
    getEffectiveHeaderNavbarOrder,
    headerHasRowOrder,
  } from './header/headerLayout.helpers';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'default_split';
  export let categories: Array<{ id?: string; name: string; slug?: string; description?: string; href?: string }> = [];
  export let store: any = null;
  export let isLiveStorefront: boolean = false;

  $: isHeaderActive = isActive && !isLiveStorefront;
  $: activeLogoText = (props?.logoText as string) || store?.name || 'Toko UMKM';
  $: safeProps = {
    ...props,
    logoText: activeLogoText,
  };

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
  $: navbarOrder = getEffectiveHeaderNavbarOrder(activePreset, props?.navbarOrder);

  let isMobileMenuOpen = false;

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
  };
</script>

<header
  data-node="header_container"
  style="font-family: var(--theme-font-body, inherit); {hasCustomBg ? '' : 'background-color: var(--theme-surface, var(--color-card-base, white)); color: var(--theme-text-primary, var(--color-text-main)); border-bottom: 1px solid var(--color-border);'}"
  class={`w-full flex flex-col box-border select-none transition-colors relative z-30 overflow-visible ${
    activePreset === 'transparent_glass_header'
      ? 'backdrop-blur-md bg-base-100/80 border-b border-[var(--color-border)] text-[var(--theme-text-primary,var(--color-text-main))]'
      : ''
  }`}
>
  <!-- Bar Pengumuman / Baris Atas Tambahan -->
  {#if activePreset === 'top_contact_bar'}
    {#if hasAnnouncementRow}
      <div
        style="order: {announcementBarOrder}; background-color: var(--color-nested-base); color: var(--theme-text-muted, var(--color-text-secondary)); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
        class="w-full py-2"
      >
        <div
          class="w-full mx-auto flex items-center justify-between gap-4 box-border"
          style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
        >
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5"><Clock size={13} class="text-[var(--theme-primary,var(--color-primary))]" /> {storeHours}</span>
            {#if !isMobile}
              <span class="flex items-center gap-1.5"><MapPin size={13} class="text-[var(--theme-primary,var(--color-primary))]" /> {address}</span>
            {/if}
          </div>
          <div class="flex items-center gap-2">
            <span
              style="border-radius: var(--theme-btn-radius, var(--btn-radius, 6px)); background-color: color-mix(in srgb, var(--color-success, #22c55e) 15%, transparent); color: var(--color-success, #22c55e); font-size: calc(var(--theme-text-caption, 12px) * 0.9);"
              class="inline-flex items-center gap-1.5 font-semibold px-2 py-0.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-success,#22c55e)] animate-pulse"></span>
              {storeStatus}
            </span>
          </div>
        </div>
      </div>
    {/if}
  {:else if hasAnnouncementRow && props?.showAnnouncement !== false && !['compact_inline', 'floating_pill_island', 'transparent_glass_header', 'delivery_order_cta', 'store_badge_highlight', 'promo_countdown_banner'].includes(activePreset)}
    <div data-node="announcement_bar" style="order: {announcementBarOrder};" class="w-full">
      <AnnouncementBar props={safeProps} {sectionId} isActive={isHeaderActive} />
    </div>
  {/if}

  <!-- Header Nav Layout Variants -->
  {#if activePreset === 'floating_pill_island'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderPillIsland
        props={safeProps} {sectionId} isActive={isHeaderActive} {navbarOrder}
        {waNumber} {ctaText} onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'delivery_order_cta'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderDeliveryOrder
        props={safeProps} {sectionId} isActive={isHeaderActive} {hasAnnouncementRow}
        {announcementBarOrder} {navbarContainerOrder} {navbarOrder}
        {waNumber} {ctaText} onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'store_badge_highlight'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderStoreBadge
        props={safeProps} {sectionId} isActive={isHeaderActive} {navbarOrder}
        {waNumber} {ctaText} onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'promo_countdown_banner'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderPromoCountdown
        props={safeProps} {sectionId} isActive={isHeaderActive} {hasAnnouncementRow}
        {announcementBarOrder} {navbarContainerOrder} {navbarOrder}
        {waNumber} {ctaText} onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'split_nav_centered_logo'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderSplitNavCenteredLogo
        props={safeProps} {sectionId} isActive={isHeaderActive} {navbarOrder}
        {navLinks} {waUrl} {ctaText} onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'command_search_bar'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderCommandSearch
        props={safeProps} {sectionId} isActive={isHeaderActive} {navbarOrder}
        {waNumber} {ctaText} onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'mega_menu_dropdown'}
    <div style="order: {navbarContainerOrder};" class="w-full">
      <HeaderMegaMenu
        props={safeProps} {sectionId} isActive={isHeaderActive} {navbarOrder}
        {waNumber} {ctaText} {categories} onToggleMobileMenu={toggleMobileMenu}
      />
    </div>

  {:else if activePreset === 'centered_stacked'}
    {#if isDesktop}
      <!-- Desktop Stacked (Logo vs Nav Links in custom order) -->
      <div
        id={`section-header-nav-${sectionId}`}
        class="header-nav-container w-full mx-auto flex flex-col items-center justify-center py-4 gap-3 box-border overflow-visible"
        style="order: {navbarContainerOrder}; max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
      >
        {#each navbarOrder as slot}
          {#if slot === 'logo'}
            <div data-node="logo" class="flex items-center justify-center">
              <HeaderLogo props={safeProps} {sectionId} isActive={isHeaderActive} />
            </div>
          {:else if slot === 'nav_links'}
            <div data-node="nav_links" class="flex items-center justify-center gap-6">
              <HeaderNav props={safeProps} {sectionId} isActive={isHeaderActive} onlyDesktop={true} />
            </div>
          {/if}
        {/each}
      </div>
    {:else}
      <!-- Tablet & Mobile Single-Row Collapse (Logo Leftmost, Hamburger Rightmost) -->
      <div
        class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 min-h-[64px] box-border overflow-visible"
        style="order: {navbarContainerOrder}; max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px; border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
      >
        <div data-node="logo" class="flex items-center flex-shrink-0">
          <HeaderLogo props={safeProps} {sectionId} isActive={isHeaderActive} />
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 ml-auto">
          {#if viewMode === 'tablet'}
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); border: none;"
              class="inline-flex items-center justify-center px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{ctaText}</span>
            </a>
          {/if}
          <!-- 44x44px Hamburger Button -->
          <button
            type="button"
            on:click={toggleMobileMenu}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 10px)); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); background: var(--color-card-base, var(--theme-surface, transparent)); font-family: var(--theme-font-body, inherit);"
            class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer shadow-xs ml-auto"
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
        props={safeProps} {sectionId} isActive={isHeaderActive} {activePreset}
        {navbarOrder} {waUrl} {ctaText} onToggleMobileMenu={toggleMobileMenu}
      />
    </div>
  {/if}

  <!-- Universal Mobile Drawer Overlay -->
  <HeaderMobileDrawer
    isOpen={isMobileMenuOpen}
    onClose={() => (isMobileMenuOpen = false)}
    props={safeProps} {sectionId} isActive={isHeaderActive} {activePreset}
    {waNumber} {ctaText} {storeHours} {address}
    {storeStatus} {categories}
  />
</header>