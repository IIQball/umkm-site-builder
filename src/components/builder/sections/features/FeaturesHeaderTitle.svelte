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
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: effectiveOrder = (elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle']).filter(
    (k) => ['badge', 'title', 'subtitle'].includes(k)
  );

  $: isBadgeActive = activeNodeId === 'badge' || activeNodeId === 'feature_badge';
  $: isTitleActive =
    activeNodeId === 'title' ||
    activeNodeId === 'feature_title' ||
    activeNodeId === 'features_heading';
  $: isSubtitleActive = activeNodeId === 'subtitle' || activeNodeId === 'feature_subtitle';

  $: badgeStyle = nodeStyles?.['badge'] || nodeStyles?.['feature_badge'] || {};
  $: titleStyle = nodeStyles?.['title'] || nodeStyles?.['feature_title'] || nodeStyles?.['features_heading'] || {};
  $: subtitleStyle = nodeStyles?.['subtitle'] || nodeStyles?.['feature_subtitle'] || {};

  const handleBadgeClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (selectNode) selectNode(e, 'badge');
  };

  const handleBadgeKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      if (selectNode) selectNode(e, 'badge');
    }
  };

  const handleTitleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (selectNode) selectNode(e, 'title');
  };

  const handleTitleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      if (selectNode) selectNode(e, 'title');
    }
  };

  const handleSubtitleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (selectNode) selectNode(e, 'subtitle');
  };

  const handleSubtitleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      if (selectNode) selectNode(e, 'subtitle');
    }
  };
</script>

{#if effectiveOrder.length > 0}
<div class={`flex flex-col ${align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'} ${maxWidthClass} mb-8`}>
  {#each effectiveOrder as slot}
    {#if slot === 'badge' && badgeText}
      <div
        data-node="badge"
        role="button"
        tabindex="0"
        on:click={handleBadgeClick}
        on:keydown={handleBadgeKeydown}
        class={`inline-flex items-center rounded-full border text-2xs gap-1.5 font-heading font-medium shadow-2xs px-3 py-1 cursor-pointer transition-all ${
          isBadgeActive
            ? 'ring-2 ring-[var(--color-primary)] ring-offset-2'
            : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
        } ${badgeColorClass}`}
        style="{!badgeColorClass ? 'background-color: color-mix(in srgb, var(--color-primary) 10%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary);' : ''} {badgeStyle.color ? `color: ${badgeStyle.color};` : ''} margin-top: {badgeStyle.marginTop || '0px'}; margin-bottom: {badgeStyle.marginBottom || '12px'};"
      >
        <span
          class={`w-1.5 h-1.5 rounded-full ${dotColorClass}`}
          style={!dotColorClass ? 'background-color: var(--color-primary);' : ''}
        ></span>
        <span>{badgeText}</span>
      </div>
    {:else if slot === 'title' && title}
      <div
        data-node="title"
        role="button"
        tabindex="0"
        on:click={handleTitleClick}
        on:keydown={handleTitleKeydown}
        class={`cursor-pointer transition-all rounded-xl px-2 py-0.5 ${
          isTitleActive
            ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 bg-[var(--color-primary)]/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
        }`}
        style="margin-top: {titleStyle.marginTop || '0px'}; margin-bottom: {titleStyle.marginBottom || '12px'};"
      >
        <h2 class="cq-title font-heading font-extrabold tracking-tight" style="color: {titleStyle.color || 'var(--color-text-main)'};">
          {title}
        </h2>
      </div>
    {:else if slot === 'subtitle' && subtitle}
      <div
        data-node="subtitle"
        role="button"
        tabindex="0"
        on:click={handleSubtitleClick}
        on:keydown={handleSubtitleKeydown}
        class={`cursor-pointer transition-all rounded-xl px-2 py-0.5 ${
          isSubtitleActive
            ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 bg-[var(--color-primary)]/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
        }`}
        style="margin-top: {subtitleStyle.marginTop || '0px'}; margin-bottom: {subtitleStyle.marginBottom || '0px'};"
      >
        <p class="text-body-base leading-relaxed" style="color: {subtitleStyle.color || 'var(--color-text-secondary)'};">
          {subtitle}
        </p>
      </div>
    {/if}
  {/each}
</div>
{/if}
