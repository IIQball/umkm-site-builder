<script lang="ts">
  import { ChevronDown, MessageCircle, Menu } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
  export let categories: Array<{ name: string; description?: string; href?: string }> = [];
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  let showMegaMenu = false;

  $: navLinks = Array.isArray(props?.navLinks) && props.navLinks.length > 0
    ? props.navLinks
    : ['Beranda', 'Produk', 'Tentang', 'Kontak'];

  $: defaultCategories = [
    { name: 'Makanan', description: 'Kuliner & Snack', href: '#products' },
    { name: 'Fashion', description: 'Pakaian & Batik', href: '#products' },
    { name: 'Kerajinan', description: 'Handmade UMKM', href: '#products' },
    { name: 'Minuman', description: 'Kopi & Herbal', href: '#products' },
  ];

  $: displayCategories = (Array.isArray(categories) && categories.length > 0)
    ? categories
    : ((props?.categories as any[]) || defaultCategories);

  $: waUrl = generateWhatsAppLink(waNumber);
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border relative overflow-visible"
  style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px;"
>
  <!-- Logo on Far Left Margin -->
  <div data-node="logo" class="flex items-center flex-shrink-0">
    <HeaderLogo {props} {sectionId} {isActive} />
  </div>

  <!-- Desktop Navigation with Mega Menu Dropdown -->
  {#if isDesktop}
    <div class="flex items-center gap-6 text-xs font-semibold">
      <div class="relative">
        <button
          type="button"
          on:click={() => (showMegaMenu = !showMegaMenu)}
          class="flex items-center gap-1 hover:text-[var(--theme-primary,#2563eb)] cursor-pointer text-slate-700 dark:text-slate-200 py-2"
        >
          <span>Kategori Produk</span>
          <ChevronDown size={14} class={`transition-transform duration-150 ${showMegaMenu ? 'rotate-180 text-blue-600' : ''}`} />
        </button>

        {#if showMegaMenu}
          <!-- Backdrop for dropdown -->
          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
          <div
            class="fixed inset-0 z-40 cursor-default bg-transparent"
            on:click={() => (showMegaMenu = false)}
          />
          <div class="absolute top-full left-0 mt-2 w-80 p-4 rounded-2xl bg-[var(--theme-surface,white)] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 grid grid-cols-2 gap-3 text-left animate-in fade-in zoom-in-95 duration-150">
            {#each displayCategories as cat}
              <a
                href={cat.href || '#products'}
                on:click={() => (showMegaMenu = false)}
                class="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors block"
              >
                <span class="font-bold text-xs block text-slate-900 dark:text-white">{cat.name}</span>
                {#if cat.description}
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">{cat.description}</span>
                {/if}
              </a>
            {/each}
          </div>
        {/if}
      </div>

      {#each navLinks as link}
        <a
          href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
          class="text-slate-700 dark:text-slate-200 hover:text-[var(--theme-primary,#2563eb)] transition-colors"
        >
          {link}
        </a>
      {/each}
    </div>
  {/if}

  <!-- Right Controls: Desktop CTA & Mobile Hamburger -->
  <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
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

    <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast, Far Right Margin -->
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
