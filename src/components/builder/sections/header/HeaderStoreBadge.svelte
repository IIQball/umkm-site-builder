<script lang="ts">
  import { Menu } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Konsultasi Gratis';
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: bpomText = props.bpomText || '✓ BPOM';
  $: halalText = props.halalText || '✓ Halal MUI';

  $: waUrl = generateWhatsAppLink(waNumber, 'Halo, saya ingin konsultasi gratis!');
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] h-16 box-border relative overflow-visible"
  style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
>
  <!-- Logo & Legal Badges (BPOM & Halal MUI) -->
  <div data-node="logo" class="flex items-center flex-shrink-0">
    <HeaderLogo {props} {sectionId} {isActive} />

    <!-- Badges Highlight (Desktop & Tablet) -->
    {#if !isMobile}
      <div class="flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200 dark:border-slate-800 text-[11px]">
        <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold border border-emerald-200/70 dark:border-emerald-800/70">
          {bpomText}
        </span>
        <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold border border-blue-200/70 dark:border-blue-800/70">
          {halalText}
        </span>
      </div>
    {/if}
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
        class="inline-flex items-center justify-center px-4 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors"
      >
        <span>{ctaText || 'Konsultasi Gratis'}</span>
      </a>
    {/if}

    <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast -->
    {#if isSmallScreen}
      <button
        type="button"
        on:click={onToggleMobileMenu}
        class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-colors cursor-pointer shadow-xs ml-auto"
        aria-label="Buka menu navigasi"
      >
        <Menu size={20} />
      </button>
    {/if}
  </div>
</div>
