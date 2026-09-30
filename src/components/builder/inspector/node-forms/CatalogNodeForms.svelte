<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { ProductItem } from '@/types';
  import ImageUploadDropzone from '../ImageUploadDropzone.svelte';
  import CatalogCategoryManager from '../../content/CatalogCategoryManager.svelte';
  import { isCatalogImageSupported, DEFAULT_DEMO_PRODUCTS, DEFAULT_CATALOG_CATEGORIES, type CatalogCategory } from '../../sections/productCatalog.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset = (section.layoutPreset || section.props?.layoutPreset || section.styles?.layoutPreset || 'grid_standard') as string;
  $: hasImageSupport = isCatalogImageSupported(activePreset);

  $: products = (Array.isArray(section.props?.products) && section.props.products.length > 0
    ? (section.props.products as ProductItem[])
    : DEFAULT_DEMO_PRODUCTS) as ProductItem[];

  $: rawCategories = section.props?.categories;
  $: categories = (Array.isArray(rawCategories) && rawCategories.length > 0
    ? rawCategories
    : DEFAULT_CATALOG_CATEGORIES) as CatalogCategory[];

  $: title = (section.props?.title as string) || (section.props?.heading as string) || '';
  $: subtitle = (section.props?.subtitle as string) || '';
  $: badgeText = (section.props?.badgeText as string) || '';
  $: waNumber = (section.props?.whatsappNumber as string) || '';
  $: buyButtonText = (section.props?.buyButtonText as string) || (section.props?.ctaText as string) || '';
  $: cartButtonText = (section.props?.cartButtonText as string) || (section.props?.secondaryButtonText as string) || '';

  // Extract index if nodeId is product_item_X or product_image_X or item_X
  $: itemIndex = (() => {
    if (nodeId.startsWith('product_item_')) return parseInt(nodeId.replace('product_item_', ''), 10);
    if (nodeId.startsWith('product_image_')) return parseInt(nodeId.replace('product_image_', ''), 10);
    if (nodeId.startsWith('item_')) return parseInt(nodeId.replace('item_', ''), 10);
    return 0;
  })();

  $: currentProduct = products[itemIndex] || products[0];

  function updateProductField(field: keyof ProductItem, value: any) {
    const updated = [...products];
    if (updated[itemIndex]) {
      updated[itemIndex] = { ...updated[itemIndex], [field]: value };
      onPropChange('products', updated);
    }
  }
</script>

{#if nodeId === 'catalog_header' || nodeId === 'header'}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="cat-header-title">Judul Utama Katalog (H2)</label>
      <input
        id="cat-header-title"
        type="text"
        value={title}
        on:input={(e) => onPropChange('title', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-bold"
        placeholder="Katalog Produk Pilihan"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="cat-header-sub">Deskripsi Subjudul</label>
      <textarea
        id="cat-header-sub"
        rows="2"
        value={subtitle}
        on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Deskripsi katalog toko..."
      ></textarea>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="cat-header-badge">Teks Badge Kategori</label>
      <input
        id="cat-header-badge"
        type="text"
        value={badgeText}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Katalog Unggulan"
      />
    </div>
  </div>
{:else if nodeId === 'title'}
  <div class="space-y-1 text-left">
    <label class="font-semibold text-xs text-base-content" for="cat-title-only">Judul Utama Katalog (H2)</label>
    <input
      id="cat-title-only"
      type="text"
      value={title}
      on:input={(e) => onPropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-bold"
      placeholder="Katalog Produk Pilihan"
    />
  </div>
{:else if nodeId === 'subtitle'}
  <div class="space-y-1 text-left">
    <label class="font-semibold text-xs text-base-content" for="cat-sub-only">Deskripsi Subjudul</label>
    <textarea
      id="cat-sub-only"
      rows="3"
      value={subtitle}
      on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
      placeholder="Deskripsi katalog toko..."
    ></textarea>
  </div>
{:else if nodeId === 'badge'}
  <div class="space-y-1 text-left">
    <label class="font-semibold text-xs text-base-content" for="cat-badge-only">Teks Badge Kategori</label>
    <input
      id="cat-badge-only"
      type="text"
      value={badgeText}
      on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
      placeholder="Katalog Unggulan"
    />
  </div>
{:else if nodeId.startsWith('product_image_')}
  {#if hasImageSupport}
    <div class="space-y-2 text-left">
      <ImageUploadDropzone
        imageUrl={currentProduct?.imageUrl || ''}
        onImageChange={(url) => updateProductField('imageUrl', url)}
        label={`Foto Produk #${itemIndex + 1}: ${currentProduct?.name || ''}`}
        folder="products"
        compact={true}
      />
    </div>
  {:else}
    <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl text-left">
      Preset tata letak ini tidak menggunakan ilustrasi gambar.
    </p>
  {/if}
{:else if nodeId.startsWith('product_item_') || nodeId.startsWith('item_')}
  <div class="space-y-3 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="prod-edit-name">Nama Produk #{itemIndex + 1}</label>
      <input
        id="prod-edit-name"
        type="text"
        value={currentProduct?.name || ''}
        on:input={(e) => updateProductField('name', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-bold"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="prod-edit-price">Harga (Rupiah)</label>
      <input
        id="prod-edit-price"
        type="number"
        value={currentProduct?.price || 0}
        on:input={(e) => updateProductField('price', parseFloat(e.currentTarget.value) || 0)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs font-mono"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="prod-edit-desc">Deskripsi Singkat</label>
      <textarea
        id="prod-edit-desc"
        rows="2"
        value={currentProduct?.description || ''}
        on:input={(e) => updateProductField('description', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
      ></textarea>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="prod-edit-badge">Label Badge</label>
      <input
        id="prod-edit-badge"
        type="text"
        value={currentProduct?.badge || ''}
        on:input={(e) => updateProductField('badge', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
        placeholder="Terlaris / Promo"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="prod-edit-cat">Kategori Produk</label>
      <select
        id="prod-edit-cat"
        value={(currentProduct as any)?.categoryId || (currentProduct as any)?.category?.id || ''}
        on:change={(e) => {
          const catId = e.currentTarget.value;
          const targetCat = categories.find((c) => c.id === catId);
          const updated = [...products];
          if (updated[itemIndex]) {
            updated[itemIndex] = {
              ...updated[itemIndex],
              categoryId: catId,
              categoryName: targetCat ? targetCat.name : '',
              category: targetCat ? { id: targetCat.id, name: targetCat.name, slug: targetCat.slug } : null,
            };
            onPropChange('products', updated);
          }
        }}
        class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
      >
        <option value="">— Tanpa Kategori / Umum —</option>
        {#each categories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
    </div>
    {#if hasImageSupport}
      <div class="pt-2 border-t border-base-200">
        <ImageUploadDropzone
          imageUrl={currentProduct?.imageUrl || ''}
          onImageChange={(url) => updateProductField('imageUrl', url)}
          label="Foto Produk"
          folder="products"
          compact={true}
        />
      </div>
    {/if}
  </div>
{:else if nodeId === 'catalog_timer'}
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
