<script lang="ts">
  import { MapPin } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let badge: string = 'Lokasi Gerai Fisik';
  export let title: string = 'Kunjungi Outlet Resmi Kami';
  export let subtitle: string = '';
  export let align: 'left' | 'center' | 'right' = 'left';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle'];

  $: defaultOrder = ['badge', 'title', 'subtitle'];
  $: effectiveOrder = Array.isArray(elementOrder) && elementOrder.length > 0
    ? [...elementOrder.filter((s) => defaultOrder.includes(s)), ...defaultOrder.filter((s) => !elementOrder.includes(s))]
    : defaultOrder;

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
  } ${isSelected ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 bg-[var(--theme-primary, var(--color-primary))]/5' : 'hover:bg-[var(--color-nested-base)]/50'}`}
>
  {#each effectiveOrder as slot}
    {#if slot === 'badge' && badge}
      <div
        class={`badge badge-primary badge-outline gap-1.5 px-3 py-1 font-heading font-semibold uppercase tracking-wider mb-2 ${align === 'center' ? 'mx-auto' : ''}`}
        style="font-size: var(--theme-text-caption, var(--text-caption-size, 10px));"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary, var(--color-primary))] animate-pulse"></span>
        <MapPin size={12} class="shrink-0" />
        <span>{badge}</span>
      </div>
    {:else if slot === 'title' && title}
      <h2
        class="font-heading text-[var(--theme-text-primary, var(--color-text-main))] tracking-tight leading-tight"
        style="font-size: var(--theme-text-h2, var(--text-h2-size, 26px)); font-weight: var(--theme-text-h2-weight, var(--text-h2-weight, 700));"
      >
        {title}
      </h2>
    {:else if slot === 'subtitle' && subtitle}
      <p
        class="text-[var(--theme-text-muted, var(--color-text-muted))] font-sans mt-1.5 max-w-2xl leading-relaxed {align === 'center' ? 'mx-auto' : ''}"
        style="font-size: var(--theme-text-body, var(--text-body-size, 16px));"
      >
        {subtitle}
      </p>
    {/if}
  {/each}
</div>
