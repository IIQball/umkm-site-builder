<script lang="ts">
  import { Upload, X, Loader2 } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { FeatureItem } from '@/types';
  import { FEATURE_ICON_OPTIONS } from '../../sections/features/featureIcons';
  import {
    compressToWebP,
    uploadToCloudinary,
    deleteOldImage,
  } from '../imageUpload.helpers';
  import { IMAGE_SUPPORTED_FEATURE_PRESETS } from '../../sections/features/features.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset = (section.layoutPreset || section.props?.layoutPreset || section.styles?.layoutPreset || 'grid_3_cards') as string;
  $: hasImageSupport = IMAGE_SUPPORTED_FEATURE_PRESETS.includes(activePreset);

  $: itemIndex = Math.max(
    0,
    parseInt(nodeId.replace('feature_item_', '').replace('item_', ''), 10) || 0
  );

  $: itemsKey = Array.isArray(section.props?.items) ? 'items' : 'features';
  $: rawList = ((section.props?.[itemsKey] as FeatureItem[]) ||
    (section.props?.features as FeatureItem[]) ||
    (section.props?.items as FeatureItem[]) ||
    []) as FeatureItem[];

  $: currentItem = (rawList[itemIndex] || {
    title: `Fitur #${itemIndex + 1}`,
    description: 'Deskripsi keunggulan produk/layanan Anda.',
    icon: 'sparkles',
    iconName: 'sparkles',
  }) as FeatureItem;

  let isUploading = false;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  function updateItemField(field: keyof FeatureItem, value: unknown) {
    const list = [...rawList];
    while (list.length <= itemIndex) {
      list.push({
        id: `f-${list.length}`,
        title: `Fitur #${list.length + 1}`,
        description: 'Deskripsi keunggulan...',
        icon: 'sparkles',
        iconName: 'sparkles',
      });
    }

    list[itemIndex] = {
      ...list[itemIndex],
      [field]: value,
    };

    if (field === 'icon') {
      list[itemIndex].iconName = String(value);
    } else if (field === 'iconName') {
      list[itemIndex].icon = String(value);
    }

    onPropChange(itemsKey, list);
    if (itemsKey === 'items' && section.props?.features) {
      onPropChange('features', list);
    }
  }

  async function handleImageFileChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format file wajib JPG, JPEG, atau PNG';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage = 'Ukuran maksimal file sebelum dikompresi adalah 5MB';
      return;
    }

    try {
      isUploading = true;
      const webpBlob = await compressToWebP(file, 1200, 800);
      const url = await uploadToCloudinary(webpBlob, 'templates', `${Date.now()}_feature_${itemIndex}.webp`);

      const oldUrl = currentItem.imageUrl || '';
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }
      updateItemField('imageUrl', url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gambar gagal';
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  async function handleRemoveImage() {
    const oldUrl = currentItem.imageUrl || '';
    updateItemField('imageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="space-y-4 text-left">
  <!-- Icon Selector -->
  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-item-icon">Ikon Fitur (Lucide)</label>
    <select
      id="feat-item-icon"
      value={currentItem.iconName || currentItem.icon || 'sparkles'}
      on:change={(e) => updateItemField('icon', e.currentTarget.value)}
      class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary"
    >
      {#each FEATURE_ICON_OPTIONS as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>

  <!-- Title Input -->
  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-item-title">Judul Fitur</label>
    <input
      id="feat-item-title"
      type="text"
      value={currentItem.title || ''}
      on:input={(e) => updateItemField('title', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="Judul Fitur"
    />
  </div>

  <!-- Description Input -->
  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-item-desc">Deskripsi Fitur</label>
    <textarea
      id="feat-item-desc"
      value={currentItem.description || ''}
      on:input={(e) => updateItemField('description', e.currentTarget.value)}
      rows="3"
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs resize-y"
      placeholder="Deskripsi keunggulan..."></textarea>
  </div>

  <!-- Badge & Stat Label -->
  <div class="grid grid-cols-2 gap-2">
    <div class="space-y-1">
      <label class="font-semibold text-[11px] text-base-content/70" for="feat-item-badge">Badge (Opsional)</label>
      <input
        id="feat-item-badge"
        type="text"
        value={currentItem.badge || ''}
        on:input={(e) => updateItemField('badge', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Alami & Murni"
      />
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-[11px] text-base-content/70" for="feat-item-stat">Label / CTA</label>
      <input
        id="feat-item-stat"
        type="text"
        value={currentItem.statLabel || ''}
        on:input={(e) => updateItemField('statLabel', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
        placeholder="Terverifikasi BPOM"
      />
    </div>
  </div>

  {#if hasImageSupport}
    <!-- Image Upload (Cloudinary WebP) -->
    <div class="space-y-1.5 pt-2 border-t border-base-300 dark:border-slate-800">
      <label class="font-semibold text-xs text-base-content/80" for="feat-item-img-upload">Gambar Item (Cloudinary)</label>
      {#if currentItem.imageUrl}
        <div class="relative group rounded-xl overflow-hidden border border-base-300 dark:border-slate-800 bg-base-200/50 p-2 flex items-center gap-3">
          <img
            src={currentItem.imageUrl}
            alt={currentItem.title || 'Feature Image'}
            class="w-16 h-12 object-cover bg-white dark:bg-slate-900 rounded-lg border border-base-300 dark:border-slate-700"
          />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold truncate text-base-content">Gambar Fitur #{itemIndex + 1}</p>
            <p class="text-[10px] text-base-content/60">Terunggah ke Cloudinary</p>
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
          class="w-full border-2 border-dashed border-base-300 dark:border-slate-800 hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-base-200/30 flex flex-col items-center gap-1.5"
        >
          {#if isUploading}
            <Loader2 size={16} class="animate-spin text-primary" />
            <span class="text-xs text-primary font-medium">Mengunggah ke Cloudinary...</span>
          {:else}
            <Upload size={16} class="text-base-content/50" />
            <span class="text-xs font-medium text-base-content">Pilih Gambar Fitur (PNG / JPG)</span>
            <span class="text-[10px] text-base-content/60">Kompres otomatis WebP &lt; 200KB</span>
          {/if}
        </button>
      {/if}
      <input
        id="feat-item-img-upload"
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
  {/if}

  <!-- Link URL -->
  <div class="space-y-1">
    <label class="font-semibold text-xs text-base-content/80" for="feat-item-link">Link / URL Tautan (Opsional)</label>
    <input
      id="feat-item-link"
      type="text"
      value={currentItem.linkUrl || ''}
      on:input={(e) => updateItemField('linkUrl', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="https://... atau #catalog"
    />
  </div>
</div>
