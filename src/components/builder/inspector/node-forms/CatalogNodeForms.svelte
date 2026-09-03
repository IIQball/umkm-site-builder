<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { ProductItem } from '@/types';
  import { Upload, X, Loader2 } from 'lucide-svelte';
  import {
    compressToWebP,
    uploadToCloudinary,
    deleteOldImage,
  } from '../imageUpload.helpers';
  import { isCatalogImageSupported, DEFAULT_DEMO_PRODUCTS } from '../../sections/productCatalog.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset = (section.layoutPreset || section.props?.layoutPreset || section.styles?.layoutPreset || 'grid_standard') as string;
  $: hasImageSupport = isCatalogImageSupported(activePreset);

  $: products = (Array.isArray(section.props?.products) && section.props.products.length > 0
    ? (section.props.products as ProductItem[])
    : DEFAULT_DEMO_PRODUCTS) as ProductItem[];

  $: title = (section.props?.title as string) || (section.props?.heading as string) || '';
  $: subtitle = (section.props?.subtitle as string) || '';
  $: badgeText = (section.props?.badgeText as string) || '';
  $: waNumber = (section.props?.whatsappNumber as string) || '';

  // Extract index if nodeId is product_item_X or product_image_X
  $: itemIndex = (() => {
    if (nodeId.startsWith('product_item_')) return parseInt(nodeId.replace('product_item_', ''), 10);
    if (nodeId.startsWith('product_image_')) return parseInt(nodeId.replace('product_image_', ''), 10);
    return 0;
  })();

  $: currentProduct = products[itemIndex] || products[0];

  let isUploading = false;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  function updateProductField(field: keyof ProductItem, value: any) {
    const updated = [...products];
    if (updated[itemIndex]) {
      updated[itemIndex] = { ...updated[itemIndex], [field]: value };
      onPropChange('products', updated);
    }
  }

  async function handleImageFileChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format file wajib JPG, JPEG, atau PNG';
      return;
    }

    try {
      isUploading = true;
      const webpBlob = await compressToWebP(file, 1000, 1000);
      const url = await uploadToCloudinary(webpBlob, 'products', `${Date.now()}_prod_${itemIndex}.webp`);

      const oldUrl = currentProduct?.imageUrl;
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }
      updateProductField('imageUrl', url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gambar gagal';
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  async function handleRemoveImage() {
    const oldUrl = currentProduct?.imageUrl;
    updateProductField('imageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
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
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-bold"
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
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
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
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Katalog Unggulan"
      />
    </div>
  </div>
{:else if nodeId.startsWith('product_image_')}
  {#if hasImageSupport}
    <div class="space-y-4 text-left">
      <div class="space-y-1.5">
        <label class="font-semibold text-xs text-base-content" for="cat-prod-img-upload">
          Foto Produk #{itemIndex + 1}: {currentProduct?.name || ''}
        </label>
        {#if currentProduct?.imageUrl}
          <div class="relative group rounded-xl overflow-hidden border border-base-300 dark:border-slate-800 bg-base-200/50 p-2 flex items-center gap-3">
            <img
              src={currentProduct.imageUrl}
              alt="Preview"
              class="w-14 h-14 object-cover rounded-lg border border-base-300 dark:border-slate-700 bg-white"
            />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold truncate text-base-content">{currentProduct.name || 'Produk'}</p>
              <p class="text-[10px] text-base-content/60">Cloudinary WebP</p>
            </div>
            <button
              type="button"
              on:click={handleRemoveImage}
              class="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
              title="Hapus Gambar"
            >
              <X size={14} />
            </button>
          </div>
        {:else}
          <button
            type="button"
            on:click={() => fileInput?.click()}
            disabled={isUploading}
            class="w-full border-2 border-dashed border-base-300 dark:border-slate-800 hover:border-primary/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-base-200/30 flex flex-col items-center gap-1.5"
          >
            {#if isUploading}
              <Loader2 size={18} class="animate-spin text-primary" />
              <span class="text-xs text-primary font-medium">Mengunggah...</span>
            {:else}
              <Upload size={18} class="text-base-content/50" />
              <span class="text-xs font-medium text-base-content">Pilih Foto Produk (PNG/JPG)</span>
              <span class="text-[10px] text-base-content/60">Otomatis kompresi WebP</span>
            {/if}
          </button>
        {/if}
        <input
          id="cat-prod-img-upload"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          bind:this={fileInput}
          on:change={handleImageFileChange}
          class="hidden"
        />
        {#if errorMessage}
          <p class="text-[11px] text-error font-medium">{errorMessage}</p>
        {/if}
      </div>

      <div class="space-y-1">
        <label class="font-semibold text-xs text-base-content" for="cat-prod-img-url">URL Gambar Manual</label>
        <input
          id="cat-prod-img-url"
          type="text"
          value={currentProduct?.imageUrl || ''}
          on:input={(e) => updateProductField('imageUrl', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
          placeholder="https://images.unsplash.com/..."
        />
      </div>
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
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-bold"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="prod-edit-price">Harga (Rupiah)</label>
      <input
        id="prod-edit-price"
        type="number"
        value={currentProduct?.price || 0}
        on:input={(e) => updateProductField('price', parseFloat(e.currentTarget.value) || 0)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="prod-edit-desc">Deskripsi Singkat</label>
      <textarea
        id="prod-edit-desc"
        rows="2"
        value={currentProduct?.description || ''}
        on:input={(e) => updateProductField('description', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      ></textarea>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="prod-edit-badge">Label Badge</label>
      <input
        id="prod-edit-badge"
        type="text"
        value={currentProduct?.badge || ''}
        on:input={(e) => updateProductField('badge', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Terlaris / Promo"
      />
    </div>
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
{:else if nodeId === 'catalog_cta'}
  <div class="space-y-2 text-left">
    <div class="space-y-1">
      <label class="font-semibold text-xs text-base-content" for="cat-wa-number">Nomor WhatsApp Toko</label>
      <input
        id="cat-wa-number"
        type="text"
        value={waNumber}
        on:input={(e) => onPropChange('whatsappNumber', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs font-mono"
        placeholder="628123456789"
      />
    </div>
    <p class="text-[10px] text-base-content/60">Pesanan dari katalog otomatis masuk ke chat WhatsApp dengan format teks terstruktur.</p>
  </div>
{:else if nodeId === 'catalog_categories' || nodeId === 'catalog_sidebar'}
  <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1 text-left">
    <p class="font-semibold text-xs text-base-content">Bilah Filter Kategori</p>
    <p class="text-[11px] text-base-content/60">Pengunjung dapat memfilter katalog berdasarkan kategori produk secara instan.</p>
  </div>
{:else if nodeId === 'catalog_price_rows'}
  <div class="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl space-y-1 text-left">
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
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
    ></textarea>
  </div>
{/if}
