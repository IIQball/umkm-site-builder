<script lang="ts">
  import { ChevronUp, ChevronDown, Trash2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { ProductItem } from '@/types';
  import type { CatalogCategory } from '../sections/productCatalog.helpers';
  import ImageUploadDropzone from '../inspector/ImageUploadDropzone.svelte';

  export let product: ProductItem;
  export let index: number;
  export let totalProducts: number;
  export let categories: CatalogCategory[];
  export let showCategory: boolean = true;
  export let showImage: boolean = true;
  export let onFieldChange: (field: keyof ProductItem, value: any) => void;
  export let onCategoryChange: (catId: string) => void;
  export let onMove: (direction: 'up' | 'down') => void;
  export let onRemove: () => void;

  function handleToggleDiscount(checked: boolean) {
    onFieldChange('showOriginalPrice', checked);
    if (checked && (!product.originalPrice || product.originalPrice <= (product.price || 0))) {
      const defaultOriginal = product.price ? Math.round(product.price * 1.3) : 0;
      if (defaultOriginal > 0) {
        onFieldChange('originalPrice', defaultOriginal);
      }
    }
  }
</script>

<div class="p-3 bg-base-200/50 border border-base-300 rounded-lg space-y-3 text-left">
  <!-- Card Header -->
  <div class="flex items-center justify-between gap-2 border-b border-base-300/60 pb-2">
    <div class="flex items-center gap-2 min-w-0">
      {#if product.imageUrl}
        <img src={product.imageUrl} alt={product.name} class="w-6 h-6 rounded object-cover shrink-0" />
      {:else}
        <div class="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-2xs shrink-0">
          {(product.name || 'P').charAt(0).toUpperCase()}
        </div>
      {/if}
      <span class="font-heading font-bold text-xs text-base-content truncate">
        Produk #{index + 1}: {product.name || 'Produk Baru'}
      </span>
    </div>

    <div class="flex items-center gap-0.5 shrink-0">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        on:click={() => onMove('up')}
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
        on:click={() => onMove('down')}
        disabled={index === totalProducts - 1}
        class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-base-content disabled:opacity-20"
        title="Pindah ke Bawah"
      >
        <ChevronDown size={13} />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        on:click={onRemove}
        class="!p-1 !h-6 !w-6 !min-h-0 !min-w-0 text-base-content/50 hover:text-error rounded"
        title="Hapus Produk"
      >
        <Trash2 size={13} />
      </Button>
    </div>
  </div>

  <!-- Form Fields: 1 Kolom Penuh Stacked Vertikal -->
  <div class="space-y-2.5">
    <div class="space-y-1">
      <label for={`prod-name-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Nama Produk
      </label>
      <input
        id={`prod-name-${index}`}
        type="text"
        value={product.name ?? ''}
        on:input={(e) => onFieldChange('name', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content font-bold focus:outline-none focus:border-primary"
        placeholder="Nama Produk"
      />
    </div>

    <div class="space-y-1">
      <label for={`prod-price-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Harga Produk (Rp)
      </label>
      <input
        id={`prod-price-${index}`}
        type="number"
        value={product.price ?? 0}
        on:input={(e) => onFieldChange('price', Number(e.currentTarget.value))}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary font-mono"
        placeholder="Contoh: 50000"
      />
    </div>

    <!-- Opsi Diskon / Harga Coret -->
    <div class="p-2.5 bg-base-100/70 border border-base-300/80 rounded-lg space-y-2">
      <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content">
        <input
          type="checkbox"
          checked={product.showOriginalPrice ?? false}
          on:change={(e) => handleToggleDiscount(e.currentTarget.checked)}
          class="checkbox checkbox-primary checkbox-xs rounded"
        />
        <span>Tampilkan Efek Harga Coret (Diskon)</span>
      </label>

      {#if product.showOriginalPrice}
        <div class="space-y-1 pt-1">
          <label for={`prod-orig-price-${index}`} class="block font-medium text-2xs text-base-content/70">
            Harga Sebelum Diskon (Coret) (Rp)
          </label>
          <input
            id={`prod-orig-price-${index}`}
            type="number"
            value={product.originalPrice ?? (product.price ? Math.round(product.price * 1.3) : '')}
            on:input={(e) => onFieldChange('originalPrice', parseFloat(e.currentTarget.value) || 0)}
            class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary font-mono"
            placeholder="Contoh: 75000"
          />
        </div>
      {/if}
    </div>

    <div class="space-y-1">
      <label for={`prod-badge-${index}`} class="block font-semibold text-2xs text-base-content/70">
        Lencana / Badge (Opsional)
      </label>
      <input
        id={`prod-badge-${index}`}
        type="text"
        value={product.badge ?? ''}
        on:input={(e) => onFieldChange('badge', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary"
        placeholder="Contoh: Terlaris / Populer"
      />
    </div>

    {#if showCategory}
      <div class="space-y-1">
        <label for={`prod-cat-${index}`} class="block font-semibold text-2xs text-base-content/70">
          Kategori Produk
        </label>
        <select
          id={`prod-cat-${index}`}
          value={(product as any).categoryId || (product as any).category?.id || ''}
          on:change={(e) => onCategoryChange(e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded text-xs text-base-content focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="">— Tanpa Kategori / Umum —</option>
          {#each categories as cat}
            <option value={cat.id}>{cat.name}</option>
          {/each}
        </select>
      </div>
    {/if}

    <!-- Foto Produk Dropzone -->
    {#if showImage}
      <div class="space-y-1 pt-1">
        <span class="block font-semibold text-2xs text-base-content/70">
          Foto Produk
        </span>
        <ImageUploadDropzone
          imageUrl={product.imageUrl ?? ''}
          onImageChange={(url) => onFieldChange('imageUrl', url)}
          label={`Foto ${product.name || `Produk #${index + 1}`}`}
          placeholderTitle="Tarik & lepas foto produk ke sini"
          placeholderSubtitle="atau pilih berkas dari perangkat"
          folder="products"
          compact={true}
        />
      </div>
    {/if}
  </div>
</div>
