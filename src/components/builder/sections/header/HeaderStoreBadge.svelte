<script lang="ts">
  import { Menu, MessageCircle } from 'lucide-svelte';
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
  export let ctaText: string = 'Konsultasi Gratis';
  export let navbarOrder: string[] = ['logo', 'store_badges', 'nav_links', 'cta'];
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: hasLogo = navbarOrder.includes('logo');
  $: hasBadges = navbarOrder.includes('store_badges');
  $: hasNav = navbarOrder.includes('nav_links');
  $: hasCta = navbarOrder.includes('cta');

  $: bpomText = stripEmoji(props.bpomText) || 'BPOM Terdaftar';
  $: halalText = stripEmoji(props.halalText) || 'Halal MUI';
  $: bpomIcon = (props.bpomIcon as string) || 'shield-check';
  $: halalIcon = (props.halalIcon as string) || 'badge-check';

  $: waUrl = generateWhatsAppLink(waNumber, 'Halo, saya ingin konsultasi gratis!');
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 min-h-[64px] h-16 box-border relative overflow-visible"
  style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
>
  <!-- Logo & Legal Badges (BPOM & Halal MUI) -->
  <div data-node="logo" class="flex items-center flex-shrink-0">
    {#if hasLogo}
      <HeaderLogo {props} {sectionId} {isActive} />
    {/if}

    <!-- Badges Highlight (Desktop & Tablet) -->
    {#if hasBadges && !isMobile}
      <div class="flex items-center gap-1.5 ml-3 pl-3 border-l border-[var(--color-border)]">
        <span
          style="border-radius: 6px; background-color: color-mix(in srgb, var(--theme-primary, var(--color-primary)) 12%, transparent); color: var(--theme-primary, var(--color-primary)); border: 1px solid color-mix(in srgb, var(--theme-primary, var(--color-primary)) 25%, transparent); font-family: var(--theme-font-body, inherit); font-size: var(--theme-text-caption, var(--text-caption-size, 11px));"
          class="inline-flex items-center gap-1 px-2 py-0.5 font-semibold"
        >
          <svelte:component this={resolveFeatureIcon(bpomIcon)} size={12} class="flex-shrink-0" />
          <span>{bpomText}</span>
        </span>
        <span
          style="border-radius: 6px; background-color: color-mix(in srgb, var(--theme-secondary, var(--color-secondary)) 12%, transparent); color: var(--theme-secondary, var(--color-secondary)); border: 1px solid color-mix(in srgb, var(--theme-secondary, var(--color-secondary)) 25%, transparent); font-family: var(--theme-font-body, inherit); font-size: var(--theme-text-caption, var(--text-caption-size, 11px));"
          class="inline-flex items-center gap-1 px-2 py-0.5 font-semibold"
        >
          <svelte:component this={resolveFeatureIcon(halalIcon)} size={12} class="flex-shrink-0" />
          <span>{halalText}</span>
        </span>
      </div>
    {/if}
  </div>

  <!-- Desktop Nav Links in Center -->
  {#if hasNav && isDesktop}
    <div data-node="nav_links" class="flex-1 flex items-center justify-center">
      <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
    </div>
  {/if}

  <!-- Right Controls: Desktop CTA & Mobile 44x44px Hamburger Button -->
  <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
    <!-- Theme Toggle (Sebelum tombol CTA) -->
    <TemplateThemeToggle size="sm" />

    {#if hasCta && (isDesktop || viewMode === 'tablet')}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); border: none;"
        class="inline-flex items-center justify-center px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
      >
        <MessageCircle size={15} class="mr-1.5" />
        <span>{ctaText || 'Konsultasi Gratis'}</span>
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
