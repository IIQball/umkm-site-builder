<script lang="ts">
  import { CheckCircle2 } from 'lucide-svelte';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'trust_badges'];

  $: hasBadges = elementOrder.includes('trust_badges');
  $: isBadgesActive = activeNodeId === 'hero_trust_badges' || activeNodeId === 'trust_badges';
</script>

{#snippet badgesBlock()}
  {#if hasBadges}
    <div
      data-node="hero_trust_badges"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_trust_badges')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_trust_badges')}
      class={`w-full max-w-md p-6 rounded-2xl bg-[var(--color-card-base)]/80 backdrop-blur-md border border-[var(--color-border)] shadow-xl flex flex-col items-center gap-4 transition-all cursor-pointer ${
        isBadgesActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-primary/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="flex items-center gap-4 text-xs font-medium text-[var(--color-text-secondary)]">
        <span class="flex items-center gap-1"><CheckCircle2 size={14} style="color: var(--color-primary);" /> Kualitas Asli</span>
        <span class="flex items-center gap-1"><CheckCircle2 size={14} style="color: var(--color-primary);" /> Siap Kirim</span>
        <span class="flex items-center gap-1"><CheckCircle2 size={14} style="color: var(--color-primary);" /> Garansi Aman</span>
      </div>
    </div>
  {/if}
{/snippet}

<div class="py-12 w-full">
  <HeroHeaderContent
    {badgeText}
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
