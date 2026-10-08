<script lang="ts">
  import { Search, MessageCircle, Menu, X, Store } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import TemplateThemeToggle from './TemplateThemeToggle.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { editorStore, canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import {
    sanitizeSearchInput,
    filterCatalogProducts,
    type SearchProduct,
  } from './headerSearch.helpers';
  import { navigateToSection } from './headerNav.helpers';
  import HeaderSearchResultsPopup from './HeaderSearchResultsPopup.svelte';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
  export let navbarOrder: string[] = ['logo', 'search_bar', 'cta'];
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: hasLogo = navbarOrder.includes('logo');
  $: hasSearch = navbarOrder.includes('search_bar');
  $: hasCta = navbarOrder.includes('cta');

  let isMobileSearchOpen = false;
  let rawSearchQuery = '';
  let debouncedQuery = '';
  let hasThreatWarning = false;
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let showResultsPopup = false;

  // Ekstrak katalog produk dari dokumen
  $: catalogSection = $editorStore?.template?.config?.sections?.find(
    (s) => s.type === 'product_catalog'
  );
  $: rawProducts = ((catalogSection?.props?.products as SearchProduct[]) || [
    { name: 'Kopi Robusta Premium', price: 45000, category: 'Minuman' },
    { name: 'Keripik Tempe Renyah', price: 18000, category: 'Snack' },
    { name: 'Sambal Bawang Istimewa', price: 25000, category: 'Kuliner' },
    { name: 'Batik Tulis Handmade', price: 150000, category: 'Fashion' },
  ]) as SearchProduct[];

  $: searchResults = filterCatalogProducts(rawProducts, debouncedQuery);

  function handleSearchInput(e: Event) {
    const val = (e.currentTarget as HTMLInputElement).value;
    rawSearchQuery = val;

    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    // Lazy Search: Tunggu pengguna benar-benar berhenti mengetik (350ms)
    searchDebounceTimer = setTimeout(() => {
      const { cleanQuery, hasThreat } = sanitizeSearchInput(rawSearchQuery);
      hasThreatWarning = hasThreat;
      debouncedQuery = cleanQuery;
      showResultsPopup = cleanQuery.length > 0;
    }, 350);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      showResultsPopup = false;
      navigateToSection(e, 'produk');
    } else if (e.key === 'Escape') {
      showResultsPopup = false;
    }
  }

  function handleSelectProduct(e: MouseEvent, _prod: SearchProduct) {
    showResultsPopup = false;
    isMobileSearchOpen = false;
    navigateToSection(e, 'produk');
  }

  function clearSearch() {
    rawSearchQuery = '';
    debouncedQuery = '';
    hasThreatWarning = false;
    showResultsPopup = false;
  }

  $: waUrl = generateWhatsAppLink(waNumber, (props?.whatsappTemplate as string) || '');
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-3 sm:gap-4 border-b min-h-[64px] box-border relative overflow-visible"
  style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); height: 64px; max-width: var(--theme-max-width, var(--active-max-width, 1200px)); border-bottom-color: var(--color-border); font-family: var(--theme-font-body, inherit);"
>
  {#if isMobileSearchOpen && isMobile}
    <!-- Mobile Search Inline Expanded View -->
    <div class="flex items-center gap-2.5 w-full animate-in fade-in duration-150 relative">
      {#if props.logoImageUrl}
        <img
          src={props.logoImageUrl}
          alt="Logo"
          style="border-radius: 6px;"
          class="w-8 h-8 object-cover flex-shrink-0"
        />
      {:else}
        <div
          style="border-radius: 6px; background-color: color-mix(in srgb, var(--theme-primary, var(--color-primary)) 12%, transparent); color: var(--theme-primary, var(--color-primary)); border: 1px solid color-mix(in srgb, var(--theme-primary, var(--color-primary)) 25%, transparent);"
          class="w-8 h-8 flex items-center justify-center flex-shrink-0"
        >
          <Store size={18} />
        </div>
      {/if}

      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
        class="flex-1 flex items-center gap-2 px-3 py-1.5 text-xs relative"
      >
        <Search size={15} style="color: var(--theme-text-muted, var(--color-text-muted));" class="flex-shrink-0" />
        <input
          type="text"
          value={rawSearchQuery}
          on:input={handleSearchInput}
          on:keydown={handleKeydown}
          placeholder="Cari produk di toko..."
          class="flex-1 bg-transparent text-xs focus:outline-none placeholder:opacity-60"
        />
        {#if rawSearchQuery}
          <button
            type="button"
            on:click={clearSearch}
            style="color: var(--theme-text-muted, var(--color-text-muted));"
            class="hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Bersihkan input"
          >
            <X size={14} />
          </button>
        {/if}
      </div>

      <!-- Close Button with 44x44px target -->
      <button
        type="button"
        on:click={() => {
          isMobileSearchOpen = false;
          showResultsPopup = false;
        }}
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); border: 1px solid var(--color-border); background-color: var(--theme-surface, var(--color-card-base, transparent)); color: var(--theme-text-primary, var(--color-text-main));"
        class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer hover:bg-[var(--color-nested-base)]"
        aria-label="Tutup pencarian"
      >
        <X size={20} />
      </button>

      <!-- Mobile Search Results Popup -->
      {#if showResultsPopup}
        <HeaderSearchResultsPopup
          {searchResults}
          {debouncedQuery}
          {hasThreatWarning}
          onSelectProduct={handleSelectProduct}
          onViewAll={(e) => {
            showResultsPopup = false;
            isMobileSearchOpen = false;
            navigateToSection(e, 'produk');
          }}
          isMobile={true}
        />
      {/if}
    </div>
  {:else}
    <!-- Normal View: Logo on Left Margin -->
    {#if hasLogo}
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
    {/if}

    <!-- Desktop/Tablet Search Input with Lazy Search -->
    {#if hasSearch && !isMobile}
      <div class="relative flex-1 max-w-lg mx-4">
        <div
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--color-nested-base); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
          class="w-full flex items-center gap-2.5 px-3.5 py-1.5 text-xs transition-all"
        >
          <Search size={15} style="color: var(--theme-text-muted, var(--color-text-muted));" class="flex-shrink-0" />
          <input
            type="text"
            value={rawSearchQuery}
            on:input={handleSearchInput}
            on:keydown={handleKeydown}
            on:focus={() => {
              if (debouncedQuery) showResultsPopup = true;
            }}
            placeholder="Cari katalog produk..."
            class="flex-1 bg-transparent text-xs focus:outline-none placeholder:opacity-60"
          />
          {#if rawSearchQuery}
            <button
              type="button"
              on:click={clearSearch}
              style="color: var(--theme-text-muted, var(--color-text-muted));"
              class="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Bersihkan input"
            >
              <X size={14} />
            </button>
          {/if}
          {#if isDesktop && !rawSearchQuery}
            <kbd
              style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 8px)) * 0.5); border-color: var(--color-border); color: var(--theme-text-muted, var(--color-text-muted));"
              class="kbd kbd-xs font-mono text-[10px]"
            >⌘K</kbd>
          {/if}
        </div>

        <!-- Desktop Lazy Search Live Results Popover -->
        {#if showResultsPopup}
          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
          <div class="fixed inset-0 z-40 bg-transparent" on:click={() => (showResultsPopup = false)}></div>
          <HeaderSearchResultsPopup
            {searchResults}
            {debouncedQuery}
            {hasThreatWarning}
            onSelectProduct={handleSelectProduct}
            onViewAll={(e) => {
              showResultsPopup = false;
              navigateToSection(e, 'produk');
            }}
            isMobile={false}
          />
        {/if}
      </div>
    {/if}

    <!-- Right Controls: Mobile Search Trigger + CTA + Hamburger Button -->
    <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
      <!-- Mobile Search Icon Trigger: 44x44px tap target -->
      {#if hasSearch && isMobile}
        <button
          type="button"
          on:click={() => (isMobileSearchOpen = true)}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); border: 1px solid var(--color-border); background-color: var(--theme-surface, var(--color-card-base, transparent)); color: var(--theme-text-primary, var(--color-text-main));"
          class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer shadow-xs hover:bg-[var(--color-nested-base)]"
          aria-label="Buka pencarian"
        >
          <Search size={18} />
        </button>
      {/if}

      <!-- Theme Toggle (Sebelum tombol CTA) -->
      <TemplateThemeToggle size="sm" />

      <!-- Desktop CTA -->
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

      <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast, Far Right -->
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
  {/if}
</div>
