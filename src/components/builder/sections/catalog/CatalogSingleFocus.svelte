<script lang="ts">
  import type { ProductItem } from '@/types';
  import { ShoppingBag, CheckCircle, ShieldCheck } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { formatRupiah, buildWhatsAppOrderLink } from '../productCatalog.helpers';

  export let sectionId: string = '';
  export let products: ProductItem[] = [];
  export let waNumber: string = '';
  export let onBuyNow: (product: ProductItem, selections: Record<string, string>) => void = () => {};

  $: product = products[0] || {
    name: 'VCO Cold Pressed Virgin Coconut Oil 250ml',
    price: 48000,
    badge: 'Produk Juara',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Diproses dingin tanpa pemanasan dan bebas bahan kimia. Menjaga kemurnian asam laurat alami untuk imunitas dan metabolisme tubuh.',
  };

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

<div class="cq-prod-split-view items-center text-left bg-card border border-light/80 rounded-3xl p-6 sm:p-10 shadow-xs">
  <!-- Large Hero Photo -->
  <div
    role="button"
    tabindex="0"
    on:click={selectImage}
    on:keydown={(e) => { if (e.key === 'Enter') selectImage(e); }}
    class={`aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-nested relative group/img cursor-pointer transition-all ${
      $canvasStore.selectedNodeId === 'product_image_0' ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-xl' : 'hover:shadow-md'
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
      <span class="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
        {product.badge}
      </span>
    {/if}
  </div>

  <!-- Deep Focus Details -->
  <div class="space-y-4">
    <div
      role="button"
      aria-label="Deskripsi Manfaat Produk"
      tabindex="0"
      on:click={selectDesc}
      on:keydown={(e) => { if (e.key === 'Enter') selectDesc(e); }}
      class={`cursor-pointer transition-all rounded-2xl p-2 ${
        $canvasStore.selectedNodeId === 'product_desc'
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">
        Sorotan Produk Unggulan
      </span>
      <h3 class="font-heading text-xl sm:text-2xl font-black text-main mt-1 mb-2">
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
      role="button"
      aria-label="Tombol Pesan WhatsApp"
      tabindex="0"
      on:click={selectCta}
      on:keydown={(e) => { if (e.key === 'Enter') selectCta(e); }}
      class={`pt-4 border-t border-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer rounded-2xl p-2 ${
        $canvasStore.selectedNodeId === 'catalog_cta' ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
    >
      <div>
        <span class="text-xs text-secondary block font-mono">Harga Spesial</span>
        <span class="font-heading font-black text-2xl text-primary">
          {formatRupiah(product.price)}
        </span>
      </div>
      <button
        type="button"
        on:click|stopPropagation={handleDirectBuy}
        class="h-10 px-6 rounded-2xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-heading font-semibold text-xs transition-all shadow-md"
      >
        Pesan Langsung via WA
      </button>
    </div>
  </div>
</div>
