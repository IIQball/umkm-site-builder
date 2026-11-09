<script lang="ts">
  import { MessageCircle, Menu, X } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import TemplateThemeToggle from './TemplateThemeToggle.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let activePreset: string = 'default_split';
  export let navbarOrder: string[] = ['logo', 'nav_links', 'cta'];
  export let waUrl: string = '';
  export let ctaText: string = 'Chat WA';
  export let onToggleMobileMenu: () => void = () => {};
  export let isMobileMenuOpen: boolean = false;

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: slot1 = navbarOrder[0] || '';
  $: slot2 = navbarOrder.length >= 3 ? navbarOrder[1] : '';
  $: slot3 = navbarOrder.length >= 3 ? navbarOrder[2] : (navbarOrder.length === 2 ? navbarOrder[1] : '');
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class={`header-nav-container w-full mx-auto flex items-center justify-between gap-4 box-border overflow-visible ${
    activePreset === 'compact_inline' ? 'min-h-[56px] h-14' : 'min-h-[64px] h-16'
  }`}
  style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
>
  <!-- Kolom 1 (Kiri) -->
  <div class="flex items-center flex-shrink-0">
    {#if slot1 === 'logo'}
      <div data-node="logo" class="flex items-center">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
    {:else if slot1 === 'nav_links'}
      <div data-node="nav_links" class="{isSmallScreen ? 'hidden' : 'hidden lg:flex'} items-center justify-start gap-6">
        <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
      </div>
    {:else if slot1 === 'cta'}
      <div data-node="cta" class="{isSmallScreen ? 'hidden' : 'hidden md:flex'} items-center">
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px));"
          class="inline-flex items-center justify-center px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <MessageCircle size={15} class="mr-1.5" />
          <span>{ctaText}</span>
        </a>
      </div>
    {/if}
  </div>

  <!-- Kolom 2 (Tengah) -->
  <div class="flex-1 flex items-center justify-center">
    {#if slot2 === 'logo'}
      <div data-node="logo" class="flex items-center justify-center">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
    {:else if slot2 === 'nav_links'}
      <div data-node="nav_links" class="{isSmallScreen ? 'hidden' : 'hidden lg:flex'} items-center justify-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
      </div>
    {:else if slot2 === 'cta'}
      <div data-node="cta" class="{isSmallScreen ? 'hidden' : 'hidden md:flex'} items-center justify-center">
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px));"
          class="inline-flex items-center justify-center px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <MessageCircle size={15} class="mr-1.5" />
          <span>{ctaText}</span>
        </a>
      </div>
    {/if}
  </div>

  <!-- Kolom 3 (Kanan) -->
  <div class="flex items-center gap-2 flex-shrink-0 justify-end">
    {#if slot3 === 'logo'}
      <div data-node="logo" class="flex items-center justify-end">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
    {:else if slot3 === 'nav_links'}
      <div data-node="nav_links" class="{isSmallScreen ? 'hidden' : 'hidden lg:flex'} items-center justify-end gap-6">
        <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
      </div>
    {/if}

    <!-- Theme Toggle (Sebelum tombol CTA) -->
    <TemplateThemeToggle size="sm" />

    {#if slot3 === 'cta'}
      <div data-node="cta" class="{isSmallScreen ? 'hidden' : 'hidden md:flex'} items-center justify-end">
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px));"
          class="inline-flex items-center justify-center px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <MessageCircle size={15} class="mr-1.5" />
          <span>{ctaText}</span>
        </a>
      </div>
    {/if}

    <!-- Mobile/Tablet Hamburger Button (Always far right on small screens) -->
    <button
      type="button"
      on:click|stopPropagation={onToggleMobileMenu}
      style="border-radius: var(--theme-btn-radius, var(--btn-radius, 10px)); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); background: var(--color-card-base, var(--theme-surface, transparent)); font-family: var(--theme-font-body, inherit);"
      class="{isSmallScreen ? 'flex' : 'flex md:hidden'} w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center hover:opacity-80 transition-colors cursor-pointer shadow-xs ml-auto"
      aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
    >
      {#if isMobileMenuOpen}
        <X size={20} />
      {:else}
        <Menu size={20} />
      {/if}
    </button>
  </div>
</div>
