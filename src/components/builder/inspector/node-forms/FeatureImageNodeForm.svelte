<script lang="ts">
  import { Upload, X, Loader2 } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import {
    compressToWebP,
    uploadToCloudinary,
    deleteOldImage,
  } from '../imageUpload.helpers';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: mainImageUrl = (section.props?.mainImageUrl as string) || '';

  let isUploading = false;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

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
      const webpBlob = await compressToWebP(file, 1600, 1200);
      const url = await uploadToCloudinary(webpBlob, 'templates', `${Date.now()}_feature_main.webp`);

      const oldUrl = mainImageUrl;
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }
      onPropChange('mainImageUrl', url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gambar gagal';
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  async function handleRemoveImage() {
    const oldUrl = mainImageUrl;
    onPropChange('mainImageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="space-y-4 text-left">
  <div class="space-y-1.5">
    <label class="font-semibold text-xs text-base-content/80" for="feat-main-img-upload">Gambar Utama / Ilustrasi Showcase</label>
    {#if mainImageUrl}
      <div class="relative group rounded-xl overflow-hidden border border-base-300 dark:border-slate-800 bg-base-200/50 p-2 flex items-center gap-3">
        <img
          src={mainImageUrl}
          alt="Main Feature Preview"
          class="w-16 h-12 object-cover bg-white dark:bg-slate-900 rounded-lg border border-base-300 dark:border-slate-700"
        />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold truncate text-base-content">Ilustrasi Fitur</p>
          <p class="text-[10px] text-base-content/60">Terunggah ke Cloudinary (WebP)</p>
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
          <span class="text-xs text-primary font-medium">Mengunggah ke Cloudinary...</span>
        {:else}
          <Upload size={18} class="text-base-content/50" />
          <span class="text-xs font-medium text-base-content">Pilih Gambar Ilustrasi (PNG / JPG)</span>
          <span class="text-[10px] text-base-content/60">Kompresi otomatis WebP tajam & ringan</span>
        {/if}
      </button>
    {/if}
    <input
      id="feat-main-img-upload"
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
    <label class="font-semibold text-xs text-base-content/80" for="feat-main-img-url">Atau Masukkan URL Gambar Manual</label>
    <input
      id="feat-main-img-url"
      type="text"
      value={mainImageUrl}
      on:input={(e) => onPropChange('mainImageUrl', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="https://images.unsplash.com/..."
    />
  </div>
</div>
