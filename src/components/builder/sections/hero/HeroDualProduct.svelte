<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Paket Bundling Spesial';
  export let tagName: string = 'h1';
  export let title: string = 'Dua Varian Paling Dicari Pekan Ini';
  export let subtitle: string = 'Pilih paket bundling favorit untuk mendapatkan gratis ongkir dan bonus merchandise menarik.';
  export let ctaText: string = 'Pesan Varian';
  export let ctaLink: string = '#products';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'product_cards'];

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isTablet = viewMode === 'tablet';

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin membeli ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;

  $: hasProductCards = elementOrder.includes('product_cards');
  $: isProductActive = activeNodeId === 'hero_product_cards' || activeNodeId === 'product_cards';
</script>

{#snippet cardsBlock()}
  {#if hasProductCards}
    <div
      data-node="hero_product_cards"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_product_cards')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_product_cards')}
      class={`grid gap-4 sm:gap-6 mx-auto text-left p-2 rounded-2xl transition-all cursor-pointer ${
        isMobile ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
      } ${
        isProductActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-primary/5'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="card bg-[var(--color-card-base)] p-4 sm:p-5 rounded-2xl shadow-md border border-[var(--color-border)]">
        <div class="aspect-video w-full rounded-xl overflow-hidden bg-[var(--color-nested-base)] mb-3">
          <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80" alt="Varian Paket 1" class="w-full h-full object-cover" />
        </div>
        <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)] mb-1">Paket Varian A - Best Seller</h3>
        <p class="text-xs text-[var(--color-text-secondary)] mb-4 font-sans">Cita rasa unik dengan kemasan ramah lingkungan</p>
        <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
          <span class="font-heading font-bold text-sm" style="color: var(--color-primary);">Rp 45.000</span>
          <a
            href={effectiveCtaLink}
            target={waNumber ? '_blank' : '_self'}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
            class="btn btn-primary btn-xs sm:btn-sm h-8 px-4 text-xs font-heading font-semibold shadow-xs"
          >
            {ctaText || 'Pesan'}
          </a>
        </div>
      </div>

      <div class="card bg-[var(--color-card-base)] p-4 sm:p-5 rounded-2xl shadow-md border border-[var(--color-border)]">
        <div class="aspect-video w-full rounded-xl overflow-hidden bg-[var(--color-nested-base)] mb-3">
          <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80" alt="Varian Paket 2" class="w-full h-full object-cover" />
        </div>
        <h3 class="font-heading font-bold text-sm text-[var(--color-text-main)] mb-1">Paket Varian B - Premium</h3>
        <p class="text-xs text-[var(--color-text-secondary)] mb-4 font-sans">Kualitas unggulan dengan aroma khas istimewa</p>
        <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
          <span class="font-heading font-bold text-sm" style="color: var(--color-primary);">Rp 65.000</span>
          <a
            href={effectiveCtaLink}
            target={waNumber ? '_blank' : '_self'}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
            class="btn btn-primary btn-xs sm:btn-sm h-8 px-4 text-xs font-heading font-semibold shadow-xs"
          >
            {ctaText || 'Pesan'}
          </a>
        </div>
      </div>
    </div>
  {/if}
{/snippet}

<div class={`text-center w-full ${isMobile ? 'py-6' : isTablet ? 'py-10' : 'py-12 md:py-16'}`}>
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
    customBlocks={{ product_cards: cardsBlock }}
  />
</div>
