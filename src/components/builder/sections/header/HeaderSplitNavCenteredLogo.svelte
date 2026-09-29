<script lang="ts">
  import { Menu } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';

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
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-3 sm:gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border relative overflow-visible"
  style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px;"
>
  <!-- Desktop Left Half Links (Hidden on Tablet & Mobile) -->
  {#if hasNav && isDesktop}
    <div class="flex-1 flex items-center justify-start gap-6 text-xs font-semibold">
      {#each navLinks.slice(0, Math.ceil(navLinks.length / 2)) as link}
        <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} class="hover:text-[var(--theme-primary, var(--color-primary))] transition-colors">
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
  <div class="flex-1 flex items-center justify-end gap-3 text-xs font-semibold ml-auto">
    {#if hasNav && isDesktop}
      <div class="flex items-center gap-6 mr-3">
        {#each navLinks.slice(Math.ceil(navLinks.length / 2)) as link}
          <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} class="hover:text-[var(--theme-primary, var(--color-primary))] transition-colors">
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
        style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
        class="btn btn-sm btn-primary inline-flex items-center justify-center px-4 font-bold text-xs shadow-sm"
      >
        <span>{ctaText}</span>
      </a>
    {/if}

    <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast, Right Margin -->
    {#if isSmallScreen}
      <button
        type="button"
        on:click={onToggleMobileMenu}
        class="btn btn-ghost btn-square w-11 h-11 min-w-[44px] min-h-[44px] border border-base-300 dark:border-slate-700/80 rounded-xl transition-colors cursor-pointer ml-auto shadow-xs"
        aria-label="Buka menu navigasi"
      >
        <Menu size={20} />
      </button>
    {/if}
  </div>
</div>
