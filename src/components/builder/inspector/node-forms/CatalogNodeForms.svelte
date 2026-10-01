<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { ProductItem } from '@/types';
  import ImageUploadDropzone from '../ImageUploadDropzone.svelte';
  import CatalogExtraNodeForms from './CatalogExtraNodeForms.svelte';
  import { isCatalogImageSupported, isCatalogCategorySupported, DEFAULT_DEMO_PRODUCTS, DEFAULT_CATALOG_CATEGORIES, type CatalogCategory } from '../../sections/productCatalog.helpers';

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

  // Extract index if nodeId is product_item_X or product_image_X or item_X or matches product.id
  $: itemIndex = (() => {
    if (nodeId.startsWith('product_item_')) return parseInt(nodeId.replace('product_item_', ''), 10);
    if (nodeId.startsWith('product_image_')) return parseInt(nodeId.replace('product_image_', ''), 10);
    if (nodeId.startsWith('item_')) return parseInt(nodeId.replace('item_', ''), 10);
    const foundIdx = products.findIndex((p) => p.id === nodeId);
    if (foundIdx !== -1) return foundIdx;
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

  function handleToggleDiscount(checked: boolean) {
    const updated = [...products];
    if (updated[itemIndex]) {
      const prod = { ...updated[itemIndex], showOriginalPrice: checked };
      if (checked && (!prod.originalPrice || prod.originalPrice <= (prod.price || 0))) {
        const defaultOriginal = prod.price ? Math.round(prod.price * 1.3) : 0;
        if (defaultOriginal > 0) prod.originalPrice = defaultOriginal;
      }
      updated[itemIndex] = prod;
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
{:else if nodeId.startsWith('product_item_') || nodeId.startsWith('item_') || products.some((p) => p.id === nodeId)}
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
    <!-- Opsi Diskon / Harga Coret -->
    <div class="p-2.5 bg-base-100/70 border border-base-300/80 rounded-lg space-y-2">
      <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content">
        <input
          type="checkbox"
          checked={currentProduct?.showOriginalPrice ?? false}
          on:change={(e) => handleToggleDiscount(e.currentTarget.checked)}
          class="checkbox checkbox-primary checkbox-xs rounded"
        />
        <span>Tampilkan Efek Harga Coret (Diskon)</span>
      </label>

      {#if currentProduct?.showOriginalPrice}
        <div class="space-y-1 pt-1">
          <label for="prod-edit-orig-price" class="block font-medium text-2xs text-base-content/70">
            Harga Sebelum Diskon (Coret) (Rp)
          </label>
          <input
            id="prod-edit-orig-price"
            type="number"
            value={currentProduct?.originalPrice ?? (currentProduct?.price ? Math.round(currentProduct.price * 1.3) : '')}
            on:input={(e) => updateProductField('originalPrice', parseFloat(e.currentTarget.value) || 0)}
            class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary font-mono"
            placeholder="Contoh: 75000"
          />
        </div>
      {/if}
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
    {#if isCatalogCategorySupported(activePreset)}
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
    {/if}
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
{:else}
  <CatalogExtraNodeForms
    {nodeId}
    {buyButtonText}
    {cartButtonText}
    {waNumber}
    {categories}
    {currentProduct}
    {onPropChange}
    {updateProductField}
  />
{/if}
