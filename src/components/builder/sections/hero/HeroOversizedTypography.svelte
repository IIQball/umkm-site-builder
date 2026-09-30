<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { ArrowRight } from 'lucide-svelte';
  import { resolveFeatureIcon, stripEmoji } from './heroIcons';

  export let badgeText: string = '';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta'];

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isTablet = viewMode === 'tablet';

  $: effectiveOrder = (
    elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle', 'cta']
  ).filter((k) => k !== 'image');

  $: isBadgeActive = activeNodeId === 'hero_badge' || activeNodeId === 'badge';
  $: isTitleActive = activeNodeId === 'hero_title' || activeNodeId === 'title';
  $: isSubtitleActive = activeNodeId === 'hero_subtitle' || activeNodeId === 'subtitle';
  $: isCtaActive = activeNodeId === 'hero_cta' || activeNodeId === 'cta';
</script>

<div class={`flex flex-col items-center text-center ${isMobile ? 'py-6 gap-3' : isTablet ? 'py-8 gap-4' : 'py-12 gap-6'}`}>
  {#each effectiveOrder as slot (slot)}
    {#if slot === 'badge' && badgeText}
      {@const IconComponent = resolveFeatureIcon(badgeIcon)}
      <div
        data-node="badge"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_badge')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_badge')}
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 9999px)); font-family: var(--font-heading, inherit);"
        class={`badge badge-outline inline-flex items-center gap-1.5 px-3 py-1 text-2xs font-heading font-medium border transition-all cursor-pointer shadow-2xs ${
          isBadgeActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/15'
            : 'bg-[var(--color-nested-base)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        {#if IconComponent}
          <svelte:component this={IconComponent} size={12} class="text-[var(--color-primary)] shrink-0" />
        {:else}
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--color-primary);"></span>
        {/if}
        <span>{stripEmoji(badgeText)}</span>
      </div>
    {:else if slot === 'title'}
      <svelte:element
        this={tagName || 'h1'}
        data-node="title"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_title')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_title')}
        style="font-weight: var(--text-h1-weight, inherit); color: var(--color-text-main);"
        class={`font-heading font-black tracking-tight transition-all cursor-pointer rounded-2xl p-2 max-w-4xl ${
          isMobile
            ? 'text-3xl leading-tight'
            : isTablet
              ? 'text-5xl leading-tight'
              : 'text-6xl md:text-7xl lg:text-8xl leading-none tracking-tighter'
        } ${
          isTitleActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        {title}
      </svelte:element>
    {:else if slot === 'subtitle' && subtitle}
      <div
        data-node="subtitle"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_subtitle')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_subtitle')}
        style="color: var(--color-text-secondary);"
        class={`max-w-2xl font-medium leading-relaxed font-sans transition-all cursor-pointer rounded-xl p-2 ${
          isMobile ? 'text-xs sm:text-sm' : isTablet ? 'text-sm sm:text-base' : 'text-base sm:text-xl'
        } ${
          isSubtitleActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        <p>{subtitle}</p>
      </div>
    {:else if slot === 'cta' && ctaText}
      <div
        data-node="cta"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_cta')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_cta')}
        class={`pt-2 sm:pt-4 rounded-2xl p-2 transition-all cursor-pointer ${
          isCtaActive
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/10'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
      >
        <a
          href={ctaLink || '#'}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, white);"
          class={`inline-flex items-center justify-center font-heading font-bold hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-md ${
            isMobile
              ? 'h-10 min-h-[40px] px-6 text-sm'
              : 'h-12 min-h-[48px] px-10 text-base'
          }`}
        >
          <span>{ctaText}</span>
          <ArrowRight size={18} class="ml-2" />
        </a>
      </div>
    {/if}
  {/each}
</div>
