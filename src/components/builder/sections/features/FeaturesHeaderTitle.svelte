<script lang="ts">
  export let badgeText: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeColorClass: string = '';
  export let dotColorClass: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let align: 'center' | 'left' = 'center';
  export let maxWidthClass: string = 'max-w-2xl';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle'];

  $: effectiveOrder = (elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle']).filter(
    (k) => ['badge', 'title', 'subtitle'].includes(k)
  );

  $: isHeadingActive =
    activeNodeId === 'features_heading' ||
    activeNodeId === 'header' ||
    activeNodeId === 'badge' ||
    activeNodeId === 'title' ||
    activeNodeId === 'subtitle';

  const handleHeadingClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_heading');
  };

  const handleHeadingKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_heading');
    }
  };
</script>

{#if effectiveOrder.length > 0}
<div
  role="button"
  tabindex="0"
  on:click={handleHeadingClick}
  on:keydown={handleHeadingKeydown}
  class={`flex flex-col ${align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'} ${maxWidthClass} mb-8 p-3 rounded-2xl transition-all cursor-pointer ${
    isHeadingActive
      ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 bg-[var(--color-primary)]/10'
      : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
  }`}
>
  {#each effectiveOrder as slot}
    {#if slot === 'badge' && badgeText}
      <span
        data-node="badge"
        class={`inline-flex items-center rounded-full border text-2xs gap-1.5 font-heading font-medium mb-3 shadow-2xs px-3 py-1 ${badgeColorClass}`}
        style={!badgeColorClass ? 'background-color: color-mix(in srgb, var(--color-primary) 10%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary);' : ''}
      >
        <span
          class={`w-1.5 h-1.5 rounded-full ${dotColorClass}`}
          style={!dotColorClass ? 'background-color: var(--color-primary);' : ''}
        ></span>
        {badgeText}
      </span>
    {:else if slot === 'title' && title}
      <h2
        data-node="title"
        class="cq-title font-heading font-extrabold text-[var(--color-text-main)] tracking-tight mb-3"
      >
        {title}
      </h2>
    {:else if slot === 'subtitle' && subtitle}
      <p
        data-node="subtitle"
        class="text-body-base text-[var(--color-text-secondary)] leading-relaxed font-sans"
      >
        {subtitle}
      </p>
    {/if}
  {/each}
</div>
{/if}
