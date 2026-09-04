<script lang="ts">
  import { MessageCircle, Menu } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: waUrl = generateWhatsAppLink(waNumber);
</script>

<div class="w-full py-3 box-border overflow-visible flex items-center">
  <div
    id={`section-header-nav-${sectionId}`}
    class="h-14 px-3.5 sm:px-6 rounded-full bg-[var(--theme-surface,white)]/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between gap-3 sm:gap-4 box-border relative z-20"
    style="margin-left: var(--active-margin, var(--active-safe-zone, 24px)); margin-right: var(--active-margin, var(--active-safe-zone, 24px)); width: calc(100% - (var(--active-margin, var(--active-safe-zone, 24px)) * 2));"
  >
    <!-- Logo on Far Left inside Capsule -->
    <div data-node="logo" class="flex items-center flex-shrink-0">
      <HeaderLogo {props} {sectionId} {isActive} />
    </div>

    <!-- Desktop Nav Links -->
    {#if isDesktop}
      <div data-node="nav_links" class="flex-1 flex items-center justify-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
      </div>
    {/if}

    <!-- Right Controls: CTA (Desktop) + Hamburger (Tablet & Mobile, Far Right inside Capsule) -->
    <div class="flex items-center gap-2 flex-shrink-0">
      {#if isDesktop}
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 38px); border-radius: 9999px; background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
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
          class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 dark:text-slate-100 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-full transition-colors cursor-pointer shadow-xs"
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>
      {/if}
    </div>
  </div>
</div>
