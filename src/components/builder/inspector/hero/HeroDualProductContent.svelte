<script lang="ts">
  import { editorStore } from '../../stores/editorStore';
  import { AlertCircle, ShoppingBag } from 'lucide-svelte';
  import { formatIDR } from '@/lib/currency';

  export let selectedProductIndex1: number = -1;
  export let selectedProductIndex2: number = -1;
  export let onPropChange: (key: string, value: unknown) => void;

  interface CatalogProduct {
    name?: string;
    price?: number;
    imageUrl?: string;
    image?: string;
    imageUrls?: string[];
    description?: string;
    badge?: string;
  }

  $: catalogSection = $editorStore?.template?.config?.sections?.find(
    (s: any) => s.type === 'catalog' || s.type === 'product_catalog'
  );
  $: catalogProducts = ((catalogSection?.props?.products as CatalogProduct[]) || []);
  $: productCount = catalogProducts.length;

  $: defaultIndex1 = productCount === 2 ? 0 : productCount >= 3 ? productCount - 1 : 0;
  $: defaultIndex2 = productCount === 2 ? 1 : productCount >= 3 ? productCount - 2 : 1;

  $: activeIndex1 =
    selectedProductIndex1 >= 0 && selectedProductIndex1 < productCount
      ? selectedProductIndex1
      : defaultIndex1;

  $: activeIndex2 =
    selectedProductIndex2 >= 0 && selectedProductIndex2 < productCount
      ? selectedProductIndex2
      : defaultIndex2;
</script>

<div class="space-y-3 pt-3 border-t border-base-300">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content/80">
    <ShoppingBag size={14} class="text-primary" />
    <span>Sinkronisasi Produk Bundling</span>
  </div>

  {#if productCount === 0}
    <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2 leading-relaxed">
      <AlertCircle size={16} class="shrink-0 mt-0.5" />
      <div>
        <span class="font-bold block">Belum ada produk di Katalog</span>
        Tambahkan produk di section <strong>Katalog Produk</strong> terlebih dahulu agar dapat dipilih dan ditampilkan secara otomatis di sini.
      </div>
    </div>
  {:else if productCount === 1}
    <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs flex items-start gap-2 leading-relaxed">
      <AlertCircle size={16} class="shrink-0 mt-0.5" />
      <div>
        <span class="font-bold block">Hanya 1 produk tersedia</span>
        Tambahkan minimal 2 produk di section Katalog agar kedua kartu produk bundling terisi lengkap.
      </div>
    </div>
  {:else}
    <p class="text-[11px] text-base-content/60">
      {#if productCount === 2}
        Otomatis menampilkan 2 produk yang tersedia di katalog.
      {:else}
        Secara bawaan menampilkan 2 produk terbaru. Anda dapat memilih varian produk lain di bawah:
      {/if}
    </p>

    <div class="space-y-2.5">
      <div>
        <label for="select-prod-1" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
          Pilih Kartu Produk 1
        </label>
        <select
          id="select-prod-1"
          value={activeIndex1}
          on:change={(e) => onPropChange('selectedProductIndex1', parseInt(e.currentTarget.value, 10))}
          class="select select-bordered select-xs w-full"
        >
          {#each catalogProducts as prod, idx}
            <option value={idx}>
              {idx + 1}. {prod.name || 'Produk ' + (idx + 1)} ({formatIDR(prod.price || 0)})
            </option>
          {/each}
        </select>
      </div>

      <div>
        <label for="select-prod-2" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
          Pilih Kartu Produk 2
        </label>
        <select
          id="select-prod-2"
          value={activeIndex2}
          on:change={(e) => onPropChange('selectedProductIndex2', parseInt(e.currentTarget.value, 10))}
          class="select select-bordered select-xs w-full"
        >
          {#each catalogProducts as prod, idx}
            <option value={idx}>
              {idx + 1}. {prod.name || 'Produk ' + (idx + 1)} ({formatIDR(prod.price || 0)})
            </option>
          {/each}
        </select>
      </div>
    </div>
  {/if}
</div>
