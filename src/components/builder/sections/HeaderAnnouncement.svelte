<script lang="ts">
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types';
  import { editorStore, activeNodeId, activeSection } from '../stores/editorStore';
  import AnnouncementBar from './header/AnnouncementBar.svelte';
  import HeaderLogo from './header/HeaderLogo.svelte';
  import HeaderNav from './header/HeaderNav.svelte';
  import HeroElementToolbar from './hero/HeroElementToolbar.svelte';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: isSectionSelected = isActive || $activeSection?.id === sectionId;
  $: hasCustomBg = !!styles?.backgroundColor;
  $: nodeStylesMap = props?.nodeStyles || {};

  const defaultPositions: Record<string, { x: number; y: number; w: number }> = {
    logo: { x: 4, y: 12, w: 30 },
    nav_links: { x: 50, y: 12, w: 46 },
  };

  let isDraggingNode = false;
  let isResizingNode = false;
  let currentKey: string | null = null;
  let startX = 0;
  let startY = 0;
  let initialNodeX = 0;
  let initialNodeY = 0;
  let initialNodeW = 0;
  let resizeTooltip = '';

  const getNodePos = (key: string) => {
    const custom = (nodeStylesMap[key] || {}) as Record<string, string | undefined>;
    const fallback = defaultPositions[key] || { x: 5, y: 10, w: 40 };
    return {
      x: custom.left !== undefined ? parseFloat(custom.left) : fallback.x,
      y: custom.top !== undefined ? parseFloat(custom.top) : fallback.y,
      w: custom.width !== undefined ? parseFloat(custom.width) : fallback.w,
    };
  };

  const handlePointerDown = (e: PointerEvent, key: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('.resize-handle') || target.closest('.toolbar-btn')) return;
    e.stopPropagation();
    editorStore.selectSection(sectionId);
    editorStore.selectNode(sectionId, key);

    isDraggingNode = true;
    currentKey = key;
    startX = e.clientX;
    startY = e.clientY;
    const pos = getNodePos(key);
    initialNodeX = pos.x;
    initialNodeY = pos.y;

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!isDraggingNode || !currentKey) return;
      const dx = moveEv.clientX - startX;
      const dy = moveEv.clientY - startY;
      const container = document.getElementById(`section-header-nav-${sectionId}`);
      const containerWidth = container?.offsetWidth || 1000;
      const dxPercent = (dx / containerWidth) * 100;
      const newX = Math.max(0, Math.min(95, initialNodeX + dxPercent));
      const newY = Math.max(0, initialNodeY + dy);

      editorStore.updateNodeStyles(sectionId, currentKey, {
        left: `${newX.toFixed(1)}%`,
        top: `${newY.toFixed(0)}px`,
        position: 'absolute',
      });
    };

    const onPointerUp = () => {
      isDraggingNode = false;
      currentKey = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const startNodeResize = (e: PointerEvent, key: string, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingNode = true;
    currentKey = key;
    startX = e.clientX;
    startY = e.clientY;
    const pos = getNodePos(key);
    initialNodeW = pos.w;

    const onPointerMove = (moveEv: PointerEvent) => {
      const dx = moveEv.clientX - startX;
      const container = document.getElementById(`section-header-nav-${sectionId}`);
      const containerWidth = container?.offsetWidth || 1000;
      const dxPercent = (dx / containerWidth) * 100;

      let newW = initialNodeW;
      if (handle === 'e' || handle === 'se' || handle === 'ne') {
        newW = Math.max(10, Math.min(100, initialNodeW + dxPercent));
      } else if (handle === 'w' || handle === 'sw' || handle === 'nw') {
        newW = Math.max(10, Math.min(100, initialNodeW - dxPercent));
      }

      resizeTooltip = `Lebar: ${newW.toFixed(0)}%`;
      editorStore.updateNodeStyles(sectionId, key, { width: `${newW.toFixed(1)}%` });
    };

    const onPointerUp = () => {
      isResizingNode = false;
      resizeTooltip = '';
      currentKey = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };
</script>

<div class="w-full flex flex-col box-border select-none">
  <!-- 1. Top Full-Width Row: Announcement Bar -->
  <AnnouncementBar {props} {sectionId} {isActive} />

  <!-- 2. Main Header Navbar Row: Canvas Fleksibel Bebas Atur Posisi & Ukuran -->
  <div
    id={`section-header-nav-${sectionId}`}
    class={`relative w-full border-b box-border transition-colors min-h-[70px] ${
      hasCustomBg ? '' : 'bg-white border-slate-200/80'
    }`}
  >
    <!-- Node: Logo Brand -->
    {#each ['logo'] as key (key)}
      {@const isLogoActive = isSectionSelected && $activeNodeId === 'logo'}
      {@const posLogo = getNodePos('logo')}
      <div
        role="button"
        tabindex="0"
        on:pointerdown|capture={(e) => handlePointerDown(e, 'logo')}
        style="left: {posLogo.x}%; top: {posLogo.y}px; width: {posLogo.w}%; position: absolute;"
        class="group/elem transition-shadow cursor-move z-10 {
          isLogoActive ? 'ring-2 ring-blue-500 rounded-lg shadow-lg bg-blue-500/5 !z-30' : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/60 rounded-lg'
        }"
      >
        {#if isLogoActive}
          <HeroElementToolbar
            nodeKey="logo"
            index={0}
            total={2}
            {sectionId}
            {isResizingNode}
            {resizeTooltip}
            onMoveElement={() => {}}
            onStartResize={startNodeResize}
          />
        {/if}
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
    {/each}

    <!-- Node: Navigation Menu -->
    {#each ['nav_links'] as key (key)}
      {@const isNavActive = isSectionSelected && ($activeNodeId === 'nav_links' || ($activeNodeId && $activeNodeId.startsWith('nav_')))}
      {@const posNav = getNodePos('nav_links')}
      <div
        role="button"
        tabindex="0"
        on:pointerdown|capture={(e) => handlePointerDown(e, 'nav_links')}
        style="left: {posNav.x}%; top: {posNav.y}px; width: {posNav.w}%; position: absolute;"
        class="group/elem transition-shadow cursor-move z-10 {
          isNavActive ? 'ring-2 ring-blue-500 rounded-lg shadow-lg bg-blue-500/5 !z-30' : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/60 rounded-lg'
        }"
      >
        {#if isNavActive}
          <HeroElementToolbar
            nodeKey="nav_links"
            index={1}
            total={2}
            {sectionId}
            {isResizingNode}
            {resizeTooltip}
            onMoveElement={() => {}}
            onStartResize={startNodeResize}
          />
        {/if}
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
    {/each}
  </div>
</div>