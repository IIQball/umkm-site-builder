<script lang="ts">
  import { ChevronDown, MessageCircle, Menu } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import { navigateToSection } from './headerNav.helpers';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
  export let categories: Array<{ id?: string; name: string; slug?: string; description?: string; href?: string }> = [];
  export let navbarOrder: string[] = ['logo', 'nav_links', 'cta'];
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: hasLogo = navbarOrder.includes('logo');
  $: hasNav = navbarOrder.includes('nav_links');
  $: hasCta = navbarOrder.includes('cta');

  let showMegaMenu = false;

  $: navLinks = Array.isArray(props?.navLinks) && props.navLinks.length > 0
    ? props.navLinks
    : ['Beranda', 'Produk', 'Tentang', 'Kontak'];

  $: defaultCategories = [
    { name: 'Makanan', description: 'Kuliner & Snack', href: '#produk' },
    { name: 'Fashion', description: 'Pakaian & Batik', href: '#produk' },
    { name: 'Kerajinan', description: 'Handmade UMKM', href: '#produk' },
    { name: 'Minuman', description: 'Kopi & Herbal', href: '#produk' },
  ];

  // Kategori toko tenant otomatis didahulukan; desainer builder menggunakan props.categories
  $: displayCategories = (Array.isArray(categories) && categories.length > 0)
    ? categories
    : ((Array.isArray(props?.categories) && props.categories.length > 0)
        ? props.categories
        : defaultCategories);

  $: waUrl = generateWhatsAppLink(waNumber, (props?.whatsappTemplate as string) || '');
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b min-h-[64px] box-border relative overflow-visible"
  style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px; max-width: var(--theme-max-width, var(--active-max-width, 1200px)); border-bottom-color: var(--color-border); font-family: var(--theme-font-body, inherit);"
>
  <!-- Logo on Far Left Margin -->
  {#if hasLogo}
    <div data-node="logo" class="flex items-center flex-shrink-0">
      <HeaderLogo {props} {sectionId} {isActive} />
    </div>
  {/if}

  <!-- Desktop Navigation with Mega Menu Dropdown -->
  {#if hasNav && isDesktop}
    <div class="flex items-center gap-6">
      <div class="relative">
        <button
          type="button"
          on:click={() => (showMegaMenu = !showMegaMenu)}
          style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); font-weight: var(--text-body-weight, 500); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
          class="flex items-center gap-1 hover:text-[var(--theme-primary,var(--color-primary))] cursor-pointer py-2 transition-colors"
        >
          <span>Kategori Produk</span>
          <ChevronDown size={14} class={`transition-transform duration-150 ${showMegaMenu ? 'rotate-180 text-[var(--theme-primary,var(--color-primary))]' : ''}`} />
        </button>

        {#if showMegaMenu}
          <!-- Backdrop for dropdown -->
          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
          <div
            class="fixed inset-0 z-40 cursor-default bg-transparent"
            on:click={() => (showMegaMenu = false)}></div>
          <div
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--theme-surface, var(--color-card-base, white)); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
            class="absolute top-full left-0 mt-2 w-80 p-4 shadow-2xl z-50 grid grid-cols-2 gap-3 text-left animate-in fade-in zoom-in-95 duration-150"
          >
            {#each displayCategories as cat}
              <a
                href={cat.href || '#produk'}
                on:click={(e) => {
                  showMegaMenu = false;
                  navigateToSection(e, cat.href || '#produk');
                }}
                style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 8px)) * 0.75);"
                class="p-2.5 hover:bg-[var(--color-nested-base)] transition-colors block cursor-pointer"
              >
                <span
                  style="font-family: var(--theme-font-heading, inherit); color: var(--theme-text-primary, var(--color-text-main)); font-size: var(--theme-text-caption, 12px); font-weight: var(--text-h3-weight, 600);"
                  class="block"
                >{cat.name}</span>
                {#if cat.description}
                  <span
                    style="color: var(--theme-text-muted, var(--color-text-muted)); font-size: calc(var(--theme-text-caption, 12px) * 0.85);"
                    class="block"
                  >{cat.description}</span>
                {/if}
              </a>
            {/each}
          </div>
        {/if}
      </div>

      {#each navLinks as link}
        <a
          href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
          on:click={(e) => navigateToSection(e, link)}
          style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); font-weight: var(--text-body-weight, 500); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
          class="hover:text-[var(--theme-primary,var(--color-primary))] transition-colors cursor-pointer"
        >
          {link}
        </a>
      {/each}
    </div>
  {/if}

  <!-- Right Controls: Desktop CTA & Mobile Hamburger -->
  <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
    {#if hasCta && isDesktop}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px)); border: none;"
        class="inline-flex items-center justify-center px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
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
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); border: 1px solid var(--color-border); background-color: var(--theme-surface, var(--color-card-base, transparent)); color: var(--theme-text-primary, var(--color-text-main));"
        class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer shadow-xs ml-auto hover:bg-[var(--color-nested-base)]"
        aria-label="Buka menu navigasi"
      >
        <Menu size={20} />
      </button>
    {/if}
  </div>
</div>
