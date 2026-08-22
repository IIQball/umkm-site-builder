<script lang="ts">
  import { editorStore, activeNodeId, activeSection } from '../stores/editorStore';
  import type { HeroProps, SectionStyles } from '@/types';
  import HeroElementToolbar from './hero/HeroElementToolbar.svelte';

  export let props: HeroProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: isSectionSelected = isActive || $activeSection?.id === sectionId;
  $: tagName = props?.tagName || 'h1';
  $: title = props?.title || 'Selamat datang di toko kami';
  $: subtitle = props?.subtitle || 'Produk berkualitas dengan harga terjangkau';
  $: imageUrl = props?.imageUrl || '';
  $: imageMode = (props?.imageMode as 'element' | 'background') || 'element';
  $: ctaText = props?.ctaText || 'Lihat Katalog';
  $: badgeText = props?.badgeText || 'Promo Spesial UMKM';
  $: nodeStylesMap = props?.nodeStyles || {};

  const defaultOrder = ['badge', 'title', 'subtitle', 'image', 'cta'];
  $: elementOrder = Array.isArray(props?.elementOrder) && props.elementOrder.length > 0
    ? props.elementOrder
    : defaultOrder;

  const defaultPositions: Record<string, { x: number; y: number; w: number }> = {
    badge:    { x: 35, y: 40,  w: 30 },
    title:    { x: 15, y: 100, w: 70 },
    subtitle: { x: 20, y: 240, w: 60 },
    image:    { x: 15, y: 340, w: 70 },
    cta:      { x: 38, y: 440, w: 24 },
  };

  let isDraggingNode = false;
  let isResizingNode = false;
  let currentKey: string | null = null;
  let startX = 0;
  let startY = 0;
  let isDraggingBg = false;
  let bgStartX = 0;
  let bgStartY = 0;
  
  $: bgPosX = parseInt(String(styles?.backgroundPositionX ?? '50'), 10) || 50;
  $: bgPosY = parseInt(String(styles?.backgroundPositionY ?? '50'), 10) || 50;

  let initialNodeX = 0;
  let initialNodeY = 0;
  let initialNodeW = 0;
  let resizeTooltip = '';

  const getNodePos = (key: string) => {
    const custom = (nodeStylesMap[key] || {}) as Record<string, string | undefined>;
    const fallback = defaultPositions[key] || { x: 10, y: 10, w: 50 };
    return {
      x: custom.left !== undefined ? parseFloat(custom.left) : fallback.x,
      y: custom.top !== undefined ? parseFloat(custom.top) : fallback.y,
      w: custom.width !== undefined ? parseFloat(custom.width) : fallback.w,
    };
  };

  const selectNodeDirectly = (e: Event, key: string) => {
    e.stopPropagation();
    editorStore.selectSection(sectionId);
    editorStore.selectNode(sectionId, key);
  };

  const handleBgPointerDown = (e: PointerEvent) => {
    if (imageMode !== 'background' || !imageUrl) return;
    const target = e.target as HTMLElement;
    if (target.closest('.group\\/elem') || target.closest('.resize-handle') || target.closest('.toolbar-btn')) return;

    e.stopPropagation();
    editorStore.selectSection(sectionId);

    isDraggingBg = true;
    bgStartX = e.clientX;
    bgStartY = e.clientY;
    const initialBgX = bgPosX;
    const initialBgY = bgPosY;

    const onBgPointerMove = (moveEv: PointerEvent) => {
      if (!isDraggingBg) return;
      const dx = moveEv.clientX - bgStartX;
      const dy = moveEv.clientY - bgStartY;

      // Geser titik fokus background 0% - 100%
      const newX = Math.max(0, Math.min(100, initialBgX + Math.round(dx / 5)));
      const newY = Math.max(0, Math.min(100, initialBgY + Math.round(dy / 5)));

      editorStore.updateSectionStyles(sectionId, {
        backgroundPositionX: `${newX}%`,
        backgroundPositionY: `${newY}%`,
      });
    };

    const onBgPointerUp = () => {
      isDraggingBg = false;
      window.removeEventListener('pointermove', onBgPointerMove);
      window.removeEventListener('pointerup', onBgPointerUp);
    };

    window.addEventListener('pointermove', onBgPointerMove);
    window.addEventListener('pointerup', onBgPointerUp);
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

      const container = document.getElementById(`section-hero-${sectionId}`);
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

  const handleKeydown = (e: KeyboardEvent, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      editorStore.selectSection(sectionId);
      editorStore.selectNode(sectionId, key);
    }
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
      const container = document.getElementById(`section-hero-${sectionId}`);
      const containerWidth = container?.offsetWidth || 1000;
      const dxPercent = (dx / containerWidth) * 100;

      let newW = initialNodeW;
      if (handle.includes('e')) newW = Math.max(10, Math.min(100, initialNodeW + dxPercent));
      if (handle.includes('w')) newW = Math.max(10, Math.min(100, initialNodeW - dxPercent));

      resizeTooltip = `Width: ${newW.toFixed(0)}%`;
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

  const buildCustomStyles = (key: string) => {
    const custom = nodeStylesMap[key] || {};
    const rules: string[] = [];
    if (custom.color) rules.push(`color: ${custom.color}`);
    if (custom.fontSize) rules.push(`font-size: ${custom.fontSize}`);
    if (custom.textAlign) rules.push(`text-align: ${custom.textAlign}`);
    if (custom.backgroundColor) rules.push(`background-color: ${custom.backgroundColor}`);
    if (custom.borderRadius) rules.push(`border-radius: ${custom.borderRadius}`);
    return rules.join('; ');
  };
</script>

<!-- Hero Section Container -->
<section
  id={`section-hero-${sectionId}`}
  class="relative w-full !p-0 !m-0 overflow-hidden select-none outline-none block"
  style="min-height: {styles?.minHeight || '650px'}; height: {styles?.height || 'auto'}; {styles?.backgroundColor ? `background-color: ${styles.backgroundColor};` : ''}"
  on:pointerdown={handleBgPointerDown}
>
  <!-- Background Image Mode: Full edge-to-edge & Draggable Focus Position -->
  {#if imageMode === 'background' && imageUrl}
    <div class="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <img
        src={imageUrl}
        alt="Hero Background"
        class="w-full h-full object-cover select-none pointer-events-none"
        style="object-position: {bgPosX}% {bgPosY}%;"
      />
      <!-- Overlay transparan gelap agar teks tetap terbaca -->
      <div class="absolute inset-0 bg-slate-950/40 pointer-events-none"></div>
    </div>
  {/if}

  <!-- Background Backdrop Click Handler -->
  <button
    type="button"
    tabindex="-1"
    aria-label="Pilih Hero Section"
    on:click|stopPropagation={() => editorStore.selectSection(sectionId)}
    class="absolute inset-0 w-full h-full bg-transparent border-0 p-0 m-0 cursor-move focus:outline-none z-0"
  ></button>

  {#each elementOrder as key (key)}
    <!-- Jika imageMode === 'background', sembunyikan rendering elemen image di canvas absolute -->
    {#if !(key === 'image' && imageMode === 'background')}
      {@const isElementActive = isSectionSelected && $activeNodeId === key}
      {@const pos = getNodePos(key)}

      <div
        role="button"
        tabindex="0"
        aria-label={`Elemen ${key}`}
        on:pointerdown|capture={(e) => handlePointerDown(e, key)}
        on:click|capture={(e) => selectNodeDirectly(e, key)}
        on:keydown={(e) => handleKeydown(e, key)}
        style="left: {pos.x}%; top: {pos.y}px; width: {pos.w}%; position: absolute;"
        class="group/elem transition-shadow cursor-move z-10 {
          isElementActive
            ? 'ring-2 ring-blue-500 rounded-lg shadow-lg bg-blue-500/5 !z-30'
            : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/60 rounded-lg'
        }"
      >
        {#if isElementActive}
          <HeroElementToolbar
            nodeKey={key}
            index={elementOrder.indexOf(key)}
            total={elementOrder.length}
            {sectionId}
            {isResizingNode}
            {resizeTooltip}
            onMoveElement={() => {}}
            onStartResize={startNodeResize}
          />
        {/if}

        <!-- Badge -->
        {#if key === 'badge' && badgeText}
          <div style={buildCustomStyles('badge')} class="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 shadow-sm w-full truncate pointer-events-none">
            <span>{badgeText}</span>
          </div>

        <!-- Title -->
        {:else if key === 'title'}
          <svelte:element
            this={tagName || 'h1'}
            style="background-color: transparent; {buildCustomStyles('title')}"
            class="font-black tracking-tight leading-tight w-full break-words text-2xl sm:text-4xl lg:text-5xl {imageMode === 'background' && !nodeStylesMap?.title?.color ? 'text-white' : 'text-slate-900 dark:text-white'} pointer-events-none"
          >
            {title}
          </svelte:element>
          
        <!-- Subtitle -->
        {:else if key === 'subtitle'}
          <p style={buildCustomStyles('subtitle')} class="leading-relaxed w-full break-words text-slate-600 dark:text-slate-300 text-sm sm:text-base pointer-events-none">
            {subtitle}
          </p>

        <!-- Image (Mode Elemen Bebas) -->
        {:else if key === 'image' && imageUrl}
          <div class="w-full overflow-hidden rounded-xl shadow-sm border border-slate-200 pointer-events-none">
            <img src={imageUrl} alt="Banner" class="w-full h-auto object-cover max-h-[500px]" />
          </div>

        <!-- CTA Button -->
        {:else if key === 'cta'}
          <div
            style={buildCustomStyles('cta')}
            class="w-full inline-flex items-center justify-center text-center px-6 py-3 font-semibold rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all pointer-events-none"
          >
            {ctaText}
          </div>
        {/if}
      </div>
    {/if}
  {/each}
</section>