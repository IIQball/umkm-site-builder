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
  } ${isSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900 bg-[var(--theme-primary,#2563eb)]/5' : 'hover:bg-[var(--color-nested-base,#f8fafc)]/50'}`}
>
  {#if badge}
    <div
      class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-primary,#2563eb)]/10 text-[var(--theme-primary,#2563eb)] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-semibold mb-2 ${align === 'center' ? 'mx-auto' : ''}`}
      style="font-size: var(--theme-text-caption, var(--text-caption-size, 10px));"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary,#2563eb)] animate-pulse"></span>
      <MapPin size={12} class="shrink-0" />
      <span class="uppercase tracking-wider">{badge}</span>
    </div>
  {/if}

  <h2
    class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--theme-text-primary,var(--color-text-main,#0f172a))] tracking-tight leading-tight"
    style="font-size: var(--theme-text-h2, var(--text-h2-size, 26px)); font-weight: var(--theme-text-h2-weight, var(--text-h2-weight, 700)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
  >
    {title}
  </h2>

  {#if subtitle}
    <p
      class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))] mt-1.5 max-w-2xl leading-relaxed {align === 'center' ? 'mx-auto' : ''}"
      style="font-size: var(--theme-text-body, var(--text-body-size, 16px)); font-family: var(--theme-font-body, var(--font-family, inherit));"
    >
      {subtitle}
    </p>
  {/if}
</div>
