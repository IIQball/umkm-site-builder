<script lang="ts">
  import { editorStore, activeNodeId } from '../stores/editorStore';
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types/builder';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: announcementText = props?.announcementText ?? 'Diskon 20% khusus hari ini';
  $: navLinks = Array.isArray(props?.navLinks) ? props.navLinks : ['Beranda', 'Produk', 'Tentang', 'Kontak'];
  $: hasCustomBg = !!styles?.backgroundColor;
  $: hasCustomColor = !!styles?.color;
  $: nodeStylesMap = props?.nodeStyles || {};

  const buildNodeStyle = (key: string, defaults: Record<string, string> = {}): string => {
    const custom = nodeStylesMap[key] || {};
    const merged = { ...defaults, ...custom };
    const rules: string[] = [];

    if (merged.textAlign) rules.push(`text-align: ${merged.textAlign}`);
    if (merged.color) rules.push(`color: ${merged.color}`);
    if (merged.fontFamily) rules.push(`font-family: ${merged.fontFamily}`);
    if (merged.fontSize) rules.push(`font-size: ${merged.fontSize}`);
    if (merged.fontWeight) rules.push(`font-weight: ${merged.fontWeight}`);
    if (merged.marginTop) rules.push(`margin-top: ${merged.marginTop}`);
    if (merged.marginBottom) rules.push(`margin-bottom: ${merged.marginBottom}`);

    return rules.join('; ');
  };

  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

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

  const handleAnnouncementClick = (e: MouseEvent) => {
    e.stopPropagation();
    editorStore.selectNode(sectionId, 'announcement');
  };

  const handleAnnouncementKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      editorStore.selectNode(sectionId, 'announcement');
    }
  };
</script>

<div class={`flex flex-wrap items-center justify-between px-6 py-3 border-b ${hasCustomBg ? '' : 'bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border-amber-500/20'}`}>
  <div
    role="button"
    tabindex="0"
    on:click={handleAnnouncementClick}
    on:keydown={handleAnnouncementKeydown}
    class={`flex-1 text-center md:text-left min-w-[200px] cursor-pointer rounded px-2 py-0.5 transition-all ${
      isActive && $activeNodeId === 'announcement' ? 'ring-2 ring-blue-500' : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/60'
    }`}
  >
    <p
      style={buildNodeStyle('announcement')}
      class={`text-xs font-semibold tracking-wide ${hasCustomColor ? '' : 'text-amber-900'}`}
    >
      {announcementText}
    </p>
  </div>

  <nav class={`flex items-center gap-3 text-xs font-medium ${hasCustomColor ? 'opacity-90' : 'text-slate-600'}`}>
    {#each navLinks as link, index (link + index)}
      <span
        role="button"
        tabindex="0"
        draggable={isActive}
        on:dragstart={(e) => onDragStart(e, index)}
        on:dragover={(e) => onDragOver(e, index)}
        on:dragleave={() => (dropTargetIdx = null)}
        on:drop={(e) => onDrop(e, index)}
        class={`transition-all ${isActive ? 'cursor-grab active:cursor-grabbing hover:text-blue-600' : 'cursor-pointer'} ${
          dropTargetIdx === index ? 'border-l-2 border-blue-500 pl-1' : ''
        } ${draggedIdx === index ? 'opacity-30' : ''}`}
      >
        {link}
      </span>
    {/each}
  </nav>
</div>
