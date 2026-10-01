<script lang="ts">
  import { Menu, MessageCircle } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import {
    navigateToSection,
    resolveNavFontSize,
    resolveColorTokenMatch,
    NAV_COLOR_TOKENS,
    NAV_HOVER_COLOR_TOKENS,
  } from './headerNav.helpers';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let navLinks: string[] = ['Beranda', 'Produk', 'Tentang', 'Kontak'];
  export let waUrl: string = '';
  export let ctaText: string = 'Chat WA';
  export let navbarOrder: string[] = ['logo', 'nav_links', 'cta'];
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: hasLogo = navbarOrder.includes('logo');
  $: hasNav = navbarOrder.includes('nav_links');
  $: hasCta = navbarOrder.includes('cta');

  $: navColorVal = (props.navColor as string) || NAV_COLOR_TOKENS[0].value;
  $: navHoverColorVal = (props.navHoverColor as string) || NAV_HOVER_COLOR_TOKENS[0].value;
  $: activeNavColor = resolveColorTokenMatch(navColorVal, NAV_COLOR_TOKENS, NAV_COLOR_TOKENS[0].value);
  $: activeNavHoverColor = resolveColorTokenMatch(navHoverColorVal, NAV_HOVER_COLOR_TOKENS, NAV_HOVER_COLOR_TOKENS[0].value);
  $: activeFontSize = resolveNavFontSize(props.navTypographyToken as string);
  $: activeTextTransform = props.navTextTransform || 'none';
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-3 sm:gap-4 border-b min-h-[64px] box-border relative overflow-visible"
  style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px; max-width: var(--theme-max-width, var(--active-max-width, 1200px)); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
>
  <!-- Desktop Left Half Links (Hidden on Tablet & Mobile) -->
  {#if hasNav && isDesktop}
    <div
      style="font-family: var(--theme-font-body, var(--font-family, inherit));"
      class="flex-1 flex items-center justify-start gap-6"
    >
      {#each navLinks.slice(0, Math.ceil(navLinks.length / 2)) as link}
        <a
          href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
          on:click={(e) => navigateToSection(e, link)}
          style="--nav-item-color: {activeNavColor}; --nav-item-hover-color: {activeNavHoverColor}; --nav-item-size: {activeFontSize}; --nav-item-transform: {activeTextTransform};"
          class="builder-header-nav-link transition-colors cursor-pointer"
        >
          {link}
        </a>
      {/each}
    </div>
  {/if}

  <!-- Logo: Centered on Desktop, Leftmost Column 1 on Tablet/Mobile with brand icon only on 375px -->
  {#if hasLogo}
    <div data-node="logo" class="flex items-center md:justify-center flex-shrink-0">
      <HeaderLogo {props} {sectionId} {isActive} hideTextOnMobile={true} />
    </div>
  {/if}

  <!-- Desktop Right Half Links + CTA (Hidden on Tablet & Mobile) -->
  <div
    style="font-family: var(--theme-font-body, var(--font-family, inherit));"
    class="flex-1 flex items-center justify-end gap-3 ml-auto"
  >
    {#if hasNav && isDesktop}
      <div class="flex items-center gap-6 mr-3">
        {#each navLinks.slice(Math.ceil(navLinks.length / 2)) as link}
          <a
            href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
            on:click={(e) => navigateToSection(e, link)}
            style="--nav-item-color: {activeNavColor}; --nav-item-hover-color: {activeNavHoverColor}; --nav-item-size: {activeFontSize}; --nav-item-transform: {activeTextTransform};"
            class="builder-header-nav-link transition-colors cursor-pointer"
          >
            {link}
          </a>
        {/each}
      </div>
    {/if}

    {#if hasCta && (isDesktop || viewMode === 'tablet')}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); border: none;"
        class="inline-flex items-center justify-center px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
      >
        <MessageCircle size={15} class="mr-1.5" />
        <span>{ctaText}</span>
      </a>
    {/if}

    <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast, Right Margin -->
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

<style>
  .builder-header-nav-link {
    color: var(--nav-item-color);
    font-size: var(--nav-item-size);
    font-weight: 500;
    font-family: var(--theme-font-body, var(--font-family, inherit));
    text-transform: var(--nav-item-transform, none);
    transition: color 0.15s ease, opacity 0.15s ease;
  }
  .builder-header-nav-link:hover {
    color: var(--nav-item-hover-color) !important;
  }
</style>
