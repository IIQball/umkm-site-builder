<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeText: string = '';
  export let align: 'left' | 'center' | 'right' = 'center';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle'];

  $: effectiveOrder = (elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle']).filter(
    (k) => k !== 'catalog_grid'
  );

  $: isHeaderSelected = $canvasStore.selectedNodeId === 'catalog_header';

  function handleSelectContainer(e?: Event) {
    if (e) e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_header');
    }
  }

  function handleSelectSlot(e: Event, slot: string) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, slot);
    }
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSelectContainer(e);
  }
</script>

{#if title || subtitle || badgeText}
  <div
    data-node="catalog_header"
    data-node-id="catalog_header"
    role="button"
    tabindex="0"
    on:click={handleSelectContainer}
    on:keydown={handleKey}
    class={`flex flex-col cursor-pointer transition-all duration-150 mb-8 rounded-2xl p-3 ${
      align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center'
    } ${
      isHeaderSelected
        ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 dark:ring-offset-base-100'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/60'
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
          on:keydown={(e) => e.key === 'Enter' && handleSelectSlot(e, 'badge')}
          class={`inline-flex items-center rounded-full border text-2xs gap-1.5 font-heading font-medium mb-3 shadow-2xs px-3 py-1 transition-all cursor-pointer ${
            $canvasStore.selectedNodeId === 'badge' ? 'ring-2 ring-[var(--color-primary)] ring-offset-1' : ''
          }`}
          style="background-color: color-mix(in srgb, var(--color-primary) 10%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary);"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            style="background-color: var(--color-primary);"
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
          on:keydown={(e) => e.key === 'Enter' && handleSelectSlot(e, 'title')}
          class={`inline-block transition-all ${
            $canvasStore.selectedNodeId === 'title' ? 'ring-2 ring-[var(--color-primary)] rounded-lg' : ''
          }`}
        >
          <h2 class="cq-title font-heading font-extrabold text-[var(--color-text-main)] tracking-tight mb-3">
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
          on:keydown={(e) => e.key === 'Enter' && handleSelectSlot(e, 'subtitle')}
          class={`inline-block transition-all ${
            $canvasStore.selectedNodeId === 'subtitle' ? 'ring-2 ring-[var(--color-primary)] rounded-lg' : ''
          }`}
        >
          <p class="text-body-base text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed font-sans">
            {subtitle}
          </p>
        </div>
      {/if}
    {/each}
  </div>
{/if}
