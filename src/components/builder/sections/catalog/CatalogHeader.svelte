<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeText: string = '';
  export let align: 'left' | 'center' | 'right' = 'center';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle'];
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let isActive: boolean = false;

  $: badgeStyle = nodeStyles?.['badge'] || nodeStyles?.['catalog_badge'] || {};
  $: titleStyle = nodeStyles?.['title'] || nodeStyles?.['catalog_title'] || nodeStyles?.['catalog_header'] || {};
  $: subtitleStyle = nodeStyles?.['subtitle'] || nodeStyles?.['catalog_subtitle'] || {};

  $: effectiveOrder = (elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle']).filter(
    (k) => k !== 'catalog_grid'
  );

  $: isThisSectionSelected = isActive || $canvasStore?.selectedSectionId === sectionId;
  $: isBadgeActive = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'badge' || $canvasStore?.selectedNodeId === 'catalog_badge');
  $: isTitleActive = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'title' || $canvasStore?.selectedNodeId === 'catalog_title' || $canvasStore?.selectedNodeId === 'catalog_header');
  $: isSubtitleActive = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'subtitle' || $canvasStore?.selectedNodeId === 'catalog_subtitle');

  function handleSelectSlot(e: Event, slot: string) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, slot);
    }
  }
</script>

{#if title || subtitle || badgeText}
  <div
    class={`flex flex-col mb-8 ${
      align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center'
    }`}
  >
    {#each effectiveOrder as slot}
      {#if slot === 'badge' && badgeText}
        <div
          data-node="badge"
          data-node-id="badge"
          role="button"
          tabindex="0"
          on:click={(e) => handleSelectSlot(e, 'badge')}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectSlot(e, 'badge')}
          class={`inline-flex items-center rounded-full border text-2xs gap-1.5 font-heading font-medium mb-3 shadow-2xs px-3 py-1 transition-all cursor-pointer ${
            isBadgeActive
              ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2'
              : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary, var(--color-primary))]/50'
          }`}
          style="{badgeStyle.color ? `color: ${badgeStyle.color} !important; border-color: ${badgeStyle.color} !important;` : 'color: var(--color-primary); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent);'} background-color: color-mix(in srgb, var(--color-primary) 10%, transparent); margin-top: {badgeStyle.marginTop || '0px'}; margin-bottom: {badgeStyle.marginBottom || '12px'};"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            style="background-color: currentColor;"
          ></span>
          <span>{badgeText}</span>
        </div>
      {:else if slot === 'title' && title}
        <div
          data-node="title"
          data-node-id="title"
          role="button"
          tabindex="0"
          on:click={(e) => handleSelectSlot(e, 'title')}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectSlot(e, 'title')}
          class={`cursor-pointer transition-all rounded-xl px-2 py-0.5 mb-2 ${
            isTitleActive
              ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 bg-[var(--theme-primary, var(--color-primary))]/10'
              : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary, var(--color-primary))]/50'
          }`}
          style="margin-top: {titleStyle.marginTop || '0px'}; margin-bottom: {titleStyle.marginBottom || '12px'};"
        >
          <h2
            class="cq-title font-heading font-extrabold tracking-tight"
            style="{titleStyle.color ? `color: ${titleStyle.color} !important;` : 'color: var(--theme-text-primary, var(--color-text-main));'} font-family: var(--theme-heading-font, var(--font-heading));"
          >
            {title}
          </h2>
        </div>
      {:else if slot === 'subtitle' && subtitle}
        <div
          data-node="subtitle"
          data-node-id="subtitle"
          role="button"
          tabindex="0"
          on:click={(e) => handleSelectSlot(e, 'subtitle')}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectSlot(e, 'subtitle')}
          class={`cursor-pointer transition-all rounded-xl px-2 py-0.5 ${
            isSubtitleActive
              ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 bg-[var(--theme-primary, var(--color-primary))]/10'
              : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary, var(--color-primary))]/50'
          }`}
          style="margin-top: {subtitleStyle.marginTop || '0px'}; margin-bottom: {subtitleStyle.marginBottom || '0px'};"
        >
          <p
            class="text-body-base max-w-2xl mx-auto leading-relaxed"
            style="{subtitleStyle.color ? `color: ${subtitleStyle.color} !important;` : 'color: var(--theme-text-muted, var(--color-text-secondary));'} font-family: var(--theme-body-font, var(--font-family));"
          >
            {subtitle}
          </p>
        </div>
      {/if}
    {/each}
  </div>
{/if}
