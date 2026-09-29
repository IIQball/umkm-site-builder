<script lang="ts">
  import { Menu, Bike } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Pesan Sekarang';
  export let hasAnnouncementRow: boolean = true;
  export let announcementBarOrder: number = 0;
  export let navbarContainerOrder: number = 1;
  export let navbarOrder: string[] = ['logo', 'nav_links', 'cta'];
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: hasLogo = navbarOrder.includes('logo');
  $: hasNav = navbarOrder.includes('nav_links');
  $: hasCta = navbarOrder.includes('cta');

  $: deliveryText = props.deliveryText || '🛵 Siap Kirim Instan: Estimasi 30 Menit';
  $: deliveryPartners = props.deliveryPartners || 'Tersedia GrabFood & GoFood';

  $: waUrl = generateWhatsAppLink(waNumber, 'Halo, saya ingin pesan delivery!');
</script>

<div class="w-full flex flex-col">
  <!-- Top Ribbon: Delivery Info -->
  {#if hasAnnouncementRow}
    <div
      style="order: {announcementBarOrder};"
      class="w-full bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 text-xs py-1.5 border-b border-orange-200/60 dark:border-orange-900/60"
    >
      <div
        class="w-full mx-auto flex items-center justify-between box-border text-[11px]"
        style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
      >
        <span class="font-medium flex items-center gap-1.5">
          <span>{deliveryText}</span>
        </span>
        {#if !isMobile}
          <span class="font-semibold opacity-90">
            {deliveryPartners}
          </span>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Main Navbar -->
  <div
    id={`section-header-nav-${sectionId}`}
    class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] h-16 box-border relative overflow-visible"
    style="order: {navbarContainerOrder}; padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
  >
    <!-- Logo on Far Left Column 1 -->
    {#if hasLogo}
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
    {/if}

    <!-- Desktop Nav Links in Center -->
    {#if hasNav && isDesktop}
      <div data-node="nav_links" class="flex-1 flex items-center justify-center">
        <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
      </div>
    {/if}

    <!-- Right Controls: Desktop Delivery CTA & Mobile 44x44px Hamburger Button -->
    <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
      {#if hasCta && (isDesktop || viewMode === 'tablet')}
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          class="btn btn-sm btn-warning inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
        >
          <Bike size={15} />
          <span>{ctaText || 'Pesan Sekarang'}</span>
        </a>
      {/if}

    <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast -->
    {#if isSmallScreen}
      <button
        type="button"
        on:click={onToggleMobileMenu}
        class="btn btn-ghost btn-square w-11 h-11 min-w-[44px] min-h-[44px] border border-base-300 dark:border-slate-700/80 rounded-xl transition-colors cursor-pointer shadow-xs ml-auto"
        aria-label="Buka menu navigasi"
      >
        <Menu size={20} />
      </button>
    {/if}
  </div>
</div>
</div>
