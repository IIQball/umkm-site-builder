<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { HelpCircle } from 'lucide-svelte';

  export let sectionId: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeText: string = '';
  export let align: 'left' | 'center' | 'right' = 'center';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle'];
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let isActive: boolean = false;

  $: defaultOrder = ['badge', 'title', 'subtitle'];
  $: effectiveOrder = (Array.isArray(elementOrder) ? elementOrder : defaultOrder).filter(
    (k) => defaultOrder.includes(k)
  );

  $: isThisSectionSelected = isActive || $canvasStore?.selectedSectionId === sectionId;
  $: isBadgeActive = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'badge' || $canvasStore?.selectedNodeId === 'faq_badge');
  $: isTitleActive = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'title' || $canvasStore?.selectedNodeId === 'faq_title' || $canvasStore?.selectedNodeId === 'faq_header');
  $: isSubtitleActive = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'subtitle' || $canvasStore?.selectedNodeId === 'faq_subtitle');

  $: badgeStyle = nodeStyles?.['badge'] || nodeStyles?.['faq_badge'] || {};
  $: badgeColor = badgeStyle.color || '';
  $: badgeMarginTop = badgeStyle.marginTop || '0px';
  $: badgeMarginBottom = badgeStyle.marginBottom !== undefined && badgeStyle.marginBottom !== '' ? badgeStyle.marginBottom : '12px';

  $: titleStyle = nodeStyles?.['title'] || nodeStyles?.['faq_title'] || nodeStyles?.['faq_header'] || {};
  $: titleColor = titleStyle.color || '';
  $: titleMarginTop = titleStyle.marginTop || '0px';
  $: titleMarginBottom = titleStyle.marginBottom !== undefined && titleStyle.marginBottom !== '' ? titleStyle.marginBottom : '12px';

  $: subtitleStyle = nodeStyles?.['subtitle'] || nodeStyles?.['faq_subtitle'] || {};
  $: subtitleColor = subtitleStyle.color || '';
  $: subtitleMarginTop = subtitleStyle.marginTop || '0px';
  $: subtitleMarginBottom = subtitleStyle.marginBottom !== undefined && subtitleStyle.marginBottom !== '' ? subtitleStyle.marginBottom : '0px';

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
          style="background-color: color-mix(in srgb, {badgeColor || 'var(--theme-primary, var(--color-primary))'} 10%, transparent); border-color: color-mix(in srgb, {badgeColor || 'var(--theme-primary, var(--color-primary))'} 25%, transparent); color: {badgeColor || 'var(--theme-primary, var(--color-primary))'}; margin-top: {badgeMarginTop}; margin-bottom: {badgeMarginBottom}; border-radius: var(--theme-btn-border-radius, 9999px); font-family: var(--theme-heading-font, var(--font-heading));"
        >
          <HelpCircle size={12} class="text-current" />
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
          style="margin-top: {titleMarginTop}; margin-bottom: {titleMarginBottom};"
        >
          <h2
            class="cq-title font-heading font-extrabold tracking-tight"
            style="color: {titleColor || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading)); font-size: var(--theme-h2-size, 26px); line-height: var(--theme-h2-line-height, 1.25); font-weight: var(--theme-h2-font-weight, 700);"
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
          style="margin-top: {subtitleMarginTop}; margin-bottom: {subtitleMarginBottom};"
        >
          <p
            class="text-body-base max-w-2xl mx-auto leading-relaxed"
            style="color: {subtitleColor || 'var(--theme-text-muted, var(--color-text-secondary))'}; font-family: var(--theme-body-font, var(--font-body)); font-size: var(--theme-body-size, 16px); line-height: var(--theme-body-line-height, 1.6);"
          >
            {subtitle}
          </p>
        </div>
      {/if}
    {/each}
  </div>
{/if}
