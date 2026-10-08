<script lang="ts">
  import { Menu, Bike } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import TemplateThemeToggle from './TemplateThemeToggle.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import { stripEmoji } from './headerIcons';
  import { resolveFeatureIcon } from '../features/featureIcons';

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

  $: deliveryText = stripEmoji(props.deliveryText) || 'Siap Kirim Instan: Estimasi 30 Menit';
  $: deliveryPartners = stripEmoji(props.deliveryPartners) || 'Tersedia GrabFood & GoFood';
  $: deliveryIcon = (props.deliveryIcon as string) || 'truck';

  $: waUrl = generateWhatsAppLink(waNumber, 'Halo, saya ingin pesan delivery!');
</script>

<div class="w-full flex flex-col">
  <!-- Top Ribbon: Delivery Info -->
  {#if hasAnnouncementRow}
    <div
      style="order: {announcementBarOrder}; background-color: color-mix(in srgb, var(--theme-secondary, var(--color-secondary, #f97316)) 10%, transparent); color: var(--theme-secondary, var(--color-secondary, #ea580c)); border-bottom: 1px solid color-mix(in srgb, var(--theme-secondary, var(--color-secondary, #f97316)) 20%, transparent); font-family: var(--theme-font-body, var(--font-family, inherit));"
      class="w-full py-1.5"
    >
      <div
        class="w-full mx-auto flex items-center justify-between box-border"
        style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
      >
        <span class="font-medium flex items-center gap-1.5">
          <svelte:component this={resolveFeatureIcon(deliveryIcon)} size={14} class="text-[var(--theme-primary,var(--color-primary))] flex-shrink-0" />
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
    class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 min-h-[64px] h-16 box-border relative overflow-visible"
    style="order: {navbarContainerOrder}; max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
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
      <!-- Theme Toggle (Sebelum tombol CTA) -->
      <TemplateThemeToggle size="sm" />

      {#if hasCta && (isDesktop || viewMode === 'tablet')}
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px));"
          class="inline-flex items-center justify-center gap-1.5 px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
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
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 10px)); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); background: var(--color-card-base, var(--theme-surface, transparent)); font-family: var(--theme-font-body, inherit);"
          class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer shadow-xs ml-auto"
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>
      {/if}
    </div>
  </div>
</div>
