<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { apiFetch } from '@/lib/api/parse-response';
  import { formatIDR } from '@/lib/currency';
  import { Button } from '@/components/ui';
  import { toast } from '@/lib/toast';
  import { getWebpProductUrl } from './gallery-download.helpers';

  export let storeId: string = '';
  export let imageUrl: string = '';
  export let featureType: string = 'product_poster';

  const dispatch = createEventDispatcher<{
    attached: { productId: string; productName: string };
    cancel: void;
  }>();

  interface StoreProductItem {
    id: string;
    name: string;
    price: number;
    basePrice?: number;
    imageUrl?: string;
    imageUrls?: string[] | Array<{ url: string }>;
  }

  let products: StoreProductItem[] = [];
  let loading = false;
  let attachingId: string | null = null;

  async function loadProducts() {
    if (!storeId) return;
    loading = true;
    try {
      const res = await apiFetch<StoreProductItem[] | { items?: StoreProductItem[] }>(
        `/api/stores/${storeId}/products?limit=50`
      );
      if (res.success && res.data) {
        products = Array.isArray(res.data) ? res.data : (res.data.items || []);
      }
    } catch {
      toast.error('Gagal memuat daftar produk toko');
    } finally {
      loading = false;
    }
  }

  function resolveThumb(p: StoreProductItem): string {
    if (p.imageUrl) return p.imageUrl;
    if (Array.isArray(p.imageUrls) && p.imageUrls.length > 0) {
      const first = p.imageUrls[0];
      return typeof first === 'string' ? first : first?.url || '';
    }
    return '';
  }

  async function handleSelectProduct(product: StoreProductItem) {
    if (!product || attachingId || !imageUrl) return;
    attachingId = product.id;

    const webpUrl = getWebpProductUrl(imageUrl);
    const validAttachmentType =
      featureType === 'packaging_mockup'
        ? 'packaging_mockup'
        : featureType === 'logo'
          ? 'logo'
          : 'product_poster';

    try {
      const res = await apiFetch('/api/tenant/products/attach-ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          cloudinaryUrl: webpUrl,
          attachmentType: validAttachmentType,
        }),
      });

      if (res.success) {
        toast.success(`Gambar berhasil dipasang ke produk ${product.name}!`);
        dispatch('attached', { productId: product.id, productName: product.name });
      } else {
        toast.error('Terjadi gangguan, silakan coba beberapa saat lagi.');
      }
    } catch {
      toast.error('Terjadi gangguan, silakan coba beberapa saat lagi.');
    } finally {
      attachingId = null;
    }
  }

  onMount(() => {
    loadProducts();
  });
</script>

<div class="space-y-4 max-h-[60vh] overflow-y-auto p-1">
  <div class="flex items-center justify-between pb-2 border-b border-white/10 text-white">
    <div>
      <h4 class="font-heading font-bold text-sm">Pilih Produk</h4>
      <p class="text-2xs text-white/60">Klik salah satu produk untuk memasang gambar ini (format WebP)</p>
    </div>
    <Button
      type="button"
      variant="ghost"
      size="xs"
      class="text-xs text-white/70 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20"
      on:click={() => dispatch('cancel')}
    >
      Batal
    </Button>
  </div>

  {#if loading}
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {#each [1, 2, 3, 4, 5, 6] as _}
        <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 animate-pulse space-y-2">
          <div class="aspect-square bg-white/10 rounded-lg"></div>
          <div class="h-3 bg-white/10 rounded w-3/4"></div>
          <div class="h-2 bg-white/10 rounded w-1/2"></div>
        </div>
      {/each}
    </div>
  {:else if products.length === 0}
    <div class="text-center py-8 text-white/60 text-xs">
      Belum ada produk terdaftar di toko Anda.
    </div>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {#each products as product (product.id)}
        {@const thumb = resolveThumb(product)}
        {@const isAttachingThis = attachingId === product.id}
        <div
          role="button"
          tabindex="0"
          class="group text-left p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-primary transition-all duration-200 cursor-pointer flex flex-col justify-between {isAttachingThis ? 'opacity-60 pointer-events-none' : ''}"
          on:click={() => handleSelectProduct(product)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectProduct(product)}
        >
          <div class="aspect-square rounded-xl bg-black/40 overflow-hidden mb-2 relative flex items-center justify-center">
            {#if thumb}
              <img src={thumb} alt={product.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white/40">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            {/if}
            {#if isAttachingThis}
              <div class="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              </div>
            {/if}
          </div>
          <div class="min-w-0">
            <h5 class="text-xs font-bold text-white truncate font-heading group-hover:text-primary transition-colors">
              {product.name}
            </h5>
            <p class="text-2xs text-white/60 font-mono mt-0.5">
              {formatIDR(product.price || product.basePrice || 0)}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
