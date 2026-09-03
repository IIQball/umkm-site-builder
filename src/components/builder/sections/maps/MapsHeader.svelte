<script lang="ts">
  import { MapPin } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let badge: string = 'Lokasi Gerai Fisik';
  export let title: string = 'Kunjungi Outlet Resmi Kami';
  export let subtitle: string = '';
  export let align: 'left' | 'center' | 'right' = 'left';

  $: isSelected = $canvasStore?.selectedNodeId === 'maps_header' && $canvasStore?.selectedSectionId === sectionId;

  function selectHeader(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'maps_header');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectHeader(e);
    }
  }
</script>

<div
  role="button"
  tabindex="0"
  on:click={selectHeader}
  on:keydown={handleKeydown}
  class={`mb-5 cursor-pointer rounded-2xl p-2 transition-all duration-200 outline-none ${
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
  } ${isSelected ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : 'hover:bg-base-200/40'}`}
>
  {#if badge}
    <div class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 ${align === 'center' ? 'mx-auto' : ''}`}>
      <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
      <MapPin size={12} class="shrink-0" />
      <span class="text-label-caps uppercase tracking-wider">{badge}</span>
    </div>
  {/if}

  <h2 class="text-heading-lg font-heading font-black text-main tracking-tight leading-tight">
    {title}
  </h2>

  {#if subtitle}
    <p class="text-body-sm text-secondary mt-1.5 max-w-2xl leading-relaxed {align === 'center' ? 'mx-auto' : ''}">
      {subtitle}
    </p>
  {/if}
</div>
