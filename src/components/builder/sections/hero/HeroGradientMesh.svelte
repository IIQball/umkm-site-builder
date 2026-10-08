<script lang="ts">
  import { CheckCircle2 } from 'lucide-svelte';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  import { resolveFeatureIcon, stripEmoji } from './heroIcons';

  export let badgeText: string = '';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let trustBadges: Array<{ text: string; icon?: string }> = [];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'trust_badges'];

  $: hasBadges = elementOrder.includes('trust_badges');
  $: isBadgesActive = activeNodeId === 'hero_trust_badges' || activeNodeId === 'trust_badges';
  $: defaultBadges = [
    { text: 'Kualitas Asli', icon: 'CheckCircle2' },
    { text: 'Siap Kirim', icon: 'CheckCircle2' },
    { text: 'Garansi Aman', icon: 'CheckCircle2' },
  ];
  $: activeBadges = Array.isArray(trustBadges) && trustBadges.length > 0 ? trustBadges : defaultBadges;
</script>

{#snippet badgesBlock()}
  {#if hasBadges}
    <div
      data-node="hero_trust_badges"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_trust_badges')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_trust_badges')}
      class={`w-full max-w-md p-6 rounded-2xl bg-card/80 backdrop-blur-md border border-light shadow-xl flex flex-col items-center gap-4 transition-all cursor-pointer ${
        isBadgesActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-secondary">
        {#each activeBadges as badge}
          {@const IconComp = resolveFeatureIcon(badge.icon || 'CheckCircle2') || CheckCircle2}
          <span class="flex items-center gap-1.5">
            <svelte:component this={IconComp} size={14} class="text-primary" />
            <span>{stripEmoji(badge.text)}</span>
          </span>
        {/each}
      </div>
    </div>
  {/if}
{/snippet}

<div class="py-12 w-full">
  <HeroHeaderContent
    {badgeText}
    {badgeIcon}
    {tagName}
    {title}
    {subtitle}
    {ctaText}
    {ctaLink}
    {activeNodeId}
    {selectNode}
    {selectNodeKey}
    {elementOrder}
    align="center"
    customBlocks={{ trust_badges: badgesBlock }}
  />
</div>
