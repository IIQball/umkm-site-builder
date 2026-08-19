<script lang="ts">
  import { editorStore, activeNodeId } from '../stores/editorStore';
  import type { HeroProps, SectionStyles } from '@/types/builder';
  import HeroElementToolbar from './hero/HeroElementToolbar.svelte';

  export let props: HeroProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: isMobileView = $editorStore?.viewMode === 'mobile';
  $: isTabletView = $editorStore?.viewMode === 'tablet';

  $: tagName = props?.tagName || 'h1';
  $: title = props?.title || 'Selamat datang di toko kami';
  $: subtitle = props?.subtitle || 'Produk berkualitas dengan harga terjangkau';
  $: imageUrl = props?.imageUrl || '';
  $: ctaText = props?.ctaText || 'Lihat Katalog';
  $: ctaLink = props?.ctaLink || '#catalog';
  $: badgeText = props?.badgeText || 'Promo Spesial UMKM';
  $: nodeStylesMap = props?.nodeStyles || {};

  const defaultOrder = ['badge', 'title', 'subtitle', 'image', 'cta'];
  $: elementOrder =
    Array.isArray(props?.elementOrder) && props.elementOrder.length > 0
      ? props.elementOrder
      : defaultOrder;

  let draggedKey: string | null = null;
  let dropTargetKey: string | null = null;
  let isResizingNode = false;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeTooltip = '';

  const buildNodeStyle = (key: string, defaults: Record<string, string> = {}): string => {
    const custom = nodeStylesMap[key] || {};
    const merged = { ...defaults, ...custom };
    const rules: string[] = [];
    if (merged.textAlign) rules.push(`text-align: ${merged.textAlign}`);
    if (merged.color) rules.push(`color: ${merged.color}`);
    if (merged.fontFamily) rules.push(`font-family: ${merged.fontFamily}`);
    if (merged.fontSize) rules.push(`font-size: ${merged.fontSize}`);
    if (merged.fontWeight) rules.push(`font-weight: ${merged.fontWeight}`);
    if (merged.backgroundColor) rules.push(`background-color: ${merged.backgroundColor}`);
    if (merged.borderRadius) rules.push(`border-radius: ${merged.borderRadius}`);
    if (merged.padding) rules.push(`padding: ${merged.padding}`);
    if (merged.boxShadow && merged.boxShadow !== 'none') rules.push(`box-shadow: ${merged.boxShadow}`);
    if (merged.marginTop) rules.push(`margin-top: ${merged.marginTop}`);
    if (merged.marginBottom) rules.push(`margin-bottom: ${merged.marginBottom}`);
    if (merged.animation && merged.animation !== 'none') {
      rules.push(`animation: ${merged.animation} 600ms cubic-bezier(0.16, 1, 0.3, 1) both`);
    }
    return rules.join('; ');
  };

  const getNodeHoverClass = (key: string): string => {
    const custom = nodeStylesMap[key] || {};
    if (custom.hoverEffect === 'scale') return 'hover:scale-105 transition-transform duration-200';
    if (custom.hoverEffect === 'lift') return 'hover:-translate-y-1 transition-transform duration-200';
    if (custom.hoverEffect === 'glow') return 'hover:shadow-blue-500/50 hover:shadow-xl transition-shadow duration-200';
    return 'transition-all';
  };

  const handleElementClick = (e: MouseEvent, key: string) => {
    if (isResizingNode) return;
    e.stopPropagation();
    editorStore.selectNode(sectionId, key);
  };

  const handleElementKeydown = (e: KeyboardEvent, key: string) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        e.stopPropagation();
        e.preventDefault();
        editorStore.deleteNode(sectionId, key);
        return;
      }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      editorStore.selectNode(sectionId, key);
    }
  };

  const startNodeResize = (e: PointerEvent, key: string, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingNode = true;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;

    const currentStyle = nodeStylesMap[key] || {};
    const startFontSize = parseInt(currentStyle.fontSize || (key === 'title' ? '36px' : '16px'), 10) || 16;
    const startRadius = parseInt(currentStyle.borderRadius || '12px', 10) || 12;

    const onPointerMove = (moveEv: PointerEvent) => {
      const deltaX = moveEv.clientX - resizeStartX;
      const deltaY = moveEv.clientY - resizeStartY;

      if (handle === 'se' || handle === 'sw') {
        if (key === 'title' || key === 'subtitle' || key === 'badge') {
          const newSize = Math.max(12, Math.min(64, startFontSize + Math.round(deltaY / 3)));
          resizeTooltip = `Font: ${newSize}px`;
          editorStore.updateNodeStyles(sectionId, key, { fontSize: `${newSize}px` });
        } else if (key === 'cta') {
          const newRadius = Math.max(0, Math.min(48, startRadius + Math.round(deltaX / 2)));
          resizeTooltip = `Radius: ${newRadius}px`;
          editorStore.updateNodeStyles(sectionId, key, { borderRadius: `${newRadius}px` });
        }
      } else if (handle === 'e' || handle === 'w') {
        const delta = Math.abs(deltaX);
        const newMaxW = Math.max(200, Math.min(900, 450 + delta * 2));
        resizeTooltip = `Max-Width: ${newMaxW}px`;
        editorStore.updateNodeStyles(sectionId, key, { maxWidth: `${newMaxW}px` });
      }
    };

    const onPointerUp = () => {
      isResizingNode = false;
      resizeTooltip = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onDragStart = (e: DragEvent, key: string) => {
    if (!isActive || isResizingNode) return;
    draggedKey = key;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', key);
    }
  };

  const onDragOver = (e: DragEvent, key: string) => {
    if (!draggedKey || draggedKey === key) return;
    e.preventDefault();
    dropTargetKey = key;
  };

  const onDragLeave = () => { dropTargetKey = null; };

  const onDrop = (e: DragEvent, targetKey: string) => {
    e.preventDefault();
    if (!draggedKey || draggedKey === targetKey) { draggedKey = null; dropTargetKey = null; return; }
    const list = [...elementOrder];
    const fromIdx = list.indexOf(draggedKey);
    const toIdx = list.indexOf(targetKey);
    if (fromIdx !== -1 && toIdx !== -1) {
      const [item] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, item);
      editorStore.updateSectionProps(sectionId, { elementOrder: list });
    }
    draggedKey = null;
    dropTargetKey = null;
  };

  const moveElement = (key: string, direction: 'up' | 'down') => {
    const list = [...elementOrder];
    const idx = list.indexOf(key);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    editorStore.updateSectionProps(sectionId, { elementOrder: list });
  };
</script>

<div class="max-w-4xl mx-auto flex flex-col items-center w-full">
  {#each elementOrder as key, index (key)}
    {@const isElementActive = isActive && $activeNodeId === key}
    <div
      role="button"
      tabindex="0"
      aria-label={`Pilih elemen ${key}`}
      draggable={isActive}
      on:click={(e) => handleElementClick(e, key)}
      on:keydown={(e) => handleElementKeydown(e, key)}
      on:dragstart={(e) => onDragStart(e, key)}
      on:dragover={(e) => onDragOver(e, key)}
      on:dragleave={onDragLeave}
      on:drop={(e) => onDrop(e, key)}
      class={`relative w-full flex flex-col items-center group/elem transition-all cursor-pointer ${
        isElementActive
          ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg p-1.5 z-30'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/60 rounded-lg p-1'
      } ${dropTargetKey === key ? 'border-t-2 border-blue-500 py-1' : ''} ${draggedKey === key ? 'opacity-40' : ''}`}
    >
      {#if isElementActive}
        <HeroElementToolbar
          nodeKey={key}
          {index}
          total={elementOrder.length}
          {sectionId}
          {isResizingNode}
          {resizeTooltip}
          onMoveElement={moveElement}
          onStartResize={startNodeResize}
        />
      {/if}

      <!-- Badge -->
      {#if key === 'badge'}
        {#if badgeText}
          <div
            style={buildNodeStyle('badge')}
            class="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] sm:text-xs font-semibold border border-blue-200/80 mb-3 shadow-sm max-w-full truncate"
          >
            <span>{badgeText}</span>
          </div>
        {/if}

      <!-- Title -->
      {:else if key === 'title'}
        <svelte:element
          this={tagName || 'h1'}
          style={buildNodeStyle('title', {
            color: styles?.color || (styles?.backgroundColor && parseInt(styles.backgroundColor.replace('#',''), 16) < 0x888888 ? '#f8fafc' : '#0f172a'),
            fontWeight: '800',
            textAlign: styles?.textAlign || 'center',
            marginBottom: '12px',
          })}
          class={`font-extrabold tracking-tight leading-tight w-full max-w-3xl box-border ${
            isMobileView ? 'text-2xl sm:text-3xl' : isTabletView ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-4xl lg:text-5xl'
          }`}
        >
          {title}
        </svelte:element>

      <!-- Subtitle -->
      {:else if key === 'subtitle'}
        <p
          style={buildNodeStyle('subtitle', {
            color: styles?.color || (styles?.backgroundColor && parseInt(styles.backgroundColor.replace('#',''), 16) < 0x888888 ? '#cbd5e1' : '#475569'),
            textAlign: styles?.textAlign || 'center',
            marginBottom: '20px',
          })}
          class={`max-w-2xl leading-relaxed w-full opacity-90 box-border ${
            isMobileView ? 'text-xs sm:text-sm' : isTabletView ? 'text-sm sm:text-base' : 'text-xs sm:text-base lg:text-lg'
          }`}
        >
          {subtitle}
        </p>

      <!-- Banner Image -->
      {:else if key === 'image'}
        {#if imageUrl}
          <div
            style={buildNodeStyle('image')}
            class="mb-6 w-full max-w-2xl overflow-hidden rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 box-border"
          >
            <img src={imageUrl} alt="Banner Produk Toko" class="w-full h-auto max-h-[260px] sm:max-h-[360px] lg:max-h-[440px] object-cover" />
          </div>
        {/if}

      <!-- CTA Button -->
      {:else if key === 'cta'}
        <div class="mb-2 w-full flex justify-center px-2">
          <a
            href={ctaLink}
            on:click|preventDefault
            style={buildNodeStyle('cta', {
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: '600',
            })}
            class={`${
              isMobileView ? 'w-full' : 'w-full sm:w-auto'
            } inline-flex items-center justify-center text-center px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold rounded-xl text-white shadow-md shadow-blue-600/20 active:scale-[0.98] pointer-events-auto cursor-pointer ${getNodeHoverClass('cta')}`}
          >
            {ctaText}
          </a>
        </div>
      {/if}
    </div>
  {/each}
</div>
