<script lang="ts">
  import { Menu, X } from 'lucide-svelte';
  import { editorStore, activeNodeId } from '../../stores/editorStore';
  import type { HeaderAnnouncementProps } from '@/types';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: isMobileView = $editorStore?.viewMode === 'mobile' || $editorStore?.viewMode === 'tablet';
  $: navLinks = Array.isArray(props?.navLinks) ? props.navLinks : ['Beranda', 'Produk', 'Tentang', 'Kontak'];
  $: navGap = props.navGap || 'normal';
  $: navFontSize = props.navFontSize || '14px';
  $: navFontWeight = props.navFontWeight || '500';
  $: navTextTransform = props.navTextTransform || 'none';
  $: navColor = props.navColor || '#475569';
  $: navHoverColor = props.navHoverColor || '#2563eb';
  $: ctaText = props.ctaText || '';
  $: ctaLink = props.ctaLink || '#';

  $: nodeStyles = props?.nodeStyles?.nav_links || {};
  $: isNodeActive = isActive && ($activeNodeId === 'nav_links' || ($activeNodeId && $activeNodeId.startsWith('nav_')));

  let isMobileMenuOpen = false;
  let hoveredIdx: number | null = null;
  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  const gapValueMap: Record<string, string> = {
    compact: '12px',
    normal: '20px',
    relaxed: '32px',
  };

  $: gapPx = typeof navGap === 'number' ? `${navGap}px` : gapValueMap[navGap] || navGap || '20px';

  $: navStyleString = [
    `gap: ${gapPx}`,
    nodeStyles.fontFamily ? `font-family: ${nodeStyles.fontFamily}` : '',
  ].filter(Boolean).join('; ');

  const getLinkStyle = (index: number) => {
    const isHovered = hoveredIdx === index;
    const color = isHovered ? navHoverColor : (nodeStyles.color || navColor);
    return [
      `color: ${color}`,
      `font-size: ${nodeStyles.fontSize || navFontSize}`,
      `font-weight: ${nodeStyles.fontWeight || navFontWeight}`,
      `text-transform: ${navTextTransform}`,
      'transition: color 0.15s ease, transform 0.15s ease',
    ].filter(Boolean).join('; ');
  };

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
  class={`relative flex items-center justify-end rounded-lg p-1 transition-all cursor-pointer ${
    isNodeActive
      ? 'ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
      : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/40'
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
        on:mouseenter={() => (hoveredIdx = index)}
        on:mouseleave={() => (hoveredIdx = null)}
        on:dragstart={(e) => onDragStart(e, index)}
        on:dragover={(e) => onDragOver(e, index)}
        on:dragleave={() => (dropTargetIdx = null)}
        on:drop={(e) => onDrop(e, index)}
        style={getLinkStyle(index)}
        class={`whitespace-nowrap px-1.5 py-1 rounded cursor-pointer select-none ${
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
        class="ml-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
      >
        {ctaText}
      </a>
    {/if}
  </nav>

  <!-- Mobile / Tablet Hamburger Button -->
  <div class={`flex ${isMobileView ? '' : 'sm:hidden'} items-center gap-2`}>
    {#if ctaText}
      <a
        href={ctaLink}
        class="px-2.5 py-1 bg-blue-600 text-white rounded-md text-[11px] font-semibold whitespace-nowrap"
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
      aria-label="Toggle navigation menu"
      class="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
      class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150"
    >
      {#each navLinks as link, index (link + index)}
        <span
          role="button"
          tabindex="0"
          on:click={() => (isMobileMenuOpen = false)}
          on:keydown={(e) => e.key === 'Enter' && (isMobileMenuOpen = false)}
          style={getLinkStyle(index)}
          class="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer block truncate"
        >
          {link}
        </span>
      {/each}
      {#if ctaText}
        <a
          href={ctaLink}
          on:click={() => (isMobileMenuOpen = false)}
          class="mt-1 w-full text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors block"
        >
          {ctaText}
        </a>
      {/if}
    </div>
  {/if}
</div>
