<script lang="ts">
  export let badgeText: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeColorClass: string = 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-200/90 dark:border-blue-800/80 text-[var(--color-primary,#2563eb)]';
  export let dotColorClass: string = 'bg-[var(--color-primary,#2563eb)]';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let align: 'center' | 'left' = 'center';
  export let maxWidthClass: string = 'max-w-2xl';

  $: isHeadingActive = activeNodeId === 'features_heading' || activeNodeId === 'header';

  const handleHeadingClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_heading');
  };

  const handleHeadingKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_heading');
    }
  };
</script>

<div
  role="button"
  tabindex="0"
  on:click={handleHeadingClick}
  on:keydown={handleHeadingKeydown}
  class={`${align === 'center' ? 'text-center mx-auto' : 'text-left'} ${maxWidthClass} mb-8 p-3 rounded-2xl transition-all cursor-pointer ${
    isHeadingActive
      ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
      : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
  }`}
>
  {#if badgeText}
    <span
      data-node="badge"
      class={`inline-flex items-center rounded-full border px-2.5 py-1 text-2xs gap-1.5 font-heading font-medium mb-3 shadow-2xs ${badgeColorClass}`}
    >
      <span class={`w-1.5 h-1.5 rounded-full ${dotColorClass}`}></span>
      {badgeText}
    </span>
  {/if}
  {#if title}
    <h2 data-node="title" class="cq-title text-heading-lg font-heading font-extrabold text-[var(--color-text-main,#0f172a)] tracking-tight mb-3">
      {title}
    </h2>
  {/if}
  {#if subtitle}
    <p data-node="subtitle" class="text-body-base text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
      {subtitle}
    </p>
  {/if}
</div>
