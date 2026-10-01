<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { Check, Sparkles } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { buildWhatsAppOrderLink, resolveProductNodeStyle } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let waNumber: string = '';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  $: tiers = ((products.length >= 2 ? products.slice(0, 3) : [
    {
      name: 'Paket Hemat Icip-Icip',
      price: 55000,
      badge: 'Starter',
      description: 'Cocok untuk perorangan atau tester oleh-oleh.',
    },
    {
      name: 'Paket Syukuran Keluarga',
      price: 135000,
      badge: 'Paling Laris',
      description: 'Lengkap aneka varian rasa favorit keluarga besar.',
    },
  ]) as (ProductItem & { id?: string })[]);

  function selectTiers(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_bundle_tier');
    }
  }

  function selectCard(e: Event, idx: number, prod: any) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, prod.id || `product_item_${idx}`);
    }
  }

  function handleOrder(product: any) {
    if (onBuyNow) {
      onBuyNow(product, {});
      return;
    }
    const link = buildWhatsAppOrderLink(waNumber, product.name, product.price);
    if (typeof window !== 'undefined') window.open(link, '_blank');
  }
</script>

<div
  role="button"
  aria-label="Tiers Paket Bundling"
  tabindex="0"
  on:click={selectTiers}
  on:keydown={(e) => { if (e.key === 'Enter') selectTiers(e); }}
  class={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left cursor-pointer transition-all ${
    $canvasStore.selectedNodeId === 'catalog_bundle_tier' ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 rounded-3xl p-2' : ''
  }`}
>
  {#each tiers as tier, idx (tier.name + idx)}
    {@const isPopular = idx === 1}
    {@const isCardActive = $canvasStore.selectedNodeId === (tier.id || `product_item_${idx}`)}
    {@const pStyle = resolveProductNodeStyle(tier, idx, nodeStyles)}
    {@const currentPrice = Number(tier.price ?? 0)}
    {@const originalPrice = Number(tier.originalPrice) || (tier.showOriginalPrice === true && currentPrice > 0 ? Math.round(currentPrice * 1.3) : 0)}
    {@const hasDiscount = (tier.showOriginalPrice === true || (tier.showOriginalPrice !== false && !!tier.originalPrice && Number(tier.originalPrice) > currentPrice)) && originalPrice > currentPrice}

    <div
      data-node={tier.id || `product_item_${idx}`}
      data-node-id={tier.id || `product_item_${idx}`}
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, idx, tier)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, idx, tier); }}
      style={pStyle.marginStyle}
      class={`p-6 sm:p-7 rounded-3xl flex flex-col justify-between relative transition-all duration-200 cursor-pointer ${
        isPopular
          ? 'bg-blue-50/60 dark:bg-blue-950/40 border-2 border-primary shadow-lg'
          : 'bg-card border border-light/80 shadow-xs hover:shadow-md'
      } ${isCardActive ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100' : ''}`}
    >
      {#if isPopular}
        <span class="absolute -top-3 right-6 text-2xs font-heading font-semibold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm" style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));">
          <Sparkles size={11} />
          <span>POPULER</span>
        </span>
      {/if}

      <div>
        <span class={`text-2xs font-heading font-bold uppercase tracking-wider ${isPopular ? 'text-[var(--theme-secondary,var(--color-secondary))]' : 'text-[var(--color-text-muted)]'}`}>
          {tier.badge || `Tier 0${idx + 1}`}
        </span>
        <h3 class="font-heading font-black text-lg text-main mt-1 mb-2" style={pStyle.color ? `color: ${pStyle.color};` : ''}>
          {tier.name}
        </h3>
        <p class="text-xs text-secondary leading-relaxed mb-6">
          {tier.description}
        </p>

        <ul class="space-y-2.5 text-xs text-secondary border-t border-light/60 pt-4 mb-6">
          <li class="flex items-center gap-2">
            <Check size={14} class="text-primary shrink-0" />
            <span>Komposisi bahan premium pilihan</span>
          </li>
          <li class="flex items-center gap-2">
            <Check size={14} class="text-primary shrink-0" />
            <span>Kemasan eksklusif kedap udara</span>
          </li>
          <li class="flex items-center gap-2">
            <Check size={14} class="text-primary shrink-0" />
            <span>Kartu ucapan custom & garansi tiba aman</span>
          </li>
        </ul>
      </div>

      <div class="pt-4 border-t border-light/60">
        <div class="flex items-baseline gap-2 mb-3">
          <p class="font-heading font-black text-lg sm:text-xl text-[var(--color-primary)]">
            {formatIDR(tier.price)}
          </p>
          {#if hasDiscount}
            <span class="text-xs text-secondary line-through font-mono opacity-70">
              {formatIDR(originalPrice)}
            </span>
          {/if}
        </div>
        <button
          type="button"
          on:click|stopPropagation={() => handleOrder(tier)}
          class={`w-full h-10 font-heading font-bold text-xs transition-all active:scale-[0.98] ${
            isPopular
              ? 'bg-[var(--color-primary)] hover:opacity-90 text-white shadow-md'
              : 'border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-main)]'
          }`}
          style="border-radius: var(--btn-radius, 0.75rem);"
        >
          Pilih Paket Bundling
        </button>
      </div>
    </div>
  {/each}
</div>
