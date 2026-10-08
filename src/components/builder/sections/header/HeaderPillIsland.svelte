<script lang="ts">
  import { MessageCircle, Menu } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import TemplateThemeToggle from './TemplateThemeToggle.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
  export let navbarOrder: string[] = ['logo', 'nav_links', 'cta'];
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: hasLogo = navbarOrder.includes('logo');
  $: hasNav = navbarOrder.includes('nav_links');
  $: hasCta = navbarOrder.includes('cta');

  $: waUrl = generateWhatsAppLink(waNumber, (props?.whatsappTemplate as string) || '');
</script>

<div class="w-full py-3 box-border overflow-visible flex items-center justify-center">
  <div
    id={`section-header-nav-${sectionId}`}
    class="h-14 px-3.5 sm:px-6 rounded-full backdrop-blur-md shadow-lg flex items-center justify-between gap-3 sm:gap-4 box-border relative z-20"
    style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); margin-left: auto; margin-right: auto; width: calc(100% - (var(--active-margin, var(--active-safe-zone, 24px)) * 2)); background-color: color-mix(in srgb, var(--theme-surface, var(--color-card-base, white)) 90%, transparent); color: var(--theme-text-primary, var(--color-text-main)); border: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
  >
    <!-- Logo on Far Left inside Capsule -->
    {#if hasLogo}
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
    {/if}

    <!-- Desktop Nav Links -->
    {#if hasNav && isDesktop}
      <div data-node="nav_links" class="flex-1 flex items-center justify-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
      </div>
    {/if}

    <!-- Right Controls: CTA (Desktop) + Hamburger (Tablet & Mobile, Far Right inside Capsule) -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <!-- Theme Toggle (Sebelum tombol CTA) -->
      <TemplateThemeToggle size="sm" />

      {#if hasCta && isDesktop}
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); border: none;"
          class="inline-flex items-center justify-center px-4 font-bold transition-all hover:brightness-105 active:scale-95 shadow-sm cursor-pointer"
        >
          <MessageCircle size={14} class="mr-1.5" />
          <span>{ctaText}</span>
        </a>
      {/if}

      <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast -->
      {#if isSmallScreen}
        <button
          type="button"
          on:click={onToggleMobileMenu}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); background: var(--color-card-base, var(--theme-surface, transparent)); font-family: var(--theme-font-body, inherit);"
          class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer shadow-xs hover:opacity-80"
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>
      {/if}
    </div>
  </div>
</div>
