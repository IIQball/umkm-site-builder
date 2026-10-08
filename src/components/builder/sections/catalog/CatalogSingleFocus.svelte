<script lang="ts">
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';
  import { ShoppingBag, CheckCircle, ShieldCheck } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { buildWhatsAppOrderLink, resolveProductNodeStyle } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let waNumber: string = '';
  export let buyButtonText: string = 'Pesan Langsung via WA';
  export let nodeStyles: Record<string, Record<string, string>> = {};
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  $: product = products[0] || {
    name: 'VCO Cold Pressed Virgin Coconut Oil 250ml',
    price: 48000,
    badge: 'Produk Juara',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Diproses dingin tanpa pemanasan dan bebas bahan kimia. Menjaga kemurnian asam laurat alami untuk imunitas dan metabolisme tubuh.',
  };
  $: pStyle = resolveProductNodeStyle(product, 0, nodeStyles);
  $: currentPrice = Number(product?.price ?? 0);
  $: originalPrice = Number(product?.originalPrice) || (product?.showOriginalPrice === true && currentPrice > 0 ? Math.round(currentPrice * 1.3) : 0);
  $: hasDiscount = (product?.showOriginalPrice === true || (product?.showOriginalPrice !== false && !!product?.originalPrice && Number(product?.originalPrice) > currentPrice)) && originalPrice > currentPrice;

  function selectImage(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'product_image_0');
    }
  }

  function selectDesc(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'product_desc');
    }
  }

  function selectCta(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_cta');
    }
  }

  function handleDirectBuy() {
    if (onBuyNow) {
      onBuyNow(product, {});
      return;
    }
    const link = buildWhatsAppOrderLink(waNumber, product.name, product.price);
    if (typeof window !== 'undefined') window.open(link, '_blank');
  }
</script>

<div
  data-node="product_item_0"
  data-node-id="product_item_0"
  style={pStyle.marginStyle}
  class="cq-prod-split-view items-center text-left bg-card border border-light/80 rounded-3xl p-6 sm:p-10 shadow-xs"
>
  <!-- Large Hero Photo -->
  <div
    data-node="product_image_0"
    data-node-id="product_image_0"
    role="button"
    tabindex="0"
    on:click={selectImage}
    on:keydown={(e) => { if (e.key === 'Enter') selectImage(e); }}
    class={`aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-nested relative group/img cursor-pointer transition-all ${
      $canvasStore.selectedNodeId === 'product_image_0' ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-xl' : 'hover:shadow-md'
    }`}
  >
    {#if product.imageUrl}
      <img
        src={product.imageUrl}
        alt={product.name}
        class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
        loading="lazy"
      />
    {:else}
      <div class="w-full h-full flex items-center justify-center text-secondary/60">
        <ShoppingBag size={48} />
      </div>
    {/if}
    {#if product.badge}
      <span
        class="absolute top-3 left-3 text-2xs font-heading font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs"
        style="background-color: var(--theme-secondary, var(--color-secondary)); color: var(--theme-secondary-text, var(--color-text-main, #0f172a));"
      >
        {product.badge}
      </span>
    {/if}
  </div>

  <!-- Deep Focus Details -->
  <div class="space-y-4">
    <div
      data-node="product_desc"
      data-node-id="product_desc"
      role="button"
      aria-label="Deskripsi Manfaat Produk"
      tabindex="0"
      on:click={selectDesc}
      on:keydown={(e) => { if (e.key === 'Enter') selectDesc(e); }}
      class={`cursor-pointer transition-all rounded-2xl p-2 ${
        $canvasStore.selectedNodeId === 'product_desc'
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100'
          : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <span class="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-primary)]">
        Sorotan Produk Unggulan
      </span>
      <h3 class="font-heading text-xl sm:text-2xl font-black text-main mt-1 mb-2" style={pStyle.color ? `color: ${pStyle.color};` : ''}>
        {product.name}
      </h3>
      <p class="text-xs sm:text-sm text-secondary leading-relaxed">
        {product.description}
      </p>

      <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-light/60 text-xs text-secondary">
        <div class="flex items-center gap-2">
          <CheckCircle size={15} class="text-emerald-600 shrink-0" />
          <span>100% Organik & Alami</span>
        </div>
        <div class="flex items-center gap-2">
          <ShieldCheck size={15} class="text-emerald-600 shrink-0" />
          <span>Sertifikasi Halal & BPOM</span>
        </div>
      </div>
    </div>

    <div
      data-node="catalog_cta"
      data-node-id="catalog_cta"
      role="button"
      aria-label="Tombol Pesan WhatsApp"
      tabindex="0"
      on:click={selectCta}
      on:keydown={(e) => { if (e.key === 'Enter') selectCta(e); }}
      class={`pt-4 border-t border-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer rounded-2xl p-2 ${
        $canvasStore.selectedNodeId === 'catalog_cta' ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div>
        <span class="text-xs text-secondary block font-mono">Harga Spesial</span>
        <div class="flex items-baseline gap-2 flex-wrap">
          <span class="font-heading font-black text-2xl text-primary">
            {formatIDR(product.price)}
          </span>
          {#if hasDiscount}
            <span class="text-sm text-secondary/60 line-through font-mono">
              {formatIDR(originalPrice)}
            </span>
          {/if}
        </div>
      </div>
      <button
        type="button"
        on:click|stopPropagation={handleDirectBuy}
        class="h-10 px-6 active:scale-[0.98] font-heading font-bold text-xs transition-all shadow-xs cursor-pointer hover:opacity-90"
        style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
      >
        <span>{buyButtonText || 'Pesan Langsung via WA'}</span>
      </button>
    </div>
  </div>
</div>
