<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { resolveMapIcon } from './mapsIcons';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';

  export let sectionId: string = '';
  export let badge: string = 'Lokasi Gerai Fisik';
  export let badgeText: string = '';
  export let badgeIcon: string = 'MapPin';
  export let title: string = 'Kunjungi Outlet Resmi Kami';
  export let subtitle: string = '';
  export let align: 'left' | 'center' | 'right' = 'left';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle'];
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let isActive: boolean = false;

  $: displayBadge = badgeText || badge;

  $: defaultOrder = ['badge', 'title', 'subtitle'];
  $: effectiveOrder = Array.isArray(elementOrder)
    ? elementOrder.filter((s) => defaultOrder.includes(s))
    : defaultOrder;

  $: isThisSectionSelected = isActive || $canvasStore?.selectedSectionId === sectionId;
  $: isBadgeSelected = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'badge' || $canvasStore?.selectedNodeId === 'maps_badge');
  $: isTitleSelected = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'title' || $canvasStore?.selectedNodeId === 'maps_title' || $canvasStore?.selectedNodeId === 'maps_header');
  $: isSubtitleSelected = isThisSectionSelected && ($canvasStore?.selectedNodeId === 'subtitle' || $canvasStore?.selectedNodeId === 'maps_subtitle');

  $: badgeStyle = resolveMapsNodeStyle('badge', nodeStyles);
  $: titleStyle = resolveMapsNodeStyle('title', nodeStyles);
  $: subtitleStyle = resolveMapsNodeStyle('subtitle', nodeStyles);

  $: ResolvedBadgeIcon = resolveMapIcon(badgeIcon);

  function selectNode(e: Event, nodeId: string) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, nodeId);
    }
  }

  function handleKeydown(e: KeyboardEvent, nodeId: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectNode(e, nodeId);
    }
  }
</script>

<div
  class={`mb-5 transition-all duration-200 outline-none flex flex-col ${
    align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left'
  }`}
>
  {#each effectiveOrder as slot}
    {#if slot === 'badge' && displayBadge}
      <div
        data-node="badge"
        data-node-id="badge"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'badge')}
        on:keydown={(e) => handleKeydown(e, 'badge')}
        class={`inline-flex items-center rounded-full border text-2xs gap-1.5 font-heading font-medium mb-3 shadow-2xs px-3 py-1 transition-all cursor-pointer ${
          align === 'center' ? 'mx-auto' : ''
        } ${
          isBadgeSelected
            ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100'
            : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary,var(--color-primary))]/50'
        }`}
        style="{badgeStyle.color ? `color: ${badgeStyle.color} !important; border-color: ${badgeStyle.color} !important;` : 'color: var(--color-primary); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent);'} background-color: {badgeStyle.backgroundColor ? `${badgeStyle.backgroundColor} !important;` : 'color-mix(in srgb, var(--color-primary) 10%, transparent);'} margin-top: {badgeStyle.marginTop || '0px'}; margin-bottom: {badgeStyle.marginBottom || '12px'};"
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          style="background-color: currentColor;"
        ></span>
        {#if ResolvedBadgeIcon}
          <svelte:component this={ResolvedBadgeIcon} size={12} class="shrink-0" />
        {/if}
        <span>{displayBadge}</span>
      </div>
    {:else if slot === 'title' && title}
      <div
        data-node="title"
        data-node-id="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'title')}
        on:keydown={(e) => handleKeydown(e, 'title')}
        class={`cursor-pointer transition-all rounded-xl px-2 py-0.5 mb-2 ${
          isTitleSelected
            ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 bg-[var(--theme-primary,var(--color-primary))]/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary,var(--color-primary))]/50'
        }`}
        style={`margin-top: ${titleStyle.marginTop || '0px'}; margin-bottom: ${titleStyle.marginBottom || '12px'};`}
      >
        <h2
          class="font-heading text-[var(--theme-text-primary,var(--color-text-main))] tracking-tight leading-tight"
          style={`font-size: ${titleStyle.fontSize || 'var(--theme-text-h2, var(--text-h2-size, 26px))'}; font-weight: ${titleStyle.fontWeight || 'var(--theme-text-h2-weight, var(--text-h2-weight, 700))'}; ${titleStyle.color ? `color: ${titleStyle.color} !important;` : ''}`}
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
        on:click={(e) => selectNode(e, 'subtitle')}
        on:keydown={(e) => handleKeydown(e, 'subtitle')}
        class={`cursor-pointer transition-all rounded-xl px-2 py-0.5 ${
          align === 'center' ? 'mx-auto' : ''
        } ${
          isSubtitleSelected
            ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 bg-[var(--theme-primary,var(--color-primary))]/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary,var(--color-primary))]/50'
        }`}
        style={`margin-top: ${subtitleStyle.marginTop || '0px'}; margin-bottom: ${subtitleStyle.marginBottom || '0px'};`}
      >
        <p
          class="text-[var(--theme-text-muted,var(--color-text-muted))] mt-1.5 max-w-2xl leading-relaxed"
          style={`font-size: ${subtitleStyle.fontSize || 'var(--theme-text-body, var(--text-body-size, 16px))'}; ${subtitleStyle.color ? `color: ${subtitleStyle.color} !important;` : ''}`}
        >
          {subtitle}
        </p>
      </div>
    {/if}
  {/each}
</div>
