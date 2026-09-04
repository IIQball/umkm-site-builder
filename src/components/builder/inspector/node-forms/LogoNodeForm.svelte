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

  $: logoType = section.props?.logoType || 'image_text';
  $: logoImageUrl = (section.props?.logoImageUrl as string) || '';

  let isUploading = false;
  let errorMessage = '';
  let logoFileInput: HTMLInputElement;

  async function handleLogoUpload(e: Event) {
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
      const webpBlob = await compressToWebP(file, 800, 800);
      const url = await uploadToCloudinary(webpBlob, 'templates', `${Date.now()}_logo.webp`);
      
      const oldUrl = logoImageUrl;
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }
      onPropChange('logoImageUrl', url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gagal';
    } finally {
      isUploading = false;
      if (logoFileInput) logoFileInput.value = '';
    }
  }

  async function handleRemoveLogo() {
    const oldUrl = logoImageUrl;
    onPropChange('logoImageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="space-y-3">
  <div class="space-y-1">
    <label class="font-semibold text-base-content" for="logo-type-select">Tipe Tampilan Logo</label>
    <select
      id="logo-type-select"
      value={logoType}
      on:change={(e) => onPropChange('logoType', e.currentTarget.value)}
      class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
    >
      <option value="image_text">Icon Gambar & Teks</option>
      <option value="text_only">Hanya Teks Toko</option>
      <option value="image_only">Hanya Gambar Logo</option>
    </select>
  </div>

  <div class="space-y-1">
    <label class="font-semibold text-base-content" for="logo-text-input">Nama Toko (Teks Brand)</label>
    <input
      id="logo-text-input"
      type="text"
      value={section.props?.logoText || ''}
      on:input={(e) => onPropChange('logoText', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="Nama Toko Anda"
    />
  </div>

  {#if logoType !== 'text_only'}
    <div class="space-y-1.5">
      <label class="font-semibold text-base-content" for="logo-img-upload">Gambar Logo</label>
      {#if logoImageUrl}
        <div class="relative group rounded-xl overflow-hidden border border-base-300 dark:border-slate-800 bg-base-200/50 p-2 flex items-center gap-3">
          <img src={logoImageUrl} alt="Logo Preview" class="w-12 h-12 object-contain bg-white dark:bg-slate-900 rounded-lg border border-base-300" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold truncate text-base-content">Logo Toko</p>
            <p class="text-[10px] text-base-content/60">Terunggah ke Cloudinary (WebP)</p>
          </div>
          <button
            type="button"
            on:click={handleRemoveLogo}
            class="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            title="Hapus Logo"
          >
            <X size={14} />
          </button>
        </div>
      {:else}
        <button
          type="button"
          on:click={() => logoFileInput?.click()}
          disabled={isUploading}
          class="w-full border-2 border-dashed border-base-300 dark:border-slate-800 hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-base-200/30 flex flex-col items-center gap-1.5"
        >
          {#if isUploading}
            <Loader2 size={16} class="animate-spin text-primary" />
            <span class="text-[11px] text-primary">Mengunggah logo...</span>
          {:else}
            <Upload size={16} class="text-base-content/50" />
            <span class="text-[11px] font-medium text-base-content">Pilih file logo (PNG / JPG)</span>
          {/if}
        </button>
      {/if}
      <input
        id="logo-img-upload"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        bind:this={logoFileInput}
        on:change={handleLogoUpload}
        class="hidden"
      />
      {#if errorMessage}
        <p class="text-[11px] text-error font-medium">{errorMessage}</p>
      {/if}
    </div>
  {/if}
</div>
