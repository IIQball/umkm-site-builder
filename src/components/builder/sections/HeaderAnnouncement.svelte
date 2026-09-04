<script lang="ts">
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types';
  import AnnouncementBar from './header/AnnouncementBar.svelte';
  import HeaderLogo from './header/HeaderLogo.svelte';
  import HeaderNav from './header/HeaderNav.svelte';
  import HeaderPillIsland from './header/HeaderPillIsland.svelte';
  import HeaderCommandSearch from './header/HeaderCommandSearch.svelte';
  import HeaderMegaMenu from './header/HeaderMegaMenu.svelte';
  import HeaderMobileDrawer from './header/HeaderMobileDrawer.svelte';
  import HeaderDeliveryOrder from './header/HeaderDeliveryOrder.svelte';
  import HeaderStoreBadge from './header/HeaderStoreBadge.svelte';
  import HeaderPromoCountdown from './header/HeaderPromoCountdown.svelte';
  import { MessageCircle, Clock, MapPin, Menu } from 'lucide-svelte';
  import { canvasStore } from '../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'default_split';
  export let categories: Array<{ id?: string; name: string; slug?: string; description?: string; href?: string }> = [];

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

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

  $: waUrl = generateWhatsAppLink(waNumber);

  let isMobileMenuOpen = false;

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
  };
</script>

<header
  data-node="header_container"
  class={`w-full flex flex-col box-border select-none transition-colors relative z-30 overflow-visible ${
    activePreset === 'transparent_glass_header'
      ? 'backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 text-[var(--theme-text-primary,#0f172a)]'
      : hasCustomBg
      ? ''
      : 'bg-[var(--theme-surface,white)] text-[var(--theme-text-primary,#0f172a)]'
  }`}
>
  <!-- Top Announcement / Contact Bar -->
  {#if activePreset === 'top_contact_bar'}
    <div class="w-full bg-slate-900 text-slate-200 text-xs py-2 border-b border-slate-800">
      <div
        class="w-full mx-auto flex items-center justify-between gap-4 box-border"
        style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
      >
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5"><Clock size={13} class="text-emerald-400" /> {storeHours}</span>
          {#if !isMobile}
            <span class="flex items-center gap-1.5"><MapPin size={13} class="text-blue-400" /> {address}</span>
          {/if}
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {storeStatus}
          </span>
        </div>
      </div>
    </div>
  {:else if !['compact_inline', 'floating_pill_island', 'transparent_glass_header', 'delivery_order_cta', 'store_badge_highlight', 'promo_countdown_banner'].includes(activePreset)}
    <div data-node="announcement_bar" class="w-full">
      <AnnouncementBar {props} {sectionId} {isActive} />
    </div>
  {/if}

  <!-- Header Nav Layout Variants -->
  {#if activePreset === 'floating_pill_island'}
    <HeaderPillIsland
      {props}
      {sectionId}
      {isActive}
      {waNumber}
      {ctaText}
      onToggleMobileMenu={toggleMobileMenu}
    />

  {:else if activePreset === 'delivery_order_cta'}
    <HeaderDeliveryOrder
      {props}
      {sectionId}
      {isActive}
      {waNumber}
      {ctaText}
      onToggleMobileMenu={toggleMobileMenu}
    />

  {:else if activePreset === 'store_badge_highlight'}
    <HeaderStoreBadge
      {props}
      {sectionId}
      {isActive}
      {waNumber}
      {ctaText}
      onToggleMobileMenu={toggleMobileMenu}
    />

  {:else if activePreset === 'promo_countdown_banner'}
    <HeaderPromoCountdown
      {props}
      {sectionId}
      {isActive}
      {waNumber}
      {ctaText}
      onToggleMobileMenu={toggleMobileMenu}
    />

  {:else if activePreset === 'split_nav_centered_logo'}
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto flex items-center justify-between gap-3 sm:gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border relative overflow-visible"
      style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px;"
    >
      <!-- Desktop Left Half Links (Hidden on Tablet & Mobile) -->
      {#if isDesktop}
        <div class="flex-1 flex items-center justify-start gap-6 text-xs font-semibold">
          {#each navLinks.slice(0, Math.ceil(navLinks.length / 2)) as link}
            <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} class="hover:text-[var(--theme-primary,#2563eb)] transition-colors">
              {link}
            </a>
          {/each}
        </div>
      {/if}

      <!-- Logo: Centered on Desktop, Leftmost Column 1 on Tablet/Mobile with brand icon only on 375px -->
      <div data-node="logo" class="flex items-center md:justify-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} hideTextOnMobile={true} />
      </div>

      <!-- Desktop Right Half Links + CTA (Hidden on Tablet & Mobile) -->
      <div class="flex-1 flex items-center justify-end gap-3 text-xs font-semibold ml-auto">
        {#if isDesktop}
          <div class="flex items-center gap-6 mr-3">
            {#each navLinks.slice(Math.ceil(navLinks.length / 2)) as link}
              <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} class="hover:text-[var(--theme-primary,#2563eb)] transition-colors">
                {link}
              </a>
            {/each}
          </div>
        {/if}

        {#if isDesktop || viewMode === 'tablet'}
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-4 font-bold text-xs shadow-sm"
          >
            <span>{ctaText}</span>
          </a>
        {/if}

        <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast, Right Margin -->
        {#if isSmallScreen}
          <button
            type="button"
            on:click={toggleMobileMenu}
            class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-colors cursor-pointer ml-auto shadow-xs"
            aria-label="Buka menu navigasi"
          >
            <Menu size={20} />
          </button>
        {/if}
      </div>
    </div>

  {:else if activePreset === 'command_search_bar'}
    <HeaderCommandSearch
      {props}
      {sectionId}
      {isActive}
      {waNumber}
      {ctaText}
      onToggleMobileMenu={toggleMobileMenu}
    />

  {:else if activePreset === 'mega_menu_dropdown'}
    <HeaderMegaMenu
      {props}
      {sectionId}
      {isActive}
      {waNumber}
      {ctaText}
      {categories}
      onToggleMobileMenu={toggleMobileMenu}
    />

  {:else if activePreset === 'centered_stacked'}
    {#if isDesktop}
      <!-- Desktop Stacked (Row 1 Logo, Row 2 Nav links) -->
      <div
        id={`section-header-nav-${sectionId}`}
        class="header-nav-container w-full mx-auto flex flex-col items-center justify-center py-4 gap-3 border-b border-base-200 dark:border-slate-800 box-border overflow-visible"
        style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
      >
        <div data-node="logo" class="flex items-center justify-center">
          <HeaderLogo {props} {sectionId} {isActive} />
        </div>
        <div data-node="nav_links" class="flex items-center justify-center gap-6">
          <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
        </div>
      </div>
    {:else}
      <!-- Tablet & Mobile Single-Row Collapse (Logo Leftmost, Hamburger Rightmost) -->
      <div
        class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border overflow-visible"
        style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px;"
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
              style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
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
    <div
      id={`section-header-nav-${sectionId}`}
      class={`header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 box-border overflow-visible ${
        activePreset === 'compact_inline' ? 'min-h-[56px] h-14' : 'min-h-[64px] h-16'
      }`}
      style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
    >
      <!-- Logo on Far Left Column 1 -->
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>

      <!-- Desktop Nav Links in Center -->
      {#if isDesktop}
        <div data-node="nav_links" class="flex-1 flex items-center justify-center">
          <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
        </div>
      {/if}

      <!-- Right Controls: Desktop CTA & Mobile 44x44px Hamburger Button -->
      <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
        {#if isDesktop || viewMode === 'tablet'}
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-4 font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-transform"
          >
            <MessageCircle size={15} class="mr-1.5" />
            <span>{ctaText}</span>
          </a>
        {/if}

        <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast, Far Right Margin -->
        {#if isSmallScreen}
          <button
            type="button"
            on:click={toggleMobileMenu}
            class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-colors cursor-pointer shadow-xs ml-auto"
            aria-label="Buka menu navigasi"
          >
            <Menu size={20} />
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Universal Mobile Drawer Overlay (True Overlay, No Physical Resize of Header) -->
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