<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import { Upload, X, Loader2 } from 'lucide-svelte';
  import {
    compressToWebP,
    uploadToCloudinary,
    deleteOldImage,
  } from '../inspector/imageUpload.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: imageMode = (section.props?.imageMode as 'element' | 'background') ?? 'element';

  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  async function handleImageUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format file wajib JPG, JPEG, atau PNG';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      errorMessage = 'Ukuran maksimal file sebelum dikompresi adalah 5MB';
      input.value = '';
      return;
    }

    try {
      isUploading = true;
      uploadProgress = 30;
      const webpBlob = await compressToWebP(file, 1920, 1080);
      uploadProgress = 60;
      const url = await uploadToCloudinary(webpBlob, 'templates', `${Date.now()}_hero.webp`);
      uploadProgress = 100;

      const oldUrl = imageUrl;
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }

      handlePropChange('imageUrl', url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gagal';
    } finally {
      isUploading = false;
      input.value = '';
    }
  }

  async function handleRemoveImage() {
    const oldUrl = imageUrl;
    handlePropChange('imageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="space-y-4">
  <div>
    <label for="hero-title" class="block font-semibold text-xs text-base-content/80 mb-1">Judul Utama (Title)</label>
    <input
      id="hero-title"
      type="text"
      value={section.props?.title ?? ''}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
      placeholder="Selamat datang di toko kami"
    />
  </div>

  <div>
    <label for="hero-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">Subjudul (Subtitle)</label>
    <textarea
      id="hero-subtitle"
      value={subtitle}
      on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
      rows="2"
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500 resize-y"
      placeholder="Produk berkualitas dengan harga terjangkau"></textarea>
  </div>

  <!-- Panel Upload Gambar Banner / Background -->
  <div class="pt-2 border-t border-base-300 dark:border-slate-800">
    <div class="flex items-center justify-between mb-1.5">
      <label for="hero-img-uploader" class="block font-semibold text-xs text-base-content/80">Gambar Banner / Background</label>
      {#if imageUrl}
        <span class="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Tersedia</span>
      {/if}
    </div>

    <!-- Tipe Tampilan Gambar -->
    <div class="grid grid-cols-2 gap-2 mb-3">
      <button
        type="button"
        on:click={() => handlePropChange('imageMode', 'element')}
        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all {imageMode === 'element' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-base-200/40 border-base-300 hover:bg-base-200'}"
      >
        Elemen Bebas
      </button>
      <button
        type="button"
        on:click={() => handlePropChange('imageMode', 'background')}
        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all {imageMode === 'background' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-base-200/40 border-base-300 hover:bg-base-200'}"
      >
        Full Background
      </button>
    </div>

    {#if imageUrl}
      <div class="relative group rounded-xl overflow-hidden aspect-video bg-base-200 border border-base-300 mb-2">
        <img src={imageUrl} alt="Banner Hero" class="w-full h-full object-cover" />
        <button
          type="button"
          on:click={handleRemoveImage}
          class="btn btn-circle btn-error btn-xs absolute top-2 right-2 shadow-lg"
          title="Hapus gambar secara permanen"
        >
          <X size={13} />
        </button>
      </div>
    {/if}

    <input
      id="hero-img-uploader"
      bind:this={fileInput}
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      class="hidden"
      on:change={handleImageUpload}
    />

    <button
      type="button"
      disabled={isUploading}
      on:click={() => fileInput?.click()}
      class="w-full py-2.5 px-3 border border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-primary transition-all cursor-pointer disabled:opacity-50"
    >
      {#if isUploading}
        <Loader2 size={16} class="animate-spin text-primary" />
        <span>Mengunggah & Mengonversi ({uploadProgress}%)...</span>
      {:else}
        <Upload size={16} />
        <span>{imageUrl ? 'Ganti Gambar (Otomatis Replace)' : 'Upload Gambar Banner (JPG/PNG)'}</span>
      {/if}
    </button>
    <p class="text-[10.5px] text-base-content/50 mt-1">Maks 5MB. Otomatis convert ke WebP ringan (&le;200KB).</p>

    {#if errorMessage}
      <p class="text-xs text-rose-500 font-semibold mt-1">{errorMessage}</p>
    {/if}
  </div>

  <div class="grid grid-cols-2 gap-2">
    <div>
      <label for="cta-text" class="block font-semibold text-xs text-base-content/80 mb-1">Teks CTA</label>
      <input
        id="cta-text"
        type="text"
        value={section.props?.ctaText ?? ''}
        on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
        placeholder="Lihat Katalog"
      />
    </div>
    <div>
      <label for="cta-link" class="block font-semibold text-xs text-base-content/80 mb-1">Link CTA</label>
      <input
        id="cta-link"
        type="text"
        value={section.props?.ctaLink ?? ''}
        on:input={(e) => handlePropChange('ctaLink', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
        placeholder="#catalog"
      />
    </div>
  </div>

  <!-- Pengaturan Tinggi Section Canvas (8pt Grid) -->
  <div class="pt-3 border-t border-base-300 dark:border-slate-800">
    <span class="block font-semibold text-xs text-base-content/80 mb-1">Tinggi Minimum Hero (8pt Grid)</span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-xs">
      {#each [
        { label: '480px', value: '480px' },
        { label: '560px', value: '560px' },
        { label: '640px', value: '640px' },
        { label: 'Auto', value: 'auto' },
      ] as h}
        <button
          type="button"
          on:click={() => onUpdate({
            ...section,
            styles: {
              ...(section.styles || {}),
              minHeight: h.value,
            }
          })}
          class={`py-1.5 rounded font-medium transition-colors cursor-pointer text-center ${
            (section.styles?.minHeight || '560px') === h.value ? 'bg-base-100 text-blue-600 dark:text-blue-400 font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {h.label}
        </button>
      {/each}
    </div>
  </div>
</div>