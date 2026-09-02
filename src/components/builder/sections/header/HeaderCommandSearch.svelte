<script lang="ts">
  import { Search, MessageCircle, Menu, X, Store } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
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
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  let isMobileSearchOpen = false;
  let searchQuery = '';

  $: waUrl = generateWhatsAppLink(waNumber);
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-3 sm:gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border relative overflow-visible"
  style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px;"
>
  {#if isMobileSearchOpen && isMobile}
    <!-- Mobile Search Inline Expanded View (Replaces full header row) -->
    <div class="flex items-center gap-2.5 w-full animate-in fade-in duration-150">
      <!-- Mini Brand Icon -->
      {#if props.logoImageUrl}
        <img src={props.logoImageUrl} alt="Logo" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
      {:else}
        <div class="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-900">
          <Store size={18} />
        </div>
      {/if}

      <div class="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs border border-slate-300 dark:border-slate-700">
        <Search size={15} class="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari produk di toko..."
          class="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-slate-400"
        />
        {#if searchQuery}
          <button
            type="button"
            on:click={() => (searchQuery = '')}
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Bersihkan input"
          >
            <X size={14} />
          </button>
        {/if}
      </div>

      <!-- Close Button with 44x44px target -->
      <button
        type="button"
        on:click={() => (isMobileSearchOpen = false)}
        class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex-shrink-0"
        aria-label="Tutup pencarian"
      >
        <X size={20} />
      </button>
    </div>
  {:else}
    <!-- Normal View: Logo on Left Margin -->
    <div data-node="logo" class="flex items-center flex-shrink-0">
      <HeaderLogo {props} {sectionId} {isActive} />
    </div>

    <!-- Desktop/Tablet Search Input (Expanded to column boundaries) -->
    {#if !isMobile}
      <div class="flex-1 max-w-lg flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 text-xs border border-slate-200 dark:border-slate-700/80 transition-all mx-4">
        <Search size={15} class="flex-shrink-0 text-slate-400" />
        <span class="flex-1 text-left truncate text-slate-500 dark:text-slate-400">Cari katalog produk...</span>
        {#if isDesktop}
          <kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono text-[10px]">⌘K</kbd>
        {/if}
      </div>
    {/if}

    <!-- Right Controls: Mobile Search Trigger + CTA + Hamburger Button -->
    <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
      <!-- Mobile Search Icon Trigger: 44x44px tap target -->
      {#if isMobile}
        <button
          type="button"
          on:click={() => (isMobileSearchOpen = true)}
          class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-colors cursor-pointer shadow-xs"
          aria-label="Buka pencarian"
        >
          <Search size={18} />
        </button>
      {/if}

      <!-- Desktop CTA -->
      {#if isDesktop}
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
        >
          <MessageCircle size={14} class="mr-1.5" />
          <span>{ctaText}</span>
        </a>
      {/if}

      <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast, Far Right -->
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
  {/if}
</div>
