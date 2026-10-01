<script lang="ts">
  import type { ProductItem } from '@/types';
  import CatalogCategoryManager from '../../content/CatalogCategoryManager.svelte';
  import type { CatalogCategory } from '../../sections/productCatalog.helpers';

  export let nodeId: string;
  export let buyButtonText: string = '';
  export let cartButtonText: string = '';
  export let waNumber: string = '';
  export let categories: CatalogCategory[] = [];
  export let currentProduct: ProductItem | undefined = undefined;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let updateProductField: (field: keyof ProductItem, value: any) => void = () => {};
</script>

{#if nodeId === 'catalog_timer'}
  <div class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1 text-left">
    <p class="font-semibold text-xs text-rose-700 dark:text-rose-300">Banner Flash Sale Countdown</p>
    <p class="text-[11px] text-base-content/70">Waktu mundur otomatis memicu psikologi kelangkaan (Urgency FOMO) bagi calon pembeli toko.</p>
  </div>
{:else if nodeId === 'catalog_bundle_tier'}
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-1 text-left">
    <p class="font-semibold text-xs text-blue-700 dark:text-blue-300">Paket Bundling Bertingkat</p>
    <p class="text-[11px] text-base-content/70">Tampilkan pilihan paket hemat vs lengkap untuk mendongkrak Nilai Transaksi Rata-rata (AOV).</p>
  </div>
{:else if nodeId === 'catalog_cta' || nodeId === 'cta'}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="cat-buy-btn-text">Teks Tombol Utama / Beli</label>
      <input
        id="cat-buy-btn-text"
        type="text"
        value={buyButtonText}
        on:input={(e) => onPropChange('buyButtonText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Beli / Pesan"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="cat-cart-btn-text">Teks Tombol Keranjang</label>
      <input
        id="cat-cart-btn-text"
        type="text"
        value={cartButtonText}
        on:input={(e) => onPropChange('cartButtonText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Keranjang"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="cat-wa-number">Nomor WhatsApp Toko</label>
      <input
        id="cat-wa-number"
        type="text"
        value={waNumber}
        on:input={(e) => onPropChange('whatsappNumber', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-mono"
        placeholder="628123456789"
      />
    </div>
    <p class="text-[10px] text-base-content/60">Pesanan dari katalog otomatis masuk ke chat WhatsApp dengan format teks terstruktur.</p>
  </div>
{:else if nodeId === 'catalog_categories' || nodeId === 'catalog_sidebar'}
  <div class="space-y-2 text-left">
    <CatalogCategoryManager
      {categories}
      onUpdateCategories={(cats) => onPropChange('categories', cats)}
    />
  </div>
{:else if nodeId === 'catalog_price_rows'}
  <div class="p-3 bg-slate-100 rounded-xl space-y-1 text-left">
    <p class="font-semibold text-xs text-base-content">Baris Tabel & Pricelist</p>
    <p class="text-[11px] text-base-content/60">Layout ringkas tabular dan akordeon fokus pada kejelasan harga serta spesifikasi produk tanpa gambar.</p>
  </div>
{:else if nodeId === 'product_desc'}
  <div class="space-y-1 text-left">
    <label class="font-semibold text-xs text-base-content" for="cat-deep-desc">Deskripsi Manfaat Produk Unggulan</label>
    <textarea
      id="cat-deep-desc"
      rows="4"
      value={currentProduct?.description || ''}
      on:input={(e) => updateProductField('description', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
    ></textarea>
  </div>
{/if}
