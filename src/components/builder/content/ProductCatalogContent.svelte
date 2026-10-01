<script lang="ts">
  import { Plus } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { ProductItem } from '@/types';
  import { Button } from '@/components/ui';
  import { makeHandlePropChange } from './content.helpers';
  import {
    DEFAULT_DEMO_PRODUCTS,
    DEFAULT_CATALOG_CATEGORIES,
    type CatalogCategory,
    isCatalogCategorySupported,
    isCatalogCartSupported,
    isCatalogSingleProduct,
    isCatalogImageSupported,
  } from '../sections/productCatalog.helpers';
  import { getEffectiveCatalogElementOrder } from '../sections/catalog/catalogLayout.helpers';
  import CatalogCategoryManager from './CatalogCategoryManager.svelte';
  import ProductItemCard from './ProductItemCard.svelte';
  import CatalogExtraNodeForms from '../inspector/node-forms/CatalogExtraNodeForms.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: activePreset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'grid_standard';

  $: rawProducts = section.props?.products;
  $: products = (Array.isArray(rawProducts) && rawProducts.length > 0
    ? rawProducts
    : DEFAULT_DEMO_PRODUCTS) as ProductItem[];

  $: rawOrder = section.props?.elementOrder;
  $: elementOrder = getEffectiveCatalogElementOrder(activePreset, rawOrder, products);

  $: hasCategorySupport = isCatalogCategorySupported(activePreset) || elementOrder.includes('catalog_categories') || elementOrder.includes('catalog_sidebar');
  $: hasCartSupport = isCatalogCartSupported(activePreset);
  $: isSingleProduct = isCatalogSingleProduct(activePreset);
  $: hasImageSupport = isCatalogImageSupported(activePreset);
  $: hasPriceRows = elementOrder.includes('catalog_price_rows');

  $: badgeText = (section.props?.badgeText as string) ?? '';
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: buyButtonText = (section.props?.buyButtonText as string) ?? '';
  $: cartButtonText = (section.props?.cartButtonText as string) ?? '';
  $: waNumber = (section.props?.whatsappNumber as string) ?? '';

  $: rawCategories = section.props?.categories;
  $: categories = (Array.isArray(rawCategories) && rawCategories.length > 0
    ? rawCategories
    : DEFAULT_CATALOG_CATEGORIES) as CatalogCategory[];

  function getCurrentProducts(): ProductItem[] {
    const raw = section.props?.products;
    return Array.isArray(raw) && raw.length > 0 ? [...raw] : [...DEFAULT_DEMO_PRODUCTS];
  }

  function handleUpdateCategories(updated: CatalogCategory[]) {
    onUpdate({ ...section, props: { ...(section.props || {}), categories: updated } });
  }

  function handleProductCategoryChange(index: number, catId: string) {
    const list = getCurrentProducts();
    const targetCat = categories.find((c) => c.id === catId);
    list[index] = {
      ...list[index],
      categoryId: catId,
      categoryName: targetCat ? targetCat.name : '',
      category: targetCat ? { id: targetCat.id, name: targetCat.name, slug: targetCat.slug } : null,
    };
    onUpdate({ ...section, props: { ...(section.props || {}), products: list } });
  }

  function handleAddProduct(template: ProductItem) {
    const list = getCurrentProducts();
    onUpdate({ ...section, props: { ...(section.props || {}), products: [...list, template] } });
  }

  function handleProductChange(index: number, key: keyof ProductItem, value: unknown) {
    const list = getCurrentProducts();
    list[index] = { ...list[index], [key]: value };
    onUpdate({ ...section, props: { ...(section.props || {}), products: list } });
  }

  function handleRemoveProduct(index: number) {
    const list = getCurrentProducts();
    onUpdate({ ...section, props: { ...(section.props || {}), products: list.filter((_, i) => i !== index) } });
  }

  function handleMoveProduct(index: number, direction: 'up' | 'down') {
    const list = getCurrentProducts();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onUpdate({ ...section, props: { ...(section.props || {}), products: list } });
  }
</script>

<div class="space-y-3">
  {#if elementOrder.includes('badge')}
    <div>
      <label for="catalog-badge" class="block font-semibold text-xs text-base-content/80 mb-1">Teks Lencana (Badge)</label>
      <input
        id="catalog-badge"
        type="text"
        value={badgeText}
        on:input={(e) => handlePropChange('badgeText', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 text-xs bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
        placeholder="Produk Unggulan"
      />
    </div>
  {/if}

  {#if elementOrder.includes('title')}
    <div>
      <label for="catalog-title" class="block font-semibold text-xs text-base-content/80 mb-1">Judul Katalog (Title)</label>
      <input
        id="catalog-title"
        type="text"
        value={section.props?.title ?? ''}
        on:input={(e) => handlePropChange('title', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 text-xs bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
        placeholder="Katalog Produk Pilihan"
      />
    </div>
  {/if}

  {#if elementOrder.includes('subtitle')}
    <div>
      <label for="catalog-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">Subjudul (Subtitle)</label>
      <textarea
        id="catalog-subtitle"
        value={subtitle}
        on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
        rows="2"
        class="w-full px-2.5 py-1.5 text-xs bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary resize-y"
        placeholder="Pilih produk terbaik kami dengan jaminan mutu dan kemudahan pemesanan"></textarea>
    </div>
  {/if}

  <!-- Slot Tambahan Sesuai Layout Preset Aktif -->
  {#if elementOrder.includes('catalog_timer')}
    <CatalogExtraNodeForms nodeId="catalog_timer" />
  {/if}

  {#if elementOrder.includes('catalog_bundle_tier')}
    <CatalogExtraNodeForms nodeId="catalog_bundle_tier" />
  {/if}

  {#if hasPriceRows}
    <CatalogExtraNodeForms nodeId="catalog_price_rows" />
  {/if}

  {#if elementOrder.includes('product_desc')}
    <CatalogExtraNodeForms
      nodeId="product_desc"
      currentProduct={products[0]}
      updateProductField={(field, val) => handleProductChange(0, field, val)}
    />
  {/if}

  {#if !hasPriceRows}
    <div class="space-y-3">
      <div>
        <label for="catalog-buy-btn" class="block font-semibold text-xs text-base-content/80 mb-1">Teks Tombol Beli</label>
        <input
          id="catalog-buy-btn"
          type="text"
          value={buyButtonText}
          on:input={(e) => handlePropChange('buyButtonText', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 text-xs bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
          placeholder="Beli / Pesan"
        />
      </div>
      {#if hasCartSupport}
        <div>
          <label for="catalog-cart-btn" class="block font-semibold text-xs text-base-content/80 mb-1">Teks Tombol Keranjang</label>
          <input
            id="catalog-cart-btn"
            type="text"
            value={cartButtonText}
            on:input={(e) => handlePropChange('cartButtonText', e.currentTarget.value)}
            class="w-full px-2.5 py-1.5 text-xs bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
            placeholder="Keranjang"
          />
        </div>
      {/if}
      {#if elementOrder.includes('catalog_cta')}
        <div>
          <label for="catalog-wa-num" class="block font-semibold text-xs text-base-content/80 mb-1">Nomor WhatsApp Pemesanan</label>
          <input
            id="catalog-wa-num"
            type="text"
            value={waNumber}
            on:input={(e) => handlePropChange('whatsappNumber', e.currentTarget.value)}
            class="w-full px-2.5 py-1.5 text-xs bg-base-200/50 border border-base-300 rounded-md text-base-content font-mono focus:outline-none focus:border-primary"
            placeholder="628123456789"
          />
        </div>
      {/if}
    </div>
  {/if}

  {#if hasCategorySupport}
    <CatalogCategoryManager
      {categories}
      onUpdateCategories={handleUpdateCategories}
    />
  {/if}

  <div class="flex items-center justify-between pt-2 border-t border-base-200">
    <span class="block font-semibold text-base-content/80">
      {isSingleProduct ? 'Produk Unggulan (Fokus 1 Produk)' : `Daftar Produk (${products.length})`}
    </span>
    {#if !isSingleProduct}
      <Button
        type="button"
        size="xs"
        variant="ghost"
        on:click={() => handleAddProduct({ name: 'Produk Baru', price: 50000, imageUrl: '', badge: 'Terlaris' })}
        class="!p-0 !h-auto !min-h-0 text-[11px] font-medium text-blue-500 hover:text-blue-400 gap-1"
      >
        <Plus size={12} />
        <span>Tambah Item</span>
      </Button>
    {/if}
  </div>

  {#if products.length === 0}
    <div class="p-4 text-center border border-dashed border-base-300 rounded-lg text-base-content/50">
      <p>Belum ada produk preview.</p>
      <Button
        type="button"
        size="xs"
        variant="tertiary"
        on:click={() => handleAddProduct({ name: 'Produk Contoh', price: 75000, imageUrl: '', badge: 'Populer' })}
        class="mt-2 text-xs text-blue-500 hover:underline inline-block"
      >
        + Buat Produk Contoh
      </Button>
    </div>
  {:else if isSingleProduct}
    <div class="space-y-3">
      <ProductItemCard
        product={products[0]}
        index={0}
        totalProducts={1}
        {categories}
        showCategory={false}
        showImage={hasImageSupport}
        onFieldChange={(field, val) => handleProductChange(0, field, val)}
        onCategoryChange={(catId) => handleProductCategoryChange(0, catId)}
        onMove={() => {}}
        onRemove={() => {}}
      />
    </div>
  {:else}
    <div class="space-y-3">
      {#each products as product, index (product.id || index)}
        <ProductItemCard
          {product}
          {index}
          totalProducts={products.length}
          {categories}
          showCategory={hasCategorySupport}
          showImage={hasImageSupport}
          onFieldChange={(field, val) => handleProductChange(index, field, val)}
          onCategoryChange={(catId) => handleProductCategoryChange(index, catId)}
          onMove={(dir) => handleMoveProduct(index, dir)}
          onRemove={() => handleRemoveProduct(index)}
        />
      {/each}
    </div>
  {/if}
</div>
