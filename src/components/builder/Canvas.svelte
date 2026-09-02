<script lang="ts">
  import { onDestroy } from 'svelte';
  import SectionRenderer from './sections/SectionRenderer.svelte';
  import LayoutGridOverlay from './LayoutGridOverlay.svelte';
  import CanvasSpacingHandles from './canvas/CanvasSpacingHandles.svelte';
  import type { TemplateSection, TemplateTheme } from '@/schemas';
  import { editorStore, canvasStore } from './stores/editorStore';
  import { buildCanvasCssVars } from './canvas/canvasCss.helpers';

  export let sections: TemplateSection[] = [];
  export let selectedSectionId: string | null = null;
  export let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  export let onSelectSection: (id: string) => void;

  let isDraggingSpacing = false;
  let dragStartY = 0;
  let dragStartX = 0;
  let startValue = 0;
  let currentDragTooltip = '';
  let transientStyles: Record<string, Record<string, string>> = {};
  let activeCleanup: (() => void) | null = null;

  onDestroy(() => {
    if (activeCleanup) {
      activeCleanup();
    }
  });

  $: renderedSections = sections.map((s) => {
    const override = transientStyles[s.id];
    if (!override) return s;
    return {
      ...s,
      styles: {
        ...(s.styles || {}),
        ...override,
      },
    };
  });

  let containerWidth = 0;
  let canvasHeight = 0;

  $: targetWidth = viewMode === 'desktop' ? 1200 : viewMode === 'tablet' ? 768 : 375;
  $: paddingHorizontal = 48;
  $: availableWidth = Math.max(0, containerWidth - paddingHorizontal);
  $: autoScale = (availableWidth > 0 && availableWidth < targetWidth)
    ? (availableWidth / targetWidth)
    : 1;
  $: userZoom = ($canvasStore.zoom && $canvasStore.zoom !== 100) ? ($canvasStore.zoom / 100) : 1;
  $: scaleRatio = Number(Math.min(1, Math.max(0.1, autoScale * userZoom)).toFixed(4));

  $: theme = ($editorStore.template?.config.theme || {}) as TemplateTheme;
  $: isDarkPreview = $canvasStore.previewTheme === 'dark';
  $: canvasCssVars = buildCanvasCssVars(theme, isDarkPreview, viewMode);

  const parsePx = (val: unknown, defaultVal: number = 0): number => {
    if (typeof val !== 'string' && typeof val !== 'number') return defaultVal;
    return parseInt(String(val), 10) || defaultVal;
  };

  const handleStartDrag = (
    e: MouseEvent,
    section: TemplateSection,
    type: 'padding-top' | 'padding-bottom' | 'padding-horizontal' | 'margin-top' | 'margin-bottom'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    isDraggingSpacing = true;
    dragStartY = e.clientY;
    dragStartX = e.clientX;

    const styles = section.styles || {};
    if (type === 'padding-top') {
      startValue = parsePx(styles.paddingTop ?? (styles.padding ? styles.padding.split(' ')[0] : '0px'), 0);
    } else if (type === 'padding-bottom') {
      startValue = parsePx(styles.paddingBottom ?? (styles.padding ? styles.padding.split(' ')[0] : '0px'), 0);
    } else if (type === 'padding-horizontal') {
      startValue = parsePx(styles.paddingLeft ?? (styles.padding ? (styles.padding.split(' ')[1] || styles.padding.split(' ')[0]) : '0px'), 0);
    } else if (type === 'margin-top') {
      startValue = parsePx(styles.marginTop ?? '0px', 0);
    } else if (type === 'margin-bottom') {
      startValue = parsePx(styles.marginBottom ?? '0px', 0);
    }

    currentDragTooltip = `${type}: ${startValue}px`;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let delta = 0;
      if (type === 'padding-top' || type === 'margin-top') {
        delta = moveEvent.clientY - dragStartY;
      } else if (type === 'padding-bottom' || type === 'margin-bottom') {
        delta = moveEvent.clientY - dragStartY;
      } else if (type === 'padding-horizontal') {
        delta = Math.abs(moveEvent.clientX - dragStartX) * (moveEvent.clientX < dragStartX ? 1 : 1);
      }

      let rawNewVal = startValue + (type === 'padding-top' || type === 'margin-top' ? delta : delta);
      if (type === 'padding-top' && delta < 0) rawNewVal = startValue - Math.abs(delta);

      let snappedVal = Math.max(0, Math.round(rawNewVal / 8) * 8);
      if (type.startsWith('padding') && snappedVal > 160) snappedVal = 160;
      if (type.startsWith('margin') && snappedVal > 120) snappedVal = 120;

      currentDragTooltip = `${type.replace('-', ' ').toUpperCase()}: ${snappedVal}px`;

      const updates: Record<string, string> = {};
      if (type === 'padding-top') {
        updates.paddingTop = `${snappedVal}px`;
      } else if (type === 'padding-bottom') {
        updates.paddingBottom = `${snappedVal}px`;
      } else if (type === 'padding-horizontal') {
        updates.paddingLeft = `${snappedVal}px`;
        updates.paddingRight = `${snappedVal}px`;
      } else if (type === 'margin-top') {
        updates.marginTop = `${snappedVal}px`;
      } else if (type === 'margin-bottom') {
        updates.marginBottom = `${snappedVal}px`;
      }

      transientStyles = {
        ...transientStyles,
        [section.id]: {
          ...(transientStyles[section.id] || {}),
          ...updates,
        },
      };
    };

    const handleMouseUp = () => {
      isDraggingSpacing = false;
      currentDragTooltip = '';
      if (activeCleanup) {
        activeCleanup();
        activeCleanup = null;
      }

      const finalOverrides = transientStyles[section.id];
      if (finalOverrides) {
        editorStore.updateSectionStyles(section.id, finalOverrides);
        transientStyles = { ...transientStyles };
        delete transientStyles[section.id];
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    activeCleanup = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<div
  bind:clientWidth={containerWidth}
  class="flex-1 bg-nested relative flex items-start justify-center p-3 sm:p-6 overflow-x-hidden overflow-y-auto min-h-0 select-none transition-colors"
  on:click={() => editorStore.selectSection(null)}
  role="region"
  aria-label="Canvas Area"
>
  <!-- Background Pixel Grid Guide -->
  {#if $canvasStore.showPixelGrid}
    <div
      class="absolute inset-0 pointer-events-none opacity-30 z-0 bg-[radial-gradient(var(--theme-primary,#2563eb)_1px,transparent_1px)] [background-size:16px_16px]"
      aria-hidden="true"
    />
  {/if}

  <!-- Drag Spacing Value Tooltip Overlay -->
  {#if isDraggingSpacing && currentDragTooltip}
    <div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white font-mono font-bold text-xs px-3.5 py-1.5 rounded-full shadow-2xl border border-white/20 animate-pulse pointer-events-none flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-orange"></span>
      <span>{currentDragTooltip}</span>
    </div>
  {/if}

  <!-- Canvas Scaled Wrapper -->
  <div
    class="relative transition-all duration-300 origin-top flex flex-col items-center flex-shrink-0"
    style="
      width: {targetWidth}px;
      transform: scale({scaleRatio});
      margin-bottom: {canvasHeight > 0 && scaleRatio < 1 ? `${Math.round(canvasHeight * (scaleRatio - 1))}px` : '0px'};
    "
  >
    <!-- Viewport Header Indicator -->
    <div class="w-full flex items-center justify-between px-3 py-1.5 mb-2 bg-card border border-light rounded-t-xl text-3xs font-mono text-secondary shadow-xs">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="font-bold text-main uppercase font-heading">{viewMode}</span>
        <span>•</span>
        <span>{targetWidth}px</span>
      </div>
      <div class="flex items-center gap-2">
        <span>Zoom: {Math.round(scaleRatio * 100)}%</span>
        <span>•</span>
        <span>{sections.length} Section</span>
      </div>
    </div>

    <div
      bind:clientHeight={canvasHeight}
      class="w-full bg-card rounded-b-2xl shadow-xl transition-all duration-200 border border-light relative overflow-visible"
      style="{canvasCssVars};"
      on:click|stopPropagation
      role="region"
      aria-label="Editable Page Canvas"
    >
      <!-- Figma Layout Columns Overlay -->
      <LayoutGridOverlay
        {viewMode}
        showColumnGrid={$canvasStore.showColumnGrid}
        showPixelGrid={$canvasStore.showPixelGrid}
      />

      {#if sections.length === 0}
        <div class="py-24 px-8 text-center flex flex-col items-center justify-center">
          <div class="w-16 h-16 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mb-4 shadow-2xs">
            <span class="material-symbols-outlined text-3xl">add_box</span>
          </div>
          <h3 class="text-base font-bold text-main font-heading mb-1">Canvas Masih Kosong</h3>
          <p class="text-xs text-secondary max-w-sm font-sans mb-4 leading-relaxed">
            Belum ada section yang ditambahkan ke tema ini. Gunakan panel layer di samping kiri untuk mulai mendesain.
          </p>
        </div>
      {:else}
        {#each renderedSections as section (section.id)}
          {@const isSelected = selectedSectionId === section.id}
          <div
            class={`relative group/section transition-all duration-150 ${section.type === 'header_announcement' ? 'z-30 overflow-visible' : isSelected ? 'z-20' : 'z-10'} ${isSelected ? 'ring-2 ring-primary ring-inset shadow-md' : 'hover:ring-1 hover:ring-primary/40 hover:ring-inset'}`}
            on:click|stopPropagation={() => onSelectSection(section.id)}
            role="button"
            tabindex="0"
            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectSection(section.id)}
          >
            <!-- Spacing Interactive Drag Handles on Selected Section -->
            <CanvasSpacingHandles
              {section}
              {isSelected}
              onStartDrag={handleStartDrag}
            />

            <!-- Section Content Body -->
            <SectionRenderer {section} isActive={isSelected} />
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
