<script lang="ts">
  import { Menu, X } from 'lucide-svelte';
  import { editorStore, canvasStore, activeNodeId } from '../../stores/editorStore';
  import type { HeaderAnnouncementProps } from '@/types';
  import {
    navigateToSection,
    resolveNavFontSize,
    resolveColorTokenMatch,
    NAV_COLOR_TOKENS,
    NAV_HOVER_COLOR_TOKENS,
  } from './headerNav.helpers';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let onlyDesktop: boolean = false;

  $: isMobileView = $canvasStore?.viewMode === 'mobile' || $canvasStore?.viewMode === 'tablet';
  $: navLinks = Array.isArray(props?.navLinks) ? props.navLinks : ['Beranda', 'Produk', 'Tentang', 'Kontak'];
  $: navGap = props.navGap || '16px';
  $: navColorVal = (props.navColor as string) || NAV_COLOR_TOKENS[0].value;
  $: navHoverColorVal = (props.navHoverColor as string) || NAV_HOVER_COLOR_TOKENS[0].value;
  $: activeNavColor = resolveColorTokenMatch(navColorVal, NAV_COLOR_TOKENS, NAV_COLOR_TOKENS[0].value);
  $: activeNavHoverColor = resolveColorTokenMatch(navHoverColorVal, NAV_HOVER_COLOR_TOKENS, NAV_HOVER_COLOR_TOKENS[0].value);
  $: activeFontSize = nodeStyles.fontSize || resolveNavFontSize(props.navTypographyToken as string);
  $: activeTextTransform = props.navTextTransform || 'none';
  $: activeFontWeight = nodeStyles.fontWeight || 'var(--text-body-weight, 500)';
  $: ctaText = props.ctaText || '';
  $: ctaLink = props.ctaLink || '#';

  $: nodeStyles = props?.nodeStyles?.nav_links || {};
  $: isNodeActive = isActive && ($activeNodeId === 'nav_links' || ($activeNodeId && $activeNodeId.startsWith('nav_')));

  let isMobileMenuOpen = false;
  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  const gapValueMap: Record<string, string> = {
    compact: '12px',
    normal: '16px',
    relaxed: '24px',
  };

  $: gapPx = typeof navGap === 'number' ? `${navGap}px` : gapValueMap[navGap] || navGap || '16px';

  $: navStyleString = [
    `gap: ${gapPx}`,
    nodeStyles.fontFamily ? `font-family: ${nodeStyles.fontFamily}` : 'font-family: var(--theme-font-body, inherit)',
  ].filter(Boolean).join('; ');

  const handleNavContainerClick = (e: MouseEvent) => {
    e.stopPropagation();
    editorStore.selectNode(sectionId, 'nav_links');
  };

  const handleNavContainerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      editorStore.selectNode(sectionId, 'nav_links');
    }
  };

  const onDragStart = (e: DragEvent, index: number) => {
    if (!isActive) return;
    draggedIdx = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    }
  };

  const onDragOver = (e: DragEvent, index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;
    e.preventDefault();
    dropTargetIdx = index;
  };

  const onDrop = (e: DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      draggedIdx = null;
      dropTargetIdx = null;
      return;
    }
    const list = [...navLinks];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, moved);
    editorStore.updateSectionProps(sectionId, { navLinks: list });
    draggedIdx = null;
    dropTargetIdx = null;
  };
</script>

<div
  role="button"
  tabindex="0"
  aria-label="Header Navigation"
  on:click={handleNavContainerClick}
  on:keydown={handleNavContainerKeyDown}
  class={`relative flex items-center justify-end rounded-lg transition-all cursor-pointer ${
    isNodeActive
      ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] bg-[var(--theme-primary,var(--color-primary))]/10'
      : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary,var(--color-primary))]/40'
  }`}
>
  <!-- Desktop / Wide Viewport Navigation Links -->
  <nav
    style={navStyleString}
    class={`hidden ${isMobileView ? '' : 'sm:flex'} items-center max-w-full flex-wrap`}
  >
    {#each navLinks as link, index (link + index)}
      <span
        role="button"
        tabindex="0"
        draggable={isActive}
        on:dragstart={(e) => onDragStart(e, index)}
        on:dragover={(e) => onDragOver(e, index)}
        on:dragleave={() => (dropTargetIdx = null)}
        on:drop={(e) => onDrop(e, index)}
        on:click={(e) => {
          if (draggedIdx === null) navigateToSection(e, link);
        }}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigateToSection(e, link);
        }}
        style="--nav-item-color: {activeNavColor}; --nav-item-hover-color: {activeNavHoverColor}; --nav-item-size: {activeFontSize}; --nav-item-weight: {activeFontWeight}; --nav-item-transform: {activeTextTransform};"
        class={`builder-header-nav-link whitespace-nowrap px-1.5 py-1 rounded cursor-pointer select-none ${
          isActive ? 'cursor-grab active:cursor-grabbing' : ''
        } ${dropTargetIdx === index ? 'border-l-2 border-blue-500 pl-1' : ''} ${
          draggedIdx === index ? 'opacity-30' : ''
        }`}
      >
        {link}
      </span>
    {/each}

    {#if ctaText}
      <a
        href={ctaLink}
        style="height: var(--theme-btn-height, 36px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px));"
        class="ml-2 px-3.5 inline-flex items-center justify-center font-bold shadow-sm transition-all hover:brightness-105 active:scale-95 whitespace-nowrap cursor-pointer"
      >
        {ctaText}
      </a>
    {/if}
  </nav>

  {#if !onlyDesktop}
    <!-- Mobile / Tablet Hamburger Button -->
    <div class={`flex ${isMobileView ? '' : 'sm:hidden'} items-center gap-2`}>
      {#if ctaText}
        <a
          href={ctaLink}
          style="height: 32px; border-radius: var(--theme-btn-radius, var(--btn-radius, 6px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, 11px);"
          class="px-2.5 inline-flex items-center justify-center font-bold whitespace-nowrap shadow-xs cursor-pointer"
        >
          {ctaText}
        </a>
      {/if}
      <button
        type="button"
        on:click={(e) => {
          e.stopPropagation();
          isMobileMenuOpen = !isMobileMenuOpen;
        }}
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); color: var(--theme-text-primary, var(--color-text-main)); border: 1px solid var(--color-border); background: var(--color-card-base, var(--theme-surface, transparent)); font-family: var(--theme-font-body, inherit);"
        aria-label="Toggle navigation menu"
        class="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer shadow-xs"
      >
        {#if isMobileMenuOpen}
          <X size={20} />
        {:else}
          <Menu size={20} />
        {/if}
      </button>
    </div>

    <!-- Mobile Dropdown Drawer -->
    {#if isMobileMenuOpen}
      <div
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--theme-surface, var(--color-card-base, white)); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
        class="absolute right-0 top-full mt-2 w-56 shadow-xl p-3 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150"
      >
        {#each navLinks as link, index (link + index)}
          <span
            role="button"
            tabindex="0"
            on:click={(e) => {
              isMobileMenuOpen = false;
              navigateToSection(e, link);
            }}
            on:keydown={(e) => {
              if (e.key === 'Enter') {
                isMobileMenuOpen = false;
                navigateToSection(e, link);
              }
            }}
            style="--nav-item-color: {activeNavColor}; --nav-item-hover-color: {activeNavHoverColor}; --nav-item-size: {activeFontSize}; --nav-item-transform: {activeTextTransform}; border-radius: var(--theme-btn-radius, var(--btn-radius, 6px));"
            class="builder-header-nav-link px-2.5 py-1.5 hover:bg-[var(--color-nested-base)] cursor-pointer block truncate"
          >
            {link}
          </span>
        {/each}
        {#if ctaText}
          <a
            href={ctaLink}
            on:click={() => (isMobileMenuOpen = false)}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-btn-primary-bg, var(--theme-primary, var(--color-primary))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-body, 14px);"
            class="mt-1 w-full text-center px-3 py-2 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all block cursor-pointer"
          >
            {ctaText}
          </a>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style>
  .builder-header-nav-link {
    color: var(--nav-item-color);
    font-size: var(--nav-item-size);
    font-weight: var(--nav-item-weight, 500);
    font-family: var(--theme-font-body, var(--font-family, inherit));
    text-transform: var(--nav-item-transform, none);
    transition: color 0.15s ease, opacity 0.15s ease, transform 0.15s ease;
  }
  .builder-header-nav-link:hover {
    color: var(--nav-item-hover-color) !important;
  }
</style>
