<script lang="ts">
  import { onDestroy } from 'svelte';
  import SectionRenderer from './sections/SectionRenderer.svelte';
  import LayoutGridOverlay from './LayoutGridOverlay.svelte';
  import type { TemplateSection, TemplateTheme } from '@/schemas';
  import { editorStore, canvasStore } from './stores/editorStore';
  import { calculateGoldenRatioTypography } from '@/lib/utils/designMath';
  import { MoveVertical, MoveHorizontal } from 'lucide-svelte';

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
  $: paddingHorizontal = 48; // 24px left + 24px right padding
  $: availableWidth = Math.max(0, containerWidth - paddingHorizontal);
  $: autoScale = (availableWidth > 0 && availableWidth < targetWidth)
    ? (availableWidth / targetWidth)
    : 1;
  $: userZoom = ($canvasStore.zoom && $canvasStore.zoom !== 100) ? ($canvasStore.zoom / 100) : 1;
  $: scaleRatio = Number(Math.min(1, Math.max(0.1, autoScale * userZoom)).toFixed(4));

  $: theme = ($editorStore.template?.config.theme || {}) as TemplateTheme;
  $: isDarkPreview = $canvasStore.previewTheme === 'dark';
  $: colors = theme.colors || {};
  $: typography = theme.typography || {};
  $: buttons = (theme.buttons || {}) as Record<string, any>;
  $: layout = theme.layout || {};

  $: baseFontSize = parseInt(String(typography.body?.fontSize || '16'), 10) || 16;
  $: goldenRatio = calculateGoldenRatioTypography(baseFontSize);

  $: canvasCssVars = [
    /* 1. Warna */
    `--theme-primary: ${colors.primary || '#3b82f6'}`,
    `--theme-secondary: ${colors.secondary || '#64748b'}`,
    `--theme-bg: ${isDarkPreview ? '#090d16' : (colors.background || '#ffffff')}`,
    `--theme-surface: ${isDarkPreview ? '#111827' : (colors.surface || '#f8fafc')}`,
    `--theme-text-primary: ${isDarkPreview ? '#f8fafc' : (colors.textPrimary || '#0f172a')}`,
    `--theme-text-muted: ${isDarkPreview ? '#94a3b8' : (colors.textMuted || '#64748b')}`,

    /* 2. Tipografi Golden Ratio */
    `--theme-font-heading: ${typography.headingFont || 'Inter, sans-serif'}`,
    `--theme-font-body: ${typography.bodyFont || 'Inter, sans-serif'}`,
    `--theme-text-h1: ${typography.h1?.fontSize || `${goldenRatio.h1}px`}`,
    `--theme-text-h2: ${typography.h2?.fontSize || `${goldenRatio.h2}px`}`,
    `--theme-text-h3: ${typography.h3?.fontSize || `${goldenRatio.h3}px`}`,
    `--theme-text-body: ${typography.body?.fontSize || `${goldenRatio.body}px`}`,
    `--theme-text-caption: ${typography.caption?.fontSize || `${goldenRatio.caption}px`}`,

    /* 3. Tombol & Radius */
    `--theme-btn-height: ${buttons.height || 40}px`,
    `--theme-btn-radius: ${buttons.borderRadius || '8px'}`,
    `--theme-btn-primary-bg: ${buttons.primary?.backgroundColor || colors.primary || '#3b82f6'}`,
    `--theme-btn-primary-text: ${buttons.primary?.textColor || '#ffffff'}`,
    `--theme-btn-secondary-bg: ${buttons.secondary?.backgroundColor || '#f1f5f9'}`,
    `--theme-btn-secondary-text: ${buttons.secondary?.textColor || '#0f172a'}`,
    `--theme-btn-outline-border: ${buttons.outline?.borderColor || colors.primary || '#3b82f6'}`,
    `--theme-btn-outline-text: ${buttons.outline?.textColor || colors.primary || '#3b82f6'}`,

    /* 4. Grid & Spacing */
    `--theme-grid-gutter: 24px`,
    `--theme-max-width: ${layout.maxWidth || '1200px'}`,
    `--theme-safe-zone-desktop: ${layout.horizontalMarginDesktop || '32px'}`,
    `--theme-safe-zone-tablet: ${layout.horizontalMarginTablet || '24px'}`,
    `--theme-safe-zone-mobile: ${layout.horizontalMarginMobile || '16px'}`,
    `--active-safe-zone: ${viewMode === 'mobile' ? (layout.horizontalMarginMobile || '16px') : viewMode === 'tablet' ? (layout.horizontalMarginTablet || '24px') : (layout.horizontalMarginDesktop || '32px')}`,

    /* 5. Effects */
    `--theme-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)`,
    `--theme-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)`,
    `--theme-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)`,
  ].join('; ');

  const parsePx = (val: unknown, defaultVal: number = 0): number => {
    if (typeof val !== 'string' && typeof val !== 'number') return defaultVal;
    return parseInt(String(val), 10) || defaultVal;
  };

  const handleSelect = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (isDraggingSpacing) return;
    onSelectSection(id);
  };

  const handleCanvasBackgroundClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.classList?.contains('canvas-backdrop')) {
      canvasStore.deselectAll();
    }
  };

  const commitStyles = (sectionId: string, styles: Record<string, string>) => {
    if (!styles || Object.keys(styles).length === 0) return;
    editorStore.updateSectionStyles(sectionId, styles);
  };

  const startTopMarginDrag = (e: PointerEvent, section: TemplateSection) => {
    e.stopPropagation();
    e.preventDefault();
    if (activeCleanup) activeCleanup();

    isDraggingSpacing = true;
    dragStartY = e.clientY;
    startValue = parsePx(section.styles?.marginTop, 0);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaY = (moveEvent.clientY - dragStartY) / (scaleRatio || 1);
      const newMarginTop = Math.max(0, Math.min(160, startValue + Math.round(deltaY)));
      currentDragTooltip = `Margin Top: ${newMarginTop}px`;
      transientStyles = {
        ...transientStyles,
        [section.id]: {
          ...(transientStyles[section.id] || {}),
          marginTop: `${newMarginTop}px`,
        },
      };
    };

    const onPointerUp = () => {
      const finalStyles = transientStyles[section.id];
      transientStyles = {};
      if (activeCleanup) activeCleanup();
      if (finalStyles) {
        commitStyles(section.id, finalStyles);
      }
    };

    activeCleanup = () => {
      isDraggingSpacing = false;
      currentDragTooltip = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      activeCleanup = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const startBottomMarginDrag = (e: PointerEvent, section: TemplateSection) => {
    e.stopPropagation();
    e.preventDefault();
    if (activeCleanup) activeCleanup();

    isDraggingSpacing = true;
    dragStartY = e.clientY;
    startValue = parsePx(section.styles?.marginBottom, 0);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaY = (moveEvent.clientY - dragStartY) / (scaleRatio || 1);
      const newMarginBottom = Math.max(0, Math.min(160, startValue + Math.round(deltaY)));
      currentDragTooltip = `Margin Bottom: ${newMarginBottom}px`;
      transientStyles = {
        ...transientStyles,
        [section.id]: {
          ...(transientStyles[section.id] || {}),
          marginBottom: `${newMarginBottom}px`,
        },
      };
    };

    const onPointerUp = () => {
      const finalStyles = transientStyles[section.id];
      transientStyles = {};
      if (activeCleanup) activeCleanup();
      if (finalStyles) {
        commitStyles(section.id, finalStyles);
      }
    };

    activeCleanup = () => {
      isDraggingSpacing = false;
      currentDragTooltip = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      activeCleanup = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const startSidePaddingDrag = (e: PointerEvent, section: TemplateSection) => {
    e.stopPropagation();
    e.preventDefault();
    if (activeCleanup) activeCleanup();

    isDraggingSpacing = true;
    dragStartX = e.clientX;
    const paddingStr = section.styles?.padding || '48px 24px';
    const parts = paddingStr.trim().split(/\s+/).map((p) => parseInt(p, 10) || 0);
    const padY = parts[0] || 48;
    const startPadX = parts.length > 1 ? parts[1] : padY;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - dragStartX) / (scaleRatio || 1);
      const newPadX = Math.max(8, Math.min(120, startPadX + Math.round(deltaX / 2)));
      currentDragTooltip = `Padding: ${padY}px ${newPadX}px`;
      transientStyles = {
        ...transientStyles,
        [section.id]: {
          ...(transientStyles[section.id] || {}),
          padding: `${padY}px ${newPadX}px`,
        },
      };
    };

    const onPointerUp = () => {
      const finalStyles = transientStyles[section.id];
      transientStyles = {};
      if (activeCleanup) activeCleanup();
      if (finalStyles) {
        commitStyles(section.id, finalStyles);
      }
    };

    activeCleanup = () => {
      isDraggingSpacing = false;
      currentDragTooltip = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      activeCleanup = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && canvasStore.deselectAll()} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
<main
  bind:clientWidth={containerWidth}
  tabindex="-1"
  on:click={handleCanvasBackgroundClick}
  class="canvas-backdrop flex-1 w-full h-full overflow-auto flex items-start justify-center min-w-0 p-6 bg-slate-100 dark:bg-slate-950 select-none transition-colors"
  aria-label="Editor Canvas"
>
  <!-- Scaler Wrapper that preserves accurate flow bounds and vertical scrollbar height -->
  <div
    class="canvas-scale-container relative flex-shrink-0 transition-all duration-300 ease-out"
    style="width: {targetWidth * scaleRatio}px; height: {canvasHeight > 0 ? `${canvasHeight * scaleRatio}px` : 'auto'}; min-height: {canvasHeight > 0 ? `${canvasHeight * scaleRatio}px` : '100%'};"
  >
    <!-- Frame Container with fixed viewport width, scaled via CSS transform -->
    <div
      id="canvas-frame"
      bind:clientHeight={canvasHeight}
      data-theme={$canvasStore.previewTheme}
      style="{canvasCssVars}; width: {targetWidth}px; transform: scale({scaleRatio}); transform-origin: top left; position: {scaleRatio < 1 ? 'absolute' : 'relative'}; top: 0; left: 0;"
      class={`transition-transform duration-300 ease-out flex flex-col box-border overflow-x-hidden ${
        isDarkPreview ? 'theme-dark bg-slate-950 text-slate-100' : 'theme-light bg-white text-slate-900'
      } ${
        viewMode === 'desktop'
          ? 'min-h-screen shadow-xl border border-slate-300 dark:border-slate-700'
          : viewMode === 'tablet'
          ? 'min-h-screen shadow-2xl border border-slate-300 dark:border-slate-700'
          : 'min-h-screen shadow-2xl border border-slate-300 dark:border-slate-700'
      }`}
    >
      <!-- Figma-Style Layout Grid Guides (Overlay) -->
      <LayoutGridOverlay
        {viewMode}
        showColumnGrid={$canvasStore.showColumnGrid}
        showPixelGrid={$canvasStore.showPixelGrid}
      />

      {#if renderedSections.length === 0}
        <div class="p-16 text-center text-slate-400">
          <p class="text-sm">Tidak ada section untuk ditampilkan.</p>
        </div>
      {:else}
        <div class="flex flex-col w-full min-w-0 transition-all">
          {#each renderedSections as section (section.id)}
            <div
              role="button"
              tabindex="0"
              on:click={(e) => handleSelect(section.id, e)}
              on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectSection(section.id)}
              class={`relative w-full text-left transition-all cursor-pointer ${
                selectedSectionId === section.id
                  ? 'ring-2 ring-blue-500 ring-inset z-20'
                  : 'hover:ring-1 hover:ring-blue-400/50 hover:ring-inset'
              }`}
            >
              <!-- Active Section Overlays & Spacing Drag Handles -->
              {#if selectedSectionId === section.id}
                <!-- Selection Badge -->
                <div class="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-30 pointer-events-none uppercase tracking-wider">
                  {section.type.replace('_', ' ')}
                </div>

                <!-- Drag Info Tooltip -->
                {#if isDraggingSpacing && currentDragTooltip}
                  <div class="absolute top-2 right-2 bg-slate-900 text-blue-400 border border-blue-500/40 text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-lg z-40 pointer-events-none">
                    {currentDragTooltip}
                  </div>
                {/if}

                <!-- Top Spacing Handle (Margin Top) -->
                <div
                  role="slider"
                  tabindex="0"
                  aria-valuenow={startValue}
                  aria-label="Drag to adjust margin top"
                  on:pointerdown={(e) => startTopMarginDrag(e, section)}
                  class="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 px-3 h-5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold rounded-full shadow-lg cursor-ns-resize z-30 transition-all group"
                  title="Tarik untuk mengatur jarak atas (Margin Top)"
                >
                  <MoveVertical size={11} class="opacity-90 group-hover:scale-110 transition-transform" />
                  <span class="text-[9px] tracking-tight">Jarak Atas</span>
                </div>

                <!-- Bottom Spacing Handle (Margin Bottom) -->
                <div
                  role="slider"
                  tabindex="0"
                  aria-valuenow={startValue}
                  aria-label="Drag to adjust margin bottom"
                  on:pointerdown={(e) => startBottomMarginDrag(e, section)}
                  class="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 px-3 h-5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold rounded-full shadow-lg cursor-ns-resize z-30 transition-all group"
                  title="Tarik untuk mengatur jarak bawah (Margin Bottom)"
                >
                  <MoveVertical size={11} class="opacity-90 group-hover:scale-110 transition-transform" />
                  <span class="text-[9px] tracking-tight">Jarak Bawah</span>
                </div>

                <!-- Right Side Padding Handle -->
                <div
                  role="slider"
                  tabindex="0"
                  aria-valuenow={startValue}
                  aria-label="Drag to adjust horizontal padding"
                  on:pointerdown={(e) => startSidePaddingDrag(e, section)}
                  class="absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg cursor-ew-resize z-30 flex items-center justify-center transition-all group"
                  title="Tarik untuk mengatur padding horizontal"
                >
                  <MoveHorizontal size={12} class="opacity-90 group-hover:scale-110 transition-transform" />
                </div>
              {/if}

              <SectionRenderer {section} isActive={selectedSectionId === section.id} />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>


