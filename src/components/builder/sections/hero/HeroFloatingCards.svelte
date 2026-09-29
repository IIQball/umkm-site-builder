<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = '';
  export let tagName: string = 'h1';
  export let title: string = '';
  export let subtitle: string = '';
  export let ctaText: string = '';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'floating_cards'];

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isTablet = viewMode === 'tablet';

  $: hasFloatingCards = elementOrder.includes('floating_cards');
  $: isCardsActive = activeNodeId === 'hero_floating_cards' || activeNodeId === 'floating_cards';
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
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-primary/5'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class={`p-5 sm:p-6 rounded-2xl bg-[var(--color-card-base)] border border-[var(--color-border)] shadow-md flex flex-col text-left gap-1.5 transition-transform ${isMobile ? 'rotate-0' : 'sm:-rotate-2 hover:rotate-0'}`}>
        <span class="text-2xl">✨</span>
        <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)]">Produk Terkurasi</h3>
        <p class="text-xs text-[var(--color-text-secondary)] font-sans">Kualitas bahan terbaik standar nasional.</p>
      </div>
      <div class={`p-5 sm:p-6 rounded-2xl bg-[var(--color-card-base)] border border-[var(--color-border)] shadow-xl flex flex-col text-left gap-1.5 z-10 transition-transform ${isMobile ? 'scale-100' : 'sm:scale-105'}`}>
        <span class="text-2xl">⚡</span>
        <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)]">Pesan Instan</h3>
        <p class="text-xs text-[var(--color-text-secondary)] font-sans">Klik tombol WA langsung terhubung ke admin.</p>
      </div>
      <div class={`p-5 sm:p-6 rounded-2xl bg-[var(--color-card-base)] border border-[var(--color-border)] shadow-md flex flex-col text-left gap-1.5 transition-transform ${isMobile ? 'rotate-0' : 'sm:rotate-2 hover:rotate-0'}`}>
        <span class="text-2xl">🛡️</span>
        <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)]">Garansi 100%</h3>
        <p class="text-xs text-[var(--color-text-secondary)] font-sans">Barang rusak langsung kami ganti baru.</p>
      </div>
    </div>
  {/if}
{/snippet}

<div class={`w-full ${isMobile ? 'py-4' : 'py-8'}`}>
  <HeroHeaderContent
    {badgeText}
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
