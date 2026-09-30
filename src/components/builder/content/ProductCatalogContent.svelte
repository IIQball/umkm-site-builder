<script lang="ts">
  import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { ProductItem } from '@/types';
  import { Button } from '@/components/ui';
  import { makeHandlePropChange } from './content.helpers';
  import { DEFAULT_DEMO_PRODUCTS, DEFAULT_CATALOG_CATEGORIES, type CatalogCategory } from '../sections/productCatalog.helpers';
  import ImageUploadDropzone from '../inspector/ImageUploadDropzone.svelte';
  import CatalogCategoryManager from './CatalogCategoryManager.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);

  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: buyButtonText = (section.props?.buyButtonText as string) ?? '';
  $: cartButtonText = (section.props?.cartButtonText as string) ?? '';

  $: rawCategories = section.props?.categories;
  $: categories = (Array.isArray(rawCategories) && rawCategories.length > 0
    ? rawCategories
    : DEFAULT_CATALOG_CATEGORIES) as CatalogCategory[];

  $: rawProducts = section.props?.products;
  $: products = (Array.isArray(rawProducts) && rawProducts.length > 0
    ? rawProducts
    : DEFAULT_DEMO_PRODUCTS) as ProductItem[];

  function getCurrentProducts(): ProductItem[] {
    const raw = section.props?.products;
    return Array.isArray(raw) && raw.length > 0 ? [...raw] : [...DEFAULT_DEMO_PRODUCTS];
  }

  function handleUpdateCategories(updated: CatalogCategory[]) {
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        categories: updated,
      },
    });
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
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        products: list,
      },
    });
  }

  function handleAddProduct(template: ProductItem) {
    const list = getCurrentProducts();
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        products: [...list, template],
      },
    });
  }

  function handleProductChange(index: number, key: keyof ProductItem, value: unknown) {
    const list = getCurrentProducts();
    list[index] = { ...list[index], [key]: value };
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        products: list,
      },
    });
  }

  function handleRemoveProduct(index: number) {
    const list = getCurrentProducts();
    const updated = list.filter((_, i) => i !== index);
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        products: updated,
      },
    });
  }

  function handleMoveProduct(index: number, direction: 'up' | 'down') {
    const list = getCurrentProducts();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onUpdate({
      ...section,
      props: {
        ...(section.props || {}),
        products: list,
      },
    });
  }
</script>

<div class="space-y-3">
  <div>
    <label for="catalog-title" class="block font-semibold text-base-content/80 mb-1">Judul Katalog (Title)</label>
    <input
      id="catalog-title"
      type="text"
      value={section.props?.title ?? ''}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary"
      placeholder="Katalog Produk Pilihan"
    />
  </div>

  <div>
    <label for="catalog-subtitle" class="block font-semibold text-base-content/80 mb-1">Subjudul (Subtitle)</label>
    <textarea
      id="catalog-subtitle"
      value={subtitle}
      on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
      rows="2"
      class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary resize-y"
      placeholder="Pilih produk terbaik kami dengan jaminan mutu dan kemudahan pemesanan"></textarea>
  </div>

  <div class="grid grid-cols-2 gap-2">
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
  </div>

  <CatalogCategoryManager
    {categories}
    onUpdateCategories={handleUpdateCategories}
  />

  <div class="flex items-center justify-between pt-2 border-t border-base-200">
    <span class="block font-semibold text-base-content/80">Daftar Produk ({ products.length })</span>
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
  {:else}
    <div class="space-y-3">
      {#each products as product, index}
        <div class="p-3 bg-base-200/50 border border-base-300 rounded-lg space-y-2">
          <div class="flex items-center justify-between gap-1.5">
            <input
              type="text"
              value={product.name ?? ''}
              on:input={(e) => handleProductChange(index, 'name', e.currentTarget.value)}
              class="flex-1 px-2.5 py-1 bg-base-100 border border-base-300 rounded text-base-content focus:outline-none focus:border-primary"
              placeholder="Nama Produk"
            />
            <div class="flex items-center">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                on:click={() => handleMoveProduct(index, 'up')}
                disabled={index === 0}
                class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
                title="Pindah ke Atas"
              >
                <ChevronUp size={13} />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                on:click={() => handleMoveProduct(index, 'down')}
                disabled={index === products.length - 1}
                class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
                title="Pindah ke Bawah"
              >
                <ChevronDown size={13} />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                on:click={() => handleRemoveProduct(index)}
                class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-rose-500 rounded"
                title="Hapus Produk"
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={product.price ?? 0}
              on:input={(e) => handleProductChange(index, 'price', Number(e.currentTarget.value))}
              class="w-full px-2 py-1 bg-base-100 border border-base-300 rounded text-base-content focus:outline-none focus:border-primary font-mono"
              placeholder="Harga (Rp)"
            />
            <input
              type="text"
              value={product.badge ?? ''}
              on:input={(e) => handleProductChange(index, 'badge', e.currentTarget.value)}
              class="w-full px-2 py-1 bg-base-100 border border-base-300 rounded text-base-content focus:outline-none focus:border-primary"
              placeholder="Badge (opsional)"
            />
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-base-content/70 mb-0.5" for={`prod-cat-${index}`}>Kategori Produk</label>
            <select
              id={`prod-cat-${index}`}
              value={(product as any).categoryId || (product as any).category?.id || ''}
              on:change={(e) => handleProductCategoryChange(index, e.currentTarget.value)}
              class="w-full px-2 py-1 text-xs bg-base-100 border border-base-300 rounded text-base-content focus:outline-none focus:border-primary"
            >
              <option value="">— Tanpa Kategori / Umum —</option>
              {#each categories as cat}
                <option value={cat.id}>{cat.name}</option>
              {/each}
            </select>
          </div>

          <ImageUploadDropzone
            imageUrl={product.imageUrl ?? ''}
            onImageChange={(url) => handleProductChange(index, 'imageUrl', url)}
            label={`Foto Produk #${index + 1}`}
            placeholderTitle="Tarik & lepas foto produk ke sini"
            placeholderSubtitle="atau pilih berkas dari perangkat"
            folder="products"
            compact={true}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>
