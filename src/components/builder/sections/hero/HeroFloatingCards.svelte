<script lang="ts">
  import { Sparkles } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  import { resolveFeatureIcon, stripEmoji } from './heroIcons';

  export let badgeText: string = '';
  export let badgeIcon: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let floatingCards: Array<{ icon: string; title: string; desc: string }> = [];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'floating_cards'];

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isTablet = viewMode === 'tablet';

  $: hasFloatingCards = elementOrder.includes('floating_cards');
  $: isCardsActive = activeNodeId === 'hero_floating_cards' || activeNodeId === 'floating_cards';

  $: defaultCards = [
    { icon: 'Sparkles', title: 'Produk Terkurasi', desc: 'Kualitas bahan terbaik standar nasional.' },
    { icon: 'Zap', title: 'Pesan Instan', desc: 'Klik tombol WA langsung terhubung ke admin.' },
    { icon: 'ShieldCheck', title: 'Garansi 100%', desc: 'Barang rusak langsung kami ganti baru.' },
  ];
  $: activeCards = Array.isArray(floatingCards) && floatingCards.length === 3 ? floatingCards : defaultCards;
</script>

{#snippet cardsBlock()}
  {#if hasFloatingCards}
    <div
      data-node="hero_floating_cards"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_floating_cards')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_floating_cards')}
      class={`w-full grid gap-4 sm:gap-6 max-w-4xl p-2 rounded-3xl transition-all cursor-pointer ${
        isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-3 gap-3' : 'grid-cols-1 sm:grid-cols-3'
      } ${
        isCardsActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/5'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      {#each activeCards as card, idx}
        {@const IconComp = resolveFeatureIcon(card.icon) || Sparkles}
        {@const rotClass = idx === 0 ? (isMobile ? 'rotate-0' : 'sm:-rotate-2 hover:rotate-0') : idx === 1 ? (isMobile ? 'scale-100' : 'sm:scale-105 z-10') : (isMobile ? 'rotate-0' : 'sm:rotate-2 hover:rotate-0')}
        <div class={`p-5 sm:p-6 rounded-2xl bg-[var(--color-card-base)] border border-[var(--color-border)] shadow-md flex flex-col text-left gap-1.5 transition-transform ${rotClass}`}>
          <div class="w-10 h-10 rounded-xl bg-[var(--color-nested-base)] flex items-center justify-center text-[var(--color-primary)]">
            <svelte:component this={IconComp} class="w-5 h-5" />
          </div>
          <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)]">{stripEmoji(card.title)}</h3>
          <p class="text-xs text-[var(--color-text-secondary)] font-sans">{stripEmoji(card.desc)}</p>
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

<div class={`w-full ${isMobile ? 'py-4' : 'py-8'}`}>
  <HeroHeaderContent
    {badgeText}
    {badgeIcon}
    {tagName}
    {title}
    {subtitle}
    {ctaText}
    {ctaLink}
    {secondaryCtaText}
    {secondaryCtaLink}
    {waNumber}
    {activeNodeId}
    {selectNode}
    {selectNodeKey}
    {elementOrder}
    align="center"
    customBlocks={{ floating_cards: cardsBlock }}
  />
</div>
