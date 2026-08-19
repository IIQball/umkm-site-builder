<script lang="ts">
  import { ChevronUp, ChevronDown, Trash2 } from 'lucide-svelte';
  import { editorStore, activeNodeId } from '../stores/editorStore';
  import type { HeroProps, SectionStyles } from '@/types/builder';

  export let props: HeroProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: tagName = props?.tagName || 'h1';
  $: title = props?.title || 'Selamat datang di toko kami';
  $: subtitle = props?.subtitle || 'Produk berkualitas dengan harga terjangkau';
  $: imageUrl = props?.imageUrl || '';
  $: ctaText = props?.ctaText || 'Lihat Katalog';
  $: ctaLink = props?.ctaLink || '#catalog';
  $: badgeText = props?.badgeText || 'Promo Spesial UMKM';
  $: nodeStylesMap = props?.nodeStyles || {};

  const defaultOrder = ['badge', 'title', 'subtitle', 'image', 'cta'];
  $: elementOrder = Array.isArray(props?.elementOrder) && props.elementOrder.length > 0
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

  const onDragLeave = () => {
    dropTargetKey = null;
  };

  const onDrop = (e: DragEvent, targetKey: string) => {
    e.preventDefault();
    if (!draggedKey || draggedKey === targetKey) {
      draggedKey = null;
      dropTargetKey = null;
      return;
    }

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
      <!-- Active Node Toolbar & Figma-like Corner Handles -->
      {#if isElementActive}
        <!-- Top Toolbar: Badge, Reorder, Delete -->
        <div class="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 px-2 py-0.5 z-40">
          <span class="text-[9px] font-bold uppercase tracking-wider text-blue-400 font-mono">
            {key}
          </span>

          <div class="h-3 w-px bg-slate-700" />

          <button
            type="button"
            on:click|stopPropagation={() => moveElement(key, 'up')}
            disabled={index === 0}
            class="p-0.5 hover:text-blue-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
            title="Pindah ke Atas"
          >
            <ChevronUp size={12} />
          </button>
          <button
            type="button"
            on:click|stopPropagation={() => moveElement(key, 'down')}
            disabled={index === elementOrder.length - 1}
            class="p-0.5 hover:text-blue-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
            title="Pindah ke Bawah"
          >
            <ChevronDown size={12} />
          </button>

          <div class="h-3 w-px bg-slate-700" />

          <button
            type="button"
            on:click|stopPropagation={() => editorStore.deleteNode(sectionId, key)}
            class="p-0.5 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
            title="Hapus Elemen (Delete)"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <!-- Live Resize Tooltip -->
        {#if isResizingNode && resizeTooltip}
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-lg z-50 pointer-events-none">
            {resizeTooltip}
          </div>
        {/if}

        <!-- 4-Corner Resize Handles -->
        <div
          role="slider"
          tabindex="0"
          aria-valuenow={0}
          aria-label="Resize Top Left"
          on:pointerdown={(e) => startNodeResize(e, key, 'nw')}
          class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow cursor-nwse-resize z-40 hover:scale-125 transition-transform"
        />
        <div
          role="slider"
          tabindex="0"
          aria-valuenow={0}
          aria-label="Resize Top Right"
          on:pointerdown={(e) => startNodeResize(e, key, 'ne')}
          class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow cursor-nesw-resize z-40 hover:scale-125 transition-transform"
        />
        <div
          role="slider"
          tabindex="0"
          aria-valuenow={0}
          aria-label="Resize Bottom Left"
          on:pointerdown={(e) => startNodeResize(e, key, 'sw')}
          class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow cursor-nesw-resize z-40 hover:scale-125 transition-transform"
        />
        <div
          role="slider"
          tabindex="0"
          aria-valuenow={0}
          aria-label="Resize Bottom Right"
          on:pointerdown={(e) => startNodeResize(e, key, 'se')}
          class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm shadow cursor-nwse-resize z-40 hover:scale-125 transition-transform"
        />
        <!-- Side Edge Handles -->
        <div
          role="slider"
          tabindex="0"
          aria-valuenow={0}
          aria-label="Resize Width"
          on:pointerdown={(e) => startNodeResize(e, key, 'e')}
          class="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-4 bg-white border border-blue-600 rounded-sm shadow cursor-ew-resize z-40 hover:scale-125 transition-transform"
        />
      {/if}

      <!-- Badge Element -->
      {#if key === 'badge'}
        {#if badgeText}
          <div
            style={buildNodeStyle('badge')}
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-4 shadow-sm"
          >
            <span>{badgeText}</span>
          </div>
        {/if}

      <!-- Title Element -->
      {:else if key === 'title'}
        <svelte:element
          this={tagName || 'h1'}
          style={buildNodeStyle('title', {
            color: styles?.color || '#0f172a',
            fontSize: tagName === 'h1' ? '2.25rem' : '1.875rem',
            fontWeight: '800',
            textAlign: styles?.textAlign || 'center',
            marginBottom: '16px',
          })}
          class="tracking-tight leading-tight w-full"
        >
          {title}
        </svelte:element>

      <!-- Subtitle Element -->
      {:else if key === 'subtitle'}
        <p
          style={buildNodeStyle('subtitle', {
            color: styles?.color ? styles.color : '#475569',
            fontSize: '1.125rem',
            textAlign: styles?.textAlign || 'center',
            marginBottom: '24px',
          })}
          class="max-w-2xl leading-relaxed w-full"
        >
          {subtitle}
        </p>

      <!-- Banner Image Element -->
      {:else if key === 'image'}
        {#if imageUrl}
          <div
            style={buildNodeStyle('image')}
            class="mb-6 w-full max-w-lg overflow-hidden rounded-2xl shadow-md border border-slate-100"
          >
            <img src={imageUrl} alt="Hero Banner" class="w-full h-56 md:h-72 object-cover" />
          </div>
        {/if}

      <!-- CTA Button Element -->
      {:else if key === 'cta'}
        <div class="mb-2 w-full flex justify-center">
          <a
            href={ctaLink}
            on:click|preventDefault
            style={buildNodeStyle('cta', {
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
            })}
            class={`inline-flex items-center justify-center shadow-lg shadow-blue-500/25 pointer-events-auto cursor-pointer ${getNodeHoverClass('cta')}`}
          >
            {ctaText}
          </a>
        </div>
      {/if}
    </div>
  {/each}
</div>
